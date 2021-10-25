import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { HttpService } from "@rbxts/services";

interface Attributes {}

@Component({})
export class Tycoon extends BaseComponent<Attributes> implements OnStart {
    /**
     * The player that owns this Tycoon.
     */
    public owner?: Player; // TODO: Make this replicatable.

    onStart() {}
}
