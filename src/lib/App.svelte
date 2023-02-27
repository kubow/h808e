<script>
	import { onMount } from 'svelte';
	//import { Router, Route, Link } from "svelte-routing";
	import Router from "./Router.svelte";
	import Route from "./Route.svelte";
	import Head from "./Head.svelte";
	import News from "./routes/News.svelte";
	//import Planets from "./routes/Planets.svelte";
	import Planets from "./routes/PlanetsInOne.svelte";
	import Plants from "./routes/Plants.svelte";
	import Radio from "./routes/Radio.svelte";
	import Restaurants from "./routes/Restaurants.svelte";
	import Database from "./routes/Database.svelte";
	import Welcome from "./routes/Welcome.svelte";
	import Calc from "./routes/Calc.svelte";
	import Maps from "./routes/Map.svelte";
	import Test from "./routes/Test.svelte";
	//import { fly } from 'svelte/transition';
	import { h808e, translate, watcher } from './stores.js';

	//export let url = ""; // router functionality
	let open = false; // side menu
	let pwd = ""; // password protected
	let searchQuery = '';
	const name = watcher(0, logIt);
	export let lang = {};

	$: outerWidth = 0
	$: innerWidth = 0
	
	function logIt() {
		console.log(name);
	};

	function tgl() {open = !open};

	function tgl_pwd(event) {
		if (pwd == "astrolab") { 
			open = !open;
			return true
		} else {
			alert("Prosim zadejte heslo ")
			event.preventDefault();
			return false
		}
	};
	
	function handleSubmit() {
		if (!searchQuery) return;
		console.log(searchQuery);
	};

	function changeLanguage(new_lang) {
		console.log($h808e.lang);
		if (lang == 'cs'|| lang == 'en') {lang = translate(temp, new_lang)};
	};

	onMount(async() => {
		let temp = await $h808e.lang;
		lang = translate(temp, 'cz');
	})
	
</script>

<svelte:window bind:innerWidth bind:outerWidth />

<Head bind:sidebar={open} bind:query={searchQuery} handleSubmit={handleSubmit}/>
<aside class="absolute w-full h-full bg-gray-200 shadow-lg" class:open>
	{#await lang}
	<p>waiting for content...</p>
	{:then lang}
	<nav class="m-12 text-xl">
		<ul>
			<li><a href="/" on:click={tgl}>{lang['home']}</a></li>
		</ul><ul>
			<li><a href="/herb" on:click={tgl}>{lang['stone']}</a></li>
			<li><a href="/herb" on:click={tgl}>{lang['plant']}</a></li>
			<li><a href="/herb" on:click={tgl}>{lang['anima']}</a></li>
			<li><a href="/herb" on:click={tgl}>{lang['planet']}</a></li>
		</ul><ul>
			<li><a href="/calculator" on:click={tgl}>{lang['calc']}</a></li>
			<li><a href="/test" on:click={tgl}>{lang['test']}</a></li>
			<li><a href="/rest" on:click={tgl}>{lang['rest']}</a></li>
			<li><a href="/news" on:click={tgl}>{lang['rss']}</a></li>
			<li><a href="/radio" on:click={tgl}>{lang['radio']}</a></li>
		</ul><ul>
			<li><a href="/database" on:click={tgl}>{lang['database']}</a></li>
			<li><a href="/maps" on:click={tgl}>{lang['maps']}</a></li>
			<li><a href="/planets" on:click={tgl_pwd}>{lang['planet']} - {lang['pass']}:</a><input bind:value={pwd}></li>
		</ul>
	</nav>
	{:catch error}
	<p> oooo </p>
	{/await}
</aside>
<Router>
	<Route path="/planets"><Planets /></Route>
	<Route path="/welcome"><Welcome /></Route>
	<Route path="/calculator"><Calc /></Route>
	<Route path="/database"><Database /></Route>
	<Route path="/herb"><Plants /></Route>
	<Route path="/rest"><Restaurants /></Route>
	<Route path="/maps"><Maps /></Route>
	<Route path="/news"><News /></Route>
	<Route path="/radio"><Radio /></Route>
	<Route path="/test"><Test /></Route>
	<Route path="/"><Welcome /></Route>
</Router>

<style>
	nav {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: space-evenly;
		align-items: stretch;
		align-content: space-around;
		align-self: center;

	}

	ul {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-evenly;
		align-items: stretch;
		align-content: space-around;
	}

	li {
		flex-shrink: 4;
		flex-grow: 12;
	}

	aside {
		left: -100%;
		transition: left 0.3s ease-in-out;
		z-index: 11;
	}
	.open {
		left: 0
	}

	 /*select {
    display: block; width: 100px; max-width: 100%;
  }*/
</style>

