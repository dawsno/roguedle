import { ArtifactType } from "./enums";
import { seededRandomInt, type GameState } from "./utils";
import { ROWS } from "./utils";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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
        break;
      case 5:
        state.name = "Thaumsaurus";
        state.imgString = "Thaumsaurus.png";
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
        break;
      case 9:
        state.name = "Grey Rabbit";
        state.imgString = "GreyRabbit.png";
        break;
      case 10:
        state.name = "Shadow Scrutinizer";
        state.imgString = "ShadowScrutinizer.png";
        break;
      case 11:
        state.name = "Vigilant Hunter";
        state.imgString = "VigilantHunter.png";
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
        state.imgString = "AlphabetRoulette" + character + ".png";
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
        state.imgString = "ConjureConclusion" + character + ".png";
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
        break;
      case 15:
        state.name = "Noun Rocket";
        state.imgString = "NounRocket.png";
        artifact = new NounRocket(state);
        break;
      case 16:
        state.name = "Virtuous Verbs";
        state.imgString = "VirtuousVerbs.png";
        artifact = new VirtuousVerbs(state);
        break;
      case 17:
        state.name = "Adjective Archfiend";
        state.imgString = "AdjectiveArchfiend.png";
        artifact = new AdjectiveArchfiend(state);
        break;
      case 18:
        state.name = "Adverb Affection";
        state.imgString = "AdverbAffection.png";
        artifact = new AdverbAffection(state);
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
        break;
      case 25:
        state.name = "Wormhole";
        state.imgString = "Wormhole.png";
        break;
      case 26:
        state.name = "Rare Letter Portal";
        state.imgString = "RareLetterPortal.png";
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
        break;
      case 39:
        state.name = "Dark Matter Definition";
        state.imgString = "DarkMatterDefinition.png";
        break;
      case 40:
        state.name = "Cosmic Consonant";
        state.imgString = "CosmicConsonant.png";
        break;
      case 41:
        state.name = "Mevowel";
        state.imgString = "Mevowel.png";
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
        break;
      case 60:
        state.name = "Silver Key";
        state.imgString = "SilverKey.png";
        break;
      case 61:
        state.name = "Wishin' Definition";
        state.imgString = "WishinDefinition.png";
        break;
      case 62:
        state.name = "Skeleton Key";
        state.imgString = "SkeletonKey.png";
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
    throw new Error("Method not implemented.");
  }
  removeArtifact() {
    throw new Error("Method not implemented.");
  }
  condition(gameState: GameState): boolean {
    throw new Error("Method not implemented.");
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
