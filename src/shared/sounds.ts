/**
 * Holds the asset ids for all Sounds.
 * Used by the server & client SoundPlayer.
 */
export const SoundDatas = {
    /**
     * This sound is played when the player buys an item for their Tycoon.
     */
    bought_item: "rbxassetid://131886985",
    /**
     * This sound is played when the player collects cash from their Tycoon's bank.
     */
    cash_from_bank: ["rbxassetid://152206246", "rbxassetid://152206206"],
};
export type SoundDatas = typeof SoundDatas;

/**
 * Represents the value that can be given by the SoundData map.
 */
export type SoundData = string | string[];
