import { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { TycoonComponentClient } from "client/components/TycoonComponentClient";
import { TycoonDropperAttributes, TycoonDropperInstance } from "shared/tycooncomponents/TycoonDropper";

interface Attributes extends TycoonDropperAttributes {}

/**
 * Handles dropping resources for the TycoonCollector to collect.
 */
@Component({
    tag: "TycoonDropper",
})
export class TycoonDropperClient extends TycoonComponentClient<Attributes, TycoonDropperInstance> implements OnStart {
    onTycoonStart() {
        this.log.Verbose("dropperclient");
    }
}
