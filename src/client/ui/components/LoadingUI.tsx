import Maid from "@rbxts/maid";
import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";

/**
 * The state that a LoadingUI component has.
 */
interface LoadingUIState {
    dots: number;
    nextDot: number;
}

/**
 * The properties that can be given when creating the LoadingUI component.
 */
interface LoadingUIProps {
    TimeBetweenDots: number;
    MaxDots: number;
}

/**
 * A Roact Component that shows up during Flamework's loading phase.
 *
 * All it does is show Text with dots animating. [. then .. then .. then ... etc.]
 */
export default class LoadingUI extends Roact.Component<LoadingUIProps, LoadingUIState> {
    private maid: Maid = new Maid();

    constructor(p: LoadingUIProps) {
        super(p);

        this.state = {
            dots: 0,
            nextDot: 0,
        };
    }

    didMount(): void {
        this.setState({
            nextDot: tick() + this.props.TimeBetweenDots,
        });
        this.maid.GiveTask(
            RunService.Heartbeat.Connect((delta) => {
                if (tick() >= this.state.nextDot) {
                    let nextDotCount = this.state.dots + 1;
                    if (nextDotCount > this.props.MaxDots) {
                        nextDotCount = 0;
                    }

                    this.setState({
                        dots: nextDotCount,
                        nextDot: tick() + this.props.TimeBetweenDots,
                    });
                }
            }),
        );
    }

    willUnmount(): void {
        this.maid.Destroy();
    }

    public render(): Roact.Element | undefined {
        let dots = "";
        for (let i = 0; i < this.state.dots; i++) {
            dots += ".";
        }
        return (
            <screengui IgnoreGuiInset={true}>
                <textlabel
                    Position={new UDim2(0, 0, 0, 0)}
                    Size={new UDim2(1, 0, 1, 0)}
                    BackgroundTransparency={0}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    Text={`Loading${dots}`}
                />
            </screengui>
        );
    }
}
