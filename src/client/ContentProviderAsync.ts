import { ContentProvider } from "@rbxts/services";

namespace ContentProviderAsync {
    export function Preload(contentInstances: Instance[]): Promise<[contentId: string, status: Enum.AssetFetchStatus]> {
        return new Promise((resolve) => {
            ContentProvider.PreloadAsync(contentInstances, (contentId, status) => resolve([contentId, status]));
        });
    }
}

export = ContentProviderAsync;
