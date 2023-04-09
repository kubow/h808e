import { readable, writable } from "svelte/store";


//localstore will be preferred_language
//const store = writable(localStorage.getItem("store") || "");
//store.subscribe(val => localStorage.setItem("store", val));
// https://stackoverflow.com/questions/56488202/how-to-persist-svelte-store

export const h808e = writable({
	path: '',
	project: '',
	api: {
		ipgeoloc: {
			access_key: '12a3d14c6ab94927af1c9f9fb0aac658',
			url: 'https://api.ipgeolocation.io/astronomy?apiKey=BOBOK&location=Prague,%20Czech',
		},
		newsapi: {
			access_key: '06751c9f3e7441bfb972aefcdbf8cbb7',
			url: 'https://newsapi.org/v2/top-headlines?country=cz&apiKey=BOBOK',
		},
		scrapestack: {
			access_key: '3847b2cdb40f8f8d3c44240810d4cad4',
			url: 'https://api.scrapestack.com/scrape?access_key=BOBOK&render_js=1&url=',
		},
		rss2json: {
			access_key: 'abwwvfp3zlhnbw3tcb3pmrsbqpt7gfkhpioavboq',
			url: ' https://api.rss2json.com/v1/api.json?api_key=BOBOK&rss_url=',
		}

	},
});
export const current_path = writable("/");

export const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});


/**
 * @param {number} initialValue
 * @param {{ (): void; (arg0: any, arg1: any): void; }} watchFunction
 */
export function watcher(initialValue, watchFunction) {
	const { subscribe, update } = writable(initialValue)
	return {
		subscribe,
		set: (/** @type {number} */ value) => {
			update(oldvalue => {
				watchFunction(oldvalue, value)
				return value
			})
		}
	}
};

export function findLocaleMatch() {
	//let keys = Object.keys(langdata.languages);
	let keys = ["en", "fr", "de", "cz"];
	let locales = Intl.getCanonicalLocales(keys); //from our data validated

	let lang = navigator.language; //from browser 
	let locale = Intl.getCanonicalLocales(lang); //from browser validated
	console.log('browser language', lang);
	console.log('locales from data file', locale);

	//find the match for locale inside locales
	let langMatch = document.documentElement.getAttribute('lang'); //default
	locales = locales.filter(l => locale == l);
	langMatch = (locales.length > 0) ? locales[0] : langMatch;
	return langMatch;
}

/**
 * @param {string | string[]} string
 */
export function parseDate(string) {
	let d = new Date();
	let a = string.split('-');
	if (string[0] == '-') {
		d.setYear('-'+a[1]);
		d.setMonth(a[2]);
		d.setDate(a[3]);
	} else {
		d.setFullYear(a[0], a[1], a[2]);
	};
	return d
};

/**
 * @param {RequestInfo | URL} address
 */
export async function loadDataUrl(address) {
	if (!address) { // default settings for application (PHP site)
		address = `https://www.blisty.cz/rss2?all=1`;
	}
	//console.log('DEBUG: getting address: '+address)
	try {
		// TODO: need to combine from https://javascript.info/fetch-api 
		const res = await fetch(address, {
			method: 'GET',
			//referrer: '',
			//referrerPolicy: 'no-referrer',
			//mode: 'no-cors',  
			//headers: {
				//'Content-Type': 'application/xhtml+xml',
				//'Access-Control-Allow-Headers': 'ContOrigin, X-Requested-With, Content-Type, Accept',
				//'Access-Control-Allow-Method': 'GET, POST',
				//'Access-Control-Allow-Origin': '*',
				//'Access-Control-Expose-Headers': "Content-Length, X-JSON",
   				//'Access-Control-Max-Age': 86400
			//}
		});
		const text = await res.json(); //.text();
		
		if (res.ok && text) {
			return text;
		} else {
			console.log('# # # # # # Error Print:');
			console.log(res);
			throw new Error(text);
		}
	} catch(ex) {
		console.log(ex);
	};
};

/**
 * @param {RequestInfo | URL} address
 */
export async function loadDataJson(address) {
	if (!address) { // default settings for application (PHP site)
		address = 'assets/saturn_pluto.json';
	}
	try {
		const res = await fetch(address);
		const text = await res.json(); //.text();
		
		if (res.ok && text) {
			return text;
		} else {
			console.log('# # # # # # Error Print:');
			console.log(res);
			throw new Error(text);
		}
	} catch(ex) {
		//alert(ex);
		console.log("Trying fetch "+address+" / "+ex);
	};
};

/**
 * @param {RequestInfo | URL} address
 */
export async function loadDataMD(address) {
	let marked = require('marked');
	if (!address) { // default settings for application (PHP site)
		address = 'assets/410.md';
	} else {
		address = 'assets/'+address+'.md';
	}
	try {
		const res = await fetch(address);
		//const text = await res.text();
		let reader = res.body.getReader();
		let utf8Decoder = new TextDecoder();
		let nextChunk;
		let resultStr = '';
    
		while (!(nextChunk = await reader.read()).done) {
			let partialData = nextChunk.value;
			resultStr += utf8Decoder.decode(partialData);
		}

		if (res.ok && resultStr) {
			//return transformToHTML(resultStr);
			return marked(resultStr); //using marked bundle
		} else {
			console.log('# # # # # # Error Print:');
			console.log(res);
			throw new Error(resultStr);
		}
	} catch(ex) {
		//alert(ex);
		console.log("Trying fetch "+address+" / "+ex);
	};
};

/**
 * @param {any} text
 * @param {(string | RegExp)[][]} replacementArray
 */
export function massReplace(text, replacementArray) {
	let results = text;
	for (let [regex, replacement] of replacementArray) {
	  results = results.replace(regex, replacement);
	}
	return results;
  }
  
/**
 * @param {any} text
 * @param {string} orig
 */
export function transformHeadings(text, orig) {
	if (orig.match(/^#{1,6}\s/)) {
	  return massReplace(text,
						 [ [/^###### (.*)/gm, '<h6>$1</h6>'],
						   [/^##### (.*)/gm,  '<h5>$1</h5>'],
						   [/^#### (.*)/gm,   '<h4>$1</h4>'],
						   [/^### (.*)/gm,    '<h3>$1</h3>'],
						   [/^## (.*)/gm,     '<h2>$1</h2>'],
						   [/^# (.*)/gm,      '<h1>$1</h1>'] ]
						);
	}
  }
  
/**
 * @param {any} text
 * @param {string} orig
 */
export function transformQuotes(text, orig) {
	if (orig.match(/"|'/)) {
	  return massReplace(text,
						 [ [/"(?=\b|\*|')/g,             '&ldquo;'],
						   [/"(?!\b|\*|')/g,             '&rdquo;'],
						   [/'(?!\b|\*)|(?=\b)'(?=\b)/g, '&lsquo;'],
						   [/'(?=\b|\*)/g,               '&rsquo;'] ]
						);
	}
  }
  
/**
 * @param {any} text
 * @param {string} orig
 */
export function transformStyling(text, orig) {
	if (orig.match(/\*\*|\*/)) {
	  return massReplace(text, 
						 [ [ /\*\*([^\*|\s]+)\*\*/g, '<strong>$1</strong>'], 
						   [ /\*([^\*|\s]+)\*/g,     '<em>$1</em>' ] ]);
	}
  }
  
/**
 * @param {any} text
 * @param {string} orig
 */
export function transformDashes(text, orig) {
	if (orig.match(/\-\-/)) {
	  return massReplace (text, [ [ /\-\-/g, '&mdash;' ] ]);
	}
  }
  
/**
 * @param {any} text
 * @param {string} orig
 */
export function transformParagraphs(text, orig) {
	if (!orig.match(/^#{1,6} (.*)/)) {
	  return `<p>${text}</p>`;
	}
  }
  
/**
 * @param {string} markdownSource
 */
export function transformToHTML(markdownSource) {
	let data = markdownSource.split('\n\n'),
		orig = data.slice(),
		transforms = [ transformHeadings, transformQuotes, transformDashes, 
					   transformStyling, transformParagraphs ];
  
	for (let i = 0, l = orig.length; i < l; ++i) {
	  for (let transform of transforms) {
		let result;
		if ((result = transform(data[i], orig[i])) !== undefined) {
		  data[i] = result;
		}
	  }
	}
  
	return data.join('\n');
  }