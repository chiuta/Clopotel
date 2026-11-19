# Jurnal de modificări — Clopotel

## 2.2.12 — 2026-11-20

- fff-kit 1.8.1: când `localStorage`/`sessionStorage` aruncă sau lipsesc (cookie-uri și date de site blocate, WebView fără stocare, `<iframe sandbox>`), kitul pune în loc o stocare în memorie, iar pagina pornește în loc să se oprească; datele nu se păstrează după închiderea paginii
- fff-kit 1.8.1: ghidajul care mărește controalele mici la 44 px măsoară acum și lățimea corpului paginii și a părintelui, deci un rând de butoane nu mai poate ieși din ecran (grupul rămâne neatins când mărirea l-ar depăși)

## 2.2.11 — 2026-11-17

- Compatibilitate cu browsere mai vechi (Chrome/Edge 55+, Firefox 52+, Safari 10.1+/iOS 10.3+): kitul 1.8.0 aduce stratul de compatibilitate (rezerve pentru API-urile care lipsesc în motoarele vechi), iar sintaxa JavaScript mai nouă decât ES2017 a fost înlocuită cu forme echivalente acolo unde exista; expresiile regulate noi și `import()` trec prin rezerve. Fără modificări de funcționalitate intenționate. Verificat cu parser ES2017 și într-un motor vechi simulat, nu pe dispozitive reale.

## 2.2.10 — 2026-11-15

- Nou: butoane de distribuire pe rețele sociale (vertical, pe marginea din stânga; fără scripturi externe, doar linkuri deschise la clic); bara de zoom cu lupă și „potrivire ecran” revine pe marginea din dreapta, centrată pe verticală; corectat afișarea suprapusă la zoom mare (panourile cu înălțimi în vh/vw nu mai ies din ecran).

## 2.2.9 — 2026-11-15

- Nou: texturi fractale hiper-detaliate (fff-texturi 1.1.2) — fundalul și suprafețele mari (carduri, panouri, antete, butoane; filele și dialogurile ascunse la încărcare, când se deschid) primesc un material generat local (WebGL2, fără rețea și fără imagini), care se repetă fără cusătură; culorile aplicației rămân ale ei. Se oprește din dialogul „Transparență” sau cu `?notex=1`.

## 2.2.2 — 2026-11-03

Destinații «Trimite către…» pentru pașaportul de învățare: adăugate FENARIUM și MENSURA (registrul de aplicații-țintă reinjectat din hub).

## 2.2.1 — 2026-11-03

Pașaport de învățare comun (FFF): „Notează în pașaport”, repetări eșalonate, export/import passport/fff și certificat tipărabil auto-declarat; local, fără server.

## 2.2.0 — 2026-11-02 (reîmprospătare kit)

- Nou (kit): **Sincronizare între dispozitive** (`FFF.sync`) — în dialogul «Transparență» (clic pe versiune → Copie de siguranță): conectezi două dispozitive direct (WebRTC, cod/QR, fără server și fără cont) și își schimbă datele aplicației; cea mai recentă valoare câștigă, secretele (chei API, parole) nu se trimit, ștergerile nu se propagă. Aplicarea trece prin importul kitului (confirmare, chei permise, rollback).
- Nou (kit): **Istoric local — «mașina timpului»** (`FFF.history`) — instantanee automate ale datelor (IndexedDB, fără secrete), diferență față de starea curentă și restaurare reversibilă; «Șterge datele aplicației» șterge și istoricul.
- Module adăugate: `qr`, `p2p`, `sync`, `history` (+~140 KB). Versiunea aplicației nu se schimbă.

## 2.2.0 — 2026-11-01

- Corectat: adaptorul «Trimite la…» nu mai aruncă eroare când kitul FFF lipsește (gardian pe fiecare bloc; găsit de testul «fără kit» din CI).

Nou: «Trimite la…» (fff-kit, modulul FFF.bridge) — după orice export de fișier (GPX, ICS, CSV, Markdown) apare butonul «Trimite la…» către aplicațiile compatibile, iar importul de fișiere al aplicației primește plicuri .fff.json trimise de ele, cu confirmare înainte de import. Fără rețea, fără telemetrie.

## 2.1.1 — 2026-10-31

Doar interfață (accesibilitate pe telefon, 360×740): casetele de bifare mai mici de 24 px → 24 px (WCAG 2.5.8). Fără alte schimbări de comportament.

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
