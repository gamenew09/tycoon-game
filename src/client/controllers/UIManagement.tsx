import { Controller, OnStart, OnInit } from "@flamework/core";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import GameStateProvider from "client/ui/components/contextproviders/GameStateProvider";
import MainUI from "client/ui/components/MainUI";
import { assertLog } from "shared/logutil";
import { ClientLog } from "./ClientLog";
import { Logger } from "@rbxts/log";
import LoadingUI from "client/ui/components/LoadingUI";
import tutil from "shared/tutil";

/**
 * Handles mounting & unmounting the main Roact components:
 *      LoadingUI & MainUI
 */
@Controller({
    loadOrder: -99,
})
export class UIManagement implements OnStart, OnInit {
    private mainTree!: Roact.Tree;
    private loadTree: Roact.Tree | undefined;

    private PlayerGui!: PlayerGui;

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
        const playerGui = Players.LocalPlayer!.WaitForChild("PlayerGui");
        this.assert(tutil.InstanceIsA.PlayerGui(playerGui), "PlayerGui is not a Class of PlayerGui, whaaaa");
        this.PlayerGui = playerGui;

        this.getLog().Info("Mounting LoadingUI.");
        this.loadTree = Roact.mount(<LoadingUI MaxDots={5} TimeBetweenDots={1}></LoadingUI>, playerGui);
        this.getLog().Info("Mounted LoadingUI.");
    }

    onStart() {
        this.getLog().Info("Unmounting LoadingUI.");
        if (this.loadTree !== undefined) {
            Roact.unmount(this.loadTree);
        }
        this.loadTree = undefined;
        this.getLog().Info("Unmounted LoadingUI.");

        this.getLog().Info("Mounting MainUI.");
        this.mainTree = Roact.mount(
            <GameStateProvider>
                <screengui>
                    <MainUI />
                </screengui>
            </GameStateProvider>,
            this.PlayerGui,
            "MainTree",
        );
        this.getLog().Info("Mounted MainUI.");
    }
}
