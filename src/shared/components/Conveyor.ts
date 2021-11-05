import { OnPhysics, OnStart } from "@flamework/core";
import { Component, BaseComponent, Components } from "@flamework/components";
import { CollectionService, Players, RunService, ServerStorage, Workspace } from "@rbxts/services";
import { Tycoon, TycoonAttributes } from "./Tycoon";

interface Attributes {
    Speed: number;
    MaxSpeed?: number;
    ShowTrigger?: boolean;
}

/**
 * Turns a BasePart into a conveyor belt.
 */
@Component({
    tag: "Conveyor",
})
export class Conveyor extends BaseComponent<Attributes, BasePart> implements OnStart, OnPhysics {
    private activelyOnConveyor: WeakMap<BasePart | Model, true> = new WeakMap();

    constructor(private components: Components) {
        super();
    }

    private isInTycoon(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject, onCancel) => {
            let canceling = false;
            onCancel(() => (canceling = true));

            while (!canceling) {
                let parent = this.instance.Parent;
                while (parent !== undefined) {
                    const hasTag = CollectionService.HasTag(parent, "Tycoon");
                    //print(`${parent} = ${tycoon ?? "undefined"}`);
                    if (hasTag) {
                        resolve(true);
                        return;
                    }
                    parent = parent.Parent;
                }
                RunService.Heartbeat.Wait();
            }
            reject("canceled");
        });
    }

    private triggerPart: BasePart | undefined = undefined;

    onStart() {
        // Go up the parent tree and try and find a Tycoon component.
        const TIMEOUT_REASON = "timeout reached";
        Promise.race<boolean>([
            this.isInTycoon(),
            Promise.delay(1).then(() => Promise.reject("timeout reached").then(() => false)),
        ])
            .then((found) => {
                if (found) {
                    this.initConveyor();
                }
            })
            .catch((reason: unknown) => {
                if (
                    reason !== TIMEOUT_REASON ||
                    (reason === TIMEOUT_REASON && !this.instance.IsDescendantOf(ServerStorage))
                ) {
                    // Warn if the reason is not TIMEOUT_REASON
                    //      or
                    // Warns if the reason is TIMEOUT_REASON and the component is not a descendant of ServerStorage (meaning the instance isn't under the instance tree of ServerStorage)
                    warn(`Failed to find tycoon: ${reason}`);
                }
                this.destroy();
            });
    }

    initConveyor() {
        this.instance.Anchored = true;

        if (RunService.IsServer()) {
            const part = this.instance;
            const trigger = new Instance("Part");

            trigger.Size = part.Size;
            trigger.Anchored = true;
            trigger.Parent = Workspace;
            trigger.Name = `${part.Name}_ConveyorTrigger`;
            trigger.CFrame = part.CFrame.add(part.CFrame.UpVector.mul(part.Size.Y));
            trigger.CanCollide = false;
            trigger.CanQuery = false;
            trigger.CanTouch = true;
            trigger.Transparency = this.attributes.ShowTrigger === true ? 0.75 : 1;

            this.triggerPart = trigger;
            this.maid.GiveTask(() => {
                (this.triggerPart as Part | undefined) = undefined;
            });
        }
    }

    getPartsInTrigger(): Array<BasePart> {
        if (this.triggerPart === undefined) {
            return [];
        }
        const overlap = new OverlapParams();
        overlap.FilterType = Enum.RaycastFilterType.Blacklist;
        overlap.FilterDescendantsInstances = [this.instance];

        const parts = Workspace.GetPartsInPart(this.triggerPart, overlap);

        // Return all parts inside of part, and then verify we only have BaseParts (since this could return any Instance type? Is this a roblox-ts error or roblox error.)
        return parts.filter((val) => val.IsA("BasePart")) as Array<BasePart>;
    }

    onPhysics(dt: number, time: number): void {
        // This is probably a bad way of doing this, but I don't know if touched would work very well here either.

        const parts = this.getPartsInTrigger().filter((part) => part.GetAttribute("ResourceType") !== undefined);
        parts.forEach((part) => {
            if (part.AssemblyLinearVelocity.Magnitude < (this.attributes.MaxSpeed ?? this.attributes.Speed)) {
                part.ApplyImpulse(this.instance.CFrame.LookVector.mul(this.attributes.Speed));
            }
        });
    }
}
