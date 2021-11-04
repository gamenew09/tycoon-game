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
        assert(dropInfo, `${this.attributes.Type} is not a valid Dropper resource drop type.`);

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

        part.Parent = this.getOwningTycoon().instance;
        part.SetNetworkOwner(undefined); // Change ownership to server.
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
        print("dropperserver");

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
