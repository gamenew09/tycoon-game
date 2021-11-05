import { BaseComponent } from "@flamework/components";
import { Controller, OnStart, OnInit, Reflect, Flamework } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import logconfig from "client/logconfig";

type Constructor<T = unknown> = new (...args: never[]) => T;

@Controller({
    loadOrder: -9999,
})
export class ClientLog implements OnStart, OnInit {
    onStart(): void {}
    onInit() {
        Log.SetLogger(logconfig.Create());

        // TODO: Would love to create logger objects for each controller.
    }

    forController(x: Constructor): Logger {
        return Log.ForContext(x);
    }

    forComponent(x: BaseComponent): Logger {
        return Log.Default()
            .Copy()
            .EnrichWithProperty("SourceContext", Reflect.getMetadata<string>(x, "identifier") ?? "UnknownComponent")
            .Create();
    }
}
