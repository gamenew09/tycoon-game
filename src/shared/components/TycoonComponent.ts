import { Tycoon, TycoonAttributes } from "./Tycoon";

export interface TycoonComponentAttributes {
    Id?: string;
}

export interface ITycoonComponent<T extends Tycoon<A>, A extends TycoonAttributes = TycoonAttributes> {
    getOwningTycoon(): T;

    onTycoonStart(): void | Promise<void>;
}
