import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { ServerStorage } from "@rbxts/services";

interface Attributes {}

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
