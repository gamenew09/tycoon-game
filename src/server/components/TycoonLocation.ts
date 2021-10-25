import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { ServerStorage } from "@rbxts/services";

interface Attributes {}

@Component({
    tag: "TycoonLocation",
})
export class TycoonLocation extends BaseComponent<Attributes> implements OnStart {
    takenBy?: Player;

    onStart() {
        this.instance.Parent = ServerStorage;
        if (this.instance.IsA("Model")) {
            const basePartRepresentation =
                this.instance.PrimaryPart ?? this.instance.FindFirstChildWhichIsA("BasePart");
            if (basePartRepresentation) {
                this.maid.GiveTask(
                    basePartRepresentation
                        .GetPropertyChangedSignal("CFrame")
                        .Connect(() => (this.instCFrame = basePartRepresentation.CFrame)),
                );
                this.maid.GiveTask(basePartRepresentation); // Done for Sanity, make sure this gets destroyed.

                this.instCFrame = basePartRepresentation.CFrame;
            } else {
                warn(
                    `TycoonLocation ${this.instance.GetFullName()} is a valid Model but does not have any valid parts to represent tycoon base.`,
                );
            }
        } else {
            warn(`TycoonLocation was placed on ${this.instance.GetFullName()}`);
        }
    }

    private instCFrame: CFrame = new CFrame();

    public getCFrame(): CFrame {
        return this.instCFrame;
    }
}
