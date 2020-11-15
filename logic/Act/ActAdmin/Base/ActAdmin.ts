import A = require("../../__init__");
import C = require("../../../Character/__init__");
import D = require("../../../Data/__init__");
import I = require("../../../Item/__init__");

export { act_admin };

class act_admin {
    protected owner: C.ca.character;
    protected acts: Array<A.ag.act_group>;
    protected act_type: typeof A.ag.act_group;
    protected characters: Array<C.ca.character>;
    constructor() {
        this.characters = [];
        this.acts = [];
        this.act_type = A.ag.act_group;
    }
    set_default(
        owner: C.ca.character,
        characters: Array<C.ca.character>
        //a?,b?,c?,d?,e?
    ) {
        this.owner = owner;
        this.characters = characters;
    }
    plan_acts(){
        for (const i in this.characters) {
            const ag = new this.act_type();
            ag.set_default(this.owner, this.characters[i]);
        }
    }
    /*
    check_acts() {
        for (const i in this.characters) {
            
                if (i == j) {
                    continue;
                }
                
            const ag = new this.act_type();
            ag.set_default(this.owner, this.characters[i]);
        }
    }
    */
    work(): void {
        for (const i of this.acts) {
            i.work();
        }
    }
}
