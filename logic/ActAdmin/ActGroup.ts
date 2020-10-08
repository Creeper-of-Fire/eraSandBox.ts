import aa_a = require("./Act");
import aa_ta = require("./TrainAdmin");
import pa_o = require("../PropertyAdmin/Organ");
import ca = require("../CharacterAdmin");

export { act_group };
/*
function train_default_list(){
    return (insert_start, insert_proceed ,insert_end, )
}
*/

class act_group {
    name: string;
    discuss: string;
    act_list: Array<aa_a.act>;
    active_character: ca.character;
    passive_character: ca.character;

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

    constructor() {
        this.name = "";
        this.discuss = "";
        this.act_list = [];
    }
}
