import { Service, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import { LeaderstatsProvider } from "./LeaderstatsProvider";
import { PlayerManager } from "./PlayerManager";
import { ServerLog } from "./ServerLog";
import { Logger } from "@rbxts/log";
import { assertLog } from "shared/logutil";

/**
 * Handles money for all players.
 *
 * The leaderstats value object gets created in the LeaderstatsProvider, however.
 */
@Service({
    loadOrder: 2,
})
export class MoneyProvider implements OnStart, OnInit {
    constructor(
        private playerManager: PlayerManager,
        private leaderstatsProvider: LeaderstatsProvider,
        private serverLog: ServerLog,
    ) {}

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
        this._log = this.serverLog.forService(MoneyProvider);
    }

    onStart() {
        this.playerManager.registerPlayerAdded((ply) => this.onPlayerAdded(ply), 1);
        this.playerManager.registerPlayerRemoving((ply) => this.onPlayerRemoving(ply), 1);
    }

    private async loadMoney(ply: Player): Promise<number> {
        if (game.PlaceId > 0) {
            // TODO: DataStore load.
            return 0;
        } else {
            this.getLog().Warn("No DataStore to reference for {@ply}, setting value to 0.", ply);
            return 0;
        }
    }

    private async saveMoney(ply: Player): Promise<void> {
        if (game.PlaceId > 0) {
            // TODO: DataStore save.
        } else {
            this.getLog().Warn("No DataStore to reference for {@ply}, skipping without erroring.", ply);
        }
    }

    private async onPlayerAdded(ply: Player) {
        const money = await this.loadMoney(ply);

        const statObject = this.leaderstatsProvider.getStatObject(ply, "Money", "IntValue");

        if (statObject !== undefined) {
            statObject.Value = money;
            this.getLog().Verbose(`Loaded money (${money}) for {@ply}`, money, ply);
        } else {
            this.getLog().Warn(`Money stat object for {@ply} doesn't exist.`, ply);
        }
    }

    private async onPlayerRemoving(ply: Player) {
        await this.saveMoney(ply);
    }

    /**
     * Gives a player `delta` amount of money. `delta` can be negative.
     * @param ply The player to give money to.
     * @param delta The amount to add (or remove)
     * @returns A promise to add the money and return the new money amount the player has.
     */
    public async giveMoney(ply: Player, delta: number): Promise<number> {
        const statObject = this.leaderstatsProvider.getStatObject(ply, "Money", "IntValue");
        this.assert(statObject, "statObject by the name of Money was invalid.");
        const newValue = statObject.Value + delta;
        statObject.Value = newValue;
        return newValue;
    }

    /**
     * Gets the money that a player has.
     * @param ply The player to get money for.
     * @returns A promise to return the amount of money a player has.
     */
    public async getMoney(ply: Player): Promise<number> {
        const statObject = this.leaderstatsProvider.getStatObject(ply, "Money", "IntValue");
        this.assert(statObject, "statObject by the name of Money was invalid.");
        return statObject.Value;
    }
}
