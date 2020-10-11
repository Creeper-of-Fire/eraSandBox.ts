import A = require("./__init__");
import C = require("../Character/__init__");
import I = require("../Item/__init__");
export { site, environment, map };

class environment {
    //基类
    protected acts: Array<A.a.act_admin>;
    protected characters: Record<string, C.ca.character>;
    protected items: Array<I.ia.item>;
    constructor() {
        this.acts = [];
        this.characters = {};
        this.items = [];
    }
    add_chara(character: C.ca.character): void {
        if (!(String(character.id) in this.characters)) {
            this.characters[String(character.id)] = character;
            this.characters[String(character.id)].environment = this;
        }
    }
    add_item(item: I.ia.item): void {
        this.items.push(item);
    }
    turn_prepare(command): void {
        this._check_acts();
    }
    turn_start(): void {
        //执行瞬间动作，挂载长期动作
        this.trun_process();
    }
    trun_process(): void {
        //长期动作运行
    }
    trun_end(): void {
        //所有时间不停止的角色和器官不进行数据结算
    }
    work(): void {
        for (const i of this.acts) {
            i.work();
        }
    }
    protected _check_acts(): void {}
}

class site extends environment {
    constructor() {
        super();
    }

    protected _check_acts(): void {
        const insert = new A.i.insert_admin();
        insert.set_default(this.characters, this.items);
        this.acts.push(insert);
    }
    prepare(): void {}
}

class map extends environment {
    sites: Array<site>;
    constructor() {
        super();
    }
}
