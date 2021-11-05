import Roact from "@rbxts/roact";
import GameStateContext from "../contexts/GameStateContext";

export default class MainUI extends Roact.Component {
    public render(): Roact.Element | undefined {
        return (
            <GameStateContext.Consumer
                render={(state) => {
                    return (
                        <textlabel
                            TextColor3={Color3.fromRGB(0, 125, 0)}
                            TextStrokeTransparency={0}
                            TextStrokeColor3={Color3.fromRGB(0, 0, 0)}
                            Position={new UDim2(0.5, 0, 0, 0)}
                            Text={`$${state.money.current}`}
                            TextSize={24}
                        />
                    );
                }}
            ></GameStateContext.Consumer>
        );
    }
}
