import Object from "@rbxts/object-utils";
import { t } from "@rbxts/t";

/**
 * Represents a drop type (aka Resource).
 */
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
/**
 * Verifies that the value given is a DropTypeRegister
 */
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
        Worth: new NumberRange(5, 10),
    }),
    iron: identity<DropTypeRegister>({
        PartProperties: {
            Color: Color3.fromRGB(250, 235, 173),
            Material: Enum.Material.Metal,
        },
        Worth: new NumberRange(2, 4),
    }),
};
export type DropTypes = typeof DropTypes;

/**
 * Verifies that the value checked is a DropType.
 */
export const isDropTypeKeys: t.check<keyof DropTypes> = t.literal(...Object.keys(DropTypes));

/**
 * Represents the intended structure of the TycoonDropper Model.
 */
export interface TycoonDropperInstance extends Model {
    DropPart: Part & {
        DropLocation: Attachment;
    };
}

/**
 * The attributes that a TycoonDropper should have.
 */
export interface TycoonDropperAttributes {
    Type: keyof DropTypes;
    TimeBetweenDrop?: number;
}
