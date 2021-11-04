import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { HttpService, Players } from "@rbxts/services";
import { ITycoon, Tycoon, TycoonAttributes } from "shared/components/Tycoon";
import { TycoonCommunication } from "server/services/TycoonCommunication";
import { DropTypeRegister, DropTypes } from "shared/tycooncomponents/TycoonDropper";
import { t } from "@rbxts/t";

@Component({})
export class TycoonServer extends Tycoon<TycoonAttributes> implements OnStart, ITycoon {
    constructor(protected tycoonCommunication: TycoonCommunication) {
        super();
    }

    onStart() {
        this.maid.GiveTask(
            this.tycoonCommunication.connect("collectResource", this, (resourceType, resourceData) =>
                this.onCollectResource(resourceType, resourceData),
            ),
        );
    }

    onCollectResource(resourceType: keyof DropTypes, resource: DropTypeRegister): void {
        const worth = resource.Worth;

        const worthValue = math.max(t.NumberRange(worth) ? math.random(worth.Min, worth.Max) : worth, 0);

        this.log.Info(
            `Collected {resourceType} which has a worth of {@worth} (using value {worth_at_collect})`,
            resourceType,
            worth,
            worthValue,
        );
        this.setAttribute("BankAmount", this.attributes.BankAmount + worthValue);
    }
}
