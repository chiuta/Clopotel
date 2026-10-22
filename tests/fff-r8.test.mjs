// CLOPOȚEL — teste pentru funcțiile noi (runda 8): raport plan/real (+CSV, tipărire) și anunțuri vocale.
import fs from "fs";
import {launch, axeRun, hOverflow, check, summary, kitSmoke, kitLabel} from "./_lib.mjs";

const SPEECH = () => {
  window.__said = [];
  window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  Object.defineProperty(window, "speechSynthesis", {configurable: true, value: {cancel() {}, speak(u) { window.__said.push([u.text, u.lang]); }}});
};
async function setAgenda(page, text) {
  await page.click("#aPaste"); await page.fill("#pasteTa", text);
  page.once("dialog", d => d.accept());
  await page.click("#pRep");
  await page.waitForTimeout(100);
}

console.log("1. pornire");
{
  const {browser, page, st} = await launch({init: SPEECH});
  await page.waitForTimeout(3500);
  check("0 erori", st.errs.length === 0, st.errs);
  check("0 cereri de rețea", st.net.length === 0, st.net);
  check("0 violări CSP", (await page.evaluate(() => window.__csp)).length === 0);
  check("meta application-version 1.2.2", (await page.getAttribute('meta[name="application-version"]', "content")) === "1.2.2");
  check("#app-version", /1\.2\.2 · 2026-10-22/.test(await page.textContent("#app-version")));
  check("fără depășire orizontală", (await hOverflow(page)) <= 0);
  check("raportul e închis implicit (starea inițială neschimbată)", !(await page.locator("#reportBox").evaluate(d => d.open)));
  await browser.close();
}

console.log("2. raport plan/real");
{
  const {browser, page, st} = await launch({init: SPEECH});
  await page.clock.install();
  await setAgenda(page, "Ana Pop | Deschidere | 1\n=1+1 | Titlu \"citat\" | 2\nIon | Final | 3");
  await page.click("#reportBox > summary");
  await page.waitForTimeout(300);
  check("tabelul are 3 rânduri", (await page.locator("#repRows tr").count()) === 3);
  check("înainte de start: real —, stare neînceput", (await page.locator("#repRows tr").first().innerText()).includes("neînceput") && (await page.locator("#repRows tr td").nth(4).textContent()) === "—");
  check("total plan toată agenda 06:00", /06:00/.test(await page.textContent("#repFoot")));
  await page.click("#bGo");
  await page.clock.fastForward(30 * 1000);
  await page.click("#bNext");                          // Ana: 30 s față de 60 s
  await page.waitForTimeout(1200);
  let r1 = (await page.locator("#repRows tr").nth(0).locator("td").allTextContents());
  check("rând 1: plan 01:00, real 00:30, diferență −00:30, încheiată", r1[3] === "01:00" && r1[4] === "00:30" && r1[5] === "−00:30" && r1[6] === "încheiată", r1);
  check("rând 1 marcat ca sub plan", await page.locator("#repRows tr").nth(0).locator("td.under").count() === 1);
  await page.click("#bGo");                            // pornește a doua
  await page.clock.fastForward(150 * 1000);
  await page.waitForTimeout(1300);
  let r2 = (await page.locator("#repRows tr").nth(1).locator("td").allTextContents());
  check("rând 2 (în curs): real ≈ 02:30, +00:30, în curs", /^02:(2[89]|3\d)$/.test(r2[4]) && /^\+00:(2\d|3\d)$/.test(r2[5]) && r2[6] === "în curs", r2);
  check("rând 2 marcat ca depășit", await page.locator("#repRows tr").nth(1).locator("td.over").count() === 1);
  const foot = await page.textContent("#repFoot");
  check("totalul include prezentările cronometrate (plan 03:00)", /03:00/.test(foot) && /Total/.test(foot), foot);
  // CSV
  const dl = page.waitForEvent("download");
  await page.click("#repCsv");
  const csv = fs.readFileSync(await (await dl).path(), "utf8");
  check("CSV are BOM UTF-8 și antet", csv.charCodeAt(0) === 0xFEFF && /^﻿Nr;Vorbitor;Titlu;Plan \(min\);Real \(mm:ss\);Diferență \(s\);Stare\r\n/.test(csv), csv.slice(0, 120));
  const lines = csv.trim().split("\r\n");
  check("CSV: 3 rânduri + antet + total", lines.length === 5, lines);
  check("CSV: rândul 1 corect", lines[1] === "1;Ana Pop;Deschidere;1;00:30;-30;încheiată", lines[1]);
  check("CSV: injecție de formule neutralizată și ghilimele duplicate corect", lines[2].startsWith("2;'=1+1;\"Titlu \"\"citat\"\"\";2;"), lines[2]);
  check("CSV: rândul neînceput are câmpuri goale", lines[3] === "3;Ion;Final;3;;;neînceput", lines[3]);
  // limba
  await page.selectOption("#langSel", "en");
  await page.waitForTimeout(1300);
  check("raport tradus în engleză", /Report: plan vs\. actual/.test(await page.textContent("#repSum")) && (await page.textContent("#repRows")).includes("in progress"));
  await page.selectOption("#langSel", "ro");
  // tipărire
  await page.emulateMedia({media: "print"});
  await page.evaluate(() => document.body.classList.add("print-report"));
  const vis = await page.evaluate(() => ({main: getComputedStyle(document.querySelector("main")).display, rep: getComputedStyle(document.getElementById("reportBox")).display, btn: getComputedStyle(document.querySelector("#reportBox .atools")).display}));
  check("tipărire: doar raportul rămâne vizibil", vis.main === "none" && vis.rep !== "none" && vis.btn === "none", vis);
  await page.evaluate(() => document.body.classList.remove("print-report")); await page.emulateMedia({media: "screen"});
  // încheiere agendă: raport complet
  await page.click("#bNext"); await page.click("#bGo"); await page.clock.fastForward(60 * 1000); await page.click("#bNext");
  await page.waitForTimeout(1200);
  check("după ultima prezentare: toate încheiate", (await page.locator("#repRows tr td:last-child").allTextContents()).every(s => s === "încheiată"));
  check("fără erori", st.errs.length === 0, st.errs);
  await browser.close();
}
{ // reîncărcare: starea (rezultatele) persistă în raport
  const {browser, page} = await launch({init: SPEECH});
  await setAgenda(page, "A | x | 1\nB | y | 1");
  await page.click("#bGo"); await page.waitForTimeout(2200); await page.click("#bNext");
  await page.reload(); await page.waitForTimeout(500);
  await page.click("#reportBox > summary");
  check("după reîncărcare raportul păstrează timpul prezentării încheiate", /^00:0[2-4]$/.test((await page.locator("#repRows tr").first().locator("td").nth(4).textContent()).trim()));
  await browser.close();
}

console.log("3. anunțuri vocale");
{
  const {browser, page, st} = await launch({init: SPEECH});
  await page.waitForTimeout(500);
  check("implicit oprite", !(await page.isChecked("#setVoice")));
  await page.evaluate(() => { document.getElementById("settings").open = true; });
  await page.click("#tWarn");
  check("oprit: nu se vorbește", (await page.evaluate(() => window.__said.length)) === 0);
  await page.check("#setVoice");
  await page.click("#tWarn");
  let said = await page.evaluate(() => window.__said.slice());
  check("avertizare vorbită în română: „Au rămas 2 minute.”", said.length === 1 && said[0][0] === "Au rămas 2 minute." && said[0][1] === "ro-RO", said);
  await page.click("#tEnd");
  said = await page.evaluate(() => window.__said.slice());
  check("final: „Timpul a expirat.”", said[1] && said[1][0] === "Timpul a expirat.", said);
  await page.fill("#setWarn", "60"); await page.dispatchEvent("#setWarn", "change");
  await page.click("#tWarn");
  said = await page.evaluate(() => window.__said.slice());
  check("60 s -> „A rămas un minut.”", said[2] && said[2][0] === "A rămas un minut.", said);
  await page.fill("#setWarn", "45"); await page.dispatchEvent("#setWarn", "change");
  await page.click("#tWarn");
  said = await page.evaluate(() => window.__said.slice());
  check("45 s -> „Au rămas 45 secunde.”", said[3] && said[3][0] === "Au rămas 45 secunde.", said);
  await page.selectOption("#langSel", "en");
  await page.click("#tEnd");
  said = await page.evaluate(() => window.__said.slice());
  check("în engleză: „Time is up.” cu en-US", said[4] && said[4][0] === "Time is up." && said[4][1] === "en-US", said);
  await page.selectOption("#langSel", "ro");
  await page.click("#btnSound");                       // sunet oprit -> nici vocea
  const n = await page.evaluate(() => window.__said.length);
  await page.click("#tEnd");
  check("cu „Sunet: oprit” nu se vorbește", (await page.evaluate(() => window.__said.length)) === n);
  await page.click("#btnSound");
  await page.reload(); await page.waitForTimeout(400);
  check("alegerea se păstrează după reîncărcare", await page.isChecked("#setVoice"));
  check("fără erori", st.errs.length === 0, st.errs);
  await browser.close();
}
{ // fără sinteză vocală: bifa e dezactivată, cu explicație
  const {browser, page} = await launch({init: () => { delete window.SpeechSynthesisUtterance; Object.defineProperty(window, "speechSynthesis", {configurable: true, value: undefined}); }});
  await page.waitForTimeout(400);
  check("fără speechSynthesis: bifa dezactivată + mesaj", (await page.isDisabled("#setVoice")) && /nu este disponibilă/.test(await page.textContent("#voiceNote")));
  await browser.close();
}
{ // fereastra pentru proiector (#scena) nu vorbește
  const {browser, page} = await launch({init: SPEECH});
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("clopotel.settings.v1") || "{}"); s.voice = true; localStorage.setItem("clopotel.settings.v1", JSON.stringify(s)); });
  await page.goto("file://" + (await page.evaluate(() => location.pathname)) + "#scena"); await page.reload(); await page.waitForTimeout(400);
  await page.evaluate(() => document.getElementById("tEnd") && document.getElementById("tEnd").click());
  check("în fereastra proiector nu se vorbește (evită dublarea)", (await page.evaluate(() => window.__said.length)) === 0);
  await browser.close();
}

console.log("4. accesibilitate și lățimi mici");
{
  const {browser, page} = await launch({bypassCSP: true, w: 360, h: 740, init: SPEECH});
  await page.waitForTimeout(3600);
  await page.evaluate(() => { document.getElementById("reportBox").open = true; document.getElementById("settings").open = true; });
  await page.waitForTimeout(300);
  check("fără depășire orizontală la 360 (raport + setări deschise)", (await hOverflow(page)) <= 1, await hOverflow(page));
  const v = await axeRun(page); if (v) check("axe 0 violări (raport + setări deschise)", v.length === 0, v);
  await browser.close();
}
{
  const {browser, page} = await launch({bypassCSP: true, colorScheme: "light", init: SPEECH});
  await page.waitForTimeout(3600);
  await page.click("#btnTheme");
  await page.evaluate(() => { document.getElementById("reportBox").open = true; });
  const v = await axeRun(page); if (v) check("axe 0 violări (temă luminoasă, raport deschis)", v.length === 0, v);
  await browser.close();
}

console.log("K. kit (Transparență + copie de siguranță)");
{
  const {browser, page, st} = await launch({init: typeof SPEECH!=="undefined"?SPEECH:undefined});
  await page.waitForTimeout(800);
  await kitLabel(page, "clopotel");
  await kitSmoke(page, "clopotel", ["clopotel.agenda.v1", "[{\"id\":\"i1\",\"speaker\":\"Ana\",\"title\":\"\",\"min\":3}]"]);
  check("kit: fără erori", st.errs.length === 0, st.errs);
  await browser.close();
}
console.log("9. import fișier: confirmare înainte de înlocuirea agendei");
{
  const {browser, page, st} = await launch();
  await setAgenda(page, "Ana | Unu | 1\nBob | Doi | 2\nCia | Trei | 3");
  const rows = () => page.locator("#rows li.row").count();
  check("agenda inițială are 3 prezentări", (await rows()) === 3);
  const json = JSON.stringify({agenda: [{speaker: "Nou", title: "Unul", min: 4}, {speaker: "Nou2", title: "Doi", min: 5}], settings: {warn: 77}});
  const setWarn = () => page.evaluate(() => { try { return JSON.parse(localStorage.getItem("clopotel.settings.v1") || "{}").warn } catch (e) { return null } });
  // renunț
  let msg = "";
  page.once("dialog", d => { msg = d.message(); d.dismiss(); });
  await page.setInputFiles("#aFile", {name: "agenda.json", mimeType: "application/json", buffer: Buffer.from(json)});
  await page.waitForTimeout(400);
  check("a apărut confirmarea (cu numărul 2)", /2/.test(msg), msg);
  check("după renunțare agenda rămâne cu 3 prezentări", (await rows()) === 3);
  check("setările nu s-au schimbat (warn ≠ 77)", (await setWarn()) !== 77);
  // CSV/text: renunț
  page.once("dialog", d => d.dismiss());
  await page.setInputFiles("#aFile", {name: "agenda.csv", mimeType: "text/csv", buffer: Buffer.from("Dan;Patru;7\nEli;Cinci;8\n")});
  await page.waitForTimeout(400);
  check("CSV: după renunțare agenda rămâne cu 3", (await rows()) === 3);
  // accept
  page.once("dialog", d => d.accept());
  await page.setInputFiles("#aFile", {name: "agenda.json", mimeType: "application/json", buffer: Buffer.from(json)});
  await page.waitForTimeout(400);
  check("după acceptare agenda are 2 prezentări", (await rows()) === 2);
  await browser.close();
}
summary();
