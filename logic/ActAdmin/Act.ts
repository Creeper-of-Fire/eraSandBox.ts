import { character } from "../CharacterAdmin";
import fp = require("../FileParser");

export { act };

//目前为止，“旁观者”不参与一个动作，后续会进行添加
class act {
    name: string;
    discuss: string;
    p_c: character;
    a_c: character;
    feature: string[];

    constructor() { }

    will(): number {
        //通过条件判断来判断是否可行，当大于0则可行
        //在以后加入“自动调教”时会很有用
        return 0;
    }
    able(): number {
        //通过设置来直接禁止的动作
        return 0;
    }

    spek(): string[] {
        function speak_translate(this, string) {
            //处理口上中类似于{balabala}的数据
            //功能暂时不做
            return string;
        }
        let list_for_rand: Array<Array<string>> = [];
        const s_data: Record<string, any> = fp.load_yaml("口上配置");
        const active = this.a_c;
        const passive = this.p_c;
        const a_feature = active.modifiers.names;
        const p_feature = passive.modifiers.names;
        for (const i_feature of this.feature) {
            if (i_feature in s_data) {
            } else {
                continue;
            }
            for (const dict1 of s_data[i_feature]) {
                //s_data[i_feature]是个列表，dict是个字典
                const able = dict1["ABLE"];
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
        let speak_list: string[] = [];
        if (list_for_rand.length != 0) {
            speak_list =
                list_for_rand[Math.round(Math.random() * list_for_rand.length)];
            speak_list.push(this.discuss);
        }
        for (let i of speak_list) {
            i = speak_translate(i);
        }
        return speak_list;
    }

    work(): void { }
}

class act_changeover extends act {
    //一 转 攻 势
    able(): number {
        return 1;
    }

    constructor() {
        super();
    }
}

class act_touch extends act {
    able(): number {
        return 1;
    }

    set_default(chara_list, organ_list): void {
        this.feature.push("愉快");
        this.name = "抚摸";
        this.discuss = "test1";
    }
    constructor() {
        super();
    }
}

class act_hit extends act {
    able(): number {
        return 1;
    }

    set_default(chara_list, organ_list): void {
        this.feature.push("喜悦", "痛苦");
        this.name = "接吻";
        this.discuss = "test2";
    }
    constructor() {
        super();
    }
}
