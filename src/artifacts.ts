import { ArtifactType } from "./enums";
import { seededRandomInt, type GameState } from "./utils";
import { ROWS } from "./utils";
export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function blankArtifactState(): ArtifactState {
  var state: ArtifactState = {
    id: 0,
    canHaveMultiple: false,
    artifactType: ArtifactType.undef,
    name: "",
    imgString: "",
    effectText: "",
  };
  return state;
}
export abstract class Artifact {
  public state: ArtifactState;
  public constructor(state: ArtifactState) {
    this.state = blankArtifactState();
    this.state.id = state.id;
    this.state.canHaveMultiple = state.canHaveMultiple;
    this.state.artifactType = state.artifactType;
    this.state.artifactBool = state.artifactBool;
    this.state.artifactData = state.artifactData;
    this.state.imgString = state.imgString;
    this.state.name = state.name;
    this.state.effectText = state.effectText;
    this.state.artifactStringData = state.artifactStringData;
  }

  public abstract artifactEffect(inputString?: string): string;
  public abstract removeArtifact();
  public abstract condition(gameState: GameState): boolean;
  public abstract updateState(artifactState: ArtifactState);
  public static generateArtifact(
    id: number,
    gameState: GameState,
    artifactState?: ArtifactState
  ): Artifact {
    var artifact: Artifact;
    var state: ArtifactState = blankArtifactState();
    state.id = id;
    state.canHaveMultiple = false;
    switch (id) {
      case 1:
        state.name = "Yellow Potion";
        state.imgString = "YellowPotion.png";
        state.artifactType = ArtifactType.StartOfRound;
        break;
      case 2:
        state.name = "Green Potion";
        state.imgString = "GreenPotion.png";
        break;
      case 3:
        state.name = "Curious Coots";
        state.imgString = "CuriosCoots1.png";
        state.artifactType = ArtifactType.ChangeValue;
        state.artifactData = 1; // initial 1 extra guess
        state.effectText = "Gain an extra guess.";
        artifact = new CuriousCoots(state);
        break;
      case 4:
        state.name = "Artifact Seeker";
        state.imgString = "ArtifactSeeker.png";
        state.artifactType = ArtifactType.ChangeValue;
        state.effectText = "Find artifacts more often";
        artifact = new ArtifactSeeker(state);
        break;
      case 5:
        state.name = "Thaumsaurus";
        state.imgString = "Thaumsaurus.png";
        state.artifactType = ArtifactType.ChangeValue;
        state.effectText = "The word length increases faster";
        artifact = new Thaumsaurus(state);
        break;
      case 6:
        state.name = "9th Life";
        state.imgString = "9thLife.png";
        break;
      case 7:
        state.name = "Duplicate Detector";
        state.imgString = "DuplicateDetector.png";
        break;
      case 8:
        state.name = "Golden Portal";
        state.imgString = "GoldenPortal.png";
        state.artifactData = 3;
        state.artifactType = ArtifactType.OnGuess;
        state.effectText = "You may proceed with 3 yellow letters";
        artifact = new GoldenPortal(state);
        break;
      case 9:
        state.name = "Grey Rabbit";
        state.imgString = "GreyRabbit.png";
        var rng = seededRandomInt(0, 10, gameState.seed);
        if (rng <= 2) {
          state.imgString = "GreyRabbitRare.png";
        }
        state.artifactData = 2;
        state.artifactType = ArtifactType.OnGuess;
        state.effectText = "You may proceed with 2 gray letters";
        artifact = new GreyRabbit(state);
        break;
      case 10:
        state.name = "Shadow Scrutinizer";
        state.imgString = "ShadowScrutinizer.png";
        state.artifactType = ArtifactType.OnGuess;
        state.effectText =
          "If your guess would only reveal gray letters, gain an extra guess";
        artifact = new ShadowScrutinizer(state);
        break;
      case 11:
        state.name = "Vigilant Hunter";
        state.imgString = "VigilantHunter.png";
        state.artifactType = ArtifactType.OnGuess;
        state.effectText =
          "If your guess would only reveal yellow letters, gain an extra guess";
        artifact = new VigilantHunter(state);
        break;
      case 12:
        state.name = "Alphabet Roulette";
        state.canHaveMultiple = true;
        state.artifactType = ArtifactType.WordGeneration;
        var character: string;
        var excludedLetters = new Array<string>();
        gameState.artifactStates.forEach((element) => {
          if (element.id == 12) {
            excludedLetters.push(element.artifactStringData);
          }
        });
        var filteredAlphabet = alphabet
          .split("")
          .filter((char) => !excludedLetters.includes(char));
        var index = seededRandomInt(0, filteredAlphabet.length, gameState.seed);
        character = filteredAlphabet[index];
        state.imgString = "AlphabetRoulette" + character.toUpperCase() + ".png";
        state.effectText =
          "Increased chance for the word to start with the letter '" +
          character +
          "'";
        state.artifactStringData = character;
        artifact = new AlphabetRoulette(state);
        break;
      case 13:
        state.name = "Conjure Conclusion";
        state.canHaveMultiple = true;
        state.artifactType = ArtifactType.WordGeneration;
        var character: string;
        var excludedLetters = new Array<string>();
        gameState.artifactStates.forEach((element) => {
          if (element.id == 13) {
            excludedLetters.push(element.artifactStringData);
          }
        });
        var filteredAlphabet = alphabet
          .split("")
          .filter((char) => !excludedLetters.includes(char));
        var index = seededRandomInt(0, filteredAlphabet.length, gameState.seed);
        character = filteredAlphabet[index];
        state.imgString =
          "ConjureConclusion" + character.toUpperCase() + ".png";
        state.effectText =
          "Increased chance for the word to end with the letter '" +
          character +
          "'";
        state.artifactStringData = character;
        artifact = new ConnjureConclusion(state);
        break;
      case 14:
        state.name = "Freestyle";
        state.imgString = "Freestyle.png";
        state.artifactType = ArtifactType.OnGuess;
        state.artifactBool = true;
        state.effectText = "You may submit 1 non-word guess per word";
        artifact = new Freestyle(state);
        break;
      case 15:
        state.name = "Noun Rocket";
        state.imgString = "NounRocket.png";
        state.effectText = "increased chance of the word being a noun";
        artifact = new NounRocket(state);
        break;
      case 16:
        state.name = "Virtuous Verbs";
        state.imgString = "VirtuousVerbs.png";
        state.effectText = "increased chance of the word being a verb";
        artifact = new VirtuousVerbs(state);
        break;
      case 17:
        state.name = "Adjective Archfiend";
        state.imgString = "AdjectiveArchfiend.png";
        state.effectText = "increased chance of the word being an adjective";
        artifact = new AdjectiveArchfiend(state);
        break;
      case 18:
        state.name = "Adverb Affection";
        state.imgString = "AdverbAffection.png";
        artifact = new AdverbAffection(state);
        state.effectText = "increased chance of the word being am adverb";
        break;
      case 19:
        state.name = "Dazzling Definition";
        state.imgString = "DazzlingDefinition.png";
        break;
      case 20:
        state.name = "Green Spell";
        state.imgString = "GreenSpell.png";
        break;
      case 21:
        state.name = "Gold Spell";
        state.imgString = "GoldSpell.png";
        break;
      case 22:
        state.name = "Equivalent Exchange";
        state.imgString = "EquivalentExchange.png";
        break;
      case 23:
        state.name = "Into the Sun";
        state.imgString = "IntotheSun.png";
        break;
      case 24:
        state.name = "Randomiser Rocket";
        state.imgString = "RandomiserRocket.png";
        state.artifactType = ArtifactType.ChangeValue;
        state.effectText =
          "The length of the word is randomized. You are more likely to get 12 letter words";
        artifact = new RandomiserRocket(state);
        break;
      case 25:
        state.name = "Wormhole";
        state.imgString = "Wormhole.png";
        state.artifactType = ArtifactType.ChangeValue;
        state.effectText = "Increases the word length by 1";
        artifact = new Wormhole(state);
        break;
      case 26:
        state.name = "Rare Letter Portal";
        state.imgString = "RareLetterPortal.png";
        state.artifactType = ArtifactType.keyboardInfo;
        state.effectText =
          "At the start of every round, show a letter with less than 10% usage in the word on the keyboard";
        artifact = new RareLetterPortal(state);
        break;
      case 27:
        state.name = "Skipping Stone";
        state.imgString = "SkippingStone.png";
        break;
      case 28:
        state.name = "Green Spotlight";
        state.imgString = "GreenSpotlight.png";
        break;
      case 29:
        state.name = "Golden Spotlight";
        state.imgString = "GoldenSpotlight.png";
        break;
      case 30:
        state.name = "Glass Key";
        state.imgString = "GlassKey.png";
        break;
      case 31:
        state.name = "Blackhole";
        state.imgString = "Blackhole.png";
        break;
      case 32:
        state.name = "Lucky Cat";
        state.imgString = "LuckyCat.png";
        state.artifactType = ArtifactType.ChangeValue;
        state.effectText =
          "You get an additional choice when selecting an artifact";
        artifact = new LuckyCat(state);
        break;
      case 33:
        state.name = "Exorcise";
        state.imgString = "Exorcise.png";
        break;
      case 34:
        state.name = "Dabbled in Duplication";
        state.imgString = "DabbledinDuplication.png";
        break;
      case 35:
        state.name = "Assimilate";
        state.imgString = "Assimilate.png";
        break;
      case 36:
        state.name = "Cosmic Call";
        state.imgString = "CosmicCall.png";
        break;
      case 37:
        state.name = "How Many Meows";
        state.imgString = "HowManyMeows.png";
        break;
      case 38:
        state.name = "Cat Like Clarity";
        state.imgString = "CatLikeClarity.png";
        state.artifactType = ArtifactType.OnGuess;
        state.effectText =
          "Reveal a new gray letter on the keyboard with every guess";
        artifact = new CatLikeClarity(state);

        break;
      case 39:
        state.name = "Dark Matter Definition";
        state.imgString = "DarkMatterDefinition.png";
        break;
      case 40:
        state.name = "Cosmic Consonant";
        state.imgString = "CosmicConsonant.png";
        state.artifactType = ArtifactType.keyboardInfo;
        state.effectText =
          "At the start of every round, show a consonant in the word on the keyboard";
        artifact = new CosmicConsonant(state);
        break;
      case 41:
        state.name = "Mevowel";
        state.imgString = "Mevowel.png";
        state.artifactType = ArtifactType.keyboardInfo;
        state.effectText =
          "At the start of every round, show a vowel in the word on the keyboard";
        artifact = new Mevowel(state);
        break;
      case 42:
        state.name = "Magnifying Glass";
        state.imgString = "MagnifyingGlass.png";
        break;
      case 43:
        state.name = "Sound It Out";
        state.imgString = "SoundItOut.png";
        break;
      case 44:
        state.name = "Random Purrfector";
        state.imgString = "RandomPurrfector.png";
        state.artifactType = ArtifactType.OnGuess;
        state.effectText =
          "Reveal a 7 gray letters on the keyboard with every 7 guesses";
        artifact = new RandomPurrfector(state);
        break;
      case 45:
        state.name = "Speller Reborn";
        state.imgString = "SpellerReborn.png";
        break;
      case 46:
        state.name = "Four Leaf Clover";
        state.imgString = "FourLeafClover.png";
        break;
      case 47:
        state.name = "Scratching Post";
        state.imgString = "ScratchingPost.png";
        break;
      case 48:
        state.name = "Out the Airlock";
        state.imgString = "OuttheAirlock.png";
        break;
      case 49:
        state.name = "Sacrificial Knife";
        state.imgString = "SacrificialKnife.png";
        break;
      case 50:
        state.name = "Smarty Pants";
        state.imgString = "SmartyPants.png";
        break;
      case 51:
        state.name = "Item Asteroid";
        state.imgString = "ItemAsteroid.png";
        break;
      case 52:
        state.name = "Glass Big Fat Dictionary";
        state.imgString = "GlassBigFatDictionary.png";
        break;
      case 53:
        state.name = "Guardian Angel";
        state.imgString = "GuardianAngel.png";
        break;
      case 54:
        state.name = "Holy Water";
        state.imgString = "HolyWater.png";
        break;
      case 55:
        state.name = "Satanic Dictionary";
        state.imgString = "SatanicDictionary.png";
        break;
      case 56:
        state.name = "Demon Skull";
        state.imgString = "DemonSkull.png";
        break;
      case 57:
        state.name = "Golden Rocket";
        state.imgString = "GoldenRocket.png";
        break;
      case 58:
        state.name = "Green Key";
        state.imgString = "GreenKey.png";
        break;
      case 59:
        state.name = "Golden Key";
        state.imgString = "GoldenKey.png";
        state.artifactType = ArtifactType.keyboardInfo;
        state.effectText =
          "At the start of every round, show a letter in the word on the keyboard";
        artifact = new GoldenKey(state);
        break;
      case 60:
        state.name = "Silver Key";
        state.imgString = "SilverKey.png";
        state.artifactType = ArtifactType.keyboardInfo;
        state.effectText =
          "At the start of every round, show two letters not in the word on the keyboard";
        artifact = new SilverKey(state);
        break;
      case 61:
        state.name = "Wishin' Definition";
        state.imgString = "WishinDefinition.png";
        break;
      case 62:
        state.name = "Skeleton Key";
        state.imgString = "SkeletonKey.png";
        state.artifactType = ArtifactType.keyboardInfo;
        state.effectText =
          "At the start of every round, show five letters not in the word on the keyboard";
        artifact = new SkeletonKey(state);
        break;
      case 63:
        state.name = "Demonic Letter Opener";
        state.imgString = "DemonicLetterOpener.png";
        break;
      case 64:
        state.name = "Big Fat Dictionary";
        state.imgString = "BigFatDictionary.png";
        break;
      case 65:
        state.name = "Mobius Strip";
        state.imgString = "MobiusStrip.png";
        break;
      case 66:
        state.name = "Holy Grail";
        state.imgString = "HolyGrail.png";
        break;
      case 67:
        state.name = "Brain in a Jar";
        state.imgString = "BrainInAJar.png";
        state.artifactType = ArtifactType.ChangeValue;
        state.effectText =
          "If this is your only artifact, +4 guesses. Otherwise destroy a random artifact that is not Brain in a Jar";
        artifact = new BrainInAJar(state);
        break;
      case 68:
        state.name = "Desolate";
        state.imgString = "Desolate.png";
        break;
      case 69:
        state.name = "Satanic Tome";
        state.imgString = "SatanicTome.png";
        break;
      case 70:
        state.name = "Cursed Altar";
        state.imgString = "CursedAltar.png";
        break;
      case 71:
        state.name = "Sacrificial Altar";
        state.imgString = "SacrificialAltar.png";
        break;
      case 72:
        state.name = "Heavenly Linger";
        state.imgString = "HeavenlyLinger.png";
        break;
      case 73:
        state.name = "Time Warp";
        state.imgString = "TimeWarp.png";
        break;
      case 74:
        state.name = "Reincarnation";
        state.imgString = "Reincarnation.png";
        break;
      case 75:
        state.name = "Holy Arrow";
        state.imgString = "HolyArrow.png";
        break;
      case 76:
        state.name = "Crystal Ball";
        state.imgString = "CrystalBall.png";
        break;
      case 77:
        state.name = "Crystall Cube";
        state.imgString = "CrystallCube.png";
        break;
      case 78:
        state.name = "Pluralizer";
        state.imgString = "Pluralizer.png";
        break;
      case 79:
        state.name = "Prefix Precognition";
        state.imgString = "PrefixPrecognition.png";
        break;
      case 80:
        state.name = "Selfish Suffix";
        state.imgString = "SelfishSuffix.png";
        break;
    }
    artifact.state = artifactState ?? state;
    return artifact;
  }
}
class CuriousCoots extends Artifact {
  artifactEffect(inputString?: string): string {
    return "guess," + this.state.artifactData;
  }
  removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState) {
    var cootsCount = 0;
    var artifactCount = 0;
    gameState.artifactStates.forEach((artifactState) => {
      if (artifactState.id == 3) {
        ++artifactCount;
        cootsCount = artifactState.artifactData + cootsCount;
        var index = gameState.artifactStates.indexOf(artifactState);
      }
    });
    gameState.artifactStates = gameState.artifactStates.filter(
      (state) => state.id !== 3
    );
    var newCoots = Artifact.generateArtifact(3, gameState);
    newCoots.state.artifactData = cootsCount;
    newCoots.state.imgString = "CuriosCoots" + cootsCount + ".png";
    gameState.artifactStates.push(newCoots.state);
    return true;
  }
  updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class AlphabetRoulette extends Artifact {
  public artifactEffect(inputString?: string): string {
    var seed = parseInt(inputString);
    var randNum = seededRandomInt(0, 100, seed);
    if (randNum < 35) {
      return this.state.artifactStringData + "-";
    } else {
      return "";
    }
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class ConnjureConclusion extends Artifact {
  public artifactEffect(inputString?: string): string {
    var seed = parseInt(inputString);
    var randNum = seededRandomInt(0, 100, seed);
    if (randNum < 35) {
      return "-" + this.state.artifactStringData;
    } else {
      return "";
    }
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class NounRocket extends Artifact {
  public artifactEffect(inputString?: string): string {
    var seed = parseInt(inputString);
    var randNum = seededRandomInt(0, 100, seed);
    if (randNum < 66) {
      return "noun";
    } else {
      return "";
    }
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class VirtuousVerbs extends Artifact {
  public artifactEffect(inputString?: string): string {
    var seed = parseInt(inputString);
    var randNum = seededRandomInt(0, 100, seed);
    if (randNum < 66) {
      return "verb";
    } else {
      return "";
    }
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class AdjectiveArchfiend extends Artifact {
  public artifactEffect(inputString?: string): string {
    var seed = parseInt(inputString);
    var randNum = seededRandomInt(0, 100, seed);
    if (randNum < 66) {
      return "adjective";
    } else {
      return "";
    }
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class AdverbAffection extends Artifact {
  public artifactEffect(inputString?: string): string {
    var seed = parseInt(inputString);
    var randNum = seededRandomInt(0, 100, seed);
    if (randNum < 66) {
      return "adverb";
    } else {
      return "";
    }
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class ArtifactSeeker extends Artifact {
  public artifactEffect(inputString?: string): string {
    return "roundsBetweenArtifact,-1";
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class Thaumsaurus extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw "roundsBetweenIncrease,1";
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class RandomiserRocket extends Artifact {
  public artifactEffect(inputString?: string): string {
    return "setWordLength," + this.state.artifactData;
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    var wordLength = seededRandomInt(5, 15, gameState.seed);
    if (wordLength > 12) {
      wordLength = 12;
    }
    this.state.artifactData = wordLength;
    return true;
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class Wormhole extends Artifact {
  public artifactEffect(inputString?: string): string {
    return "wordLength,1";
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class LuckyCat extends Artifact {
  public artifactEffect(inputString?: string): string {
    return "numArtifactChoices,1";
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class BrainInAJar extends Artifact {
  public artifactEffect(inputString?: string): string {
    return "guess,4";
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    if (gameState.artifactStates.length == 1) {
      return true;
    } else {
      var seed = gameState.seed;
      var index = seededRandomInt(0, gameState.artifactStates.length, seed);
      while (gameState.artifactStates[index].id != 67) {
        index = seededRandomInt(0, gameState.artifactStates.length, seed + 1);
      }
      gameState.artifactStates = gameState.artifactStates.filter(
        (obj) => obj.id !== 67
      );
      return false;
    }
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class GoldenPortal extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class GreyRabbit extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class ShadowScrutinizer extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class VigilantHunter extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class Freestyle extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class CatLikeClarity extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class RandomPurrfector extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class RareLetterPortal extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class Mevowel extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class CosmicConsonant extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class GoldenKey extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class SilverKey extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
class SkeletonKey extends Artifact {
  public artifactEffect(inputString?: string): string {
    throw new Error("Method not implemented.");
  }
  public removeArtifact() {
    throw new Error("Method not implemented.");
  }
  public condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
  }
  public updateState(artifactState: ArtifactState) {
    throw new Error("Method not implemented.");
  }
}
