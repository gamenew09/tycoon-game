import Object from "@rbxts/object-utils";
import { t } from "@rbxts/t";

export interface DropTypeRegister {
    /**
     * The properties that are applied to a part representing this type.
     */
    PartProperties: Partial<Pick<Part, "Color" | "BrickColor" | "Material" | "Size" | "Transparency">>;
    /**
     * The amount of money that would be added to the bank when collected.
     *
     * If set to a NumberRange, each time the resource is collected a random value between `NumberRange.Min` and `NumberRange.Max` (including min/max) is used.
     */
    Worth: number | NumberRange;
}
export const isDropTypeRegister = t.strictInterface({
    PartProperties: t.interface({
        Color: t.union(t.Color3, t.nil),
        BrickColor: t.union(t.BrickColor, t.nil),
        Material: t.union(t.enum(Enum.Material), t.nil),
        Size: t.union(t.Vector3, t.nil),
        Transparency: t.union(t.number, t.nil),
    }),
    Worth: t.union(t.number, t.NumberRange),
});

/**
 * Map of the types of drops that TycoonDropper can drop.
 */
export const DropTypes = {
    copper: identity<DropTypeRegister>({
        PartProperties: {
            Color: Color3.fromRGB(204, 166, 5),
            Material: Enum.Material.CorrodedMetal,
        },
        Worth: new NumberRange(2, 5),
    }),
};
export type DropTypes = typeof DropTypes;

export const isDropTypeKeys: t.check<keyof DropTypes> = t.literal(...Object.keys(DropTypes));

export interface TycoonDropperInstance extends Model {
    DropPart: Part & {
        DropLocation: Attachment;
    };
}

export interface TycoonDropperAttributes {
    Type: keyof DropTypes;
    TimeBetweenDrop?: number;
}
