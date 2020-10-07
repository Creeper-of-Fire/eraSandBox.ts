import fp = require('../FileParser')


export {
    modifier_admin,
}



class modifier_admin{
    modifiers:{ [key: string]: modifier }
    constructor(){}
    set_default(类型){
        const data:{[key:string]:any} = fp.load_yaml(fp.ModifierDefaultIndex.角色配置(类型))['修正']
        for (const i in data){
            for (const j in data[i]){
                const a = fp.load_process(data[i][j])
                if (a != 0){
                    this.modifiers[j] = JSON.parse(i)
                    this.modifiers[j].set_deafult()
                }
            }
        }
    }
    
    add_get(key:string):number{
        function g_add(key: string): number {
            let add = 0
            for (const i in this.modifiers) {
                if (key in this.modifiers[i].get_add) {
                    add = add + this.modifiers[i].get_add[key]
                }
            }
            return add
        }
        function g_mlt(key: string): number {
            let mlt = 1
            for (const i in this.modifiers) {
                if (key in this.modifiers[i].get_mlt) {
                    mlt = mlt * this.modifiers[i].get_mlt[key]
                }
            }
            return mlt
        }
        //add_get是在get时提供修正，不影响原值
        const val = g_add(key) * g_mlt(key)
        return val
    }
    add_alt(key: string): number {
        function a_add(key: string): number {
            let add = 0
            for (const i in this.modifiers) {
                if (key in this.modifiers[i].alt_add) {
                    add = add + this.modifiers[i].alt_add[key]
                }
            }
            return add
        }
        function a_mlt(key: string): number {
            let mlt = 1
            for (const i in this.modifiers) {
                if (key in this.modifiers[i].alt_mlt) {
                    mlt = mlt * this.modifiers[i].alt_mlt[key]
                }
            }
            return mlt
        }
        //add_alt是在add时提供修正，会影响“加上去的值”
        const val = a_add(key) * a_mlt(key)
        return val
    }

    add_modifier
    
    

}

class modifier {
    name:string
    get_add:{[key:string]:number}
    get_mlt:{[key:string]:number}
    alt_add:{[key:string]:number}
    alt_mlt:{[key:string]:number}

    constructor(){}
    set_deafult():void{
        const data = fp.load_yaml(fp.ModifierDefaultIndex.配置文件)
        this.get_add = data[this.name]['g_add']
        this.get_mlt = data[this.name]['g_mlt']
        this.alt_add = data[this.name]['a_add']
        this.alt_mlt = data[this.name]['a_mlt']
    }

    work():void{
    }
}
class attach extends modifier {
    constructor(){super()}
    contaminate():void{ }//液体沾染
}


class destruction extends modifier {
    constructor(){super()}
}

class insert extends modifier {

    constructor(){
        super()
    }
}