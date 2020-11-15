import A = require("../../__init__");
import C = require("../../../Character/__init__");
import D = require("../../../Data/__init__");
import I = require("../../../Item/__init__");

export { act_group, kiss };

class act_group {
    name: string;
    describe: string;
    protected active_character: C.ca.character;
    protected passive_character: C.ca.character;
    protected act_list: Array<A.a.act>;
    constructor() {
        this.name = "";
        this.describe = "";
        this.active_character = new C.ca.character();
        this.passive_character = new C.ca.character();
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
    set_default(active_character, passive_character): void {
        this.active_character = active_character;
        this.passive_character = passive_character;
        this._list_act();
    }
    protected _list_act(): void {}
}

class kiss extends act_group {
    constructor() {
        super();
        this.name = "接吻";
        this.describe = "describe_kiss";
    }
    protected _list_act(): void {
        const a = new A.a.touch();
        a.set_default(this.active_character, this.active_character, "嘴唇", "嘴唇");
        this.act_list = [a];
    }
}
