import { Controller, OnStart, OnInit } from "@flamework/core";
import Maid from "@rbxts/maid";
import { ContentProvider, Players } from "@rbxts/services";
import { Events } from "client/events";
import { assertLog } from "shared/logutil";
import { SoundData, SoundDatas } from "shared/sounds";
import { ClientLog } from "./ClientLog";
import { Logger } from "@rbxts/log";
import ContentProviderAsync from "client/ContentProviderAsync";
import { foreachInObject, mapObjectKV } from "shared/objectutil";

@Controller({})
export class SoundPlayer implements OnStart, OnInit {
    private uiSoundLocation?: Instance;

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

    async onInit() {
        this._log = this.clientLog.forController(SoundPlayer);
        this.uiSoundLocation = Players.LocalPlayer!;

        Events.playSound.connect((soundId, volume) => {
            this.playUiSound(soundId, volume);
        });

        // Convert sound ids to Instances and preload them.
        const sounds = mapObjectKV(SoundDatas, (soundId) => {
            const inst = new Instance("Sound");
            inst.SoundId = soundId;
            return inst;
        });
        await ContentProviderAsync.Preload(sounds);
        sounds.forEach((snd) => snd.Destroy());
    }

    protected resolveSoundId(soundName: keyof SoundDatas): SoundData {
        const data = SoundDatas[soundName];
        this.assert(data, "Invalid sound name, was given {sound}", soundName);
        return data;
    }

    public playUiSound(soundName: keyof SoundDatas, volume: number) {
        const uiSoundMaid = new Maid();

        const sound = new Instance("Sound");
        uiSoundMaid.GiveTask(sound);
        uiSoundMaid.GiveTask(sound.Ended.Connect(() => uiSoundMaid.Destroy()));
        sound.SoundId = this.resolveSoundId(soundName);
        sound.Volume = volume;
        sound.Parent = this.uiSoundLocation;
        sound.Play();
    }

    onStart() {}
}
