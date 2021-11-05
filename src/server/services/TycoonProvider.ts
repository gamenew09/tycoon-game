import { Components } from "@flamework/components";
import { Service, OnStart, OnInit, Dependency } from "@flamework/core";
import { CollectionService, Players, ServerStorage, Workspace } from "@rbxts/services";
import { TycoonLocation } from "server/components/TycoonLocation";
import { TycoonServer } from "server/components/TycoonServer";
import tutil from "shared/tutil";
import { ServerLog } from "./ServerLog";
import { Logger } from "@rbxts/log";
import { assertLog } from "shared/logutil";

const components = Dependency<Components>();

const { Model: isModel } = tutil.InstanceIsA;

@Service({})
export class TycoonProvider implements OnStart, OnInit {
    private tycoonTemplate?: Model;

    constructor(private serverLog: ServerLog) {}

    private _log?: Logger;
    protected getLog(): Logger {
        const log = this._log;
        assert(log, "Log not created yet.");
        return log;
    }

    protected assert<T>(condition: T, template: string, ...args: unknown[]): asserts condition {
        assertLog(this.getLog(), condition, template, ...args);
    }

    onInit() {
        this._log = this.serverLog.forService(TycoonProvider);
        const model = ServerStorage.WaitForChild("TycoonBase");
        this.assert(isModel(model), "TycoonBase is not a Model, got {recieved} instead.", model);
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

    private plyToTycoon: Map<Player, TycoonServer> = new Map();
    private plyToTycoonLocation: Map<Player, TycoonLocation> = new Map();

    protected choosePlot(): TycoonLocation {
        const locations = components.getAllComponents<TycoonLocation>();
        const availableLocations = locations.filter((location) => location.takenBy === undefined);
        return availableLocations[math.random(0, availableLocations.size() - 1)];
    }

    createTycoonFor(player: Player): TycoonServer {
        const location = this.choosePlot();
        this.assert(location, "Couldn't pick random location that was available.");

        this.assert(this.tycoonTemplate, "TycoonProvider.tycoonTemplate is undefined.");
        const tycoonInstance = this.tycoonTemplate!.Clone();
        tycoonInstance.Name = `${player.Name}_Tycoon`;
        tycoonInstance.SetAttribute("OwningUserId", player.UserId);
        tycoonInstance.SetAttribute("BankAmount", 0);
        tycoonInstance.SetPrimaryPartCFrame(location.getCFrame());
        tycoonInstance.Parent = Workspace;

        CollectionService.AddTag(tycoonInstance, "Tycoon");

        const tycoon = components.addComponent<TycoonServer>(tycoonInstance);
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
