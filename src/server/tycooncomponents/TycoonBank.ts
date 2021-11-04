import { Dependency, OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { TycoonComponentServer } from "server/components/TycoonComponentServer";
import { TycoonBankInstance } from "shared/tycooncomponents/TycoonBank";
import { Players } from "@rbxts/services";
import { MoneyProvider } from "server/services/MoneyProvider";
import { TycoonCommunication } from "server/services/TycoonCommunication";
import { SoundPlayer } from "server/services/SoundPlayer";

interface Attributes {}

@Component({
    tag: "Bank",
})
export class TycoonBankServer extends TycoonComponentServer<Attributes, TycoonBankInstance> implements OnStart {
    private moneyProvider!: MoneyProvider;
    private soundPlayer!: SoundPlayer;
    private prompt!: ProximityPrompt;

    onTycoonStart() {
        this.moneyProvider = Dependency<MoneyProvider>();
        this.soundPlayer = Dependency<SoundPlayer>();

        this.getOwningTycoon().onAttributeChanged("BankAmount", (newValue, oldValue) => {
            this.setMoneyLabelText(newValue);
        });

        const interact = new Instance("ProximityPrompt");
        interact.ActionText = "Collect";
        //interact.HoldDuration = 0.5;
        interact.Parent = this.instance.BankGrabPad;
        interact.Name = "TycoonBankPrompt";

        this.maid.GiveTask(interact.Triggered.Connect((ply) => this.handleBankGrabInteract(ply)));

        this.maid.GiveTask(() => {
            this.prompt.Destroy();
            (this.prompt as ProximityPrompt | undefined) = undefined;
        });
        this.prompt = interact;

        this.setMoneyLabelText(this.getOwningTycoon().attributes.BankAmount);
    }

    protected handleBankGrabInteract(ply: Player) {
        const tycoon = this.getOwningTycoon();
        if (ply !== undefined && ply === tycoon.getOwner() && tycoon.attributes.BankAmount > 0) {
            this.moneyProvider.giveMoney(ply, tycoon.attributes.BankAmount);
            tycoon.setAttribute("BankAmount", 0);
            this.soundPlayer.playUiSound(ply, "cash_from_bank", 0.5);
        }
    }

    protected setMoneyLabelText(moneyAmount: number): void {
        const moneyText = `$${moneyAmount}`;
        this.instance.MoneyDisplay.MoneySurfaceGui.MoneyLabel.Text = moneyText;
        this.prompt.ObjectText = moneyText;
    }
}
