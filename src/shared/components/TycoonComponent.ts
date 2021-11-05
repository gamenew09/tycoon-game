import { Tycoon, TycoonAttributes } from "./Tycoon";

/**
 * The attributes that a Tycoon Component should have.
 */
export interface TycoonComponentAttributes {
    /**
     * The identifier of the TycoonComponent.
     *
     * Used for when you try and unlock a component within a Tycoon.
     */
    Id: string;
    /**
     * The current state of lock.
     */
    Locked: boolean;
}

/**
 * Represents a TycoonComponent independent from sidedness.
 *
 * Gives a common api to implement.
 */
export interface ITycoonComponent<T extends Tycoon<A>, A extends TycoonAttributes = TycoonAttributes> {
    /**
     * Returns the Tycoon that owns this Component.
     */
    getOwningTycoon(): T;

    /**
     * Runs when a component is started inside of a player's Tycoon.
     */
    onTycoonStart(): void | Promise<void>;

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
