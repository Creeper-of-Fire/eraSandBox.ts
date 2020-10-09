import fs = require("fs");
import yaml = require("js-yaml");
import iconv = require("iconv-lite");

export {
    load_auto,
    load_csv,
    load_json,
    load_yaml,
    load_file,
    load_process,
    OrganDefaultIndex,
    ModifierDefaultIndex,
    CharacterDefaultIndex,
    ActDefaultIndex,
    ExperienceDefaultIndex,
    getRandomFromArray,
};
//一些配置信息
function load_file(path: string, encoding = "utf8"): string {
    const buf = fs.readFileSync(path);
    return iconv.decode(buf, encoding);
}
function load_csv(path: string, encoding = "utf8"): Array<Array<string>> {
    const text = this.load_file(path, encoding);
    const data = [];
    text.split(/\r?\n/).forEach((row) => {
        data.push(row.split(","));
    });
    return data;
}
function load_yaml(path: string, encoding = "utf8"): Record<string, unknown> {
    const text = this.load_file(path, encoding);
    return yaml.load(text);
}
function load_json(path: string, encoding = "utf8"): Record<string, unknown> {
    const text = this.load_file(path, encoding);
    return JSON.parse(text);
}
function load_auto(path: string, encoding = "utf8"): unknown {
    const suffix = /\.(.+)$/.exec(path)[1];
    switch (suffix) {
        case "csv":
            return this.load_csv(path, encoding);
        case "yml":
            return this.load_yaml(path, encoding);
        case "json":
            return this.load_json(path, encoding);
        default:
            return this.load_file(path, encoding);
    }
}
function load_process(data: string | number): string | number {
    data = String(data);
    const list = data.split("/,");
    const r = getRandomInt(0, list.length - 1);
    const range = list[r].split("/_");
    const a = Number(range[0]);
    const b = Number(range[range.length - 1]);
    if (!isNaN(a) && !isNaN(b)) {
        if (range[0].indexOf(".") > -1) {
            //此时为浮点数
            return getRandomNumber(a, b)
        } else {
            //此时为整数
            return getRandomInt(a, b)
        }
        ;
    } else {
        return range[0];
    }
}
//请输入以游戏主程序为根目录的目录

namespace OrganDefaultIndex {
    export function 器官结构定义(model: string): string {
        return "./data/配置表/器官注册/" + model + ".yml";
    }
    export function 插入结构定义(model: string): string {
        return "./data/配置表/器官注册/" + model + ".yml";
    }
    export function 器官数据定义(type: string): string {
        return "./data/配置表/角色初始/" + type + ".yml";
    }
}

namespace ModifierDefaultIndex {
    export function 配置文件(type: string = "modifier"): string {
        return "./data/配置表/修正/" + type + ".yml";
    }
    /*
    export function 角色配置(类型) {
        return "./data/配置表/角色初始/" + 类型 + ".yml";
    }
    */
}
namespace CharacterDefaultIndex {
    export function 角色数据定义(type: string): string {
        return "./data/配置表/角色初始/" + type + ".yml";
    }
}
namespace ActDefaultIndex {
    export function 口上配置(): string {
        return "./data/配置表/口上预设/口上配置.yml";
    }
    export function 描述(): string {
        return "./data/配置表/口上预设/描述配置.yml";
    }
}
namespace ExperienceDefaultIndex {
    export function 经历(): string {
        return "./data/配置表/经历/经历.yml";
    }
}

function getRandomInt(min: number, max: number): number {
    const Range = max - min;
    const Rand = Math.random(); //获取[0-1）的随机数
    return min + Math.round(Rand * Range); //放大取整
}
function getRandomNumber(min: number, max: number): number {
    const Range = max - min;
    const Rand = Math.random(); //获取[0-1）的随机数
    return min + Rand * Range; //放大取整
}
function getRandomFromArray(list: Array<any>) {
    return list[getRandomInt(0, list.length - 1)];
}
