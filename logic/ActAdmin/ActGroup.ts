import aa_a = require('./Act')
import aa_ta = require('./TrainAdmin')


function train_default_list(){
    return (insert_start, insert_proceed ,insert_end, )
}

class act_group{
    name:string
    discuss:string
    act_list:act[]

    able():void{
        for i_act in this.act_list{
            if (i_act.able() == 0){
                return 0
            }
        return 1
        }
    }
    will():void{
        willing = 0
        for i_act in this.act_list{
            if (i_act.will() == 0){
                return 0
            }
            else{
                willing = willing + i_act.will()
            }
        }
        return willing
    }
    work():void{
        for (c i_act in this.act_list){
            i_act.work()
        }
    }

    constructor(passive_list, active_list, timer){
        this.name = ''
        this.discuss = ''
        this.act_list = []
        this.a_list = active_list
        this.p_list = passive_list
        this.timer = 0
    }
}

class insert(act_group){
    function insert_length_will(){
        //插入的深度的精神需求
        return 100//测试，设置为1米
    function list_organ(){
        organ_list = []
        searching_list = []
        searched_list = {}
        //存储方式{ {肠道{ 100}(表示肠道被这个占满了)
        target = this.etr
        //对每个器官，寻找和它链接的下一个器官，同时查找是否已经取过
        //
        
        //当this.etr.insert_target都被搜索过了，则跳出
        function search(target, search_list, organ_list){
            search_list.push(target)
            //将自身载入到列表中
            if len(target.insert_target) == 0{
                organ_list.push(search_list)
                search_list.pop()
                //如果下级不可取，则到达尽头，生成一个列表，并把列表append给organ_list
                //然后从列表中去掉自身，
            for i_organ
            //如果下级不为空且不重复，则将target依次指向每一个下级
            


    function __init__(this, passive_chara, active_chara, entrance, insertion){
        //主动方，被动方，入口，插入物
        act_group.__init__(this, [passive_chara,], [active_chara,])
        this.ist = insertion
        this.etr = entrance



class insert_proceed(act_group){
    pass

class insert_end(act_group){
    pass