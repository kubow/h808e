import App from './App.svelte';
//import BackToTop from './BackToTop.svelte'

const app = new App({
	target: document.body,
	//target: document.querySelector('#app'),
	//hydrate: true,
	props: {}
});

//BackToTop button disabled
/* if ('IntersectionObserver' in window) {
	new BackToTop({
		target: document.querySelector('#backtotop'),
		props: {
			track: document.querySelector('#search')
		}
	})
} */

export default app;