import Object from "@rbxts/object-utils";
import { PhysicsService, RunService } from "@rbxts/services";
import { foreachInObject } from "./objectutil";

export type RobloxCollisionGroups = "Default";
export type CustomCollisionGroups = "Player" | "Resource";
export type CollisionGroups = RobloxCollisionGroups | CustomCollisionGroups;
export const AllCollisionGroups = ["Default", "Player", "Resource"];

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
    AllCollisionGroups.filter((group) => group !== "Default").forEach((group) =>
        PhysicsService.CreateCollisionGroup(group),
    );

    foreachInObject(CollisionGroupRelationships, (relationships, groupA) => {
        foreachInObject(relationships, (collidable, groupB) => {
            PhysicsService.CollisionGroupSetCollidable(groupA, groupB, collidable);
        });
    });
}

export function SetPartCollisionGroup(part: BasePart, group: CollisionGroups) {
    PhysicsService.SetPartCollisionGroup(part, group);
}
