import { Networking } from "@flamework/networking";
import { SoundDatas } from "./sounds";

/**
 * This interface defines all events that can be called Client -> Server.
 */
interface ServerEvents {}

/**
 * This interface defines all events that can be called Server -> Client.
 */
interface ClientEvents {
    playUISound: (soundId: keyof SoundDatas, volume: number) => void;
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
