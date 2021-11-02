import { Flamework } from "@flamework/core";

Flamework.addPaths("src/client/components");
Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/shared/components");

Flamework.addPaths("src/shared/tycooncomponents");
Flamework.addPaths("src/shared/tycooncomponents/**/*");

Flamework.addPaths("src/client/tycooncomponents");
Flamework.addPaths("src/client/tycooncomponents/**/*");

Flamework.ignite();
