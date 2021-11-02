import { Dependency, OnStart } from "@flamework/core";
import { Component, BaseComponent, Components } from "@flamework/components";
import { TycoonClient } from "./TycoonClient";
import { RunService, ServerStorage } from "@rbxts/services";
import { ITycoonComponent, TycoonComponentAttributes } from "shared/components/TycoonComponent";

const components = Dependency<Components>();

/**
 * A base component that all components that are inside of a Tycoon instance are based on.
 */
@Component({})
export class TycoonComponentClient<A extends object, I extends Instance>
    extends BaseComponent<A & TycoonComponentAttributes, I>
    implements OnStart, ITycoonComponent<TycoonClient>
{
    unlockComponent(): void {
        throw "Method not implemented.";
    }
    lockComponent(): void {
        throw "Method not implemented.";
    }

    /**
     * Checks to see if this component is currently locked.
     * @returns Is this component locked?
     */
    public isLocked(): boolean {
        return this.attributes.Locked === true;
    }

    private owner?: TycoonClient;

    public getOwningTycoon(): TycoonClient {
        const tycoonOwner = this.owner;
        assert(tycoonOwner, "this tycoon does not have an owner, this component should not exist.");
        return tycoonOwner;
    }

    private waitForTycoon(): Promise<TycoonClient> {
        return new Promise<TycoonClient>((resolve, reject, onCancel) => {
            let canceling = false;
            onCancel(() => (canceling = true));

            while (!canceling) {
                let parent = this.instance.Parent;
                print("----");
                while (parent !== undefined) {
                    const tycoon = components.getComponent<TycoonClient>(parent);
                    print(`${parent} = ${tycoon ?? "undefined"}`);
                    if (tycoon !== undefined) {
                        resolve(tycoon);
                        return;
                    }
                    parent = parent.Parent;
                }
                RunService.Heartbeat.Wait();
            }
            reject("canceled");
        });
    }

    onStart() {
        // Go up the parent tree and try and find a Tycoon component.
        const TIMEOUT_REASON = "timeout reached";
        Promise.race<TycoonClient | undefined>([
            this.waitForTycoon(),
            Promise.delay(1).then(() => Promise.reject(TIMEOUT_REASON).then(() => undefined)),
        ])
            .then((tycoon) => {
                assert(tycoon, "Tycoon was undefined but we didn't error on Promise race?");
                this.owner = tycoon;

                this.onTycoonStart();
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
                components.removeComponent(this.instance, TycoonComponentClient);
            });
    }

    /**
     * Called when onStart is called and this component is under a player owned tycoon.
     *
     * `TycoonComponent.owner` will not be undefined.
     */
    onTycoonStart() {
        error("override onTycoonStart.");
    }
}
