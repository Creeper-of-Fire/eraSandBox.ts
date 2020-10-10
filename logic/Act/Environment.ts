import A = require("./__init__");
import C = require("../Character/__init__");
import I = require("../Item/__init__");
export { site };

/*
class map {
    acts: Array<>
}
*/

class site {
    acts: Array<A.i.insert_admin | A.a.act_admin>;
    characters: Record<string, C.ca.character>;
    items: Array<I.ia.item>;
    constructor() {
        this.acts = [];
        this.characters = {};
        this.items = [];
    }
    set_default(): void {
        this.check_acts();
    }
    check_acts(): void {
        const insert = new A.i.insert_admin();
        insert.set_default(this.characters, this.items);
        this.acts.push(insert);
    }
    add_chara(character: C.ca.character): void {
        if (!(String(character.id) in this.characters)) {
            this.characters[String(character.id)] = character;
            this.characters[String(character.id)].site = this;
        }
    }
    add_item(item: I.ia.item): void {
        this.items.push(item);
    }
    prepare(): void {}
    work(): void {
        for (const i of this.acts) {
            i.work();
        }
    }
}
