import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { ServerStorage } from "@rbxts/services";

interface Attributes {}

/**
 * Represents a location that a Tycoon can be.
 *
 * The locations are placed in Workspace and then when the game start, we move them into ServerStorage so we can just use their CFrame without affecting the game.
 */
@Component({
    tag: "TycoonLocation",
})
export class TycoonLocation extends BaseComponent<Attributes, Part> implements OnStart {
    takenBy?: Player;

    onStart() {
        this.instance.Parent = ServerStorage;

        this.maid.GiveTask(
            this.instance.GetPropertyChangedSignal("CFrame").Connect(() => (this.instCFrame = this.instance.CFrame)),
        );
        this.instCFrame = this.instance.CFrame;
    }

    private instCFrame: CFrame = new CFrame();

    public getCFrame(): CFrame {
        return this.instCFrame;
    }
}
