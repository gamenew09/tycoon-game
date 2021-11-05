import Object from "@rbxts/object-utils";
import { PhysicsService, RunService } from "@rbxts/services";
import { foreachInObject } from "./objectutil";

export type RobloxCollisionGroups = "Default";
export type CustomCollisionGroups = "Player" | "Resource";
export type CollisionGroups = RobloxCollisionGroups | CustomCollisionGroups;
export const AllCollisionGroups = ["Default", "Player", "Resource"];

/**
 * Defines relationships between all of the CollisionGroups (even themselves).
 */
const CollisionGroupRelationships: {
    [n in CustomCollisionGroups]: { [C in CollisionGroups]: boolean };
} = {
    Player: {
        Default: true,
        Resource: false,
        Player: true,
    },
    Resource: {
        Default: true,
        Player: false,
        Resource: false,
    },
};

if (RunService.IsServer()) {
    // Create the custom Collision Groups.
    AllCollisionGroups.filter((group) => group !== "Default").forEach((group) =>
        PhysicsService.CreateCollisionGroup(group),
    );

    // Apply the defined relationships for the Collision Groups.
    foreachInObject(CollisionGroupRelationships, (relationships, groupA) => {
        foreachInObject(relationships, (collidable, groupB) => {
            PhysicsService.CollisionGroupSetCollidable(groupA, groupB, collidable);
        });
    });
}

/**
 * A typed shorthand for `PhysicsService.SetPartCollisionGroup`. Prevents you from trying to add a BasePart to a Collision Group that doesn't exist.
 * @param part The BasePart to set the collision group for.
 * @param group The specific Collision Group to set.
 */
export function SetPartCollisionGroup(part: BasePart, group: CollisionGroups) {
    PhysicsService.SetPartCollisionGroup(part, group);
}
