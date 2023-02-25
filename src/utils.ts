import seedRandom from "seedrandom";
import { ArtifactType, GameMode, ms } from "./enums";
import wordList from "./words";
import { Artifact } from "./artifacts";
import { get } from "svelte/store";
const initRows = 6;
const initColumns = 5;
const initArtifactChoices = 2;
const initRoundsBetweenIncrease = 2;
const initRoundsBetweenArtifact = 2;
export var artifactChoices = initArtifactChoices;
export var roundsBetweenIncrease = initRoundsBetweenIncrease;
export var roundsBetweenArtifact = initRoundsBetweenArtifact;
export var ROWS = initRows;
export var COLS = initColumns;

export const words = {
  ...wordList,
  contains: (word: string) => {
    var wordsList;
    switch (word.length) {
      case 5:
        wordsList = words.words5;
        break;
      case 6:
        wordsList = words.words6;
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
    return wordsList.includes(word);
  },
};

class Tile {
  public value: string;
  public notSet: Set<string>;
  constructor() {
    this.notSet = new Set<string>();
  }
  not(char: string) {
    this.notSet.add(char);
  }
}

class WordData {
  public letterCounts: Map<string, [number, boolean]>;
  private notSet: Set<string>;
  public word: Tile[];
  constructor() {
    this.notSet = new Set<string>();
    this.letterCounts = new Map<string, [number, boolean]>();
    this.word = [];
    for (let col = 0; col < COLS; ++col) {
      this.word.push(new Tile());
    }
  }
  confirmCount(char: string) {
    let c = this.letterCounts.get(char);
    if (!c) {
      this.not(char);
    } else {
      c[1] = true;
    }
  }
  countConfirmed(char: string) {
    const val = this.letterCounts.get(char);
    return val ? val[1] : false;
  }
  setCount(char: string, count: number) {
    let c = this.letterCounts.get(char);
    if (!c) {
      this.letterCounts.set(char, [count, false]);
    } else {
      c[0] = count;
    }
  }
  incrementCount(char: string) {
    ++this.letterCounts.get(char)[0];
  }
  not(char: string) {
    this.notSet.add(char);
  }
  inGlobalNotList(char: string) {
    return this.notSet.has(char);
  }
  lettersNotAt(pos: number) {
    return new Set([...this.notSet, ...this.word[pos].notSet]);
  }
}

export function getRowData(n: number, board: GameBoard) {
  const wd = new WordData();
  for (let row = 0; row < n; ++row) {
    const occurred = new Set<string>();
    for (let col = 0; col < COLS; ++col) {
      const state = board.state[row][col];
      const char = board.words[row][col];
      if (state === "⬛") {
        wd.confirmCount(char);
        // if char isn't in the global not list add it to the not list for that position
        if (!wd.inGlobalNotList(char)) {
          wd.word[col].not(char);
        }
        continue;
      }
      // If this isn't the first time this letter has occurred in this row
      if (occurred.has(char)) {
        wd.incrementCount(char);
      } else if (!wd.countConfirmed(char)) {
        occurred.add(char);
        wd.setCount(char, 1);
      }
      if (state === "🟩") {
        wd.word[col].value = char;
      } else {
        // if (state === "🟨")
        wd.word[col].not(char);
      }
    }
  }

  let exp = "";
  for (let pos = 0; pos < wd.word.length; ++pos) {
    exp += wd.word[pos].value
      ? wd.word[pos].value
      : `[^${[...wd.lettersNotAt(pos)].join(" ")}]`;
  }
  return (word: string) => {
    if (new RegExp(exp).test(word)) {
      const chars = word.split("");
      for (const e of wd.letterCounts) {
        const occurrences = countOccurrences(chars, e[0]);
        if (!occurrences || (e[1][1] && occurrences !== e[1][0])) return false;
      }
      return true;
    }
    return false;
  };
}

function countOccurrences<T>(arr: T[], val: T) {
  return arr.reduce((count, v) => (v === val ? count + 1 : count), 0);
}

export function contractNum(n: number) {
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export const keys = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

/**
 * Return a deterministic number based on the given mode and current or given time.
 * @param mode - The mode
 * @param time - The time. If omitted current time is used
 */
export function newSeed(mode: GameMode, time?: number) {
  const now = time ?? Date.now();
  switch (mode) {
    case GameMode.rougedle:
      // Adds time zone offset to UTC time, calculates how many days that falls after 1/1/1970
      // and returns the unix time for the beginning of that day.
      return Date.UTC(
        1970,
        0,
        1 +
          Math.floor(
            (now - new Date().getTimezoneOffset() * ms.MINUTE) / ms.DAY
          )
      );
    case GameMode.ludwig:
      return now - (now % ms.SECOND);
    // case GameMode.minutely:
    // 	return now - (now % ms.MINUTE);
    /*case GameMode.testing:
      return now - (now % ms.SECOND);*/
  }
}
export const modeData: ModeData = {
  default: GameMode.ludwig,
  modes: [
    {
      name: "Roguedle",
      unit: ms.DAY,
      start: 1642370400000, // 17/01/2022 UTC+2
      seed: newSeed(GameMode.rougedle),
      historical: false,
      streak: true,
      useTimeZone: true,
    },
    {
      name: "Ludwig Mode",
      unit: ms.SECOND,
      start: 1642528800000, // 18/01/2022 8:00pm UTC+2
      seed: newSeed(GameMode.ludwig),
      historical: false,
      icon: "m7,100c0,-50 68,-50 93,0c25,50 93,50 93,0c0,-50 -68,-50 -93,0c-25,50 -93,50 -93,0z",
      streak: true,
    },
    /*{
      name: "Test",
      unit: ms.SECOND,
      start: 1642428600000, // 17/01/2022 4:10:00pm UTC+2
      seed: newSeed(GameMode.testing),
      historical: false,
      icon: "",
    },*/
  ],
};
/**
 * Return the word number for the given mode at the time that that mode's seed was set.
 * @param mode - The game mode
 * @param current - If true the word number will be for the current time rather than for the current
 * seed for the given mode. Useful if you want the current game number during a historical game.
 */
export function getWordNumber(mode: GameMode, current?: boolean) {
  const seed = current ? newSeed(mode) : modeData.modes[mode].seed;
  return (
    Math.round(
      (seed - modeData.modes[mode].start) / modeData.modes[mode].unit
    ) + 1
  );
}

export function seededRandomInt(min: number, max: number, seed: number) {
  const rng = seedRandom(`${seed}`);
  return Math.floor(min + (max - min) * rng());
}

export const DELAY_INCREMENT = 200;

export const PRAISE = [
  "Genius",
  "Magnificent",
  "Impressive",
  "Splendid",
  "Great",
  "Phew",
];

abstract class Storable {
  toString() {
    return JSON.stringify(this);
  }
}

export class GameState extends Storable {
  public active: boolean;
  public guesses: number;
  public validHard: boolean;
  public time: number;
  public wordNumber: number;
  public board: GameBoard;
  public artifactStates: ArtifactState[];

  #valid = false;
  #mode: GameMode;
  seed: number;

  constructor(mode: GameMode, seed: number, data?: string) {
    super();
    this.#mode = mode;
    if (data) {
      this.parse(data);
      this.seed = seed;
    }
    if (!this.#valid) {
      this.active = true;
      this.guesses = 0;
      this.validHard = true;
      this.time = modeData.modes[mode].seed;
      this.wordNumber = getWordNumber(mode);
      this.artifactStates = new Array<ArtifactState>();
      this.seed = seed;
      startOfRound(this);
      this.board = {
        words: Array(ROWS).fill(""),
        state: Array.from({ length: ROWS }, () => Array(COLS).fill("🔳")),
      };
      this.#valid = true;
    }
    this.updateBoard();
  }
  get latestWord() {
    return this.board.words[this.guesses];
  }
  get lastState() {
    return this.board.state[this.guesses - 1];
  }
  get lastWord() {
    return this.board.words[this.guesses - 1];
  }
  /**
   * Returns an object containing the position of the character in the latest word that violates
   * hard mode, and what type of violation it is, if there is a violation.
   */
  checkHardMode(): HardModeData {
    for (let i = 0; i < COLS; ++i) {
      if (
        this.board.state[this.guesses - 1][i] === "🟩" &&
        this.board.words[this.guesses - 1][i] !==
          this.board.words[this.guesses][i]
      ) {
        return {
          pos: i,
          char: this.board.words[this.guesses - 1][i],
          type: "🟩",
        };
      }
    }
    for (let i = 0; i < COLS; ++i) {
      if (
        this.board.state[this.guesses - 1][i] === "🟨" &&
        !this.board.words[this.guesses].includes(
          this.board.words[this.guesses - 1][i]
        )
      ) {
        return {
          pos: i,
          char: this.board.words[this.guesses - 1][i],
          type: "🟨",
        };
      }
    }
    return { pos: -1, char: "", type: "⬛" };
  }
  guess(word: string) {
    const characters = word.split("");
    const result = Array<LetterState>(COLS).fill("⬛");
    for (let i = 0; i < COLS; ++i) {
      if (characters[i] === this.latestWord.charAt(i)) {
        result[i] = "🟩";
        characters[i] = "$";
      }
    }
    for (let i = 0; i < COLS; ++i) {
      const pos = characters.indexOf(this.latestWord[i]);
      if (result[i] !== "🟩" && pos >= 0) {
        characters[pos] = "$";
        result[i] = "🟨";
      }
    }
    return result;
  }
  private parse(str: string) {
    const parsed = JSON.parse(str) as GameState;
    if (parsed.wordNumber !== getWordNumber(this.#mode)) return;
    this.active = parsed.active;
    this.guesses = parsed.guesses;
    this.validHard = parsed.validHard;
    this.time = parsed.time;
    this.artifactStates = parsed.artifactStates;
    this.wordNumber = parsed.wordNumber;
    this.board = parsed.board;
    this.#valid = true;
    startOfRound(this);
  }
  public updateBoard() {
    //TODO make this work with guess decreases for curses
    if (ROWS > this.board.state.length) {
      this.board.words.push("");
      this.board.state.push(Array<LetterState>(COLS).fill("🔳"));
    }
  }
}

export class Settings extends Storable {
  public hard = new Array(modeData.modes.length).fill(false);
  public dark = true;
  public colorblind = false;
  public tutorial: 0 | 1 | 2 | 3 = 3;

  constructor(settings?: string) {
    super();
    if (settings) {
      const parsed = JSON.parse(settings) as Settings;
      this.hard = parsed.hard;
      this.dark = parsed.dark;
      this.colorblind = parsed.colorblind;
      this.tutorial = parsed.tutorial;
    }
  }
}

export class Stats extends Storable {
  public played = 0;
  public lastGame = 0;
  public guesses = {
    fail: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };
  public streak: number;
  public maxStreak: number;
  #hasStreak = false;

  constructor(param: string | GameMode) {
    super();
    if (typeof param === "string") {
      this.parse(param);
    } else if (modeData.modes[param].streak) {
      this.streak = 0;
      this.maxStreak = 0;
      this.#hasStreak = true;
    }
  }
  private parse(str: string) {
    const parsed = JSON.parse(str) as Stats;
    this.played = parsed.played;
    this.lastGame = parsed.lastGame;
    this.guesses = parsed.guesses;
    if (parsed.streak != undefined) {
      this.streak = parsed.streak;
      this.maxStreak = parsed.maxStreak;
      this.#hasStreak = true;
    }
  }
  /**
   * IMPORTANT: When this method is called svelte will not register the update, so you need to set
   * the variable that this object is assigned to equal to itself to force an update.
   * Example: `states = states;`.
   */
  addWin(guesses: number, mode: Mode) {
    ++this.guesses[guesses];
    ++this.played;
    if (this.#hasStreak) {
      this.streak = mode.seed - this.lastGame > mode.unit ? 1 : this.streak + 1;
      this.maxStreak = Math.max(this.streak, this.maxStreak);
    }
    this.lastGame = mode.seed;
  }
  /**
   * IMPORTANT: When this method is called svelte will not register the update, so you need to set
   * the variable that this object is assigned to equal to itself to force an update.
   * Example: `states = states;`.
   */
  addLoss(mode: Mode) {
    ++this.guesses.fail;
    ++this.played;
    if (this.#hasStreak) this.streak = 0;
    this.lastGame = mode.seed;
  }
  get hasStreak() {
    return this.#hasStreak;
  }
}

export class LetterStates {
  public a: LetterState = "🔳";
  public b: LetterState = "🔳";
  public c: LetterState = "🔳";
  public d: LetterState = "🔳";
  public e: LetterState = "🔳";
  public f: LetterState = "🔳";
  public g: LetterState = "🔳";
  public h: LetterState = "🔳";
  public i: LetterState = "🔳";
  public j: LetterState = "🔳";
  public k: LetterState = "🔳";
  public l: LetterState = "🔳";
  public m: LetterState = "🔳";
  public n: LetterState = "🔳";
  public o: LetterState = "🔳";
  public p: LetterState = "🔳";
  public q: LetterState = "🔳";
  public r: LetterState = "🔳";
  public s: LetterState = "🔳";
  public t: LetterState = "🔳";
  public u: LetterState = "🔳";
  public v: LetterState = "🔳";
  public w: LetterState = "🔳";
  public x: LetterState = "🔳";
  public y: LetterState = "🔳";
  public z: LetterState = "🔳";

  constructor(board?: GameBoard) {
    if (board) {
      for (let row = 0; row < ROWS; ++row) {
        for (let col = 0; col < board.words[row].length; ++col) {
          if (
            this[board.words[row][col]] === "🔳" ||
            board.state[row][col] === "🟩"
          ) {
            this[board.words[row][col]] = board.state[row][col];
          }
        }
      }
    }
  }
  /**
   * IMPORTANT: When this method is called svelte will not register the update, so you need to set
   * the variable that this object is assigned to equal to itself to force an update.
   * Example: `states = states;`.
   */
  update(state: LetterState[], word: string) {
    state.forEach((e, i) => {
      const ls = this[word[i]];
      if (ls === "🔳" || e === "🟩") {
        this[word[i]] = e;
      }
    });
  }
  removeRandLetter(game: GameState, word: string) {
    this.update(game.lastState, game.lastWord);
    var charsChecked = 0;
    var charToRemove = "";
    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    var shuffledAlphabet = alphabet.split("").sort((a, b) => {
      const randomA = game.seed + a.charCodeAt(0);
      const randomB = game.seed + b.charCodeAt(0);
      return randomA - randomB;
    });
    while (charToRemove.length == 0) {
      if (charsChecked == 26) {
        return;
      }
      if (
        this[shuffledAlphabet[charsChecked]] === "🔳" &&
        !word.includes(shuffledAlphabet[charsChecked])
      ) {
        charToRemove = shuffledAlphabet[charsChecked];
      }
      charsChecked++;
    }
    this[charToRemove] = "⬛";
  }
  getInfoStart(game: GameState, word: string): [LetterState[], string] {
    var information = new Array<LetterState>();
    var infoWord = "";
    var consonant = game.artifactStates.some((a) => a.id === 40);
    var rareLetter = game.artifactStates.some((a) => a.id === 26);
    var syllable = game.artifactStates.some((a) => a.id === 41);
    var silverKey = game.artifactStates.some((a) => a.id === 60);
    var skeletonKey = game.artifactStates.some((a) => a.id === 62);
    var yellowKey = game.artifactStates.some((a) => a.id === 59);
    if (rareLetter) {
      // add yellow to keyboard
      var rareLetters: string = "fywkvxzjq";
      var result = "";
      for (let i = 0; i < rareLetters.length; i++) {
        const char = rareLetters[i];
        if (word.includes(char) && !result.includes(char)) {
          result += char;
        }
      }
      if (result.length > 0) {
        var ind = seededRandomInt(0, result.length, game.seed);
        var char = result.charAt(ind);
        this[char] = "🟨";
      }
    }
    if (consonant) {
      // add yellow to keyboard
      var consonants = "bcdfghjklmnpqrstvwxyz";
      var result = "";
      for (let i = 0; i < consonants.length; i++) {
        const char = consonants[i];
        if (word.includes(char) && !result.includes(char)) {
          result += char;
        }
      }
      var yellowLetters = result.split("").sort((a, b) => {
        const randomA = game.seed + a.charCodeAt(0);
        const randomB = game.seed + b.charCodeAt(0);
        return randomA - randomB;
      });
      yellowLetters.every((letter) => {
        if (this[letter] === "🔳") {
          this[letter] = "🟨";
          return false;
        }
      });
    }
    if (syllable) {
      const vowels = "aeiou";
      var result = "";
      for (let i = 0; i < vowels.length; i++) {
        const char = vowels[i];
        if (word.includes(char) && !result.includes(char)) {
          result += char;
        }
      }
      var yellowLetters = result.split("").sort((a, b) => {
        const randomA = game.seed + a.charCodeAt(0);
        const randomB = game.seed + b.charCodeAt(0);
        return randomA - randomB;
      });
      yellowLetters.every((letter) => {
        if (this[letter] === "🔳") {
          this[letter] = "🟨";
          return false;
        }
      });
      // add yellow to keyboard
    }
    if (yellowKey) {
      // add yellow to keyboard
      var yellowLetters = word.split("").sort((a, b) => {
        const randomA = game.seed + a.charCodeAt(0);
        const randomB = game.seed + b.charCodeAt(0);
        return randomA - randomB;
      });
      yellowLetters.every((letter) => {
        if (this[letter] === "🔳") {
          this[letter] = "🟨";
          return false;
        }
      });
    }
    if (silverKey) {
      var alphabet = "abcdefghijklmnopqrstuvwxyz";
      var result = "";
      for (let i = 0; i < alphabet.length; i++) {
        const char = alphabet[i];
        if (!word.includes(alphabet[i])) {
          result += char;
        }
      }
      var grayLetters = result.split("").sort((a, b) => {
        const randomA = game.seed + a.charCodeAt(0);
        const randomB = game.seed + b.charCodeAt(0);
        return randomA - randomB;
      });
      var i = 0;
      grayLetters.every((letter) => {
        if (this[letter] === "🔳") {
          this[letter] = "⬛";
          ++i;
          if (i >= 2) {
            return false;
          }
          return true;
        }
      });
    }
    if (skeletonKey) {
      var alphabet = "abcdefghijklmnopqrstuvwxyz";
      var result = "";
      for (let i = 0; i < alphabet.length; i++) {
        const char = alphabet[i];
        if (!word.includes(alphabet[i])) {
          result += char;
        }
      }
      var grayLetters = result.split("").sort((a, b) => {
        const randomA = game.seed + a.charCodeAt(0);
        const randomB = game.seed + b.charCodeAt(0);
        return randomA - randomB;
      });
      var i = 0;
      grayLetters.every((letter) => {
        if (this[letter] === "🔳") {
          this[letter] = "⬛";
          ++i;
          if (i >= 5) {
            return false;
          }
          return true;
        }
      });
    }
    return [information, infoWord];
  }
}

export function timeRemaining(m: Mode) {
  if (m.useTimeZone) {
    return (
      m.unit -
      (Date.now() - (m.seed + new Date().getTimezoneOffset() * ms.MINUTE))
    );
  }
  return m.unit - (Date.now() - m.seed);
}

export function failed(s: GameState) {
  return !(
    s.active ||
    (s.guesses > 0 &&
      s.board.state[s.guesses - 1].join("") === "🟩".repeat(COLS))
  );
}
function getWordGenerationConstraints(
  s: GameState,
  seed: number
): {
  wordTypes: string[];
  prefixes: string[];
  suffixes: string[];
} {
  var constraints = new Array<string>();
  var artifacts = s.artifactStates;
  var wordTypes = new Array<string>();
  var prefixes = new Array<string>();
  var suffixes = new Array<string>();
  artifacts.forEach((state) => {
    if (state.artifactType == ArtifactType.WordGeneration) {
      var artifact = Artifact.generateArtifact(state.id, s, state);
      constraints.push(artifact.artifactEffect(seed.toString()));
    }
  });

  for (var constraint of constraints) {
    if (constraint.length === 2) {
      if (constraint.startsWith("-")) {
        suffixes.push(constraint.charAt(1));
      } else if (constraint.endsWith("-")) {
        prefixes.push(constraint.charAt(0));
      }
    } else if (constraint.length >= 4) {
      wordTypes.push(constraint);
    }
  }
  return { wordTypes, prefixes, suffixes };
}
export async function generateWord(
  gameState: GameState,
  seed: number
): Promise<string> {
  var wordsList: string[];
  switch (COLS) {
    case 5:
      wordsList = words.words5;
      break;
    case 6:
      wordsList = words.words6;
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
  var constraints = getWordGenerationConstraints(gameState, seed);
  var wordtypes = constraints.wordTypes;
  var suffixes = constraints.suffixes;
  var prefixes = constraints.prefixes;
  var filteredList = new Array<string>();
  wordsList.filter((word) => {
    const firstChar = word.charAt(0).toUpperCase();
    const lastChar = word.charAt(word.length - 1).toUpperCase();
    if (
      (prefixes.includes(firstChar) || prefixes.length == 0) &&
      (suffixes.includes(lastChar) || suffixes.length == 0)
    ) {
      filteredList.push(word);
    }
  });
  if (filteredList.length == 0) {
    wordsList.filter((word) => {
      const firstChar = word.charAt(0).toUpperCase();
      const lastChar = word.charAt(word.length - 1).toUpperCase();
      if (
        prefixes.includes(firstChar) ||
        prefixes.length == 0 ||
        suffixes.includes(lastChar) ||
        suffixes.length == 0
      ) {
        filteredList.push(word);
      }
    });
  }
  if (filteredList.length == 0) {
    filteredList = wordsList;
  }
  var word = filteredList[seededRandomInt(0, filteredList.length, seed)];
  var needsWordType = wordtypes.length != 0;
  var i = 0;
  var defintion = await getWordData(word);
  while (needsWordType) {
    var partOfSpeeches = defintion.meanings.map(
      (meaning) => meaning.partOfSpeech
    );
    var hasWordType = wordtypes.some((partofSpeech) =>
      partOfSpeeches.includes(partofSpeech)
    );
    if (i == 30) {
      needsWordType = false;
    }
    if (hasWordType) {
      needsWordType = false;
    } else {
      word = filteredList[seededRandomInt(0, filteredList.length, seed)];
      defintion = await getWordData(word);
    }
  }
  return word;
}
const cache = new Map<string, Promise<DictionaryEntry>>();
export async function getWordData(word: string): Promise<DictionaryEntry> {
  if (!cache.has(word)) {
    const data = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      {
        mode: "cors",
      }
    );
    if (data.ok) {
      cache.set(word, (await data.json())[0]);
    } else {
      throw new Error(`Failed to fetch definition`);
    }
  }
  return cache.get(word);
}

export function startOfRound(gamesState: GameState) {
  COLS = initColumns;
  ROWS = initRows;
  roundsBetweenArtifact = initRoundsBetweenArtifact;
  roundsBetweenIncrease = initRoundsBetweenIncrease;
  artifactChoices = initArtifactChoices;
  updateValues(gamesState);
}
function updateValues(gameState: GameState) {
  var valsToUpdate = new Array<string>();
  gameState.artifactStates.forEach((state) => {
    if (state.artifactType == ArtifactType.ChangeValue) {
      var artifact = Artifact.generateArtifact(state.id, gameState, state);
      if (artifact.condition(gameState)) {
        valsToUpdate.push(artifact.artifactEffect(""));
      }
    }
  });
  valsToUpdate.forEach((element) => {
    var [variable, valueString] = element.split(",");
    var value = parseInt(valueString);
    switch (variable) {
      case "guess":
        ROWS = ROWS + value;
        break;
      case "wordLength":
        COLS = COLS + value;
        if (COLS > 12) {
          COLS = 12;
        }
        break;
      case "setWordLength":
        COLS = value;
        break;
      case "numArtifactChoices":
        artifactChoices = artifactChoices + value;
        break;
      case "roundsBetweenIncrease":
        roundsBetweenIncrease = roundsBetweenIncrease + value;
        break;
      case "roundsBetweenArtifact":
        roundsBetweenArtifact = roundsBetweenArtifact + value;
    }
  });
}

export function incrementRow() {
  ROWS = ROWS + 1;
}
