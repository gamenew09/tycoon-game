import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { HttpService, Players } from "@rbxts/services";
import { ITycoon, Tycoon, TycoonAttributes } from "shared/components/Tycoon";

@Component({
    tag: "Tycoon",
})
export class TycoonClient extends Tycoon<TycoonAttributes> implements OnStart, ITycoon {}
