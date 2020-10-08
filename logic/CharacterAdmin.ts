import pa_m = require('./PropertyAdmin/Modifier')
import pa_i = require('./PropertyAdmin/Item')
import pa_o = require('./PropertyAdmin/Organ')

export{
    character,character_admin,
}

class character_admin {
    charalist: character[]
    master: character
    assist: character
    target: character
    player: character
    choose: character

    num(): number {//注意，去掉了一个空角色
        const num = this.charalist.length - 1
        return num
    }

    add_chara(temp_chara): void {
        this.charalist.push(temp_chara)
        this._re_list()
    }
    del_chara(id:number): void {
        this.charalist.splice(id,1)
        this._re_list()
    }
    get_chara(): string[] {
        return
    }
    private _re_list(): void {
        for (let i = 0; i <= this.num(); i++) {
            this.charalist[i].id = i
        }
    }
    error_fix(): void {
        if (this.num() != 0) {
            if (this.master.id == 0) {
                this.master = this.charalist[1]
            }
            if (this.target.id == 0) {
                this.target = this.charalist[1]
            }
            if (this.player.id == 0) {
                this.player = this.charalist[1]
            }
        }
    }
    names(start:number,end:number = this.charalist.length):string[]{
        const a:string[] = []
        for(let i=start;i<= end;i++){
            a.push(this.charalist[i].get_str('名字'))
        }
        return a
    }

    constructor() {
        this.charalist = []
        const null_chara = new character()
        this.charalist.push(null_chara)
        //添加空角色
        this.master = this.charalist[0]
        this.assist = this.charalist[0]
        this.target = this.charalist[0]
        this.player = this.charalist[0]
        this.choose = this.charalist[0]

    }
}

class character {
    id: number
    类型: string//角色的类型，比如“玩家”
    //器官模板: string
    num_data: { [key: string]: number }
    str_data: { [key: string]: string }

    modifiers: pa_m.modifier_admin
    organs: pa_o.organ_admin
    items: pa_i.item_admin

    constructor() {
        this.num_data = {
            '最大体力': 0,
            '体力': 0,
            '最大精力': 0,
            '精力': 0,

            '高潮次数': 0,

            '身高': 0,
            '体重': 0,
            '胸围': 0,
            '腰围': 0,
            '臀围': 0,
            //以后这些数据会变成用函数获取的，方便锯掉腿之类的
        }
        this.str_data = {
            '名字': '',
            '种族': '',
        }
        //要展示的数据放在这上面

        this.id = 0
    }

    set_default(id: number, name: string, 类型: string): void {
        this.id = id
        this.str_data['名字'] = name
        this.类型 = 类型
        //this.器官模板 = 器官模板

        this.modifiers = new pa_m.modifier_admin()
        this.modifiers.set_default(类型)
        this.organs = new pa_o.organ_admin()
        this.organs.set_default(this)
        this.items = new pa_i.item_admin()
        this.items.set_default(类型)
    }

    //希望少用
    get(key: string) {
        if (key in this.num_data) {
            return this.get_num(key)
        }
        else if (key in this.str_data) {
            return this.get_str(key)
        }
        else {
            return null
        }
    }
    alt(key: string, val: any){
        if (key in this.num_data) {
            this.alt_num(key,val)
        }
        else if (key in this.str_data) {
            this.alt_str(key,val)
        }
        else {
            null
        }
    }
    
    //字符串处理
    get_str(key: string):string {
        if (key in this.str_data) {
            return this.str_data[key]
        }
        else{
            return ''
        }
    }
    alt_str(key: string, val:string){
        this.str_data[key] = val
    }

    //数字处理部分，num_data相关
    get_num(key: string): number {
        if (key in this.num_data) {
            const g = this.modifiers.add_get(key,this.num_data[key])
            return g
        }
        else{
            return 0
        }
    }
    alt_num(key: string, val: number): void {
        const add_val = val - this.num_data[key]
        this._add_num(key, add_val)
    }
    private _add_num(key: string, val: number): void {
        const a = this.modifiers.add_alt(key,val)
        this.num_data[key] = this.num_data[key] + a
    }
}