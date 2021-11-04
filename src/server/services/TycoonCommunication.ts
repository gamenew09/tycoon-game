import { Service, OnStart, OnInit } from "@flamework/core";
import type { FunctionParameters } from "@flamework/networking/out/types";
import Signal from "@rbxts/signal";
import { t } from "@rbxts/t";
import { Tycoon, TycoonAttributes } from "shared/components/Tycoon";
import { DropTypeRegister, isDropTypeKeys, DropTypes, isDropTypeRegister } from "shared/tycooncomponents/TycoonDropper";

/**
 * A list of messages and their callback types.
 */
export interface CommunicationMessages {
    unlock: (id: string) => void;
    lock: (id: string) => void;
    collectResource: (resourceType: keyof DropTypes, resource: DropTypeRegister) => void;
}

type FunctionCheckParameters<T> = T extends (...args: infer P) => unknown ? t.check<P> : never;

/**
 * A map of type checks for certain function arguments.
 */
const messageTypeChecks: {
    [N in keyof CommunicationMessages]: FunctionCheckParameters<CommunicationMessages[N]>;
} = {
    lock: t.strictArray(t.string),
    unlock: t.strictArray(t.string),
    collectResource: t.strictArray(isDropTypeKeys, isDropTypeRegister),
};

/**
 * Handles communication between tycoons.
 */
@Service({
    loadOrder: 0,
})
export class TycoonCommunication implements OnStart, OnInit {
    private tycoonMessageEvent: Signal<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (msgName: string, tycoon: Tycoon<TycoonAttributes>, ...args: Array<any>) => unknown
    > = new Signal();

    onInit() {
        this.tycoonMessageEvent.Connect((msgName, tycoon, args) => {
            print(`[TycoonCommunication] ${msgName} recieved for ${tycoon.getOwner() ?? "UNKNOWN"}'s tycoon'`);
        });
    }

    onStart() {}

    /**
     *
     * @param message The message name to fire.
     * @param tycoon The tycoon to fire the message for.
     * @param args The arguments add with the event.
     */
    public fire<A extends TycoonAttributes, N extends keyof CommunicationMessages>(
        message: N,
        tycoon: Tycoon<A>,
        ...args: FunctionParameters<CommunicationMessages[N]>
    ) {
        assert(messageTypeChecks[message], `${message} is not a valid message type`);
        assert(messageTypeChecks[message](args), `fire arguments does not match arguments for ${message}`);
        this.tycoonMessageEvent.Fire(message, tycoon, ...args);
    }

    /**
     * Connects to a specific message for a specific tycoon.
     * @param message The message type to connect to.
     * @param tycoon The tycoon to listen to.
     * @param callback The callback that gets called when we recieve the message from the tycoon we are listening to.
     * @returns
     */
    public connect<A extends TycoonAttributes, N extends keyof CommunicationMessages>(
        message: N,
        tycoon: Tycoon<A>,
        callback: CommunicationMessages[N],
    ): RBXScriptConnection {
        return this.tycoonMessageEvent.Connect((msgName, msgTycoon, ...args) => {
            if (message === msgName && tycoon.getOwner() === msgTycoon.getOwner() && messageTypeChecks[message](args)) {
                // Typescript is yelling at me that I can't spread out args event when I cast to function params of the callback.
                // So I'm cheating and just casting the callback to a function that takes any & all params.
                // This could cause problems if the type check is messed up, but oh well. Anything to make connecting & firing messages a bit more convienent.
                (callback as Callback)(...args);
            }
        });
    }
}
