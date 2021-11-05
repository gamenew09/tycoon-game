import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "server/events";
import { assertLog } from "shared/logutil";
import { SoundDatas } from "shared/sounds";
import { ServerLog } from "./ServerLog";
import { Logger } from "@rbxts/log";

/**
 * Handles playing sounds for other players via Flamework networking.
 */
@Service({})
export class SoundPlayer implements OnStart, OnInit {
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
        this._log = this.serverLog.forService(SoundPlayer);
    }

    onStart() {}

    public playUiSound(targets: Player | Player[], soundId: keyof SoundDatas, volume: number) {
        Events.playSound.fire(targets, soundId, volume);
    }
}
