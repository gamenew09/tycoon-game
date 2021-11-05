import Roact from "@rbxts/roact";

/**
 * The GameState as stored by the client.
 */
export interface UiGameState {
    /**
     * Info about the LocalPlayer's current and last known money values.
     */
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

/**
 * The Roact Context object that lets you Consume & Provide GameState data.
 */
const GameStateContext = Roact.createContext<UiGameState>({
    money: {
        current: 0,
        last: 0,
    },
});
export default GameStateContext;
