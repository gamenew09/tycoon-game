import { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { TycoonComponentClient } from "client/components/TycoonComponentClient";
import { TycoonDropperAttributes, TycoonDropperInstance } from "shared/tycooncomponents/TycoonDropper";

interface Attributes extends TycoonDropperAttributes {}

@Component({
    tag: "TycoonDropper",
})
export class TycoonDropperClient extends TycoonComponentClient<Attributes, TycoonDropperInstance> implements OnStart {
    onTycoonStart() {
        print("dropperclient");
    }
}
