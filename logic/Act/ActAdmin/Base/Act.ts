import A = require("../../__init__");
import C = require("../../../Character/__init__");
import D = require("../../../Data/__init__");
import I = require("../../../Item/__init__");

export { act, touch };

//目前为止，“旁观者”不参与一个动作，后续会进行添加
class act {
    name: string;
    describe: string;
    protected passive_character: C.ca.character;
    protected active_character: C.ca.character;
    protected passive_object: C.em.equipment | C.ca.character;
    protected active_object: C.em.equipment | C.ca.character;
    protected feature: Array<string>;
    protected timer: number;
    //timer为0时，是瞬间动作
    //timer为-1时，是永久动作
    constructor() {
        this.passive_character = new C.ca.character();
        this.active_character = new C.ca.character();
        this.feature = [];
        this.timer = 0;
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
    /*
    spek(): Array<string> {
        function _speak_func(self, speak: string): string {
            //处理口上中类似于{balabala}的数据
            return speak;
        }
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
            i = _speak_func(this, i);
        }
        return speak_list;
    }*/
    work(): void {}
    set_default(
        active_character: C.ca.character,
        passive_character: C.ca.character,
        active_object_name: string,
        passive_object_name: string
    ): void {
        this.active_character = active_character;
        this.passive_character = passive_character;
        this.active_object = active_character.search_object(active_object_name);
        this.passive_object = passive_character.search_object(passive_object_name);
    }
}

class touch extends act {
    constructor() {
        super();
        this.name = "触摸";
        this.describe = "describe_touch";
        this.timer = 0;
    }
    will() {
        return 1;
    }
    able() {
        return 1;
    }
    work(): void {}
}
