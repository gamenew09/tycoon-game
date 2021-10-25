import { t } from "@rbxts/t";

declare namespace tutil {
    const InstanceIsA: { [K in keyof Instances]: t.check<Instances[K]> };
    const InstanceOf: { [K in keyof Instances]: t.check<Instances[K]> };
}
export = tutil;
