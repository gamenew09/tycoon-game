import { Dependency, OnStart } from "@flamework/core";
import { Component, BaseComponent, Components } from "@flamework/components";
import { Tycoon } from "./Tycoon";

const components = Dependency<Components>();

interface Attributes {}

/**
 * A base component that all components that are inside of a Tycoon instance are based on.
 */
@Component({})
export class TycoonComponent<A extends Attributes, I extends Instance> extends BaseComponent<A, I> implements OnStart {
    private owner?: Tycoon;

    onStart() {
        // Go up the parent tree and try and find a Tycoon component.
        let parent = this.instance.Parent;
        while (parent !== undefined) {
            const tycoon = components.getComponent<Tycoon>(parent);
            if (tycoon !== undefined) {
                this.owner = tycoon;
                break;
            }
            parent = parent.Parent;
        }

        if (this.owner !== undefined) {
            this.onTycoonStart();
        } else {
            components.removeComponent(this.instance, TycoonComponent); // Would this even work?
        }
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
