import A = require("../../__init__");
import C = require("../../../Character/__init__");
import D = require("../../../Data/__init__");

export { act, act_group, act_admin };

class act_admin {
    protected acts: Array<act_group>;
    protected act_type: typeof act_group;
    protected characters: Record<string, C.ca.character>;
    constructor() {
        this.characters = {};
        this.acts = [];
    }
    set_default(characters: Record<string, C.ca.character>, a?, b?, c?, d?, e?) {
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
    set_default(a?, b?, c?, d?, e?, f?) {}
}

//目前为止，“旁观者”不参与一个动作，后续会进行添加
class act {
    name: string;
    describe: string;
    protected passive_character: C.ca.character;
    protected active_character: C.ca.character;
    protected feature: Array<string>;
    constructor() {
        this.name = "";
        this.describe = "";
        this.passive_character = new C.ca.character();
        this.active_character = new C.ca.character();
        this.feature = [];
    }

    will(): number {
        //通过条件判断来判断是否可行，当大于0则可行
        //在以后加入“自动调教”时会很有用
        return 0;
    }
    able(): number {
        //通过设置来直接禁止的动作
        return 0;
    }
    private _speak_func(speak: string): string {
        //处理口上中类似于{balabala}的数据
        return speak;
    }
    spek(): Array<string> {
        const list_for_rand: Array<Array<string>> = [];
        const s_data = D.fp.load_yaml(D.fp.ActDefaultIndex.口上配置()) as Record<
            string,
            Array<Record<string, Record<string, Array<string>> | string>>
        >;
        const active = this.active_character;
        const passive = this.passive_character;
        const a_feature = active.modifiers.names;
        const p_feature = passive.modifiers.names;
        for (const i_feature of this.feature) {
            if (i_feature in s_data) {
            } else {
                continue;
            }
            for (const dict1 of s_data[i_feature]) {
                //s_data[i_feature]是个列表，dict是个字典
                const able = dict1["ABLE"] as Record<string, Array<string>>;
                let is_true = 1;
                if ("A" in able) {
                    for (const a_key in able["A"]) {
                        if (a_key in a_feature) {
                        } else {
                            is_true = 0;
                        }
                    }
                }
                if ("P" in able) {
                    for (const p_key in able["P"]) {
                        if (p_key in p_feature) {
                        } else {
                            is_true = 0;
                        }
                    }
                }
                if (is_true == 1) {
                    const t_list = [];
                    for (const i_key in dict1) {
                        if (i_key != "ABLE") {
                            t_list.push(dict1[i_key]);
                        }
                    }
                    list_for_rand.push(t_list);
                }
            }
        }
        let speak_list: Array<string> = [];
        if (list_for_rand.length != 0) {
            speak_list = D.dp.getRandomFromArray(list_for_rand);
            speak_list.push(D.dp.translateString(this.describe));
        }
        for (let i in speak_list) {
            i = this._speak_func(i);
        }
        return speak_list;
    }

    work(): void {}
}
