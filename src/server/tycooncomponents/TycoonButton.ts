import { Dependency, OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { TycoonComponentServer } from "server/components/TycoonComponentServer";
import { MoneyProvider } from "server/services/MoneyProvider";

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
        const moneyProvider = Dependency<MoneyProvider>();

        this.log.Verbose(`Hey we're inside a tycoon! {owner}`, this.getOwningTycoon().getOwner());

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
            interact.Triggered.Connect(async (ply) => {
                const cost = math.max(this.attributes.Cost ?? 0, 0);
                const tycoon = this.getOwningTycoon();
                if (ply === tycoon.getOwner() && (await moneyProvider.getMoney(ply)) >= cost) {
                    await moneyProvider.giveMoney(ply, -cost); // Take away money.

                    // If we did take away money, unlock the components.
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
