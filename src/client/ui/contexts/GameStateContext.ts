import Roact from "@rbxts/roact";

export interface UiGameState {
    money: {
        /**
         * The current amount of money the player has.
         */
        current: number;
        /**
         * The amount of money that was from last update.
         */
        last: number;
    };
}

const GameStateContext = Roact.createContext<UiGameState>({
    money: {
        current: 0,
        last: 0,
    },
});
export default GameStateContext;
