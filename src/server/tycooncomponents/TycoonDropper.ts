import { OnStart, OnTick } from "@flamework/core";
import { Component } from "@flamework/components";
import { TycoonComponentServer } from "server/components/TycoonComponentServer";
import {
    DropTypeRegister,
    DropTypes,
    TycoonDropperAttributes,
    TycoonDropperInstance,
} from "shared/tycooncomponents/TycoonDropper";
import Object from "@rbxts/object-utils";
import { foreachInObject } from "shared/objectutil";
import { Debris, PhysicsService } from "@rbxts/services";
import { SetPartCollisionGroup } from "shared/collisiongroups";

interface Attributes extends TycoonDropperAttributes {}

@Component({
    tag: "TycoonDropper",
})
export class TycoonDropperServer
    extends TycoonComponentServer<Attributes, TycoonDropperInstance>
    implements OnStart, OnTick
{
    private nextDrop?: number;

    protected dropResource(): void {
        const dropInfo = DropTypes[this.attributes.Type];
        this.assert(dropInfo, `{attribute_type} is not a valid Dropper resource drop type.`, this.attributes.Type);

        const part = new Instance("Part");
        part.Name = `Resource_${this.attributes.Type}`;
        part.SetAttribute("ResourceType", this.attributes.Type);

        const partProps = dropInfo.PartProperties;

        if (partProps["Size"] === undefined) {
            partProps["Size"] = new Vector3(1, 1, 1);
        }

        foreachInObject(partProps, (value, key) => {
            // Thanks typescript for making the part property setting ugly.
            (part as unknown as Map<unknown, unknown>).set(key, value);
        });

        part.CFrame = this.instance.DropPart.DropLocation.WorldCFrame;

        SetPartCollisionGroup(part, "Resource");
        part.Parent = this.getOwningTycoon().instance;
        part.SetNetworkOwner(undefined); // Change ownership to server.

        // After 30 seconds, remove the resource. We probably fell of the conveyor belt.
        Debris.AddItem(part, 30);
    }

    onTick(dt: number): void {
        if (this.nextDrop !== undefined) {
            if (this.nextDrop <= tick()) {
                // Drop a block.

                this.dropResource();
                this.nextDrop = tick() + (this.attributes.TimeBetweenDrop ?? 1);
            }
        }
    }
    onTycoonStart() {
        this.log.Info("dropperserver");

        // If the tycoon starts and we are already unlocked, just set next drop time.
        if (!this.isLocked()) {
            this.nextDrop = tick() + (this.attributes.TimeBetweenDrop ?? 1);
        }
    }

    unlockComponent() {
        super.unlockComponent();
        this.nextDrop = tick() + (this.attributes.TimeBetweenDrop ?? 1);
    }

    lockComponent() {
        super.lockComponent();
        this.nextDrop = undefined;
    }
}
