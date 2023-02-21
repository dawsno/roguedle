<script context="module" lang="ts">
	import {
		modeData,
		seededRandomInt,
		Stats,
		GameState,
		Settings,
		LetterStates,
		getWordNumber,
		words,
		COLS,
	} from "./utils";
	import Game from "./components/Game.svelte";
	import { letterStates, settings, mode } from "./stores";
	import { GameMode } from "./enums";
	import { Toaster } from "./components/widgets";
	import { setContext } from "svelte";

	document.title = "Roguele | A Wordle Roguelike";
</script>

<script lang="ts">
	export let version: string;
	setContext("version", version);
	localStorage.setItem("version", version);
	let stats: Stats;
	let word: string;
	let state: GameState;
	let toaster: Toaster;

	settings.set(new Settings(localStorage.getItem("settings")));
	settings.subscribe((s) => localStorage.setItem("settings", JSON.stringify(s)));

	const hash = window.location.hash.slice(1).split("/");
	const modeVal: GameMode = !isNaN(GameMode[hash[0]])
		? GameMode[hash[0]]
		: +localStorage.getItem("mode") || modeData.default;
	mode.set(modeVal);
	// If this is a link to a specific word make sure that that is the word
	if (!isNaN(+hash[1]) && +hash[1] < getWordNumber(modeVal)) {
		modeData.modes[modeVal].seed =
			(+hash[1] - 1) * modeData.modes[modeVal].unit + modeData.modes[modeVal].start;
		modeData.modes[modeVal].historical = true;
	}
	mode.subscribe((m) => {
		localStorage.setItem("mode", `${m}`);
		window.location.hash = GameMode[m];
		stats = new Stats(localStorage.getItem(`stats-${m}`) || m);
		var wordsList;
		switch (COLS)  {
			case 5: 
				wordsList = words.words5; 
				break;
			case 6: 
				wordsList= words.words6;
				break;
			case 7: 
				wordsList = words.words7;
				break;
			case 8: 
				wordsList = words.words8;
				break;
			case 9: 
				wordsList = words.words9;
				break;
			case 10: 
				wordsList = words.words10;
				break;
			case 11: 
				wordsList = words.words11;
				break;
			case 12: 
				wordsList = words.words12;
				break;
			default:
				wordsList = words.words5;
		} 
		word = wordsList[seededRandomInt(0, wordsList.length, modeData.modes[$mode].seed)];
		if (modeData.modes[m].historical) {
			state = new GameState(m, localStorage.getItem(`state-${m}-h`));
		} else {
			state = new GameState(m, localStorage.getItem(`state-${m}`));
		}
		// Set the letter states when data for a new game mode is loaded so the keyboard is correct
		letterStates.set(new LetterStates(state.board));
	});

	$: saveState(state);
	function saveState(state: GameState) {
		if (modeData.modes[$mode].historical) {
			localStorage.setItem(`state-${$mode}-h`, state.toString());
		} else {
			localStorage.setItem(`state-${$mode}`, state.toString());
		}
	}
</script>

<Toaster bind:this={toaster} />
{#if toaster}
	<Game {stats} bind:word {toaster} bind:game={state} />
{/if}
