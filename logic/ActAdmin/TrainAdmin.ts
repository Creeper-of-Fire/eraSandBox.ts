import aa = require("../ActAdmin/__init__");
import ca = require("../CharacterAdmin");

export {};













function train_default_list(): Array<aa.ag.act_group> {
    return [new aa.i.insert()];
}
/*
class train_admin {
    train_list: Array<aa.ag.act_group>;
    
    load_act() {
        this.train_list = [];
        for (const t_act of train_default_list()) {
            //const t = t_act(this.a_list, this.p_list);
            if (t_act.able()) {
                this.train_list.push(t_act);
            }
        }
    }
    run_act() {}

    set_default(control_able_character) {
        
    }
    constructor() {
        this.train_list = [];
        this.a_list = [];
        this.p_list = [];
        this.s_list = [];
    }
}
*/
