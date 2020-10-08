import aa_ag = require("./ActGroup");
import ca = require("../CharacterAdmin");
import aa_i = require("./Insert");

export { train_admin };











function train_default_list(): Array<aa_ag.act_group> {
    return [new aa_i.insert(),];
}

class train_admin {
    train_list: Array<aa_ag.act_group>;
    a_list: Array<ca.character>;
    p_list: Array<ca.character>;
    s_list: Array<ca.character>;
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

    set_default(active_list, passive_list, stander_list = []) {
        this.a_list = active_list;
        this.p_list = passive_list;
        this.s_list = stander_list;
    }
    constructor() {
        this.train_list = [];
        this.a_list = [];
        this.p_list = [];
        this.s_list = [];
    }
}
