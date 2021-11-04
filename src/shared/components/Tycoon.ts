import { Dependency, OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { HttpService, Players, RunService } from "@rbxts/services";
import { Logger } from "@rbxts/log";
import type { ServerLog } from "server/services/ServerLog";
import type { ClientLog } from "client/controllers/ClientLog";
import { assertLog } from "shared/logutil";

export interface TycoonAttributes {
    OwningUserId?: number;
    BankAmount: number;
}

export interface ITycoon {
    getOwner(): Player | undefined;
}

interface ILogProvider {
    forComponent(x: BaseComponent): Logger;
}

@Component({})
export class Tycoon<A extends TycoonAttributes> extends BaseComponent<A> implements OnStart, ITycoon {
    constructor() {
        super();
        let logProvider: ILogProvider;
        if (RunService.IsServer()) {
            logProvider = Dependency<ServerLog>();
        } else {
            logProvider = Dependency<ClientLog>();
        }
        this.log = logProvider.forComponent(this);
        assert(this.log, "log failed to be made");
    }

    protected log!: Logger;

    protected assert<T>(condition: T, template: string, ...args: unknown[]): asserts condition {
        assertLog(this.log, condition, template, ...args);
    }

    public getOwner(): Player | undefined {
        const { OwningUserId } = this.attributes;
        if (OwningUserId !== undefined) {
            return Players.GetPlayerByUserId(OwningUserId);
        }
        return undefined;
    }
    onStart() {
        this.log.Info("Tycoon!");
    }
}
