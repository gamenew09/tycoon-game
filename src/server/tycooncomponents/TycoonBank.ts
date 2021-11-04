import { Dependency, OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { TycoonComponentServer } from "server/components/TycoonComponentServer";
import { TycoonBankInstance } from "shared/tycooncomponents/TycoonBank";
import { Players } from "@rbxts/services";
import { MoneyProvider } from "server/services/MoneyProvider";
import { TycoonCommunication } from "server/services/TycoonCommunication";

interface Attributes {}

@Component({
    tag: "Bank",
})
export class TycoonBankServer extends TycoonComponentServer<Attributes, TycoonBankInstance> implements OnStart {
    private moneyProvider!: MoneyProvider;
    private nextGiveMoney = 0;

    onTycoonStart() {
        this.moneyProvider = Dependency<MoneyProvider>();

        this.getOwningTycoon().onAttributeChanged("BankAmount", (newValue, oldValue) => {
            this.setMoneyLabelText(newValue);
        });

        this.setMoneyLabelText(this.getOwningTycoon().attributes.BankAmount);

        this.maid.GiveTask(
            this.instance.BankGrabPad.Touched.Connect((part) => {
                // Make sure that we aren't trying to give money the next frame after we already gave money.
                if (this.nextGiveMoney <= tick()) {
                    const ply = Players.GetPlayerFromCharacter(part.Parent);
                    if (ply !== undefined && ply === this.getOwningTycoon().getOwner()) {
                        const tycoon = this.getOwningTycoon();
                        this.moneyProvider.giveMoney(ply, tycoon.attributes.BankAmount);
                        tycoon.setAttribute("BankAmount", 0);

                        this.nextGiveMoney = tick() + 0.2;
                    }
                }
            }),
        );
    }

    protected setMoneyLabelText(moneyAmount: number): void {
        this.instance.MoneyDisplay.MoneySurfaceGui.MoneyLabel.Text = `$${moneyAmount}`;
    }
}
