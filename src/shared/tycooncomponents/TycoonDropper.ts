/*
 */

export interface DropTypeRegister {
    /**
     * The properties that are applied to a part representing this type.
     */
    PartProperties: Partial<Pick<Part, "Color" | "BrickColor" | "Material" | "Size" | "Transparency">>;
    /**
     * The amount of money that would be added to the bank when collected.
     */
    Worth: number;
}

/**
 * Map of the types of drops that TycoonDropper can drop.
 */
export const DropTypes = {
    copper: identity<DropTypeRegister>({
        PartProperties: {
            Color: Color3.fromRGB(204, 166, 5),
            Material: Enum.Material.CorrodedMetal,
        },
        Worth: 1,
    }),
};
export type DropTypes = typeof DropTypes;

export interface TycoonDropperInstance extends Model {
    DropPart: Part & {
        DropLocation: Attachment;
    };
}

export interface TycoonDropperAttributes {
    Type: keyof DropTypes;
    TimeBetweenDrop?: number;
}
