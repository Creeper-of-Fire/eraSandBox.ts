import ca = require("../CharacterAdmin");
import ia = require("../ItemAdmin");
import pa = require("../PropertyAdmin/__init__");
import aa = require("../ActAdmin/__init__");
import era = require("../../engine/era");

export { act_insert, insert, object_insert_point, object_insert, insert_admin };

class act_insert extends aa.a.act {
    p_o: object_insert;
    info: insert_info;
    insertion: object_insert;
    //end_point: object_insert_point;
    start_point: object_insert_point;
    constructor(){
        super()
        this.p_o = new object_insert()
        this.info = new insert_info()
        this.insertion = new object_insert()
        //this.end_point = new object_insert_point()
        this.start_point = new object_insert_point()
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
        for (const i in this.spek()){
            era.t(i)
        }
        
    }

    //查看扩张值，如果扩张值过小则添加“疼痛值”和“损伤值”，并激活扩张效果

    set_default(insert_info: insert_info, insertion: object_insert): void {
        this.name = "插入";
        this.describe = 'test2'
        this.insertion = insertion;
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
        return 0;
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

class insert {
    name: string;
    describe: string;
    act_list: Array<act_insert>;
    active_character: ca.character;
    passive_character: ca.character;
    entrance: object_insert_point;
    insertion: object_insert;
    constructor() {
        this.name = "";
        this.describe = "";
        this.act_list = [];
    }
    list_organ(): Array<act_insert> {
        //let enter_pos = this.entrance.points[1]//举个例子
        const outside = this.passive_character.organs.get_organ("外界").object_insert;
        const a_g_able = find_path(
            this.entrance,
            outside,
            this.insertion,
            this.insertion.occupy.length
        );
        a_g_able.sort(function (a, b) {
            return b.will - a.will;
        });
        //自动进行选择
        console.log(a_g_able[0].path);
        return a_g_able[0].path;
    }
    set_default(
        passive_character: ca.character,
        active_character: ca.character,
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

class insert_admin extends aa.ag.act_admin {
    acts: Array<aa.ag.act_group>;
    act_type: typeof insert;
    characters: Record<string, ca.character>;
    set_default(characters: Record<string, ca.character>, items: Array<ia.item>) {
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
        console.log(insertions)
        for (const i in characters) {
            //i是被动
            for (const j in characters) {
                //j是主动
                if (i == j) {
                    continue;
                }
                for (const m of characters[i].organs.insert_able_point_list()) {
                    for (const n of insertions) {
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

    function add_path(): void {
        const p: insert_path = new insert_path();
        p.path = path.path.slice(0); //数组浅拷贝
        //p.last_organ = path.last_organ
        //p.last_position = path.last_position
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
    //last_organ: object_insert
    //last_position: number[] //上一个点的位置行进方向 at most 2 (front and back)
} //插入信息

class insert_info {
    //插入信息分为两种，点对点和点到器官到点
    start_point: object_insert_point;
    //end_point: object_insert_point
    object_through: object_insert;
    percentage_through: number;
}

class object_insert {
    name: string;
    points: Array<object_insert_point>;
    //一些节点，这些节点会连接向其他的器官
    modifiers: pa.m.modifier_admin;
    //属于自己的修正，和prototype共通
    master: ca.character;
    //无主的物体默认丢给NULL角色
    prototype: pa.o.organ|ia.item_part;
    //来自于哪里
    total_space: space;
    used_space: space;
    occupy: space;
    //space同时用于两种情况：插入和被插入
    constructor(){
        this.points = []
        this.name = ''
        this.modifiers = new pa.m.modifier_admin()
        this.master = new ca.character()
        this.prototype = new pa.o.organ()
        this.total_space = new space()
        this.used_space = new space()
    }

    dilate(): number {
        const val = this.prototype.get_num("扩张");
        return val;
    }
    add_modifiers(): void {}
    add_point(position: number, total_aperture: number): void {
        const op = new object_insert_point();
        op.set_default(this, position, total_aperture);
        this.points.push(op);
    }
    set_default(master: ca.character, prototype: pa.o.organ|ia.item_part): void {
        //目前只支持将organ进行转换，因为道具还没有开始配置
        this.name = prototype.name;
        //points这玩意需要prototype那边自行添加
        this.modifiers = prototype.modifiers;
        this.master = master;
        this.prototype = prototype;
        /*
            this.space = prototype.space
            this.occupy = prototype.occupy
            这两个玩意的配置放在哪我还没有想好……
            */
    }
}

class object_insert_point {
    object_at: object_insert; //所在器官
    position: number; //所在位置
    toward: Array<object_insert_point>; //和它连接的点
    total_aperture: number;
    used_aperture: number;
    modifiers: pa.m.modifier_admin;
    constructor() {
        this.toward = [];
        this.total_aperture = 0
        this.used_aperture = 0
    }
    link(p: object_insert_point): void {
        this.toward.push(p);
        p.toward.push(this);
    }
    set_default(object_at, position, total_aperture): void {
        this.object_at = object_at;
        this.position = position;
        this.total_aperture = total_aperture;
    }
    dilate(): number {
        //扩张度
        let val = this.object_at.dilate();
        for (const i of this.toward) val = val + i.object_at.dilate();
        val = val / (this.toward.length + 1);
        return val;
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
}
