import { Logger } from "@rbxts/log";

export function assertLog<T>(logger: Logger, condition: T, template: string, ...args: unknown[]): asserts condition {
    if ((condition as unknown) === false || condition === undefined) {
        throw logger.Error(template, ...args);
    }
}
