import Object from "@rbxts/object-utils";

export function foreachInObject<O extends object>(obj: O, callback: (value: O[keyof O], key: keyof O) => void) {
    const keys = Object.keys(obj as object) as Array<keyof O>;
    keys.forEach((key: keyof O) => {
        callback(obj[key], key);
    });
}

export function mapObjectKV<O extends object, T>(obj: O, callback: (value: O[keyof O], key: keyof O) => T) {
    const keys = Object.keys(obj as object) as Array<keyof O>;
    return keys.map((key: keyof O) => callback(obj[key], key));
}
