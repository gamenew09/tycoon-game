import { t } from "@rbxts/t";

/**
 * A toolkit that let's you quickly access check functions without having to create them yourself.
 *
 * NOTE: Currently if Roblox updates with new class types, we have to update the list in the lua file manually RIP.
 */
declare namespace tutil {
    /**
     * Functions that check type based on Instance.IsA
     */
    const InstanceIsA: { [K in keyof Instances]: t.check<Instances[K]> };
    /**
     * Functions that check type based on Instance.ClassName
     */
    const InstanceOf: { [K in keyof Instances]: t.check<Instances[K]> };
}
export = tutil;
