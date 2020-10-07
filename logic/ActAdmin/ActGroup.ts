import aa_a = require('./Act')
import aa_ta = require('./TrainAdmin')
import pa_o = require('../PropertyAdmin/Organ')
import ca = require('../CharacterAdmin')

/*
function train_default_list(){
    return (insert_start, insert_proceed ,insert_end, )
}
*/

class act_group {
    name: string
    discuss: string
    act_list: aa_a.act[]
    active_character: ca.character
    passive_character: ca.character

    able(): number {
        for (const i_act of this.act_list) {
            if (i_act.able() == 0) {
                return 0
            }
            return 1
        }
    }
    will(): number {
        let willing = 0
        for (const i_act of this.act_list){
            if (i_act.will() == 0) {
                return 0
            }
            else {
                willing = willing + i_act.will()
            }
        }
        return willing
    }
    work(): void {
        for (const i_act of this.act_list) {
            i_act.work()
        }
    }

    set_default(passive_character:ca.character, active_character:ca.character){
        this.active_character = active_character
        this.passive_character = passive_character
    }

    constructor() {
        this.name = ''
        this.discuss = ''
        this.act_list = []

    }
}

namespace Insert {
    

    class insert extends act_group {
        entrance: pa_o.organ
        insertion: pa_o.organ
        insert_length_will(): number {
            //插入的深度的精神需求
            return 100//测试，设置为1米
        }
        list_organ(): any {
            let outside = new pa_o.organ()
            outside.space.length = 10000000
            let enter_pos = this.entrance.points[1]//举个例子
            find_path(enter_pos, outside, this.insertion.occupy.aperture, this.insertion.space.length)

        }

        set_default(passive_character:ca.character, active_character:ca.character, entrance:pa_o.organ, insertion:pa_o.organ):void{
            //主动方，被动方，入口，插入物
            //super.set_default(passive_character, active_character)
            this.insertion = insertion
            this.entrance = entrance
        }
    }

    class insert_info {
        path: pa_o.organ_pos[]
        will: number
        last_organ: pa_o.organ
        last_position: number[] //上一个点的位置行进方向 at most 2 (front and back)
    } //插入信息

    function find_path(entry: pa_o.organ_pos, outside: pa_o.organ, insert_width: number, insert_length: number): insert_info[] {
        const paths: insert_info[] = []
        const path: insert_info = new insert_info
        path.path = []

        function add_path() {
            const p: insert_info = new insert_info
            p.path = path.path.slice(0)//数组浅拷贝
            p.last_organ = path.last_organ
            p.last_position = path.last_position
            paths.push(p)
        } //拷贝，不然只会push一个引用

        function dfs(pos: pa_o.organ_pos, rest_length: number, pre: pa_o.organ_pos): void {
            if (pos.total_aperture - pos.used_aperture < insert_width) {
                return
            } //戳不进去了，返回
            pos.used_aperture += insert_width
            path.path.push(pos)
            if (rest_length == 0) {
                add_path()
            } //插入物长度不够了，添加一个可行路径然后返回
            else if (pos.organ == pre.organ) {
                for (const target of pos.toward) {
                    dfs(target, rest_length, pos)
                } //试图去遍历其他器官
            } //如果之前就已经经过某一器官，接下来一定切换到另一个器官去
            else {
                for (const target of pos.organ.points) { //遍历pos指向的其他节点
                    if (target == pos) {
                        continue //当是自身时跳过
                    }
                    const dis = Math.abs(pos.position - target.position) * pos.organ.space.length / 100
                    //计算到该节点时花费的长度
                    if (dis < rest_length) {
                        dfs(target, rest_length - dis, pos) //长度可以够到，开始递归
                    }
                }
                const extra = rest_length / pos.organ.space.length * 100
                path.last_organ = pos.organ
                path.last_position = []
                if (pos.position + extra <= 100) {
                    path.last_position.push(pos.position + extra)
                } //看看上面能不能走到头
                if (pos.position - extra >= 0) {
                    path.last_position.push(pos.position - extra)
                } //看看下面能不能
                if (path.last_position.length > 0) {
                    add_path()
                }
            }
            path.path.pop() //对自身的遍历结束（该保存的都保存了），去掉自身
            pos.used_aperture -= insert_width //去掉自身的影响
        }

        let pre = null
        for (const target of entry.toward) {
            if (target.organ == outside) {
                //当选择的入口与外界连接时
                pre = target
                //“上一个器官”设定为外界
                break
            }
        }
        if (!pre) {
            return null
        }
        //不与外界连通时，直接返回
        dfs(entry, insert_length, pre)
        return paths
    }
}