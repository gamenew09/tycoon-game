import { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { TycoonComponentServer } from "server/components/TycoonComponentServer";

interface Attributes {
    UnlockId: string;
    Cost?: number;

    ObjectText?: string;
}

@Component({
    tag: "TycoonButton",
})
export class TycoonButtonServer extends TycoonComponentServer<Attributes, Part> implements OnStart {
    onTycoonStart() {
        print(`Hey we're inside a tycoon! ${this.getOwningTycoon().instance}`);

        // Either use an existing ProximityPrompt in the button or create a new one.
        let interact = this.instance.FindFirstAncestorWhichIsA("ProximityPrompt");

        if (interact === undefined) {
            interact = new Instance("ProximityPrompt");
            interact.ActionText = "Buy";
            interact.ObjectText =
                this.attributes.ObjectText ?? this.attributes.UnlockId + ` [$${this.attributes.Cost ?? 0}]`;
            interact.HoldDuration = 0.5;
            interact.Parent = this.instance;
        }

        interact.Name = "TycoonButtonPrompt";

        this.maid.GiveTask(interact);

        this.maid.GiveTask(
            interact.Triggered.Connect((ply) => {
                const tycoon = this.getOwningTycoon();
                if (ply === tycoon.getOwner()) {
                    if (interact !== undefined) {
                        interact.Enabled = false;
                    }

                    // Send unlock message to tycoon.

                    this.tycoonCommunication.fire("unlock", tycoon, this.attributes.UnlockId);

                    // Destroy the component itself & the attached instance.
                    this.destroy();
                    this.instance.Destroy();
                }
            }),
        );
    }
}
