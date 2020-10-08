export = {
    data: {
        Object: Object,
    },
    register(cls: { new (): void; name: string }): void {
        this.data[cls.name] = cls;
    },
    _load(data: unknown): unknown {
        switch (Object.prototype.toString.call(data)) {
            case "[object Object]": {
                const obj = data as {
                    cls: string;
                    dat: Record<string, unknown>;
                };
                const result = new this.data[obj.cls]();
                for (const k in obj.dat) {
                    result[k] = this._load(obj.dat[k]);
                }
                return result;
            }
            case "[object Array]": {
                const result = [];
                const arr = data as Array<unknown>;
                arr.forEach((o) => {
                    result.push(this._load(o));
                });
                return result;
            }
            case "[object Number]":
            case "[object String]":
            case "[object Boolean]":
            case "[object Null]":
                return data;
        }
    },
    load(data: string): unknown {
        return this._load(JSON.parse(data));
    },
    _save(data: unknown): unknown {
        switch (Object.prototype.toString.call(data)) {
            case "[object Object]": {
                const result = {
                    cls: data.constructor.name, //类的名字
                    dat: {} as Record<string, unknown>, //建立一个空的对象
                };
                const obj = data as Record<string, unknown>; //强制转换data的类型
                for (const k in obj) {
                    const val = obj[k];
                    if (typeof val != "function") {
                        result.dat[k] = this._save(val);
                    }
                    //遍历，如果不是函数就塞进去
                }
                return result;
            }
            case "[object Array]": {
                const result = [];
                const arr = data as Array<unknown>;
                arr.forEach((o) => {
                    result.push(this._save(o));
                });
                return result;
            }
            case "[object Number]":
            case "[object String]":
            case "[object Boolean]":
            case "[object Null]":
                return data;
        }
    },
    save(data: unknown): string {
        return JSON.stringify(this._save(data));
    },
};
