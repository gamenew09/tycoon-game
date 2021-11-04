import Log, { Logger } from "@rbxts/log";
import { LogConfiguration } from "@rbxts/log/out/Configuration";

export default Logger.configure()
    .WriteTo(
        Log.RobloxOutput({
            ErrorsTreatedAsExceptions: true,
            TagFormat: "full",
        }),
    )
    .EnrichWithProperty("JobId", game.JobId);
