import Log, { Logger } from "@rbxts/log";

/**
 * The configuration used by all Loggers by default.
 *
 * Each side extends from this configuration before setting the default logger.
 */
export default Logger.configure()
    .WriteTo(
        Log.RobloxOutput({
            ErrorsTreatedAsExceptions: true,
            TagFormat: "full",
        }),
    )
    .EnrichWithProperty("JobId", game.JobId);
