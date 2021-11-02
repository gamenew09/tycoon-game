import { Flamework } from "@flamework/core";

Flamework.addPaths("src/server/components");
Flamework.addPaths("src/server/services");
Flamework.addPaths("src/shared/components");

Flamework.addPaths("src/shared/tycooncomponents");
Flamework.addPaths("src/shared/tycooncomponents/**/*");

Flamework.addPaths("src/server/tycooncomponents");
Flamework.addPaths("src/server/tycooncomponents/**/*");

Flamework.ignite();
