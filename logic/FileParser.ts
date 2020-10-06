import fs = require('fs')
import yaml = require('js-yaml')
import iconv = require('iconv-lite')

export = {
	load_file(path: string, encoding = 'utf8'): string {
		const buf = fs.readFileSync(path)
		return iconv.decode(buf, encoding)
	},
	load_csv(path: string, encoding = 'utf8'): string[][] {
		const text = this.load_file(path, encoding)
		const data = []
		text.split(/\r?\n/).forEach(row => {
			data.push(row.split(','))
		})
		return data
	},
	load_yaml(path: string, encoding = 'utf8'): Record<string, unknown> {
		const text = this.load_file(path, encoding)
		return yaml.load(text)
	},
	load_json(path: string, encoding = 'utf8'): Record<string, unknown> {
		const text = this.load_file(path, encoding)
		return JSON.parse(text)
	},
	load_auto(path: string, encoding = 'utf8'): unknown {
		const suffix = /\.(.+)$/.exec(path)[1]
		switch (suffix) {
		case 'csv':
			return this.load_csv(path, encoding)
		case 'yml':
			return this.load_yaml(path, encoding)
		case 'json':
			return this.load_json(path, encoding)
		default:
			return this.load_file(path, encoding)
		}
	}
}

//请输入游戏主程序的目录