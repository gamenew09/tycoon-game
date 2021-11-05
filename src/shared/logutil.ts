import { Logger } from "@rbxts/log";

/**
 * Similar to Luau's `assert`, we make sure that a condition is true (more specifcally, that the condition is not false or undefined)
 * @param logger The logger to send the assertion to.
 * @param condition The condition to make sure is true.
 * @param template The message template to pass to the logger. Remember that this takes in the messagetemplates format.
 * @param args The arguments to pass alongside the error.
 */
export function assertLog<T>(logger: Logger, condition: T, template: string, ...args: unknown[]): asserts condition {
    if ((condition as unknown) === false || condition === undefined) {
        throw logger.Error(template, ...args);
    }
}
