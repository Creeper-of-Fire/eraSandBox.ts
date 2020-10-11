import C = require("../__init__");
import D = require("../../Data/__init__");
export { experience_admin };

class experience_admin {
    data_list: Record<string, unknown>;
    protected experiences: Record<string, experience>;
    constructor() {
        this.data_list = {};
        this.experiences = {};
    }
    set_default(list: Record<string, string | number>) {
        const data = D.fp.load_yaml(D.fp.ExperienceDefaultIndex.经历());
        const data_list = {};
        for (const i in list) {
            const a = D.dp.processLoadData(list[i]) as number;
            if (a != 0) {
                this.experiences[i] = new experience();
                const b = data[i];
                this.experiences[i].set_default(i, b);
                data_list[i] = b;
            }
        }
        this.data_list = data_list; //然后character调用这个玩意
    }
}
class experience {
    name: string;
    describe: string;
    constructor() {
        this.name = "";
        this.describe = "";
    }
    set_default(name, data) {
        this.name = name;
        this.describe = data["描述"];
    }
}
