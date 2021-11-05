import { Dependency } from "@flamework/core";
import Maid from "@rbxts/maid";
import Roact from "@rbxts/roact";
import { LocalPlayerManagement } from "client/controllers/LocalPlayerManagement";
import GameStateContext, { UiGameState } from "client/ui/contexts/GameStateContext";

/**
 * Handles populating data that can be consumed by `GameStateContext.Consumer` Roact components.
 */
export default class GameStateProvider extends Roact.Component<{}, UiGameState> {
    private maid: Maid = new Maid();

    private localPlayerManagement: LocalPlayerManagement;

    constructor(p: {}) {
        super(p);

        // Load the LocalPlayerManagement Controller via Dependency injection.
        this.localPlayerManagement = Dependency<LocalPlayerManagement>();
        this.state = {
            money: {
                current: 0,
                last: 0,
            },
        };
    }

    didMount(): void {
        // Connect to the LocalPlayerManagement's MoneyChanged event, and update the state everytime it updates.
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

        // Initialize this component's state with valid initial values from the game & local player.
        this.initValues();
    }

    /**
     * Populates the state with valid initial values (values from the local player).
     */
    initValues(): void {
        // Retrieve the money and tell the state that the current and last money are the same.
        const money = this.localPlayerManagement.getMoney();
        this.setState({
            money: {
                current: money,
                last: money,
            },
        });
    }

    willUnmount(): void {
        // Clean everything given to the maid.
        this.maid.Destroy();
    }

    public render(): Roact.Element | undefined {
        // All we do is wrap the children given to us in a Provider.
        // Later down the road, we can consume the GameStateContext via a GameStateContext.Consumer.
        //      See a practical example currently in MainUI.tsx, inside the render function.
        return <GameStateContext.Provider value={this.state}>{this.props[Roact.Children]}</GameStateContext.Provider>;
    }
}
