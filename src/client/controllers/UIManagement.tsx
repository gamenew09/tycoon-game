import { Controller, OnStart, OnInit } from "@flamework/core";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import GameStateProvider from "client/ui/components/contextproviders/GameStateProvider";
import MainUI from "client/ui/components/MainUI";
import { assertLog } from "shared/logutil";
import { ClientLog } from "./ClientLog";
import { Logger } from "@rbxts/log";

@Controller({
    loadOrder: -99,
})
export class UIManagement implements OnStart, OnInit {
    private mainTree!: Roact.Tree;

    constructor(private clientLog: ClientLog) {}

    private _log?: Logger;
    protected getLog(): Logger {
        const log = this._log;
        assert(log, "Log not created yet.");
        return log;
    }

    protected assert<T>(condition: T, template: string, ...args: unknown[]): asserts condition {
        assertLog(this.getLog(), condition, template, ...args);
    }

    onInit() {
        this._log = this.clientLog.forController(UIManagement);

        // TODO: Implement loading UI here, until we start all controllers.
    }

    onStart() {
        this.getLog().Info("Mounting MainUI.");
        this.mainTree = Roact.mount(
            <GameStateProvider>
                <screengui>
                    <MainUI />
                </screengui>
            </GameStateProvider>,
            Players.LocalPlayer!.WaitForChild("PlayerGui"),
            "MainTree",
        );
        this.getLog().Info("Mounted MainUI.");
    }
}
