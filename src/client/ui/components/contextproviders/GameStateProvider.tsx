import { Dependency } from "@flamework/core";
import Maid from "@rbxts/maid";
import Roact from "@rbxts/roact";
import { LocalPlayerManagement } from "client/controllers/LocalPlayerManagement";
import GameStateContext, { UiGameState } from "client/ui/contexts/GameStateContext";

export default class GameStateProvider extends Roact.Component<{}, UiGameState> {
    private maid: Maid = new Maid();

    private localPlayerManagement: LocalPlayerManagement;

    constructor(p: {}) {
        super(p);

        this.localPlayerManagement = Dependency<LocalPlayerManagement>();
        this.state = {
            money: {
                current: 0,
                last: 0,
            },
        };
    }

    didMount(): void {
        this.maid.GiveTask(
            this.localPlayerManagement.MoneyChanged.Connect((newMoney, oldMoney) => {
                this.setState({
                    money: {
                        current: newMoney,
                        last: oldMoney,
                    },
                });
            }),
        );

        this.initValues();
    }

    initValues(): void {
        const money = this.localPlayerManagement.getMoney();
        this.setState({
            money: {
                current: money,
                last: money,
            },
        });
    }

    willUnmount(): void {
        // really this shouldn't need to be unmounted, but just in case it does. Maid everything we need to.
        this.maid.Destroy();
    }

    public render(): Roact.Element | undefined {
        return <GameStateContext.Provider value={this.state}>{this.props[Roact.Children]}</GameStateContext.Provider>;
    }
}
