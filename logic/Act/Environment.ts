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
    set_default(): void {
        this.check_acts();
    }
    check_acts(): void {
        
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
    prepare(): void {}
    回合开始
    回合结束
    work(): void {
        for (const i of this.acts) {
            i.work();
        }
    }
}

class site extends environment {
    constructor() {
        super()
    }

    check_acts(): void {
        const insert = new A.i.insert_admin();
        insert.set_default(this.characters, this.items);
        this.acts.push(insert);
    }
    prepare(): void {}
}

class map extends environment {
    sites:Array<site>
    constructor() {
        super()
    }
}