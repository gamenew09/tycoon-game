import { ContentProvider } from "@rbxts/services";

/**
 * A utility namespace that makes some of the ContentProvider functions use Promises instead of callbacks.
 */
namespace ContentProviderAsync {
    /**
     * Promises to preload ALL the given assets using `ContentProvider.PreloadAsync`
     * @param contentInstances The instances to preload.
     * @returns A promise to preload all assets.
     */
    export function Preload(contentInstances: Instance[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const instancesGiven = contentInstances.size(); // We're gonna cache the count of instances given so we don't accidentally hold the instances in limbo forever.
            const ids: string[] = []; // We're gonna go by count to check if all assets are preloaded for this call.
            ContentProvider.PreloadAsync(contentInstances, (contentId, status) => {
                if (status === Enum.AssetFetchStatus.Success) {
                    ids.push(contentId);
                    if (ids.size() >= instancesGiven) {
                        resolve();
                    }
                } else {
                    reject(`${contentId} failed to preload.`);
                }
            });
        });
    }
}

export = ContentProviderAsync;
