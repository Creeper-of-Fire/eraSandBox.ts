import I = require("../../Item/__init__");
import C = require("../../Character/__init__");
import A = require("../__init__");
import era = require("../../../engine/era");
import D = require("../../Data/__init__");

export { act_insert, insert, object_insert_point, object_insert, insert_admin, load_map };

class act_insert extends A.a.act {
    p_o: object_insert;
    info: insert_info;
    insertion: object_insert;
    //end_point: object_insert_point;
    start_point: object_insert_point;
    constructor() {
        super();
        this.p_o = new object_insert();
        this.info = new insert_info();
        this.insertion = new object_insert();

        this.start_point = new object_insert_point();
    }
    will(): number {
        return (
            passive_will_check(this.p_c, this.a_c, this.info, this.insertion) +
            active_will_check(this.p_c, this.a_c, this.info, this.insertion)
        );
    }
    able(): number {
        return 1;
    }
    set_feature(): void {}

    dilate_organ(): void {
        //扩张
    }
    work(): void {
        this.dilate_organ();
        for (const i in this.spek()) {
            era.t(i);
        }
    }

    //查看扩张值，如果扩张值过小则添加“疼痛值”和“损伤值”，并激活扩张效果

    set_default(insert_info: insert_info, insertion: object_insert): void {
        this.name = "插入";
        this.describe = "test2";
        this.insertion = insertion;
        this.info = insert_info;
        this.start_point = insert_info.start_point;
        this.p_c = insert_info.start_point.object_at.master;
        this.p_o = insert_info.start_point.object_at;
        this.a_c = insertion.master;
    }
}

function passive_will_check(p_c, a_c, info, insertion): number {
    if ("抖M" in p_c.modifiers) {
        return 1;
    } else if (
        info.start_point.dilate() * info.start_point.total_aperture <=
        insertion.occupy.aperture
    ) {
        return 1;
    } else {
        return 1;
    }
    return 0;
}

function active_will_check(p_c, a_c, info, insertion): number {
    if ("抖M" in p_c.modifiers) {
        return 1;
    } else if (
        info.start_point.dilate() * info.start_point.total_aperture <=
        insertion.occupy.aperture
    ) {
        return 1;
    } else {
        return 0;
    }
    return;
}

class insert extends A.a.act_group {
    name: string;
    describe: string;
    act_list: Array<act_insert>;
    active_character: C.ca.character;
    passive_character: C.ca.character;
    entrance: object_insert_point;
    insertion: object_insert;
    constructor() {
        super();
        this.name = "插入";
        this.describe = "进行插入";
        this.act_list = [];
        this.active_character = new C.ca.character();
        this.passive_character = new C.ca.character();
        this.entrance = new object_insert_point();
        this.insertion = new object_insert();
    }
    list_organ(): Array<act_insert> {
        const outside = this.passive_character.organs.get_organ("外界").object_insert;
        let a_g_able = [];
        a_g_able = find_path(
            this.entrance,
            outside,
            this.insertion,
            this.insertion.occupy.length
        );
        a_g_able.sort(function (a, b) {
            return b.will - a.will;
        });
        //自动进行选择
        if (a_g_able.length != 0) {
            return a_g_able[0].path;
        } else {
            return null;
        }
    }
    set_default(
        passive_character: C.ca.character,
        active_character: C.ca.character,
        entrance: object_insert_point,
        insertion: object_insert
    ): void {
        //主动方，被动方，入口，插入物
        this.active_character = active_character;
        this.passive_character = passive_character;
        this.insertion = insertion;
        this.entrance = entrance;
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
    insert_length_will(): number {
        //插入的深度的精神需求
        return 100; //测试，设置为1米
    }
}

class insert_admin extends A.a.act_admin {
    acts: Array<A.a.act_group>;
    act_type: typeof insert;
    characters: Record<string, C.ca.character>;
    set_default(characters: Record<string, C.ca.character>, items: Array<I.ia.item>) {
        const insertions: Array<object_insert> = [];
        this.act_type = insert;
        this.characters = characters;
        for (const j in characters) {
            for (const n of characters[j].organs.insert_able_organ_list()) {
                insertions.push(n);
            }
        }
        for (const j of items) {
            for (const n of j.parts) {
                insertions.push(n.object_insert);
            }
        }
        for (const i in characters) {
            //i是被动
            for (const j in characters) {
                //j是主动
                for (const m of characters[i].organs.insert_able_point_list()) {
                    for (const n of insertions) {
                        if (m.object_at == n) {
                            continue;
                        }
                        const ag = new this.act_type();
                        ag.set_default(characters[i], characters[j], m, n);
                        ag.list_organ();
                    }
                }
            }
        }
    }
    work(): void {
        for (const i of this.acts) {
            i.work();
        }
    }
    constructor() {
        super();
        this.acts = [];
    }
}

function find_path(
    entry: object_insert_point,
    outside: object_insert,
    insertion: object_insert,
    insert_length: number
): Array<insert_path> {
    const paths: Array<insert_path> = [];
    const path: insert_path = new insert_path();
    path.path = [];
    const MAX_DEPTH: number = 100;

    function add_path(): void {
        const p: insert_path = new insert_path();
        p.path = path.path.slice(0); //数组浅拷贝
        p.will = path.will;
        paths.push(p);
    } //拷贝，不然只会push一个引用

    function dfs(pos: object_insert_point, rest_length: number, pre: object_insert_point): void {
        if (pos.total_aperture <= 0) {
            return;
        } //没开孔，返回
        if (pos.object_at.total_space.aperture <= 0) {
            return;
        } //没开孔，返回
        if (pos.object_at.total_space.volume <= 0) {
            return;
        } //没开孔，返回
        if (path.path.length >= MAX_DEPTH) {
            return;
        } //搜索太深，返回

        const info = new insert_info();
        info.start_point = pre;
        //info.end_point = pos
        info.object_through = pre.object_at;
        if (pos.object_at == pre.object_at) {
            //在同一个结构中穿行时
            info.percentage_through = Math.abs(pos.position - pre.position);
        } else {
            info.percentage_through = 0;
        }
        //info处理
        const a = new act_insert();
        a.set_default(info, insertion);
        const a_will = a.will();
        if (a.able() <= 0) {
            return;
        } //因为设置信息强行禁止插入，返回
        if (a_will < 0) {
            return;
        } //不想戳进去，返回

        pos.used_aperture = pos.used_aperture + insertion.occupy.aperture;
        pos.object_at.used_space.volume =
            pos.object_at.used_space.volume + insertion.occupy.volume;
        pos.object_at.used_space.aperture =
            pos.object_at.used_space.aperture + insertion.occupy.aperture;
        path.will = path.will + a_will;
        path.path.push(a);

        //停止判断和信息记录

        if (rest_length == 0) {
            add_path();
        } //插入物长度不够了，添加一个可行路径然后返回
        else if (pos.object_at == pre.object_at) {
            //当前函数代表穿过同一个object的过程时
            for (const target of pos.toward) {
                dfs(target, rest_length, pos);
            } //跳转到下一个object
        } //如果之前就已经经过某一器官，接下来一定切换到另一个器官去
        else {
            //从pre进入了pos所在的器官时（也就是说点对点）
            for (const target of pos.object_at.points) {
                //遍历pos所在器官（接下来预计进入的器官）指向的其他节点
                if (target == pos) {
                    continue; //当指向pos时跳过
                }
                const dis =
                    (Math.abs(pos.position - target.position) *
                        pos.object_at.total_space.length) /
                    100;
                //计算到该节点时花费的长度
                if (dis < rest_length) {
                    dfs(target, rest_length - dis, pos); //长度可以够到，开始递归，并且减去距离
                }
            }
            //所有节点都走不到了，而且由于上一次是“点对点”，这次并不能跳转到下一个点
            const extra = (rest_length / pos.object_at.total_space.length) * 100;
            //虽然预计走不到了，但是还是有剩下的长度的百分比
            if (pos.position + extra <= 100 || pos.position - extra >= 0) {
                const b = new insert_info();
                b.start_point = pos;
                b.percentage_through = extra;
                b.object_through = pos.object_at;
                const c = new act_insert();
                c.set_default(b, insertion);
                path.path.push(c);
                add_path();
            } //看看上下能不能走到头
        }
        //继续开始遍历或者进行结果判断

        path.path.pop(); //对自身的遍历结束（该保存的都保存了），去掉自身
        pos.used_aperture = pos.used_aperture - insertion.occupy.aperture; //去掉自身的影响
    }

    let pre = null;
    for (const target of entry.toward) {
        if (target.object_at == outside) {
            //当选择的入口与外界连接时
            pre = target;
            //“上一个器官”设定为外界
            break;
        }
    }
    if (!pre) {
        return null;
    }
    //不与外界连通时，直接返回
    dfs(entry, insert_length, pre);
    return paths;
}

class insert_path {
    path: Array<act_insert>;
    will: number;
    constructor() {
        this.path = [];
        this.will = 0;
    }
} //插入信息

class insert_info {
    //插入信息分为两种，点对点和点到器官到点
    start_point: object_insert_point;
    object_through: object_insert;
    percentage_through: number;
    constructor() {
        this.start_point = new object_insert_point();
        this.object_through = new object_insert();
        this.percentage_through = 0;
    }
}

class object_insert {
    name: string;
    points: Array<object_insert_point>;
    //一些节点，这些节点会连接向其他的器官
    modifiers: C.m.modifier_admin;
    //属于自己的修正，和prototype共通
    master: C.ca.character;
    //无主的物体默认丢给NULL角色
    prototype: C.o.organ | I.ia.item_part;
    //来自于哪里
    total_space: space;
    used_space: space;
    occupy: space;
    //space同时用于两种情况：插入和被插入
    constructor() {
        this.name = "";
        this.points = [];
        this.modifiers = new C.m.modifier_admin();
        this.master = new C.ca.character();
        //this.prototype = new pa.o.organ();//请勿初始化这个
        this.total_space = new space();
        this.used_space = new space();
        this.occupy = new space();
    }

    dilate(): number {
        const val = this.prototype.get_num("扩张");
        return val;
    }
    add_modifiers(): void {}
    add_point(point: object_insert_point): void {
        this.points.push(point);
        this.points = D.dp.popDuplicateFromArray(this.points);
    }
    set_default(master: C.ca.character, prototype: C.o.organ | I.ia.item_part): void {
        //目前，道具还没有开始配置
        this.name = prototype.name;
        //points这玩意需要prototype那边自行添加
        this.modifiers = prototype.modifiers;
        this.master = master;
        this.prototype = prototype;
        const data = D.fp.load_yaml(
            D.fp.OrganDefaultIndex.插入结构定义(this.master.organs.model)
        )["空间配置"] as Record<string, Record<string, Record<string, string | number>>>;
        for (const i in data["occupy"]) {
            if (i in data["occupy"]) {
                if (this.name in data["occupy"][i]) {
                    this.occupy.set(
                        i,
                        Number(D.dp.processLoadData(data["occupy"][i][this.name]))
                    );
                }
            }
        }
        for (const i in data["space"]) {
            if (i in data["space"]) {
                if (this.name in data["space"][i]) {
                    this.used_space.set(
                        i,
                        Number(D.dp.processLoadData(data["space"][i][this.name]))
                    );
                }
            }
        }
    }
}

class object_insert_point {
    object_at: object_insert; //所在器官
    position: number; //所在位置
    toward: Array<object_insert_point>; //和它连接的点
    total_aperture: number;
    used_aperture: number;
    modifiers: C.m.modifier_admin;
    constructor() {
        this.object_at = new object_insert();
        this.position = 0;
        this.toward = [];
        this.total_aperture = 0;
        this.used_aperture = 0;
        this.modifiers = new C.m.modifier_admin();
    }
    link(p: object_insert_point): void {
        if (p == this) {
            return;
        }
        this.toward.push(p);
        p.toward.push(this);
        this.toward = D.dp.popDuplicateFromArray(this.toward);
        p.toward = D.dp.popDuplicateFromArray(p.toward);
    }

    set_default(object_at, position, total_aperture): void {
        this.object_at = object_at;
        this.position = position;
        this.total_aperture = total_aperture;
    }
    dilate(): number {
        //扩张度
        let val = this.object_at.dilate();
        let length = 0;
        for (const i in this.toward) {
            val = val + this.toward[i].object_at.dilate();
            length = length + 1;
        }
        val = val / length;
        return val;
    }
}
function load_map(
    data: Record<string, string | number>,
    object: Record<string, object_insert>
): void {
    /*
    for (const k in object as Record<string, object_insert>) {
        object[k].points = [];
        //初始化信息
    }
    */ //请自己初始化
    for (const key in data as Record<string, string | number>) {
        const posInfo: Array<string> = key.split(",");
        const pos: Array<object_insert_point> = [];
        const rd: number = Number(D.dp.processLoadData(data[key]));
        //获取半径
        posInfo.forEach((s) => {
            const m = /^(.*)_(\d+(?:\.\d+)?)$/.exec(s); //魔法代码(通过正则表达式来匹配)

            if (!m) {
                return;
            }
            if (m[1] in object) {
                const o = object[m[1]];
                //用o提取对应的结构
                const p = new object_insert_point();
                p.set_default(o, Number(m[2]), rd);
                //创建节点
                pos.push(p);
                o.add_point(p);
                //节点添加到器官
            }
        });
        for (const p1 of pos) {
            for (const p2 of pos) {
                p1.link(p2);
            }
        }
    }
}

class space {
    surface: number;
    volume: number;
    length: number;
    aperture: number;
    //表面系统：一根针占用的表面是1，surface，和道具有关
    //容积系统：一毫升占用的容积是1，volume，和液体等有关
    //长度系统：一厘米，length
    constructor() {
        this.surface = 0;
        this.volume = 0;
        this.length = 0;
        this.aperture = 0;
    }
    set(key: string, val: number) {
        switch (key) {
            case "surface":
                this.surface = val;
                break;
            case "volume":
                this.volume = val;
                break;
            case "length":
                this.length = val;
                break;
            case "aperture":
                this.aperture = val;
                break;

            default:
                break;
        }
    }
}
