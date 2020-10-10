import aa = require("./ActAdmin/__init__");
import fp = require("./FileParser");
import pa = require("./PropertyAdmin/__init__");

export { character, character_admin };

class character_admin {
    charalist: Array<character>;
    master: character;
    assist: character;
    target: character;
    player: character;
    choose: character;
    constructor() {
        this.charalist = [];
        const null_chara = new character();
        null_chara.set_default(0, "NULL");
        this.charalist.push(null_chara);
        //添加空角色
        this.master = this.charalist[0];
        this.assist = this.charalist[0];
        this.target = this.charalist[0];
        this.player = this.charalist[0];
        this.choose = this.charalist[0];
    }
    num(): number {
        //注意，去掉了一个空角色
        const num = this.charalist.length - 1;
        return num;
    }

    add_chara(temp_chara: character): void {
        temp_chara.id = this.charalist.length;
        this.charalist.push(temp_chara);
        this._re_list();
        this.error_fix();
    }
    del_chara(id: number): void {
        this.charalist.splice(id, 1);
        this._re_list();
    }
    get_chara(): Array<string> {
        return;
    }
    private _re_list(): void {
        for (let i = 0; i <= this.num(); i++) {
            this.charalist[i].id = i;
        }
    }
    error_fix(): void {
        if (this.num() != 0) {
            if (this.master.id == 0) {
                this.master = this.charalist[1];
            }
            if (this.target.id == 0) {
                this.target = this.charalist[1];
            }
            if (this.player.id == 0) {
                this.player = this.charalist[1];
            }
        }
    }
    names(start: number, end: number = this.charalist.length - 1): Array<string> {
        const a: Array<string> = [];
        for (let i = start; i <= end; i++) {
            a.push(this.charalist[i].get_str("名字"));
        }
        return a;
    }
}

class character {
    id: number;
    type: string; //角色的类型，比如“玩家”
    modifiers: pa.m.modifier_admin;
    organs: pa.o.organ_admin;
    equipments: pa.e.equipment_admin;
    experiences: pa.exp.experience_admin;
    site: aa.e.site;
    num_data: Record<string, number>;
    str_data: Record<string, string>;
    constructor() {
        this.id = 0;
        this.type = "NULL";
        this.modifiers = new pa.m.modifier_admin();
        this.organs = new pa.o.organ_admin();
        this.equipments = new pa.e.equipment_admin();
        this.experiences = new pa.exp.experience_admin();
        this.site = new aa.e.site();
        this.num_data = {
            最大体力: 0,
            体力: 0,
            最大精力: 0,
            精力: 0,

            高潮次数: 0,

            身高: 0,
            体重: 0,
            胸围: 0,
            腰围: 0,
            臀围: 0,
            //以后这些数据会变成用函数获取的，方便锯掉腿之类的
        };
        this.str_data = {
            名字: "",
            种族: "",
        };
        //要展示的数据放在这上面
    }

    set_default(id: number, type: string): void {
        this.id = id;
        this.type = type;
        //this.器官模板 = 器官模板
        const data = fp.load_yaml(fp.CharacterDefaultIndex.角色数据定义(type));
        this._data_default(data["基础"] as Record<string, number | string>);

        if ("修正" in data) {
            this.modifiers.set_default(
                data["修正"] as Record<string, Record<string, string | number>>
            );
        }
        this.organs.set_default(this, data["器官模板"] as string);
        //console.log(this.organs.insert_able_organ_list())
        if (data["器官"] != null) {
            this.organs.data_default(
                data["器官"] as Record<
                    string,
                    Record<
                        string,
                        Record<
                            string,
                            string | number | Record<string, Record<string, string | number>>
                        >
                    >
                >
            );
        }
        this.equipments.set_default(type);
        if ("经历" in data) {
            //利用经历，再进行一次加载
            this.experiences.set_default(data["经历"] as Record<string, string | number>);
            const c = this.experiences.data_list;
            for (const i in c) {
                this.modifiers.set_default(
                    c[i]["修正"] as Record<string, Record<string, string | number>>
                ); //添加修正的时候，是利用了字典的特性来覆盖了之前的修正
                this._data_default(c[i]["基础"] as Record<string, string | number>);
                if (c[i]["器官"] != null) {
                    this.organs.data_default(
                        c[i]["器官"] as Record<
                            string,
                            Record<
                                string,
                                Record<
                                    string,
                                    | string
                                    | number
                                    | Record<string, Record<string, string | number>>
                                >
                            >
                        >
                    );
                }
            }
        }
    }
    private _data_default(data: Record<string, string | number>): void {
        if (data == null) {
            return;
        }
        for (const key in this.num_data) {
            if (key in data) {
                this.num_data[key] =
                    this.num_data[key] +
                    (fp.load_process(data[key] as string | number) as number);
            } //注意这里是加号，这是为了进行多次配置而进行的改动
        }
        for (const key in this.str_data) {
            if (key in data) {
                this.str_data[key] = fp.load_process(data[key] as string | number) as string;
            } //对于字符串，后面的配置信息会直接覆盖前面的，所以还请注意
        }
    }

    //希望少用
    get(key: string): unknown {
        if (key in this.num_data) {
            return this.get_num(key);
        } else if (key in this.str_data) {
            return this.get_str(key);
        } else {
            return null;
        }
    }
    alt(key: string, val: unknown) {
        if (key in this.num_data) {
            this.alt_num(key, Number(val));
        } else if (key in this.str_data) {
            this.alt_str(key, String(val));
        } else {
            return;
        }
    }

    //字符串处理
    get_str(key: string): string {
        if (key in this.str_data) {
            return this.str_data[key];
        } else {
            return "";
        }
    }
    alt_str(key: string, val: string) {
        this.str_data[key] = val;
    }

    //数字处理部分，num_data相关
    get_num(key: string): number {
        if (key in this.num_data) {
            const g = this.modifiers.add_get(key, this.num_data[key]);
            return g;
        } else {
            return 0;
        }
    }
    alt_num(key: string, val: number): void {
        const add_val = val - this.num_data[key];
        this._add_num(key, add_val);
    }
    private _add_num(key: string, val: number): void {
        const a = this.modifiers.add_alt(key, val);
        this.num_data[key] = this.num_data[key] + a;
    }
}
