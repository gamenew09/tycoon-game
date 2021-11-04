import { Service, OnStart, OnInit, Reflect } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Players } from "@rbxts/services";
import { assertLog } from "shared/logutil";
import { PlayerManager } from "./PlayerManager";
import { ServerLog } from "./ServerLog";

type LeaderstatValueType = "IntValue" | "StringValue";

type LeaderstatValueInstanceTypes = Instances[LeaderstatValueType];

interface LeaderstatValueTypes {
    IntValue: number;
    StringValue: string;
}

interface LeaderstatEntry<T extends keyof LeaderstatValueTypes = keyof LeaderstatValueTypes> {
    Name: string;
    ValueType: T;
    DefaultValue: LeaderstatValueTypes[T];
}

/**
 * Handles creating value objects that show up in the Roblox player list.
 */
@Service({
    loadOrder: 1,
})
export class LeaderstatsProvider implements OnStart, OnInit {
    constructor(private playerManager: PlayerManager, private serverLog: ServerLog) {}

    private _log?: Logger;
    protected getLog(): Logger {
        const log = this._log;
        assert(log, "Log not created yet.");
        return log;
    }

    onInit() {
        this._log = this.serverLog.forController(LeaderstatsProvider);
        this.registerStat("Money", "IntValue", 0);
    }

    protected assert<T>(condition: T, template: string, ...args: unknown[]): asserts condition {
        assertLog(this.getLog(), condition, template, ...args);
    }

    onStart() {
        this.playerManager.registerPlayerAdded((ply) => this.onPlayerAdded(ply), 0);
        this.playerManager.registerPlayerRemoving((ply) => this.onPlayerRemoving(ply), 0);
    }

    private leaderstats: LeaderstatEntry[] = [];

    public registerStat<N extends keyof LeaderstatValueTypes>(
        statName: string,
        valueType: N,
        defaultValue: LeaderstatValueTypes[N],
    ) {
        this.assert(
            this.leaderstats.filter((entry) => entry.Name === statName).size() <= 0,
            `{statName} already exists.`,
            statName,
        );

        this.leaderstats.push({
            Name: statName,
            DefaultValue: defaultValue,
            ValueType: valueType,
        });
    }

    public getStatObject<N extends keyof LeaderstatValueTypes>(
        ply: Player,
        statName: string,
        valueType: N,
    ): Instances[N] | undefined {
        const valueMap = this.plyToValueMap.get(ply);

        const entry = this.leaderstats.find((entry) => entry.Name === statName);

        // Make sure the stat entry & value map exists.
        if (entry !== undefined && valueMap !== undefined) {
            return valueMap.get(entry.Name) as Instances[N];
        }

        return undefined;
    }

    private plyToLeaderstatsMap: Map<Player, ObjectValue> = new Map();
    private plyToValueMap: Map<Player, Map<string, Instances[keyof LeaderstatValueTypes]>> = new Map();

    private onPlayerAdded(ply: Player): void {
        const leaderstats = new Instance("ObjectValue");
        leaderstats.Name = "leaderstats";
        leaderstats.Parent = ply;

        this.plyToLeaderstatsMap.set(ply, leaderstats);

        const valueMap = new Map<string, Instances[keyof LeaderstatValueTypes]>();

        this.leaderstats.forEach((entry) => {
            const value = new Instance(entry.ValueType);
            value.Value = entry.DefaultValue;
            value.Name = entry.Name;
            value.Parent = leaderstats;

            valueMap.set(entry.Name, value);
        });

        this.plyToValueMap.set(ply, valueMap);
    }

    private onPlayerRemoving(ply: Player): void {
        const valueMap = this.plyToValueMap.get(ply);
        if (valueMap !== undefined) {
            valueMap.forEach((val) => val.Destroy());
        }
        this.plyToValueMap.delete(ply);

        // Destroy leaderstats on leave.
        const leaderstats = this.plyToLeaderstatsMap.get(ply);
        if (leaderstats !== undefined) {
            leaderstats.Destroy();
        }
        this.plyToLeaderstatsMap.delete(ply);
    }
}
