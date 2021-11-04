import { Networking } from "@flamework/networking";
import { SoundDatas } from "./sounds";

interface ServerEvents {}

interface ClientEvents {
    playSound: (soundId: keyof SoundDatas, volume: number) => void;
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
