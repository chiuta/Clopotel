# CLOPOȚEL

Cronometru de scenă cu clopoțel pentru conferințe: limitează timpul fiecărui vorbitor din agendă.
Un singur fișier HTML, fără dependențe externe, funcționează complet offline („fără frontiere”, trade-free).

![CLOPOȚEL](docs/screenshot.png)

## Utilizare

1. Deschide `index.html` în browser (sau pagina publicată cu GitHub Pages: **<LINK-PAGES>**).
2. Completează agenda: vorbitor, titlu, minute alocate. Poți muta, șterge, exporta și importa agenda (JSON).
3. Apasă **Start**. Clopoțelul sună la avertizare (implicit cu 2 minute înainte), la final și periodic în depășire.
4. **Ecran scenă** pune cronometrul pe tot ecranul; **Fereastră pentru proiector** deschide o a doua fereastră sincronizată
   (același browser, același calculator) pe care o muți pe ecranul sălii.

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

- Browserul blochează sunetul până la primul clic: apasă Start sau orice buton înainte de eveniment.
- Datele (agenda, setările, starea cronometrului) se păstrează în browser (`localStorage`); după o reîncărcare, cronometrul continuă.
- Ecranul rămâne aprins cât timp cronometrul rulează (Wake Lock, unde browserul îl suportă).

## Publicare cu GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`. Fișierul `.nojekyll` este deja inclus.

## Licență

MIT — vezi [LICENSE](LICENSE).

Autor: Alexandru-Ionuț Chiuță (Alexio) · <alexio@trom.tf>

