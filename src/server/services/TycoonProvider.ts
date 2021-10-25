import { Components } from "@flamework/components";
import { Service, OnStart, OnInit, Dependency } from "@flamework/core";
import { Players, ServerStorage, Workspace } from "@rbxts/services";
import { TycoonLocation } from "server/components/TycoonLocation";
import { Tycoon } from "shared/components/Tycoon";
import tutil from "shared/tutil";

const components = Dependency<Components>();

const { Model: isModel } = tutil.InstanceIsA;

@Service({})
export class TycoonProvider implements OnStart, OnInit {
    private tycoonTemplate?: Model;

    onInit() {
        const model = ServerStorage.WaitForChild("TycoonBase");
        assert(isModel(model));
        this.tycoonTemplate = model;
    }

    onStart() {
        Players.PlayerAdded.Connect((ply) => this.onPlayerAdded(ply));
        Players.PlayerRemoving.Connect((ply) => this.onPlayerRemoving(ply));

        // If Play Solo puts in players before PlayerAdded can fire, we'll handle them here.
        // The functions all return promises so it should run async just fine.
        Players.GetPlayers().forEach((ply) => this.onPlayerAdded(ply));
    }

    protected async onPlayerAdded(player: Player): Promise<void> {
        this.createTycoonFor(player);
    }
    protected async onPlayerRemoving(player: Player): Promise<void> {
        this.destroyTycoonFor(player);
    }

    private plyToTycoon: Map<Player, Tycoon> = new Map();
    private plyToTycoonLocation: Map<Player, TycoonLocation> = new Map();

    protected choosePlot(): TycoonLocation {
        const locations = components.getAllComponents<TycoonLocation>();
        const availableLocations = locations.filter((location) => location.takenBy === undefined);
        return availableLocations[math.random(1, availableLocations.size())];
    }

    createTycoonFor(player: Player): Tycoon {
        const location = this.choosePlot();
        assert(location, "Couldn't pick random location that was available.");

        assert(this.tycoonTemplate, "TycoonProvider.tycoonTemplate is undefined.");
        const tycoonInstance = this.tycoonTemplate!.Clone();
        tycoonInstance.SetPrimaryPartCFrame(location.getCFrame());
        tycoonInstance.Parent = Workspace;

        const tycoon = components.addComponent<Tycoon>(tycoonInstance);
        tycoon.owner = player;
        this.plyToTycoon.set(player, tycoon);

        location.takenBy = player; // Make sure location knows that its been taken up by a player.
        this.plyToTycoonLocation.set(player, location);

        return tycoon;
    }
    destroyTycoonFor(player: Player): void {
        const tycoon = this.plyToTycoon.get(player);
        if (tycoon) {
            tycoon.destroy();
            this.plyToTycoon.delete(player);
        }

        const tycoonLocation = this.plyToTycoonLocation.get(player);
        if (tycoonLocation) {
            tycoonLocation.takenBy = undefined;
            this.plyToTycoonLocation.delete(player);
        }
    }
}
