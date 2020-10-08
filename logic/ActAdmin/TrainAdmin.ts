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
        for (const t_act of this.train_default_list()) {
            //const t = t_act(this.a_list, this.p_list);
            if (t_act.able()) {
                this.train_list.push(t_act);
            }
        }
    }
    run_act() {}
    c() {}
    train_default_list():aa_ag.act_group[]{
        return []
    }

    o() {}
    set(active_list, passive_list, stander_list = []) {
        this.train_list = [];
        this.a_list = active_list;
        this.p_list = passive_list;
        this.s_list = stander_list;
    }
}
