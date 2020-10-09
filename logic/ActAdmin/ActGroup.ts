import aa = require("../ActAdmin/__init__");
import ca = require("../CharacterAdmin");

export { act_group, act_admin };
/*
function train_default_list(){
    return (insert_start, insert_proceed ,insert_end, )
}
*/

class act_admin {
    acts: Array<act_group>;
    act_type: typeof act_group;
    characters: Record<string, ca.character>;
    constructor() {
        this.characters = {};
        this.acts = [];
    }
    set_default(characters: Record<string, ca.character>, a?, b?) {
        this.act_type = act_group;
        this.characters = characters;
        for (const i in characters) {
            for (const j in characters) {
                if (i == j) {
                    continue;
                }
                const ag = new this.act_type();
                ag.set_default();
            }
        }
    }
    work(): void {
        for (const i of this.acts) {
            i.work();
        }
    }
}

class act_group {
    name: string;
    discuss: string;

    active_character: ca.character;
    passive_character: ca.character;
    act_list: Array<aa.a.act>;
    constructor() {
        this.name = "";
        this.discuss = "";
        this.active_character = new ca.character();
        this.passive_character = new ca.character();
        this.act_list = [];
    }

    able(): number {
        for (const i_act of this.act_list) {
            if (i_act.able() == 0) {
                return 0;
            }
            return 1;
        }
    }
    will(): number {
        let willing = 0;
        for (const i_act of this.act_list) {
            if (i_act.will() == 0) {
                return 0;
            } else {
                willing = willing + i_act.will();
            }
        }
        return willing;
    }
    work(): void {
        for (const i_act of this.act_list) {
            i_act.work();
        }
    }
    set_default(a?, b?, c?, d?, e?, f?) {}
}
