import { BaseComponent } from "@flamework/components";
import { Service, OnStart, OnInit, Reflect } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import logconfig from "server/logconfig";

type Constructor<T = unknown> = new (...args: never[]) => T;

@Service({
    loadOrder: -1,
})
export class ServerLog implements OnStart, OnInit {
    onStart(): void {}
    onInit() {
        Log.SetLogger(logconfig.Create());

        // TODO: Would love to create logger objects for each controller.
    }

    forService(x: Constructor): Logger {
        return Log.ForContext(x);
    }

    forComponent(x: BaseComponent): Logger {
        return Log.Default()
            .Copy()
            .EnrichWithProperty("SourceContext", Reflect.getMetadata<string>(x, "identifier") ?? "UnknownComponent")
            .Create();
    }
}
