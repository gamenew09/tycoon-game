import Object from "@rbxts/object-utils";

/**
 * Iterates through the object.
 * @param obj The object to iterate through
 * @param callback The callback that gets called for each key value pair in the object.
 */
export function foreachInObject<O extends object>(obj: O, callback: (value: O[keyof O], key: keyof O) => void) {
    const keys = Object.keys(obj as object) as Array<keyof O>;
    keys.forEach((key: keyof O) => {
        callback(obj[key], key);
    });
}

/**
 * Similar to Array.map, it maps an Object's key-value pairs into an array that is made up of the callback returns.
 * @param obj The object to map on.
 * @param callback The callback to use for the mapping.
 * @returns The newly mapped values.
 */
export function mapObjectKV<O extends object, T>(obj: O, callback: (value: O[keyof O], key: keyof O) => T) {
    const keys = Object.keys(obj as object) as Array<keyof O>;
    return keys.map((key: keyof O) => callback(obj[key], key));
}
