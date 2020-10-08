import aa_ag = require("./ActGroup");
import ca = require("../CharacterAdmin");

export { train_admin };

class train_admin {
    train_list: aa_ag.act_group[];
    a_list: ca.character[];
    p_list: ca.character[];
    s_list: ca.character[];
    load_act() {
        this.train_list = [];
        for (t_act in g.train_default_list()) {
            t = t_act(this.a_list, this.p_list);
            if (t.able()) {
                this.train_list.push(t);
            }
        }
    }
    run_act() {}
    c() {}

    o() {}
    set(active_list, passive_list, stander_list = []) {
        this.train_list = [];
        this.a_list = active_list;
        this.p_list = passive_list;
        this.s_list = stander_list;
    }
}
