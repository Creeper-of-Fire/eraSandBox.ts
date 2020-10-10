import pa = require("./__init__");
import fp = require("../FileParser");
export { experience_admin };

class experience_admin {
    data_list: Record<string, unknown>;
    experiences: Record<string, experience>;
    constructor() {
        this.data_list = {};
        this.experiences = {};
    }
    set_default(list: Record<string, string | number>) {
        const data = fp.load_yaml(fp.ExperienceDefaultIndex.经历());
        const data_list = {};
        for (const i in list) {
            const a = fp.load_process(list[i]) as number;
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
