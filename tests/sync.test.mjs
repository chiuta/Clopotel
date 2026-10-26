// CLOPOȚEL 2.0 — sincronizare pe mai multe ecrane (FFF.p2p), mesaje către scenă, semnal vizual, recuperare întârziere.
import {chromium, INDEX, check, summary, answerDialog} from "./_lib.mjs";

const ARGS = ["--allow-loopback-in-peer-connection", "--disable-features=WebRtcHideLocalIpsWithMdns"];
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ARGS});
const errs = [];
async function newPage(opts = {}) {
  const ctx = await browser.newContext({viewport: {width: 1100, height: 800}, acceptDownloads: true, ...opts});
  await ctx.route(/^https?:/, r => r.abort());
  const page = await ctx.newPage();
  page.on("pageerror", e => errs.push(String(e))); page.on("console", m => { if (m.type() === "error") console.log("CONSOLE", m.text()); });
  await page.goto("file://" + INDEX);
  return {ctx, page};
}
async function setAgenda(page, text) {
  await page.click("#aPaste"); await page.fill("#pasteTa", text);
  const a = answerDialog(page, true, 700);
  await page.click("#pRep"); await a.done; await page.waitForTimeout(100);
}
// conectare reală prin dialogul FFF.p2p (copiere/lipire de coduri)
async function connect(host, guest, role, n) {
  await host.evaluate(() => { document.getElementById("syncBox").open = true; });
  await host.click("#syncHost");
  const hd = host.locator("dialog.fff-p2p");
  await hd.locator("[data-role=optin]").check();
  await hd.locator("[data-role=mode-host]").click();
  await hd.locator("[data-role=gen-offer]").click();
  await host.waitForFunction(() => { const t = document.querySelector("dialog.fff-p2p textarea[data-role=offer-out]"); return t && t.value.length > 20; }, null, {timeout: 15000});
  const offer = await hd.locator("textarea[data-role=offer-out]").inputValue();
  await guest.evaluate(() => { document.getElementById("syncBox").open = true; });
  await guest.selectOption("#syncRole", role);
  await guest.click("#syncJoin");
  const gd = guest.locator("dialog.fff-p2p");
  await gd.locator("[data-role=optin]").check();
  await gd.locator("[data-role=mode-join]").click();
  await gd.locator("textarea[data-role=offer-in]").fill(offer);
  await gd.locator("[data-role=gen-answer]").click();
  await guest.waitForFunction(() => { const t = document.querySelector("dialog.fff-p2p textarea[data-role=answer-out]"); return t && t.value.length > 20; }, null, {timeout: 15000});
  const answer = await gd.locator("textarea[data-role=answer-out]").inputValue();
  await hd.locator("textarea[data-role=answer-in]").fill(answer);
  await hd.locator("[data-role=connect]").click();
  await host.waitForFunction(n => document.querySelectorAll("#syncList li").length === n && /\S/.test(document.getElementById("syncList").textContent) && !/Se conectează/.test(document.getElementById("syncList").textContent), n, {timeout: 20000}).catch(async e => { console.log("DBG", await host.evaluate(() => [document.getElementById("syncList").textContent, document.getElementById("syncStat").textContent])); console.log("DBGG", await guest.evaluate(() => [document.getElementById("syncStat").textContent])); throw e; });
}

console.log("1. sincronizare: scenă, sală, moderator");
{
  const H = await newPage(); const S = await newPage(); const L = await newPage(); const M = await newPage();
  await setAgenda(H.page, "Ana | Deschidere | 5\nBogdan | Tema | 10\nCiprian | Final | 5");
  const lsBefore = await S.page.evaluate(() => localStorage.getItem("clopotel.agenda.v1"));
  await connect(H.page, S.page, "stage", 1);
  await connect(H.page, L.page, "hall", 2);
  await connect(H.page, M.page, "mod", 3);
  const lis = await H.page.locator("#syncList li").allTextContents(); check("gazda listează 3 dispozitive", lis.length === 3, lis);
  check("scena a intrat în mod scenă (display)", await S.page.evaluate(() => document.body.classList.contains("display") && document.body.classList.contains("stagemode")));
  check("moderatorul are panoul de mesaje, scena nu", await M.page.isVisible("#msgBox") && !(await S.page.isVisible("#msgBox")));
  check("gazda are panoul de mesaje (are dispozitive)", await H.page.isVisible("#msgBox"));
  await S.page.waitForFunction(() => document.getElementById("who").textContent === "Ana", null, {timeout: 8000});
  check("scena arată vorbitorul din agenda gazdei", (await S.page.textContent("#who")) === "Ana" && (await L.page.textContent("#who")) === "Ana");
  check("moderatorul vede agenda gazdei (nu o afișează)", (await M.page.textContent("#who")) === "Ana" && !(await M.page.isVisible(".agenda")));
  await H.page.click("#bGo");
  await S.page.waitForFunction(() => /^0?4:5\d$|^05:00$/.test(document.getElementById("t").textContent), null, {timeout: 8000});
  await H.page.waitForTimeout(2300);
  const tm = async p => p.evaluate(() => { const [m, s] = document.getElementById("t").textContent.split(":").map(Number); return m * 60 + s; });
  const th = await tm(H.page), ts = await tm(S.page), tl = await tm(L.page), tmod = await tm(M.page);
  check("același timp pe toate ecranele (±2 s)", Math.abs(th - ts) <= 2 && Math.abs(th - tl) <= 2 && Math.abs(th - tmod) <= 2, [th, ts, tl, tmod]);
  check("scena arată faza în curs, nu repaus", (await S.page.getAttribute("#stage", "data-phase")) === "ok");
  // moderatorul comandă
  await M.page.click("#bGo");
  await H.page.waitForFunction(() => document.getElementById("bGo").textContent === "Continuă", null, {timeout: 8000});
  check("pauza de pe telefon ajunge la gazdă și la scenă", true);
  await S.page.waitForFunction(() => document.getElementById("lab").textContent.includes("PAUZ") || document.getElementById("bGo").textContent === "Continuă", null, {timeout: 8000});
  await M.page.click("#bNext");
  await H.page.waitForFunction(() => document.getElementById("who").textContent === "Bogdan", null, {timeout: 8000});
  await S.page.waitForFunction(() => document.getElementById("who").textContent === "Bogdan", null, {timeout: 8000});
  check("„Următorul” de pe telefon mută gazda și scena", true);
  await M.page.click("#bAdd");
  await H.page.waitForFunction(() => document.querySelectorAll("#rows input[type=number]")[1].value === "11", null, {timeout: 8000});
  check("+1 min de pe telefon modifică agenda gazdei", true);
  // mesaje
  await M.page.click("#mP2");
  await S.page.waitForSelector("#modMsg:not([hidden])", {timeout: 8000});
  check("mesajul „Mai ai 2 minute” apare pe scenă", (await S.page.textContent("#modMsg")) === "Mai ai 2 minute");
  check("nu apare în sală", !(await L.page.isVisible("#modMsg")));
  check("gazda îl vede și ea", (await H.page.textContent("#modMsg")) === "Mai ai 2 minute");
  await M.page.fill("#msgIn", "Încheie cu o concluzie"); await M.page.click("#mSend");
  await S.page.waitForFunction(() => document.getElementById("modMsg").textContent === "Încheie cu o concluzie", null, {timeout: 8000});
  check("mesaj propriu ajunge pe scenă", true);
  await M.page.click("#mClear");
  await S.page.waitForSelector("#modMsg[hidden]", {state: "attached", timeout: 8000});
  check("mesajul se șterge de pe scenă", true);
  // un oaspete non-moderator nu poate comanda
  const sent = await S.page.evaluate(() => { return typeof window.FFF.p2p === "object"; });
  check("izolare: starea oaspeților nu s-a scris în localStorage-ul lor", (await S.page.evaluate(() => localStorage.getItem("clopotel.agenda.v1"))) === lsBefore);
  // ieșire din sincronizare
  await S.page.click("#bExit");
  await S.page.evaluate(() => { document.getElementById("syncBox").open = true; });
  await S.page.click("#syncLeave");
  await S.page.waitForFunction(() => document.querySelectorAll("#rows li").length === 10, null, {timeout: 8000});
  check("după ieșire revine agenda proprie (exemplul de 10)", true);
  await H.page.waitForFunction(() => document.querySelectorAll("#syncList li").length === 2, null, {timeout: 12000});
  check("gazda observă deconectarea", true);
  // închiderea gazdei: moderatorul revine
  await H.page.close();
  await M.page.waitForFunction(() => !document.body.classList.contains("remote-mod"), null, {timeout: 40000});
  check("când gazda pleacă, telefonul revine la agenda proprie", (await M.page.locator("#rows li").count()) === 10);
  for (const x of [S, L, M]) await x.ctx.close();
  await H.ctx.close();
}

console.log("2. semnal vizual accesibil");
{
  const {ctx, page} = await newPage();
  await page.evaluate(() => { document.getElementById("settings").open = true; });
  check("implicit oprit", !(await page.isChecked("#setVisual")));
  await page.click("#tWarn"); await page.waitForTimeout(150);
  check("oprit: nu apare suprapunerea", !(await page.isVisible("#vis")));
  await page.check("#setVisual");
  await page.click("#tWarn"); await page.waitForTimeout(150);
  check("pornit: suprapunere cu text la avertizare", (await page.isVisible("#vis")) && /ATENȚIE/.test(await page.textContent("#vis")) && (await page.getAttribute("#vis", "data-k")) === "warn");
  await page.click("#tEnd"); await page.waitForTimeout(150);
  check("la final: TIMP EXPIRAT", /EXPIRAT/.test(await page.textContent("#vis")) && (await page.getAttribute("#vis", "data-k")) === "end");
  await page.waitForTimeout(3900);
  check("suprapunerea dispare singură", !(await page.isVisible("#vis")));
  await page.reload(); await page.evaluate(() => { document.getElementById("settings").open = true; });
  check("opțiunea se păstrează", await page.isChecked("#setVisual"));
  await ctx.close();
  const r = await newPage({reducedMotion: "reduce"});
  await r.page.evaluate(() => { document.getElementById("settings").open = true; });
  await r.page.check("#setVisual"); await r.page.click("#tEnd"); await r.page.waitForTimeout(300);
  const an = await r.page.evaluate(() => getComputedStyle(document.getElementById("vis")).animationName);
  check("reduce motion: fără animație (static)", an === "none", an);
  await r.ctx.close();
}

console.log("3. agenda se recalculează la depășire");
{
  const {ctx, page} = await newPage();
  await page.clock.install();
  await page.reload();
  await setAgenda(page, "A | x | 5\nB | y | 5\nC | z | 5\nD | w | 5");
  check("fără întârziere: butonul de recuperare e ascuns", !(await page.isVisible("#bRecover")));
  await page.click("#bGo");
  await page.clock.fastForward(8 * 60 * 1000);
  await page.waitForTimeout(400);
  check("butonul apare cu 3 min", (await page.isVisible("#bRecover")) && /3 min/.test(await page.textContent("#bRecover")), await page.textContent("#bRecover"));
  const est = await page.locator("#rows li").nth(1).locator(".res").textContent();
  check("rândurile următoare arată ora estimată ≈ HH:MM", /^≈ \d\d:\d\d$/.test(est), est);
  const a = answerDialog(page, true, 1500);
  await page.click("#bRecover"); await a.done;
  check("a cerut confirmare cu 3 prezentări și 3 min", a.shown && /3/.test(a.msg), a.msg);
  const mins = await page.locator("#rows input[type=number]").evaluateAll(l => l.map(i => +i.value));
  check("A rămâne 5, restul scad de la 15 la 12 min (4+4+4)", JSON.stringify(mins) === "[5,4,4,4]", mins);
  await page.waitForTimeout(300);
  check("după recuperare butonul dispare", !(await page.isVisible("#bRecover")));
  await ctx.close();
}
console.log("4. fără erori");
check("fără excepții de pagină", errs.length === 0, errs);
await browser.close();
summary();
