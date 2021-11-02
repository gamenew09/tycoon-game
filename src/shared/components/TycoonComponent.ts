import { Tycoon, TycoonAttributes } from "./Tycoon";

export interface TycoonComponentAttributes {
    Id: string;
    /**
     * The current state of lock.
     */
    Locked: boolean;
}

export interface ITycoonComponent<T extends Tycoon<A>, A extends TycoonAttributes = TycoonAttributes> {
    getOwningTycoon(): T;

    onTycoonStart(): void | Promise<void>;

    /*
    /**
     * Allows the component to be used.
     */
    unlockComponent(): void;
    /**
     * Makes the component inaccessible.
     */
    lockComponent(): void;

    /**
     * Checks to see if this component is currently locked.
     * @returns Is this component locked?
     */
    isLocked(): boolean;
}
