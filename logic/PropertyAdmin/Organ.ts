import pa_m = require('./Modifier')
import fp = require('../FileParser')

export {
    organ, organ_default_index, organ_admin
}

namespace organ_default_index {
    export function 器官结构定义(器官模板: string): string {
        return '' + 器官模板 + '.yml'
    }
    export function 插入结构定义(器官模板: string): string {
        return '' + 器官模板 + '.yml'
    }
    export function 器官数据定义(类型: string): string {
        return '' + 类型 + '.yml'
    }
}
//一些配置信息

class organ_admin {
    //器官模板: string//角色的器官模板，比如human
    all_organs: { [key: string]: organ }

    constructor() {
        //this.器官模板 = 'human'
    }

    set_default(器官模板: string, 类型: string): void {
        //this.器官模板 = 器官模板
        const organ_struct = fp.load_yaml(organ_default_index.器官结构定义(器官模板))
        //种族默认器官结构
        const data = fp.load_yaml(organ_default_index.器官数据定义(类型))
        const organ_data = data['器官']
        const insert_data = fp.load_yaml(organ_default_index.插入结构定义(器官模板))
        this.all_organs['全身'] = new organ()
        this.all_organs['全身'].set_default('全身', this, organ_struct, organ_data, insert_data)
    }

    push_organ(key:string, val:organ):void{
        this.all_organs[key] = val
    }
}





//一个角色的organ参与组成以下几种数据结构：
//解剖学树——有序树，是最主要的树，用处：创建成员，进行数据关联，显示给玩家
//通道网——一个图，用处：构成让人插入的结构

class organ {
    name: string
    num_data: { [key: string]: number }
    str_data: { [key: string]: string }

    o_admin: organ_admin
    //本质上，一个角色的所有的organ都是存储在一个一层的dict里面的，以方便外部直接调用彼此
    holes: hole[]
    //为了效率，每个organ有它上面的洞
    modifiers: pa_m.modifier_admin
    //每个organ会有属于自己的修正
    low_list: organ[]
    //每个organ有它下属organ的指针
    space: space
    occupy: space

    constructor() {
        this.name = ''

        this.num_data = {
            //'等级': 0,//似乎等级应该单独出来
            '经验': 0,
            '技巧': 0,
            '敏感': 0,
            '痛苦': 0,
            '扩张': 0, //扩张值，只影响扩张
            '快感': 0,
            '破坏': 0,
            '欲望': 0,
        }
        //初始化相关的数据，即使在战斗中它们也会起作用
        //display_data，直接显示给玩家的数据
        this.space = new space()
        this.occupy = new space()
        //space同时用于两种情况：插入和被插入
        //两个space是隐藏数据，并不会直接显示
    }

    set_default(name: string, o_admin: organ_admin, organ_struct: any, organ_data: { [key: string]: any }, insert_data): void {
        this.name = name //读取来自外部的名字
        this.o_admin = o_admin//传递自己所在的dict
        this._struct_default(organ_struct, organ_data, insert_data) //进行器官结构的默认配置
        this._data_default(organ_data) //进行器官数据的默认配置
        this._insert_default(insert_data)
    }
    //为上级结构增加的属性会流到如果存在该属性的下级结构中，如果下级结构没有属性则添加给本身
    //如果该结构设置了属性，但是下级结构具有此属性，则当作没有该属性
    _data_default(organ_data): void {
        const data = organ_data[this.name]
        for (const key in this.num_data) {
            this.num_data[key] = data[key]

        }

    }
    _struct_default(organ_struct: any, organ_data: { [key: string]: any }, insert_data: any): void {
        //结构树的默认值
        for (const key in organ_struct) {
            const og = new organ()//创建下属organ
            og.set_default(key, this.o_admin, organ_struct, organ_data, insert_data)
            this.o_admin.push_organ(key, og)
            //向admin添加
            og.organ_default(value)
            continue
            this.p_data[key] = format_data(value)
        }
    }
    _insert_default(i_dict): void {//还没有做，但是这玩意是所有人共用模板的，最多因为扩张度有修正

    }

    //数字处理部分，num_data相关
    sum_all() {
        for (const i in this.num_data) {
            this.sum_num(i)
        }
    }
    sum_num(key: string): void {//汇总
        for (const i_low of this.low_list) {
            i_low.sum_num(key)
        }
        for (const i_low of this.low_list) {
            this.num_data[key] = this.num_data[key] + i_low.get_num(key)
        }
    }
    get_num(key: string): number {
        this.sum_num(key)//可能导致性能过度消耗
        if (key in this.num_data) {
            const g = this.modifiers.add_get(key)
            return this.num_data[key] + g
        }
    }
    alt_num(key: string, val: number): void {
        this.sum_num(key)
        const add_val = val - this.num_data[key]
        this.add_num(key, add_val)
    }
    add_num(key: string, val: number): void {
        this.sum_num(key)
        if (typeof (val) == 'number') {
            const a = this.modifiers.add_alt(key)
            val = val + a//获得加成
            let part = 0
            for (const i_part of this.low_list) {//获得下级个数
                if (key in i_part.num_data) {
                    part = part + 1
                }
            }
            if (part == 0) {
                this.num_data[key] = this.num_data[key] + val
            }
            else {
                for (const i_part of this.low_list) {
                    const add_val = val / part//未经过加权，直接分配
                    i_part.add_num(key, add_val)
                }
            }
        }
    }


    volume(): number {
        //容积，塞入东西时会检测容积
        //通过身高体重来获取一个数据
        //基础值，通过“器官注册”文件获取
        return 1
    }
    destruction(): number {//破坏度，最大100，会查找自己的下级器官，得到破坏度上限
        part = 0
        if len(this.low_list) == 0{
            part = 1
        }
        else {
            for i in this.low_list{
                part = part + i.destruction()
            }
        }
        const dt = this.p_data['破坏'] / part
        return dt
    }

}


class space {
    surface: number = 0
    volume: number = 0
    length: number = 0
    //表面系统：一根针占用的表面是1，surface，和道具有关
    //容积系统：一毫升占用的容积是1，volume，和液体等有关
    //长度系统：一厘米，length
}

class hole {
    side: {
        key: organ
        place: number
    }[]
    //如{'肠道'{ 100, '肛门'{ 0}
    aperture: number
}

function list_default_sexual_struct(species) {
    fm = f.open_file('角色配置', species)
    s_list = fm[species]['调教']
    return s_list

/*
class fluid(struct){
    function __init__(this, species){
        struct.__init__(this, species)
    }
}
*/


/*
function format_data(data){//通过这个，存储的数据可以有简单的小代码
    function is_number(target_str){
        try{
            target_str
            return 1
        }
        if target_str.isdigit(){
            return 1
        return 0
    if type(data) == list{
        data = random.choice(data)
    if type(data) == str{
        data_list = data.split('/-')
        if is_number(data_list[0]){
            if '.' in data_list[0]{
                data_min = float(data_list[0])
                data_max = float(data_list[-1])
                data = random.uniform(data_min, data_max)
            else{
                data_min = int(float(data_list[0]))
                data_max = int(float(data_list[-1]))
                data = random.randint(data_min, data_max)
    return data
*/
/*
function sdefault() {
    fm = f.open_file('角色配置', this.species)
    try {
        key_list = fm[this.species][this.name]
        for key in key_list{
            if key in ('饰品', '特质'){
                continue
            }
            value = format_data(key_list[key])
            if value == ''{
                continue
            }
            this.p_data[key] = value
        }
    }
}
*/