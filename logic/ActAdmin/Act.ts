import fp = require('../FileParser')

export {
    act
}

//目前为止，“旁观者”不参与一个动作，后续会进行添加
class act{

    will(){
        //通过条件判断来判断是否可行，当大于0则可行
        //在以后加入“自动调教”时会很有用
        return 0
    }
    able(){
        //通过设置来直接禁止的动作
        return 0
    }
    
    spek(){
        list_for_rand = []
        let s_data = fp.load_yaml('口上配置'??????)
        active = this.a_chara
        passive = this.p_chara
        a_feature = p.name_list(active.modifier)
        p_feature = p.name_list(passive.modifier)
        for i_feature in this.feature{
            if i_feature in s_data{
            }
            else{
                continue
            }
            for dict1 in s_data[i_feature]{//s_data[i_feature]是个列表，dict是个字典
                able = dict1['ABLE']
                is_true = 1
                if 'A' in able{
                    for a_key in able['A']{
                        if a_key in a_feature{
                        }
                        else{
                            is_true = 0
                        }
                    }
                }
                if 'P' in able{
                    for p_key in able['P']{
                        if p_key in p_feature{
                            pass
                        }
                        else{
                            is_true = 0
                        }
                    }
                }
                if is_true == 1{
                    t_list = []
                    for i_key in dict1{
                        if i_key != 'ABLE'{
                            t_list.push(dict1[i_key])
                        }
                    }
                    list_for_rand.push(t_list)
                }
            }
        }
        speak_list = []
        if list_for_rand.length != 0{
            speak_list = random.choice(list_for_rand)
        speak_list.push(this.discuss)
        }
        for i in speak_list{
            i = this.speak_translate(i)
        }
        return speak_list
    }
    speak_translate(this, string){
        //处理口上中类似于{balabala}的数据
        //功能暂时不做
        return string
    }
    work(){
    }

    set_feature(){
        feature = []
        return feature
    }

    set_default(passive_chara, passive_object, active_chara = 'NULL', active_object = 'NULL'){
        this.name = ''
        this.discuss = ''

        this.p_c = passive_chara
        this.a_c = active_chara
        this.p_o = passive_organ
        this.a_o = active_organ
        //器官和人物注册
        this.feature = []
        this.feature = this.set_feature()
    }
    constructor(){}
}


class act_insert extends act{
    will(){
        return 1
    }
    able(){
        return 1
    }
    set_feature(){
        return 1
    }

    dilate(){//扩张管理
        s_list = this.p_o.space.s_list
        in_list = this.a_o.space.s_list
        dilate_rate = this.p_o.p_data['扩张']
        for i in s_list{
            //if i >= 
        }
    }
    work(){
        this.dilate()
    }
        
        
        //查看扩张值，如果扩张值过小则添加“疼痛值”和“损伤值”，并激活扩张效果

    set_default(passive_chara, passive_object, active_chara = 'NULL', active_object = 'NULL'){
        super.set_default(passive_chara, passive_object, active_chara, active_object)
        this.name = '插入'
        this.discuss = 'test2'
    }
}

class act_changeover extends act{
    //一 转 攻 势
    able(){
        return 1
    }

    constructor(){super()}
}

class act_touch(act){
    function able(){
        return 1
    }

    function __init__(this, chara_list, organ_list){
        act.__init__(this, chara_list, organ_list)
        this.feature.update(['愉快',])
        this.name = '抚摸'
        this.discuss = 'test1'
    }
}

class act_hit(act){
    function able(){
        return 1
    }

    function __init__(this, chara_list, organ_list){
        act.__init__(this, chara_list, organ_list)
        this.feature.update(['喜悦','痛苦'])
        this.name = '接吻'
        this.discuss = 'test2'
    }
}


