import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { HttpService, Players } from "@rbxts/services";

export interface TycoonAttributes {
    OwningUserId?: number;
}

export interface ITycoon {
    getOwner(): Player | undefined;
}

@Component({})
export class Tycoon<A extends TycoonAttributes> extends BaseComponent<A> implements OnStart, ITycoon {
    public getOwner(): Player | undefined {
        const { OwningUserId } = this.attributes;
        if (OwningUserId !== undefined) {
            return Players.GetPlayerByUserId(OwningUserId);
        }
        return undefined;
    }
    onStart() {
        print("Tycoon!");
    }
}
