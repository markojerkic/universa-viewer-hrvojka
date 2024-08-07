# Primjer korištenja UniversalViewer-a i Hrvojke

<p>Svi primjeri koriste React s istom verzijom UniversalViewer-a kao i eKultura.</p>

## Primjer bez Hrvojke

Ovaj primjer koristi samo importanu komponentu koja rendera UniversalViewer.
Ova komponenta je identična onoj koju koristimo interno u eKultura projektu.
<br >
Ovaj primjer rendera UniversalViewer s primjerom manifesta koji sadrži video uredak.
Za ovaj prvi primjer sve uredno radi.

```html
<div class='p-2 border-blue-500 rounded-md w-[90vw] h-[90vw]'>
    <UniversalViewer manifestId='https://wellcomelibrary.org/iiif/b16659090/manifest' client:only />
</div>
```

## Primjer s Hrvojkom

Ovaj primjer koristi istu komponentu, ali u HTML-u je navedeno da se importa skripta Hrvojke.
Tu čak nije ni dodana skripta koja je potrebna da se inicijalizira prevoditelj.
U eKultura projektu pored ovoga importa navedeno je i `WebsiteTranslator.Initialize()` te inicijaliziranje `clientId`-a.
Ali čak i bez inicijalizacije, sama pristunost Hrvojkinog bundle-a zbog nekog razloga ometa UniversalView u procesu renderanja videa.

Ovaj primjer namjerno ne ignorira grešku UniversalViewer-a da je jasno što se dogodi.
Projekt eKultura uhvati tu grešku te onda prikaže samo indeksnu sličicu umjesto UniversalViewer-a.

```html lang="html"
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />

++++    <script type="text/javascript" src="https://cms-hrvojka.gov.hr/uploads/wt/7.1.17/widget.js"></script>

		<title>S Hrvojkom</title>
	</head>
</html>
```

## Primjer s Hrvojkom i ignoriranjem greške

Treći primjer je isti kao i drugi, samo je dodana skriptica koja uhvati UniversalViewer grešku i ignorira je.
```js
window.alert = (msg) => {
    if (msg === "Unable to load manifest") {
        console.log("Error UV: ", msg);
    } else {
        console.log("Error UV: ", msg);
        confirm(msg);
    }
};
```
<br />
Sve rute se nalaze u `src/pages`, UniversalViewer komponenta se nalazi u `src/components/uv.tsx`.
