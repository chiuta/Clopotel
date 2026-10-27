# CLOPOȚEL

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

**Versiune:** 2.1.0 · **Ultima actualizare:** 2026-10-27

**Stare:** stabil · **Offline:** complet

Limbile interfeței: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar**

Cronometru de scenă cu clopoțel pentru conferințe: limitează timpul fiecărui vorbitor din agendă.
Un singur fișier HTML, fără dependențe externe, funcționează complet offline („fără frontiere”, trade-free).

![CLOPOȚEL](screenshot.ro.png)

## Utilizare

1. Deschide `index.html` în browser (sau pagina publicată cu GitHub Pages: **https://chiuta.github.io/Clopotel/**).
2. Completează agenda: vorbitor, titlu, minute alocate. Poți muta, șterge, exporta și importa agenda (JSON) sau o poți lipi ca listă text (**Lipește listă**: `Vorbitor | Titlu | minute`, câte o prezentare pe rând; separatori `|`, `;` sau tab; fără minute se folosesc 10). Fișierele `.csv`/`.txt` cu același format se pot importa la fel.
3. Apasă **Start**. Clopoțelul sună la avertizare (implicit cu 2 minute înainte), la final și periodic în depășire.
4. **Ecran scenă** pune cronometrul pe tot ecranul; **Fereastră pentru proiector** deschide o a doua fereastră sincronizată
   (același browser, același calculator) pe care o muți pe ecranul sălii.

## Funcții noi (v2.0.0, 26 octombrie 2026)

- **Cronometru sincronizat pe mai multe ecrane** (secțiunea „Sincronizare pe mai multe ecrane”, modulul `p2p` din fff-kit): dispozitivul cu agenda este gazda; scena (ecranul vorbitorului), sala și moderatorul (telefon) se alătură cu un rol, prin cod copiat sau QR, direct între dispozitive (WebRTC, fără server, în aceeași rețea locală). Toți văd același timp; moderatorul poate porni/opri, trece la următorul și trimite pe ecranul scenei mesaje precum „Mai ai 2 minute”. **Limită:** NAT-urile simetrice (rețele mobile/corporative) nu se pot traversa fără server STUN/TURN; adresa IP locală se vede celuilalt dispozitiv.
- **Agenda se recalculează** când o prezentare depășește: rândurile următoare arată ora estimată de început (≈ HH:MM), iar „Recuperează N min” scurtează proporțional prezentările rămase (minimum 1 min), după confirmare.
- **Semnal vizual intens** (Setări): pentru persoane cu deficiență de auz, ecranul se colorează și afișează textul la avertizare și la final, plus vibrație pe telefon; pulsuri lente, static la „reducere mișcare”.

## Funcții noi (v1.1.0, 14 octombrie 2026)

Funcții alese după citirea aplicației, pentru ce lipsea unui organizator după eveniment și în sală:

### Raport: plan față de real
Secțiunea pliabilă „Raport: plan față de real” (sub Setări) arată, pentru fiecare prezentare, timpul planificat, timpul real, diferența (roșu = depășit, verde = sub plan), starea (încheiată / în curs / neînceput) și totaluri: suma pe prezentările cronometrate și planul întregii agende. Se actualizează în timp real. „Exportă CSV” descarcă `raport-clopotel.csv` (separator `;`, UTF-8 cu BOM pentru Excel/LibreOffice; celulele care ar putea fi interpretate ca formule sunt neutralizate); „Tipărește raportul” tipărește doar tabelul. Timpii vin din rezultatele pe care Clopoțel le ține deja (o prezentare intră în raport când e încheiată sau părăsită, cea curentă cu timpul de până acum). **Limită:** nu există istoric al evenimentelor anterioare; un „Resetează” sau „Selectează” pe o prezentare ștergde timpul ei real din raport (comportamentul existent).

### Anunțuri vocale (opțional)
Căsuța „Anunțuri vocale” din Setări: la avertizare și la final, pe lângă clopoțel, se spune cu voce tare „Au rămas 2 minute.” / „A rămas un minut.” / „Au rămas N secunde.” / „Timpul a expirat.” (în engleză la limba En). Folosește sinteza vocală a browserului (`speechSynthesis`), respectă volumul și comutatorul „Sunet” (cu sunetul oprit nu se vorbește), este oprită implicit și se dezactivează automat dacă browserul nu are voce. Fereastra pentru proiector nu vorbește (evită dublarea). **Limită:** calitatea și limba vocii depind de sistem; unele sisteme nu au voce românească și citesc cu accent străin; unele voci sunt furnizate online de producătorul browserului, în afara controlului aplicației.

Interfața are 8 limbi (RO, EN, FR, IT, ES, PT, DE, HU), alese din selectorul de limbă; și kitul are interfața în 8 limbi.

### Transparență și copie de siguranță (fff-kit)

Un clic (sau Enter) pe versiunea afișată (`v 1.1.1 · 2026-10-18`) deschide fereastra „Transparență”: gazdele de rețea declarate (0 cereri externe), cheile de stocare locală cu dimensiuni, API-urile folosite, mărimea și SHA-256 al fișierului (cu verificator pentru un fișier descărcat) și **copia de siguranță** a datelor aplicației într-un fișier `.fff.json` (opțional criptat cu parolă, AES-GCM 256 / PBKDF2; parola nu poate fi recuperată), import cu confirmare și ștergerea datelor aplicației. Kitul (`fff-kit`, module: core, label, bundle) este lipit în `index.html`, nu face cereri de rețea și nu schimbă datele existente; fără el aplicația funcționează la fel. Textele kitului sunt în 8 limbi (ro, en, fr, it, es, pt, hu, de); **traducerile fr/it/es/pt/hu/de sunt automate și neverificate nativ**. Interfața aplicației însăși rămâne în română.

## Ecran de vorbitor, control de la distanță și culori: ce există

- **Ecran separat pentru vorbitor:** două căi. (1) *Fereastra pentru proiector* (același browser, același calculator): muți a doua fereastră pe al doilea monitor sau pe proiector. (2) *Sincronizare pe mai multe ecrane* (alt dispozitiv, de ex. telefon sau tabletă în aceeași rețea locală): te alături ca **Scenă** (ecranul vorbitorului) sau **Sală**; fără server.
- **Control de la distanță:** un dispozitiv care se alătură ca **Moderator** (de obicei un telefon) poate porni/pune pe pauză, trece la prezentarea următoare, adăuga un minut și trimite mesaje scurte (de ex. „2 minute rămase”) care apar pe ecranul scenei. Gazda (dispozitivul cu agenda) rămâne stăpâna agendei.
- **Culori pe faze:** inelul și cifrele cronometrului se schimbă după fază: verde-turcoaz cât mai e timp, auriu din momentul avertizării (implicit cu 2 minute înainte), roșu în depășire, auriu din nou când agenda s-a încheiat. Culoarea nu este niciodată singurul semnal: fiecare fază are și o etichetă text, iar **semnalul vizual intens** opțional (Setări) face ecranul să clipească cu text și face telefoanele să vibreze; la „reducere mișcare” clipirea e înlocuită cu o schimbare statică.
- **Starea testării:** sincronizarea este acoperită de teste automate cu două sau mai multe instanțe de browser pe același calculator (`tests/sync.test.mjs`). **Nu** a fost testată pe telefoane reale, pe rețeaua Wi-Fi a unei săli sau cu un proiector real. NAT-urile simetrice (rețele mobile sau corporative) nu pot fi traversate fără un server STUN/TURN, pe care aplicația nu-l folosește.

## Scurtături

| Tastă | Acțiune |
|---|---|
| Spațiu | Start / pauză |
| N sau → | Următorul vorbitor |
| P sau ← | Anterior |
| R | Resetează |
| + / − | Adaugă / scade un minut |
| B | Sună clopoțelul |
| M | Sunet pornit / oprit |
| F | Ecran scenă |

## Note

- Selectorul de limbă de lângă titlu comută interfața între cele 8 limbi (alegerea se păstrează în browser; fereastra pentru proiector o urmează).
- Butonul **Temă luminoasă/întunecată** schimbă tema (implicit întunecată, potrivită pentru scenă); alegerea se păstrează în browser. Tipărirea (Ctrl+P) produce doar agenda, în alb-negru.
- Browserul blochează sunetul până la primul clic: apasă Start sau orice buton înainte de eveniment.
- Datele (agenda, setările, starea cronometrului) se păstrează în browser (`localStorage`); după o reîncărcare, cronometrul continuă.
- Ecranul rămâne aprins cât timp cronometrul rulează (Wake Lock, unde browserul îl suportă).

## Publicare cu GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`. Fișierul `.nojekyll` este deja inclus.

## Istoric / Changelog

### 1.2.5 — 2026-10-23
- Dialogurile native alert/confirm/prompt au fost înlocuite cu dialoguri FFF.dialog accesibile și traduse (fff-kit 1.2.0).

### 1.2.3 — 2026-10-22
- fff-kit 1.1.4: ținte tactile și text minim; ținte tactile/text corectate

### 1.2.2 — 2026-10-22
- fff-kit 1.1.2: PBKDF2 600 000 iterații, protecție anti-clickjacking

### 1.2.1 — 2026-10-22
- Erorile la importul fișierelor (fișier gol, JSON invalid) și mesajul despre fereastra blocată nu mai sunt dialoguri blocante `alert()`: apar ca notificare nemodală în limba curentă (anunțată și cititoarelor de ecran).
- Mobil: glisorul de volum și cele două căsuțe de bifat au ținte tactile mai mari; eticheta de versiune din subsol arată acum versiunea curentă.

### 1.1.1 — 18 octombrie 2026
- Importul unei agende din fișier (`.json`, `.csv`, `.txt`) cere acum confirmare înainte de a înlocui agenda existentă (ca „Lipește lista”); dacă renunți, nici agenda, nici setările nu se schimbă. Nu există „anulează” după înlocuire: exportă agenda înainte să imporți.

### 1.1.0 — 14 octombrie 2026
- Raport plan/real (+ CSV, tipărire); anunțuri vocale opționale; fff-kit (Transparență + copie de siguranță); secțiunile pliabile Setări și Raport sunt acum într-un punct de reper (`aside`) pentru accesibilitate (axe `region` era încălcat înainte).

### 1.0.0 — 12 octombrie 2026
- Versiunea și data ultimei actualizări sunt afișate în aplicație (subsol).

### 11.10.2026 (a treia actualizare) — 11 octombrie 2026
- Interfață în două limbi: română și engleză (buton lângă titlu), inclusiv etichete ARIA, mesaje, scurtături și text de ajutor; verificat cu axe în ambele limbi.
- Linia „Avans/Întârziere față de plan” arată acum pe câte prezentări încheiate se bazează calculul (evită confuzia după o trecere rapidă peste vorbitori).
- CSP: `connect-src 'none'` (aplicația nu face cereri de rețea).

### 11.10.2026 (a doua actualizare) — 11 octombrie 2026
- Import agendă din text lipit sau din fișier `.csv`/`.txt` (rânduri `Vorbitor | Titlu | minute`), cu mesaj despre rândurile importate sau ajustate.
- Temă luminoasă (contrast verificat cu axe) și stil de tipărire pentru agendă; fereastra pentru proiector urmează tema aleasă.

### 11.10.2026 — 11 octombrie 2026
- Fereastra pentru proiector: dacă browserul blochează fereastra pop-up, apare acum un mesaj clar cu pașii de urmat (în loc de nicio reacție).
- Adăugat Content-Security-Policy strict (script cu hash, fără rețea); verificare axe fără încălcări.

## Licență

MIT — vezi [LICENSE](LICENSE).

Autor: Alexandru-Ionuț Chiuță (Alexio) · <alexio@trom.tf>


### 2.0.1 — 2026-10-27
- Doar documentare: secțiunea „Ecran de vorbitor, control de la distanță și culori: ce există” (aceste capacități erau deja în 2.0.0, dar împrăștiate în note), cu starea testării scrisă explicit; liniile „Stare / Offline”.

**Culori pe faze (2.1.0).** În Setări poți alege culoarea fazei normale, a avertizării și a depășirii. O culoare cu contrast sub 3:1 față de fundal este refuzată cu mesaj; fiecare fază păstrează și eticheta text. „Culori implicite” readuce aspectul inițial. Subsolul trimite acum și la sincronizarea pe mai multe ecrane pentru alte dispozitive. Etichetele sunt scrise în RO și EN; traducerile în fr/it/es/pt/de/hu (etichete, mesaje, subsol și această notă din README) sunt automate, nevalidate de vorbitori nativi.
