import aa = require("./__init__");
import ca = require("../CharacterAdmin")
import ia = require("../ItemAdmin");
export { site };







/*
class map {
    acts: Array<>
}
*/










class site {
    acts: Array<aa.i.insert_admin|aa.ag.act_admin>;
    characters: Record<string,ca.character>;
    items: Array<ia.item>
    constructor() {
        this.acts = []
        this.characters = {}
        this.items = []
    }
    set_default():void{
        this.check_acts()
    }
    check_acts():void{
        const insert = new aa.i.insert_admin()
        insert.set_default(this.characters,this.items)
        this.acts.push(insert)
    }
    add_chara(character:ca.character):void{
        if (!(String(character.id) in this.characters)){
            this.characters[String(character.id)] = character
        }
    }
    add_item(item:ia.item):void{
        this.items.push(item)
    }
    prepare():void{
    
    }
    work():void{
        for (const i of this.acts){
            i.work()
        }
    }
}