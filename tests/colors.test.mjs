// Culori configurabile pe faze + text de subsol (2.1.0)
import {launch, check, summary} from "./_lib.mjs";
const {browser, page, st} = await launch();
await page.waitForTimeout(300);
const css = n => page.evaluate(n => document.documentElement.style.getPropertyValue(n), n);
// implicit: nimic setat
check("implicit: fără suprascriere", (await css('--cok')) === '');
// culoare cu contrast bun
await page.evaluate(() => { const e = document.getElementById('setCOk'); e.value = '#00aa88'; e.dispatchEvent(new Event('change', {bubbles: true})); });
check("culoare bună aplicată", (await css('--cok')) === '#00aa88', await css('--cok'));
const saved = await page.evaluate(() => localStorage.getItem('clopotel.settings.v1'));
check("salvată în setări", JSON.parse(saved).colors.ok === '#00aa88', saved);
// contrast insuficient (aproape de fundalul închis)
await page.evaluate(() => { const e = document.getElementById('setCWarn'); e.value = '#0d0c11'; e.dispatchEvent(new Event('change', {bubbles: true})); });
check("culoare cu contrast mic respinsă", (await css('--cwarn')) === '');
check("mesaj de refuz afișat", (await page.textContent('#colMsg')).includes('3:1'));
// culoarea ajunge efectiv la cronometru
const used = await page.evaluate(() => { const t = document.querySelector('.timer'); t.setAttribute('data-phase', 'ok'); return getComputedStyle(t).getPropertyValue('--c').trim(); });
check("cronometrul folosește culoarea aleasă", used.toLowerCase().includes('00aa88'), used);
// normalizare: valori invalide din stocare
await page.evaluate(() => localStorage.setItem('clopotel.settings.v1', JSON.stringify({colors: {ok: 'red', warn: '#12345', over: '#AABBCC'}})));
await page.reload(); await page.waitForTimeout(300);
const norm = await page.evaluate(() => [document.getElementById('setCOk').value, document.documentElement.style.getPropertyValue('--cok'), document.documentElement.style.getPropertyValue('--cover')].join('|'));
check("valorile invalide din stocare sunt ignorate", norm.split('|')[1] === '' && norm.split('|')[2].toLowerCase() === '#aabbcc', norm);
// resetare
await page.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true));
await page.click('#cReset');
check("resetare", (await css('--cover')) === '');
// subsol cu trimitere la sincronizare
check("subsol RO menționează sincronizarea", (await page.textContent('#footTxt')).includes('Sincronizare'));
await page.selectOption('#langSel', 'de');
check("subsol DE actualizat", (await page.textContent('#footTxt')).includes('Synchronisation'));
await page.selectOption('#langSel', 'en');
check("subsol EN actualizat", (await page.textContent('#footTxt')).includes('Multi-screen sync'));
check("etichete culori EN", (await page.textContent('#lColT')) === 'Phase colours');
check("fără erori", st.errs.length === 0, st.errs);
check("fără rețea", st.net.length === 0, st.net);
await browser.close(); summary();
