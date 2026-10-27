# Jurnal de modificări — Clopotel

## 2.1.0 — 2026-10-27 (anterior: 2.0.1)
- Culori configurabile pe faze (normală / avertizare / depășire), în Setări. Se salvează în setări, se sincronizează odată cu ele și se pot reseta la cele implicite. O culoare cu contrast sub 3:1 față de fundal (panou și fundal ale temei active) este refuzată cu mesaj; faza rămâne mereu marcată și prin text, nu doar prin culoare. Fără culori alese, aspectul este identic cu 2.0.x.
- Textul din subsol nu mai spune doar „același calculator”: menționează acum și sincronizarea pe mai multe ecrane (direct între dispozitive, fără server). RO și EN scrise; fr/it/es/pt/de/hu sunt traduceri automate.
- Teste noi: tests/colors.test.mjs (14 verificări). Cele existente rămân.
- Neimplementat: nimic din lista rămasă a rundei 1 pentru Clopoțel; etichetele noi ale culorilor, mesajul de contrast și nota din README au fost scrise în RO și EN și traduse apoi în fr/it/es/pt/de/hu — traducere automată, nevalidată de vorbitori nativi.

## 2.0.1 — 2026-10-27 (anterior: 2.0.0)
Doar documentare; codul aplicației nu s-a schimbat (doar numărul versiunii).
- Recomandarea „ecran de vorbitor separat, control de la distanță, culori la sfârșitul timpului” era în mare parte deja implementată în 2.0.0 (fereastra pentru proiector, sincronizare pe mai multe ecrane cu rolurile Scenă / Sală / Moderator, culori pe faze, semnal vizual intens). README (EN, RO) are acum secțiunea „Ecran de vorbitor, control de la distanță și culori: ce există”, cu starea testării scrisă explicit: teste automate cu mai multe instanțe de browser pe același calculator; NEtestat pe telefoane reale, Wi-Fi de sală sau proiector real.
- „Stare: stabil” și „Offline: complet” în toate cele 8 README.
- Neimplementat: culori configurabile de utilizator pentru faze; textul din subsol („fereastra pentru proiector… același calculator”) nu a fost modificat, deși există și sincronizarea pe alte dispozitive.
