import { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { TycoonComponentServer } from "server/components/TycoonComponentServer";
import { DropTypeRegister, DropTypes } from "shared/tycooncomponents/TycoonDropper";

interface Attributes {}

@Component({
    tag: "ResourceCollector",
})
export class TycoonResourceCollectorServer extends TycoonComponentServer<Attributes, Part> implements OnStart {
    onTycoonStart() {
        this.maid.GiveTask(
            this.instance.Touched.Connect((part) => {
                const resourceType: keyof DropTypes | undefined = part.GetAttribute("ResourceType") as
                    | keyof DropTypes
                    | undefined;
                if (resourceType !== undefined) {
                    const dropType: DropTypeRegister | undefined = DropTypes[resourceType as keyof DropTypes];
                    if (dropType !== undefined) {
                        this.collectResource(part, resourceType, dropType);
                    }
                }
            }),
        );
    }

    collectResource(part: BasePart, resourceType: keyof DropTypes, resourceData: DropTypeRegister) {
        part.Destroy();

        this.tycoonCommunication.fire("collectResource", this.getOwningTycoon(), resourceType, resourceData);
    }
}
