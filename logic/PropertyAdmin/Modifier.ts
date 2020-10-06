import fp = require('../FileParser')


export {
    modifier_admin,
    g_add, g_mlt, a_add, a_mlt,
}

class modifier_admin{
    modifiers:modifier
    constructor(){}

    set_default(){
        this.modifiers = new attach
    }

    add_get(key:string):number{
        return val
    }
    add_alt(key:string):number{
        return val
    }
}

//modifier提供的数值修正并不能在程序中修改
//如果存在此类需求，改起来其实很容易的
//g_是在get时提供修正，不影响原值
//a_是在add时提供修正，会影响“加上去的值”
function g_add(m_list:modifier[], key:string){
    const data = fp.load_yaml('modifier.yml')
    let add = 0
    m_list.forEach(i => {
        add = add + data[i.name]['g_add'][key]
    })
    return add
}

function g_mlt(m_list:modifier[], key:string){
    const data = fp.load_yaml('modifier.yml')
    let mlt = 1
    m_list.forEach(i => {
        mlt = mlt * data[i.name]['g_mlt'][key]
    })
    return mlt
}
function a_add(m_list:modifier[], key:string){
    const data = fp.load_yaml('modifier.yml')
    let add = 0
    m_list.forEach(i => {
        add = add + data[i.name]['g_add'][key]
    })
    return add
}
function a_mlt(m_list:modifier[], key:string){
    const data = fp.load_yaml('modifier.yml')
    let mlt = 1
    m_list.forEach(i => {
        mlt = mlt * data[i.name]['a_mlt'][key]
    })
    return mlt
}

class modifier {
    name:string
    work():void{
    }
    set_deafult():void{
    
    }
    constructor(){}
}
class attach extends modifier {

    contaminate():void{ //液体沾染
    }

    constructor(){
        super()
    }

}


class destruction extends modifier {
}

class insert extends modifier {
}

