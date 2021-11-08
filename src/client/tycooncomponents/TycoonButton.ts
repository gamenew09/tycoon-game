import { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import tutil from "shared/tutil";
import { Players } from "@rbxts/services";
import { TycoonComponentClient } from "client/components/TycoonComponentClient";

interface Attributes {
    UnlockId?: string;
}

const { ProximityPrompt: isProximityPrompt } = tutil.InstanceIsA;

/**
 * Represents a button that can unlock other Tycoon Components.
 */
@Component({
    tag: "TycoonButton",
})
export class TycoonButtonClient extends TycoonComponentClient<Attributes, Part> implements OnStart {
    onTycoonStart() {
        const prompt = this.instance.WaitForChild("TycoonButtonPrompt", 10);
        if (isProximityPrompt(prompt)) {
            // If we find a Proximity Prompt, set it to enabled IF the player that owns the tycoon is the local player.
            prompt.Enabled = this.getOwningTycoon().getOwner() === Players.LocalPlayer;
        }

        // TODO: When the local player gets close to the button, show a holographic representation of the thing they're gonna buy.
    }
}
