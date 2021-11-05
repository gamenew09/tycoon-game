import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { t } from "@rbxts/t";
import tutil from "shared/tutil";

type MoneyChangedCallback = (newMoney: number, oldMoney: number) => void;

/**
 * This controllers handles data relating to the Local Player: Money, etc.
 *
 * Allows the UI to access and keep a copy of the data as well (via Signals).
 */
@Controller({
    loadOrder: 0,
})
export class LocalPlayerManagement implements OnStart, OnInit {
    protected player!: Player;
    protected leaderstats!: ObjectValue;

    protected money!: IntValue;
    private oldMoneyNumber!: number;

    public readonly MoneyChanged: Signal<MoneyChangedCallback> = new Signal();

    onInit() {
        const ply = Players.LocalPlayer;
        this.player = ply;
        const leaderstats = ply.WaitForChild("leaderstats");
        assert(tutil.InstanceIsA.ObjectValue(leaderstats), "leaderstats is not a ObjectValue.");
        this.leaderstats = leaderstats;

        const moneyVal = leaderstats.WaitForChild("Money");
        assert(tutil.InstanceIsA.IntValue(moneyVal), "moneyVal is not a ObjectValue.");
        this.oldMoneyNumber = moneyVal.Value;
        moneyVal.Changed.Connect((newMoney) => {
            this.MoneyChanged.Fire(newMoney, this.oldMoneyNumber);
            this.oldMoneyNumber = newMoney;
        });
        this.money = moneyVal;
    }

    public getMoney(): number {
        return this.money.Value;
    }

    onStart() {}
}
