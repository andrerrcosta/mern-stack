import ObjectMapper from "./object-mapper";

export default function updatable() {
    let data = {};

    return {
        add(key, value) {
            data[key] = value;
            return this;
        },
        remove(key) {
            delete data[key];
            return this;
        },
        update(value) {
            data = ObjectMapper.update(data, value);
            return this;
        },
        set(value) {
            data = value;
            return this;
        },
        get(key) {
            if (data[key]) return data[key];
        },
        isEmpty() {
            return JSON.stringify(data) === JSON.stringify({})
        },
        has(...keys) {
            for (let i = 0; i < keys.length; i++) {
                if (!data[keys[i]]) return false;
            }
            return true;
        },
        get object() {
            return data;
        }
    }
}