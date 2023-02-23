import { GameState } from "./utils";
import { Artifact } from "./artifacts";

class AlphabetRoulett extends Artifact {
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
