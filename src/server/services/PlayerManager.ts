import { Service, OnStart, OnInit } from "@flamework/core";
import { HttpService, Players } from "@rbxts/services";
import { ServerLog } from "./ServerLog";
import { Logger } from "@rbxts/log";
import { assertLog } from "shared/logutil";

interface CallbackEntry {
    Id: string;
    Type: "PlayerAdded" | "PlayerRemoving";
    Order: number;
    Callback: (ply: Player) => void;
}

/**
 * Promises that the callback will be ran, if the callback errors, so will the promise.
 * @param ply The player that the callback will recieve
 * @param entry The entry that we want to promisfy
 * @returns A promise of the callback being ran.
 */
function promisfyCallbackEntryGeneric(ply: Player, entry: CallbackEntry): Promise<void> {
    return new Promise<void>((resolve) => {
        entry.Callback(ply);
        resolve();
    });
}

/**
 * Handles Player Adding and Removing events and allows for other services to connect to these events with certain priority over other callbacks.
 */
@Service({
    loadOrder: 0,
})
export class PlayerManager implements OnStart, OnInit {
    constructor(private serverLog: ServerLog) {}

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
        this._log = this.serverLog.forController(PlayerManager);
        Players.PlayerAdded.Connect((ply) => this.onPlayerAdded(ply));
        Players.PlayerRemoving.Connect((ply) => this.onPlayerRemoving(ply));
    }

    // [orderNumber]: CallbackEntry[]
    private callbacks: Map<number, CallbackEntry[]> = new Map();

    public registerPlayerAdded(callback: CallbackEntry["Callback"], order: CallbackEntry["Order"]) {
        const entry: CallbackEntry = {
            Id: HttpService.GenerateGUID(),
            Callback: callback,
            Type: "PlayerAdded",
            Order: order,
        };

        this.addEntry(entry);
    }

    public registerPlayerRemoving(callback: CallbackEntry["Callback"], order: CallbackEntry["Order"]) {
        const entry: CallbackEntry = {
            Id: HttpService.GenerateGUID(),
            Callback: callback,
            Type: "PlayerRemoving",
            Order: order,
        };

        this.addEntry(entry);
    }

    private addEntry(entry: CallbackEntry) {
        const entries = this.callbacks.get(entry.Order) ?? [];

        entries.push(entry);

        this.callbacks.set(entry.Order, entries);
    }

    onStart() {}

    private runCallbacks(ply: Player, entryType: CallbackEntry["Type"]) {
        const promisfyCallbackEntry = (entry: CallbackEntry) => promisfyCallbackEntryGeneric(ply, entry);
        this.callbacks.forEach((entries) => {
            Promise.allSettled(entries.filter((entry) => entry.Type === entryType).map(promisfyCallbackEntry)).await();
        });
    }

    private onPlayerAdded(ply: Player) {
        this.runCallbacks(ply, "PlayerAdded");
    }

    private onPlayerRemoving(ply: Player) {
        this.runCallbacks(ply, "PlayerRemoving");
    }
}
