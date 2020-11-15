import A = require("./__init__");
import C = require("../Character/__init__");
import I = require("../Item/__init__");

export { environment, map, site };

class environment {
    protected characters: Array<C.ca.character>;
    protected start: Array<number>;
    protected action_values: Record<string, number>;
    //protected items: Array<I.ia.item>;
    constructor() {
        this.characters = [];
        this.start = [];
        this.action_values;
        //this.items = [];
    }
    add_chara(temp_chara: C.ca.character): void {
        temp_chara.id = this.characters.length;
        this.characters.push(temp_chara);
    }

    trun_run(): void {
        this._time_pass();
        const to_do_list: Array<C.ca.character> = this._search_turn();
        for (const i of to_do_list) {
            i.acts.set_default(i,this.characters);
            i.acts.plan_acts()
        }
        //找不到时，本次回合结束
        //持续运行函数写在game.ts里面，这里只能一次一回合
    }
    _search_turn(): Array<C.ca.character> {
        const to_do_list: Array<C.ca.character> = [];
        for (const i of this.characters) {
            if (i.get_num("速度") >= 100) {
                to_do_list.push(i);
            }
        }
        to_do_list.sort(function (a, b) {
            return a.get_num("速度") - b.get_num("速度");
        });
        return to_do_list;
        //选择大于100的而且最大的执行（如果需要输入指令就输入指令），然后执行了的减去100
    }
    _time_pass(): void {
        for (const i in this.characters) {
            this.action_values[Number(i)] += this.characters[i].get_num("速度");
        }
    }
}

/*
class environment {
    //基类
    protected acts: Array<A.aa.act_admin>;
    protected characters: Record<string, C.ca.character>;
    protected items: Array<I.ia.item>;
    constructor() {
        this.acts = [];
        this.characters = {};
        this.items = [];
    }
    add_chara(character: C.ca.character): void {
        if (!(String(character.id) in this.characters)) {
            this.characters[String(character.id)] = character;
            this.characters[String(character.id)].environment = this;
        }
    }
    add_item(item: I.ia.item): void {
        this.items.push(item);
    }
    set_default(): void {
        this.acts = [new A.aa.act_admin()];
        for (const a of this.acts) {
            a.set_default(this.characters);
        }
    }
    turn_prepare(command?): void {
        this._check_acts();
    }
    turn_start(): void {
        //执行瞬间动作，挂载长期动作 
        //长期动作挂载在环境中
    }
    trun_process(): void {
        this._work();
        //长期动作运行
    }
    trun_end(): void {
        //所有时间不停止的角色和器官不进行数据结算
        //流程：
        //数据结算
        //口上处理
        //液体分泌处理
        //特性获得处理
    }
    private _work(): void {
        for (const i of this.acts) {
            i.work();
        }
    }
    protected _check_acts(): void {
        for (const a of this.acts) {
            a.check_acts();
        }
    }
}
*/
class site extends environment {
    constructor() {
        super();
    }

    /*protected _check_acts(): void {
        const typical = new A.aa.act_admin();
        typical.set_default(this.characters);
        this.acts.push(typical);
        //const insert = new A.i.insert_admin();
        //insert.set_default(this.characters);
        //this.acts.push(insert);
    }
    prepare(): void {}*/
}

class map extends environment {
    sites: Array<site>;
    constructor() {
        super();
    }
}
