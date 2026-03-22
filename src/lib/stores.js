import { writable } from "svelte/store";

export const headerSearchQuery = writable("");

export function findLocaleMatch() {
	let keys = ["en", "fr", "de", "cz"];
	let locales = Intl.getCanonicalLocales(keys);

	let lang = navigator.language;
	let locale = Intl.getCanonicalLocales(lang);
	console.log('browser language', lang);
	console.log('locales from data file', locale);

	let langMatch = document.documentElement.getAttribute('lang');
	locales = locales.filter(l => locale == l);
	langMatch = (locales.length > 0) ? locales[0] : langMatch;
	return langMatch;
}
