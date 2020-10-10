import uuid = require('uuid');
import net = require('net');

interface ListenerEvent {
	target: string;
	value: Record<string, unknown>;
}

interface Listener {
	(e: ListenerEvent): void
}

function new_hash() {
	return uuid.v4().replace(/-/g, '').toUpperCase();
}

export = {
	listener_list: [],
	add_listener: function (type: string, listener: Listener, hash = '', removable = true): void {
		this.listener_list.push({
			type: type,
			listener: listener,
			hash: hash,
			removable: removable,
		});
	},
	remove_all_listeners: function (): void {
		this.listener_list = this.listener_list.filter(o => {
			return !o.removable;
		});
	},
	dispatch_event: async function (type: string, target = '', value = {}): Promise<void> {
		const e = {
			type: type,
			target: target,
			value: value
		};
		const pros = [];
		this.listener_list.forEach(o => {
			if (e.type == o.type) {
				pros.push(o.listener(e));
			}
		});
		Promise.all(pros);
	},
	
	HOST: 'localhost',
	PORT: 11994,
	conn: null,

	parse_bag: async function (bag: { type: string, hash: string, value: Record<string, unknown> }): Promise<void> {
		return this.dispatch_event(bag.type, bag.hash, bag.value);
	},
	connect: async function (): Promise<void> {
		this.conn = new net.Socket();
		return new Promise((resolve) => {
			this.conn.connect(this.PORT, this.HOST, () => {
				this.conn.on('data', (data) => {
					const res = data.toString().replace(/\}\{/g, '},{');
					JSON.parse(`[${res}]`).forEach(o => {
						this.parse_bag(o);
					});
				});
				resolve();
			});
		});
	},
	send_config: function (): void {
		this.send({
			type: 'init',
			value: {
				resolution: [
					800, 600
				]
			},
			from: 'b',
			to: 'm'
		});
	},
	send_loaded: function (): void {
		this.send({
			type: 'loaded',
			from: 'b',
			to: 'r'
		});
	},
	send: function (bag: { type: string, value: Record<string, unknown> | string, from: string, to: string }): void {
		this.conn.write(JSON.stringify(bag));
	},

	lock_status: [ 0, 'mouse' ],
	unlock_resolve: null,
	wait_for_unlock: async function (): Promise<void> {
		if (this.is_locked()) {
			return new Promise((resolve) => {
				this.unlock_resolve = resolve;
			});
		} else {
			return;
		}
	},
	is_locked: function (): boolean {
		return this.lock_status[0] == 1;
	},
	lock_passed: function (): boolean {
		return this.lock_status[0] == -1;
	},
	notify_unlock: function (): void {
		if (this.unlock_resolve) {
			const temp = this.unlock_resolve;
			this.unlock_resolve = null;
			temp();
		}
	},
	lock: function (): void {
		this.lock_status[0] = 1;
	},
	unlock: function (): void {
		this.lock_status[0] = 0;
		this.notify_unlock();
	},
	unlock_forever: function (): void {
		this.lock_status[0] = -1;
		this.notify_unlock();
	},

	title: function (text: string): void {
		this.send({
			type: 'title',
			value: text,
			from: 'b',
			to: 'r'
		});
	},
	t: async function (text = '', wait = false, color = 'default', bcolor = 'default'): Promise<void> {
		this.send({
			type: 't',
			value: {
				text: text,
				color: color,
				bcolor: bcolor
			},
			from: 'b',
			to: 'r'
		});
		if (wait && !this.lock_passed()) {
			this.lock();
			await this.wait_for_unlock();
		}
	},
	b: function (text: string, func = null, param?: unknown, option: {
		disabled?: boolean;
		isLink?: boolean;
		popup?: string;
		color?: string;
	} = {}): void {
		const hash = new_hash();
		const info = {
			type: 'b',
			value: {
				text: text,
				hash: hash,
				disabled: !func,
				popup: '',
				color: ''
			} as Record<string, unknown>,
			from: 'b',
			to: 'r'
		};
		if (option.disabled) {
			info.value.disabled = true;
		}
		if (option.isLink) {
			info.value.isLink = true;
		}
		if (option.popup) {
			info.value.popup = option.popup;
		}
		if (option.color) {
			info.value.color = option.color;
		}
		this.add_listener('BUTTON_CLICK', (e: ListenerEvent) => {
			if (e.target == hash) {
				func(param);
			}
		}, hash);
		this.send(info);
		this.unlock();
	},
	h: function (text: string, rank = 1, color = 'default', bcolor = 'default'): void {
		this.send({
			type: 'h',
			value: {
				text: text,
				rank: rank,
				color: color,
				bcolor: bcolor
			},
			from: 'b',
			to: 'r'
		});
	},
	progress: function (now: number, max = 100, length = 100): void {
		this.send({
			type: 'progress',
			value: {
				now: now,
				max: max,
				length: length
			},
			from: 'b',
			to: 'r'
		});
	},
	rate: function (now = 0, max = 5, func = null, disabled = true): void {
		const hash = new_hash();
		this.add_listener('RATE_CLICK', (e: ListenerEvent) => {
			if (e.target == hash) {
				func(e.value);
			}
		}, hash);
		this.send({
			type: 'rate',
			value: {
				now: now,
				max: max,
				hash: hash,
				disabled: disabled
			},
			from: 'b',
			to: 'r'
		});
	},
	check: function (text = '', func = null, option: {
		disabled?: boolean;
		default?: boolean;
		read_only?: boolean;
	} = {}): void {
		const hash = new_hash();
		this.add_listener('CHECK_CHANGE', (e: ListenerEvent) => {
			if (e.target == hash) {
				func(e.value);
			}
		}, hash);
		const info = {
			type: 'check',
			value: {
				text: text,
				hash: hash,
				disabled: !func
			} as Record<string, unknown>,
			from: 'b',
			to: 'r'
		};
		if (option.disabled) {
			info.value.disabled = true;
		}
		if (option.default) {
			info.value.default = true;
		}
		if (option.read_only) {
			info.value.read_only = true;
		}
		this.send(info);
	},
	radio: function (choice_list: string[], func = null, default_index = 0): void {
		const hash = new_hash();
		this.add_listener('RADIO_CLICK', (e: ListenerEvent) => {
			if (e.target == hash) {
				func(e.value);
			}
		}, hash);
		this.send({
			type: 'radio',
			value: {
				list: choice_list,
				default: default_index,
				hash: hash
			},
			from: 'b',
			to: 'r'
		});
	},
	input: function (func = null, def = '', is_area = false, placeholder = ''): void {
		const hash = new_hash();
		this.add_listener('INPUT_CHANGE', (e: ListenerEvent) => {
			if (e.target == hash) {
				func(e.value);
			}
		}, hash);
		this.send({
			type: 'input',
			value: {
				default: def,
				is_area: is_area,
				placeholder: placeholder,
				hash: hash
			},
			from: 'b',
			to: 'r'
		});
	},
	dropdown: function (options: string[], func = null, def = null, search = false, multiple = false, placeholder = '', allowAdditions = false): void {
		const hash = new_hash();
		this.add_listener('DROPDOWN_CHANGE', (e: ListenerEvent) => {
			if (e.target == hash) {
				func(e.value);
			}
		}, hash);
		const new_opt = [];
		options.forEach(s => {
			new_opt.push(s);
		});
		this.send({
			type: 'dropdown',
			value: {
				options: new_opt,
				default: def,
				search: search,
				multiple: multiple,
				placeholder: placeholder,
				allowAdditions: allowAdditions,
				hash: hash
			},
			from: 'b',
			to: 'r'
		});
	},
	divider: function (text = ''): void {
		this.send({
			type: 'divider',
			value: text,
			from: 'b',
			to: 'r'
		});
	},
	// chart ??? There's no example
	page: function (color = 'default'): void {
		this.send({
			type: 'page',
			value: {
				color: color
			},
			from: 'b',
			to: 'r'
		});
		this.remove_all_listeners();
		this.mode();
	},
	clear: function (num = 0): void {
		this.send({
			type: 'clear',
			value: {
				num: num
			},
			from: 'b',
			to: 'r'
		});
	},
	exit: function (save = false): void {
		this.send({
			type: 'exit',
			value: {
				save: save
			},
			from: 'b',
			to: 'r'
		});
	},
	shake: function (duration = 500): void {
		this.send({
			type: 'shake',
			value: {
				duration: duration
			},
			from: 'b',
			to: 'r'
		});
	},
	mode: function (type = 'default', option: {
		celled?: boolean;
		compact?: boolean;
		column?: number;
	} = {}): void {
		const info = {
			type: 'mode',
			value: {
				mode: type
			} as {
				mode: string;
				celled?: boolean;
				compact?: boolean;
				column?: number;
			},
			from: 'b',
			to: 'r'
		};
		if (type == 'grid') {
			info.value.celled = option.celled || false;
			info.value.compact = option.compact || false;
			if (option.column) {
				info.value.column = option.column;
			}
		}
		this.send(info);
	},

	version: '0.1.0',
	init: async function (): Promise<void> {
		this.add_listener('MOUSE_CLICK', (e: {
			value: number
		}) => {
			switch (e.value) {
			case 1:
				if (this.is_locked()) {
					this.unlock();
				}
				break;
			case 3:
				if (this.is_locked()) {
					this.unlock_forever();
				}
				break;
			}
		}, '', false);
		this.add_listener('CMD', (e: {
			value: string[]
		}) => {
			if (e.value[0] == 'fix') {
				this.send({
					type: 'result',
					value: 'OK!',
					from: 'b',
					to: 'r'
				});
			}
		}, '', false);
		this.add_listener('SEND', (e: {
			value: unknown
		}) => {
			this.send(e.value);
		}, '', false);
		await this.connect();
		this.send_config();
		this.send_loaded();
	}
};