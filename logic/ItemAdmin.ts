import aa = require("./ActAdmin/__init__");
import pa = require("./PropertyAdmin/__init__");

export { item_admin, item, item_part };

class item_admin {
    constructor() {}
    set_default(类型) {}
}
class item {
    name: string;
    modifiers: pa.m.modifier_admin;
    parts: Array<item_part>;
    constructor() {
        this.name = "";
        this.modifiers = new pa.m.modifier_admin();
        this.parts = [];
    }
}
class item_part {
    name: string;
    modifiers: pa.m.modifier_admin;
    object_insert: aa.i.object_insert;
    num_data: Record<string, number>;
    str_data: Record<string, string>;
    constructor() {
        this.name = "";
        this.modifiers = new pa.m.modifier_admin();
        this.object_insert = new aa.i.object_insert();
        this.num_data = {};
        this.str_data = {};
    }
    //希望少用
    get(key: string) {
        if (key in this.num_data) {
            return this.get_num(key);
        } else if (key in this.str_data) {
            return this.get_str(key);
        } else {
            return null;
        }
    }
    alt(key: string, val: string | number) {
        if (key in this.num_data) {
            this.alt_num(key, val as number);
        } else if (key in this.str_data) {
            this.alt_str(key, val as string);
        } else {
            null;
        }
    }
    get_str(key: string): string {
        if (key in this.str_data) {
            return this.str_data[key];
        } else {
            return "";
        }
    }
    alt_str(key: string, val: string) {
        this.str_data[key] = val;
    }

    get_num(key: string): number {
        if (key in this.num_data) {
            const g = this.modifiers.add_get(key, this.num_data[key]);
            return g;
        } else {
            return 0;
        }
    }
    alt_num(key: string, val: number): void {
        const add_val = val - this.num_data[key];
        this._add_num(key, add_val);
    }
    private _add_num(key: string, val: number): void {
        const a = this.modifiers.add_alt(key, val); //获得加成
        let part = 0;
        this.num_data[key] = this.num_data[key] + a;
    }
}
