import D = require("../../Data/__init__");

export { modifier_admin };

class modifier_admin {
    private modifiers: Record<string, modifier>;
    constructor() {
        this.modifiers = {};
    }
    set_default(data: Record<string, Record<string, string | number>>): void {
        for (const i in data) {
            for (const j in data[i]) {
                const a = D.dp.processLoadData(data[i][j]);
                if (a != 0) {
                    this.add_modifier(j, i);
                }
            }
        }
    }
    add_modifier(name: string, type: string): void {
        const b = this.type(type);
        this.modifiers[name] = new b();
        this.modifiers[name].set_default(name);
    }
    time_pass(past_time = 1): void {
        const a = this.modifiers;
        if ("时间冻结" in a) {
            a["时间冻结"].time_pass(past_time);
            if (a["时间冻结"].timer == 0) {
                delete a["时间冻结"];
            }
        }
        for (const i in a) {
            const b = a[i];
            b.time_pass(past_time);
            if (b.timer == 0) {
                delete a[i]; //这种删除不知道对不对
            }
        }
    }
    remove_modifier(name): void {
        const a = this.modifiers;
        a[name];
    }

    add_get(key: string, val: number): number {
        if (Object.keys(this.modifiers).length == 0) {
            return val;
        }
        //add_get是在get时提供修正，不影响原值
        const a = (val + this._g_add(key)) * this._g_mlt(key);
        return a;
    }
    private _g_add(key: string): number {
        let add = 0;
        for (const i in this.modifiers) {
            if (key in this.modifiers[i].get_add) {
                add = add + this.modifiers[i].get_add[key];
            }
        }
        return add;
    }
    private _g_mlt(key: string): number {
        let mlt = 1;
        for (const i in this.modifiers) {
            if (key in this.modifiers[i].get_mlt) {
                mlt = mlt * this.modifiers[i].get_mlt[key];
            }
        }
        return mlt;
    }
    add_alt(key: string, val: number): number {
        //add_alt是在add时提供修正，会影响“加上去的值”
        if (Object.keys(this.modifiers).length == 0) {
            return val;
        }
        const a = (val + this._a_add(key)) * this._a_mlt(key);
        return a;
    }
    private _a_add(key: string): number {
        let add = 0;
        for (const i in this.modifiers) {
            if (key in this.modifiers[i].alt_add) {
                add = add + this.modifiers[i].alt_add[key];
            }
        }
        return add;
    }
    private _a_mlt(key: string): number {
        let mlt = 1;
        for (const i in this.modifiers) {
            if (key in this.modifiers[i].alt_mlt) {
                mlt = mlt * this.modifiers[i].alt_mlt[key];
            }
        }
        return mlt;
    }

    names(): Array<string> {
        const a: Array<string> = [];
        for (const i in this.modifiers) {
            a.push(i);
        }
        return a;
    }
    type(val: string): typeof modifier {
        const a = {
            modifier: modifier,
            attach: attach,
            destruction: destruction,
            insert: insert,
        };
        if (val in a) {
            return a[val];
        } else {
            //console.log("modifier_type_error when auto_set");
            return modifier;
        }
    }
}

class modifier {
    name: string;
    describe: string;
    get_add: Record<string, number>;
    get_mlt: Record<string, number>;
    alt_add: Record<string, number>;
    alt_mlt: Record<string, number>;
    timer: number;

    constructor() {
        this.name = "";
        this.describe = "";
        this.get_add = {};
        this.get_mlt = {};
        this.alt_add = {};
        this.alt_mlt = {};
        this.timer = 0;
        //为负一则是永久的
    }
    set_default(name, timer = -1): void {
        this.name = name;
        const data = D.fp.load_yaml(D.fp.ModifierDefaultIndex.配置文件(this.constructor.name));
        if (this.name in data) {
            this.describe = data[this.name]["describe"];
            this.get_add = data[this.name]["g_add"];
            this.get_mlt = data[this.name]["g_mlt"];
            this.alt_add = data[this.name]["a_add"];
            this.alt_mlt = data[this.name]["a_mlt"];
        }
    }
    time_pass(past_time): void {
        let a = this.timer;
        if (a == -1) {
            return;
        } //为负一则是永久的
        if (past_time >= a) {
            a = 0;
            return;
        }
        a = a - past_time;
    }

    work(): void {}
}
class attach extends modifier {
    constructor() {
        super();
    }
    contaminate(): void {} //液体沾染
}

class destruction extends modifier {
    constructor() {
        super();
    }
}

class insert extends modifier {
    constructor() {
        super();
    }
}
