import { Service, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import { LeaderstatsProvider } from "./LeaderstatsProvider";
import { PlayerManager } from "./PlayerManager";

@Service({
    loadOrder: 2,
})
export class MoneyProvider implements OnStart, OnInit {
    constructor(private playerManager: PlayerManager, private leaderstatsProvider: LeaderstatsProvider) {}

    onInit() {}

    onStart() {
        this.playerManager.registerPlayerAdded((ply) => this.onPlayerAdded(ply), 1);
        this.playerManager.registerPlayerRemoving((ply) => this.onPlayerRemoving(ply), 1);
    }

    private async loadMoney(ply: Player): Promise<number> {
        if (game.PlaceId > 0) {
            // TODO: DataStore load.
            return 0;
        } else {
            warn("No DataStore to reference, setting value to 0.");
            return 0;
        }
    }

    private async saveMoney(ply: Player): Promise<void> {
        if (game.PlaceId > 0) {
            // TODO: DataStore save.
        } else {
            warn("No DataStore to reference, skipping without erroring.");
        }
    }

    private async onPlayerAdded(ply: Player) {
        const money = await this.loadMoney(ply);

        const statObject = this.leaderstatsProvider.getStatObject(ply, "Money", "IntValue");

        if (statObject !== undefined) {
            statObject.Value = money;
            print(`Loaded money ($${money}) for ${ply}`);
        } else {
            warn(`Money stat object for ${ply} doesn't exist.`);
        }
    }

    private async onPlayerRemoving(ply: Player) {
        await this.saveMoney(ply);
    }
}
