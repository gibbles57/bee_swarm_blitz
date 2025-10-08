class Data {
	constructor(old) {
		if (old) this.import(old);
	}

	toJSON() {
		return Object.entries(this);
	}

	import(values) {
		values.forEach((e) => {
			if (e[1] === null) e[1] = undefined;
			this[e[0]] = e[1];
		})
	}
}

class Card extends Data {
	constructor(old, type, subtype, index) {
		super(old);
		if (old) return;
		this.type = type;
		this.subtype = subtype;
		this.index = index;
	}

	getType() {
		return this.type;
	}
	getSubtype() {
		return this.subtype;
	}
	setIndex(value) {
		this.index = value;
	}
	getIndex() {
		return this.index;
	}
}

class BeeCard extends Card {
	constructor(old, name = "none", index, gifted = false, level = 1, bond = 0, beequip = ["none", {}], mutation = "none", radioactive = 0, stats) {
		super(old, "bee", "none", index);
		if (old) return;
		this.name = name;
		this.gifted = gifted;
		this.level = level;
		this.bond = bond;
		this.beequip = beequip;
		this.mutation = mutation;
		this.radioactive = radioactive;
		this.stats = stats ? stats : JSON.parse(JSON.stringify(beeTypeStats[this.name]));
		this.show = "";
		this.cooldowns = {};
		this.initCooldowns();
	}

	getName() {
		return this.name;
	}

	setGifted(value) {
		this.gifted = value;
	}
	getGifted() {
		return this.gifted;
	}

	setLevel(value) {
		this.level = value;
	}
	addLevel(value) {
		this.level += value;
	}
	getLevel() {
		return this.level;
	}

	setBond(value) {
		this.bond = value;
		this.addBond(0);
	}
	addBond(value) {
		this.bond += value;
	}
	getBond() {
		return this.bond;
	}

	setBeequip(name, stats) {
		this.beequip = [name, stats];
	}
	getBeequip() {
		return this.beequip;
	}
	clearBeequip() {
		this.beequip = ["none", {}];
	}

	setMutation(name) {
		this.mutation = name;
	}
	getMutation() {
		return this.mutation;
	}
	clearMutation() {
		this.mutation = "none";
	}

	setRadioactive(value) {
		this.radioactive = value;
	}
	getRadioactive() {
		return this.radioactive;
	}

	getRarity() {
		return beeTypeStats[this.getName()].rarity;
	}

	getColor() {
		return (beeTypeStats[this.getName()].color == "colorless" ? "" : beeTypeStats[this.getName()].color);
	}

	updateLevel() {
		let i = 0;
		while (this.getBond() >= bondLevels[i]) {
			i++;
		}
		this.setLevel(i + 1);
	}

	toString() {
		return "bee\n" + this.name + "\n" + this.gifted + "\n" + this.level + "\n" + this.bond + "\n" + this.beequip + "\n" + this.mutation;
	}

	setStat(name, value) {
		this.stats[name] = value;
	}
	addStat(name, value) {
		this.stats[name] += value;
	}
	getStats() {
		return this.stats;
	}

	getShow() {
		this.getLines();
		if (document.getElementById("bees_infobox") && document.getElementById("bees_infobox").dataset.index == game.buffs.indexOf(this)) {
			document.getElementById("bees_infobox").innerHTML = this.show;
		} else {
			return this.show;
		}
	}

	getLines() {
		let lines = [];
		lines.push((this.gifted ? "&#11088; " : "") + textHandler("change", [(this.gifted ? "gifted_" : "") + this.name + "_bee", "regular"]) + (this.gifted ? " &#11088;" : ""));
		if (this.gifted) {
			lines.push("Gifted Bonus - " + this.stats.gifted_bonus);
		}
		//rest of stats here
		//calc all this nonsense out before
		lines.push("<span style='color: " + rarityColors[this.stats.color] + ";'>" + textHandler("change", [this.getColor() + "_" + this.getRarity(), "regular"]) + "</span>");
		lines.push("Level " + this.level);
		lines.push("Bond - " + this.bond + "&nbsp&nbsp&nbsp" + "Energy - " + this.stats.energy);
		//lines.push();
		lines.push("<span style='color: #ff6b6b;'>Attack</span> - " + this.stats.attack + "&nbsp&nbsp&nbsp" + "<span style='color: #aaffff;'>Speed</span> - " + this.stats.speed);
		//lines.push();
		lines.push("Collects " + this.stats.gather + " <span style='color: #67cd67;'>pollen</span> per turn.");
		lines.push("Makes " + Math.round(this.stats.convert / this.stats.convert_speed) + " <span style='color: #ffc400;'>honey</span> per turn.");
		if (this.mutation != "none") {
			lines.push("Mutation - " + this.mutation);
		}
		if (this.beequip[0] != "none") {
			lines.push("Beequip - " + this.beequip[1]);
		}
		lines.push("Tokens <span style='color: #808080;'>(cooldown)</span>:");
		let tokens = this.stats.tokens;
		for (let i = 0; i < tokens.length; i++) {
			if (tokens[i].includes("#") && this.gifted) {
				tokens[i] = tokens[i].substring(1);
			}
			if (tokens[i].includes("#") && !this.gifted) {
				tokens.splice(i, 1);
				i--;
				continue;
			}
			let cd = this.cooldowns[textHandler("change", [tokens[i], "underscores"])];
			lines.push(tokens[i] + " - " + (Math.round(tokenStats[textHandler("change", [tokens[i], "underscores"])][3] * 1000) / 10) + "% chance" + (cd > 0 ? " <span style='color: #808080;'>(" + cd + ")</span>" : ""));
		}
		this.show = lines[0];
		for (let i = 1; i < lines.length; i++) {
			this.show += "<br>";
			this.show += lines[i];
		}
	}

	addCooldown(name, value) {
		this.cooldowns[name] += value;
	}
	setCooldown(name, value) {
		this.cooldowns[name] = value;
	}
	getCooldown(name) {
		return this.cooldowns[name];
	}
	resetCooldown(name) {
		this.cooldowns[name] = tokenStats[name][1];
	}
	initCooldowns() {
		beeTypeStats[this.name].tokens.forEach((e) => {
			if (e.includes("#")) {
				e = e.substring(1);
			}
			e = textHandler("change", [e, "underscores"]);
			this.cooldowns[e] = tokenStats[e][1];
		});
	}
	decrementCooldowns() {
		Object.keys(this.cooldowns).forEach((e) => {
			if (this.cooldowns[e] > 0) this.cooldowns[e] -= 1;
		});
	}
}

class ConsumableCard extends Card {
	constructor(old, id, index, count = 1, subtype) {
		super(old, "consumable", subtype, index);
		if (old) return;
		this.id = id;
		this.count = count;
		this.limit = itemStats[id][1];
		this.max = itemStats[id][2];
		if (subtype == "consumable" || subtype == "drive") {
			this.cooldown = itemStats[id][3];
			this.duration = itemStats[id][4];
			if (this.duration != "N/A") {
				this.name = textHandler("change", [itemStats[id][5], "underscores"]);
				this.desc = itemStats[id][6];
				this.buff = itemStats[id][7];
				this.buff_desc = itemStats[id][8];
			}
		}
		if (subtype == "wax") {
			this.name = id;
			this.upgrade = itemStats[id][3];
			this.fail = itemStats[id][4];
			this.destroy = itemStats[id][5];
			this.rerolls = itemStats[id][6];
			this.clear = itemStats[id][7];
			this.desc = itemStats[id][8];
		}
		this.addCount(0);
	}

	getID() {
		return this.id;
	}

	setCount(value) {
		this.count = value;
	}
	addCount(value) {
		this.count += value;
		if (this.limit && this.max < this.count) {
			this.count = this.max;
		}
	}
	getCount() {
		return this.count;
	}

	getLimit() {
		return this.limit;
	}

	getMax() {
		return this.max;
	}

	getCooldown() {
		return this.cooldown;
	}

	getDuration() {
		return this.duration;
	}

	getName() {
		return this.name;
	}

	getDesc() {
		return this.desc;
	}

	getBuff() {
		return this.buff;
	}

	getBuffDesc() {
		return this.buff_desc;
	}

	useItem() {
		if (this.subtype == "wax") {

		} else {
			if (this.subtype == "drive"/* && not in robo challenge*/) return;
			
		}
	}
}

class TreatCard extends Card {
	constructor(old, id = "none", index, count = 1) {
		super(old, "treat", "none", index);
		if (old) return;
		this.id = id;
		this.count = count;
		this.name = textHandler("change", [id, "regular"]);
		this.bond = itemStats[id][1];
		this.gifted_chance = itemStats[id][2];
		this.req_fav = itemStats[id][3];
		this.mult = itemStats[id][4];
		this.mut = itemStats[id][5];
		this.radio = itemStats[id][6];
		this.mut_wo = itemStats[id][7];
		this.desc = itemStats[id][8];
	}

	getID() {
		return this.id;
	}

	setCount(value) {
		this.count = value;
	}
	addCount(value) {
		this.count += value;
	}
	getCount() {
		return this.count;
	}

	getName() {
		return this.name;
	}

	getDesc() {
		return this.desc;
	}

	getBond() {
		return this.bond;
	}

	getGifted() {
		return this.gifted_chance;
	}

	getReqFav() {
		return this.req_fav;
	}

	getMult() {
		return this.mult;
	}

	getMut() {
		return this.mut;
	}

	getRadio() {
		return this.radio;
	}

	getMutWO() {
		return this.mut_wo;
	}

	//count, index, gifted, mut, level
	useTreat(c, i, ug, um, ul) {
		let bee = game.cardList[i];
		let a = document.getElementById("shop_container").children[0].children;
		let index = 0;
		for (let j = 0; j < a.length; j++) {
			if (a[j].dataset.index == bee.getIndex()) {
				index = j;
				break;
			}
		}
		if (bee.getGifted() && ug) {
			textHandler("pollen_text", [a[index].getBoundingClientRect().x, a[index].getBoundingClientRect().y + a[index].getBoundingClientRect().height, textHandler("change", [bee.getName(), "regular"]) + " Bee is already gifted.", "#f0f0f0", "#f0f0f0", 1, 0, 10000, 0]);
			return;
		}
		let orig = [this.count, bee.getBond(), bee.getLevel()];
		let show = "";
		if (beeTypeStats[bee.getName()].favorite == this.id) {
			show = textHandler("change", [bee.getName(), "regular"]) + " Bee loves " + this.name + "!<br>";
		}
		if (bee.getType() != "bee") return;
		if (c > this.count) c = this.count;
		let g = bee.gifted ? 0 : (this.req_fav ? (beeTypeStats[bee.getName()].favorite == this.id ? 1 : 0) : 1);
		let m = bee.radioactive ? (this.mut > 0 ? 1 : 0) : (this.mut_wo > 0 ? 1 : 0);
		let r = bee.radioactive ? 0 : (this.radio > 0 ? 1 : 0);
		let rolls = [0, 0, 0];
		let lv = 0;
		let remaining = 0;
		//fix until gifted
		//fix multiple mutations and radioactive
		for (let j = 0; j < c; j++) {
			this.addCount(-1);
			bee.addBond(this.bond * (beeTypeStats[bee.name].favorite == this.id ? this.mult : 1));
			if (g) {
				if (Math.random() < this.gifted_chance[Object.keys(rarityColors).indexOf(bee.getRarity())]) {
					bee.setGifted(true);
					rolls[0] = 1;
					show += "The treat transformed " + textHandler("change", [bee.getName(), "regular"]) + " Bee into a gifted bee!<br>";
					if (ug) break;
				}
			}
			if (m) {
				if ((bee.getRadioactive() && Math.random() < this.mut) || (!bee.getRadioactive() && Math.random() < this.mut_wo)) {
					let mut = this.genMutation(bee.getLevel());
					bee.setMutation(mut);
					rolls[1] = 1;
					show += textHandler("change", [bee.getName(), "regular"]) + " Bee gained a mutation! (" + mut + ")<br>";
					if (um) break;
					m = 0;
				}
			}
			if (r) {
				if (Math.random() < this.radio) {
					bee.setRadioactive(true);
					rolls[2] = 1;
					show += textHandler("change", [bee.getName(), "regular"]) + " Bee became temporarily radioactive...<br>";
					r = 0;
				}
			}
			if (bee.getBond() >= bondLevels[bee.getLevel() - 1]) {
				bee.updateLevel();
				if (ul) break;
			}
			if ((ug && (rolls[0] || this.gifted_chance[Object.keys(rarityColors).indexOf(beeTypeStats[bee.getName()].rarity)] === 0)) && (um && (rolls[1] || (bee.getRadioactive() && this.mut === 0) || (this.mut_wo === 0 && !bee.getRadioactive())) && (rolls[2] || this.radio === 0))) {
				lv = 1;
				remaining = c - j - 1;
				break;
			}
		}
		if (lv == 1) {
			if (ul) {
				let cal = calcTreatsBond(i, bee.getBond(), bondLevels[bee.getLevel()]);
				if (cal == "None") {
					bee.addBond(remaining * this.bond * (beeTypeStats[bee.getName()].favorite == this.id ? this.mult : 1));
					this.addCount(-1 * remaining);
				} else {
					bee.addBond(cal * this.bond * (beeTypeStats[bee.getName()].favorite == this.id ? this.mult : 1));
					this.addCount(-1 * cal);
				}
			} else {
				bee.addBond(remaining * this.bond * (beeTypeStats[bee.getName()].favorite == this.id ? this.mult : 1));
				this.addCount(-1 * remaining);
			}
		}
		orig = [orig[0] - this.count, bee.getBond() - orig[1], orig[2]];
		show = "You fed " + orig[0] + " " + this.name + " to " + textHandler("change", [bee.getName(), "regular"]) + " Bee<br>" + show;
		show += textHandler("change", [bee.getName(), "regular"]) + " Bee bond increased by " + orig[1] + " (" + bee.getBond() + " / " + bondLevels[orig[2] - 1] + ")!<br>";
		if (orig[2] != bee.getLevel()) {
			show += textHandler("change", [bee.getName(), "regular"]) + " Bee advanced to level " + bee.getLevel();
		}
		textHandler("pollen_text", [a[index].getBoundingClientRect().x, a[index].getBoundingClientRect().y + a[index].getBoundingClientRect().height, show, "#f0f0f0", "#f0f0f0", 1, 0, 10000, 0]);
		if (this.count <= 0) {
			this.count = 0;

			/*
			let temp = 0;
			let a = document.getElementById("shop_container").children[1].children;
			for (let j = 0; j < a.length; j++) {
				if (this.index == a[j].dataset.cardID) {
					a[j].remove();
					temp = j;
				}
			}
			game.cardList.splice(this.index, 1);
			for (let j = temp; j < a.length; j++) {
				a[j].dataset.cardID = parseInt(a[j].dataset.cardID) - 1;
			}
			*/
		}
		cardHandler("update", document.getElementById("shop_container").children[1]);
		shopHandler("open");
		saveHandler("save");
	}

	genMutation(level) {
		let mutation = "";
		let c = 0;
		let lvl = level < 11 ? 1 : (level < 21 ? 2 : 3);
		let num = Math.random();
		for (let i = 0; i < mutationChances.length; i++) {
			c += mutationChances[i].chance;
			if (num < c) {
				let t = Math.floor(Math.random() * (mutationChances[i].range[lvl] - mutationChances[i].range[0] + 1) + mutationChances[i].range[0]);
				if (mutationChances[i].name[1] == "%") {
					mutation = mutationChances[i].name.slice(0, 1) + t + mutationChances[i].name.slice(1, 2) + " " + mutationChances[i].name.slice(2);
				} else {
					mutation = mutationChances[i].name.slice(0, 1) + t + " " + mutationChances[i].name.slice(1);
				}
				return mutation;
			}
		}
	}

	calcTreatsBond(i, start, finish) {
		let total = this.count * this.bond * (beeTypeStats[game.cardList[i].getName()].favorite == this.id ? this.mult : 1);
		if (start + total < finish) return "None";
		let count = finish - start;
		let final = count / total * this.count;
		return Math.ceil(pf(final));
	}
}

class GearCard extends Card {
	constructor(old, id) {
		super(old);
		if (old) return;
		this.id = id;
		this.cost = gearStats[type].cost;
		this.zone = gearStats[type].zone;
		this.type = gearStats[type].type;
		this.rarity = gearStats[type].rarity;
		this.stats = gearStats[type].stats;
		this.perks = gearStats[type].perks;
	}

	getId() {
		return this.id;
	}

	getCost() {
		return this.cost;
	}

	getZone() {
		return this.zone;
	}

	getType() {
		return this.type;
	}

	getRarity() {
		return this.rarity;
	}

	getStats() {
		return this.stats;
	}

	getPerks() {
		return this.perks;
	}
}

class Ability extends Data {
	constructor(old, type) {
		super(old);
		if (old) return;
		this.type = type;
	}

	getType() {
		return this.type;
	}

	getName() {
		this.setName();
		return this.name;
	}
	setName() {
		this.name = this.variety === undefined ? this.base : this.variety + "_" + this.base;
	}

	getBase() {
		return this.base;
	}
	setBase(value) {
		this.base = value;
	}

	getVariety() {
		return this.variety;
	}
	setVariety(value) {
		this.variety = value;
	}
}

class Buff extends Ability {
	constructor(old, base, stack = 1, duration = 0, variety) {
		super(old, "buff");
		if (old) return;
		this.base = base;
		this.stack = stack;
		this.duration = duration;
		this.variety = variety;
		this.name = variety === undefined ? base : variety + "_" + base;
		this.string = buffs[base][0];
		this.lines = this.string.split("#");
		this.show = "";
	}

	getStack() {
		if (Object.keys(timedBuffs).includes(this.base)) {
			return timedBuffs[this.base][0] + timedBuffs[this.base][1] * this.stack;
		}
		return this.stack;
	}
	setStack(value) {
		this.stack = value;
		this.getShow();
	}
	addStack(value) {
		this.stack += value;
		if (!this.getStackable() && value > 0) {
			this.stack = 1;
			this.setDuration(buffs[this.base][1]);
			return;
		}
		if (this.stack > buffs[this.base][3]) {
			this.stack = buffs[this.base][3];
		}
		if (this.getTimed()) {
			this.setDuration(Math.ceil(this.stack / (buffs[this.base][3] / buffs[this.base][4])));
		} else {
			this.setDuration(buffs[this.base][4]);
		}
	}

	getDuration() {
		return this.duration;
	}
	setDuration(value) {
		this.duration = value;
		this.getShow();
	}
	addDuration(value) {
		this.duration += value;
		if (this.duration > buffs[this.base][4]) {
			this.duration = buffs[this.base][4];
		}
		this.getShow();
	}

	getTimed() {
		return Object.keys(timedBuffs).includes(this.base);
	}

	getIndex() {
		return game.buffs.indexOf(this);
	}

	getStackable() {
		return buffs[this.base].length != 2;
	}

	getShow() {
		this.getLines();
		if (document.getElementById("buffs_infobox") && document.getElementById("buffs_infobox").dataset.buffID == game.buffs.indexOf(this)) {
			document.getElementById("buffs_infobox").innerHTML = this.show;
		} else {
			return this.show;
		}
	}

	getLines() {
		this.lines = this.string.split("#");
		this.evalLines();
	}

	evalLines() {
		let t = 0;
		for (let i = 0; i < this.lines.length; i++) {
			let l = this.lines[i];
			if (l.includes("*")) {
				this.lines[i] = l.substr(0, l.indexOf("*")) + (pf(buffs[this.base][1][t] + this.stack * buffs[this.base][2][t])) + l.substr(l.indexOf("*") + 1);
				l = this.lines[i];
				t += 1;
			}
			if (l.includes("^")) {
				this.lines[i] = l.substr(0, l.indexOf("^")) + textHandler("change", [this.variety, "regular"]) + l.substr(l.indexOf("^") + 1);
				l = this.lines[i];
			}
			if (l.includes("!")) {
				this.lines[i] = l.substr(0, l.indexOf("!")) + l.substr(l.indexOf("!") + 1);
				l = this.lines[i];
			}
			if (l.includes("@")) {
				let color;
				if (this.variety == "red") {
					color = "blue";
				} else {
					color = "red";
				}
				for (let j = 0; j < 2; j++) {
					this.lines[i] = this.lines[i].substr(0, this.lines[i].indexOf("@")) + textHandler("change", [color, "regular"]) + this.lines[i].substr(this.lines[i].indexOf("@") + 1);
				}
			}
			if (i == 0) {
				if (this.getName() != "APM" && this.getName() != "haste+") {
					this.show = textHandler("change", [this.getName(), "regular"]);
				} else {
					this.show = this.getName()[0].toUpperCase() + this.getName().slice(1);
				}
				if (!this.getTimed() && this.getStackable()) {
					this.show += (" (x" + this.stack + ")");
				}
			}
			this.show += "<br>" + this.lines[i];
		}
		this.show += "<br>" + this.getDuration().toString() + " Turns";
	}

	getSrc() {
		if (this.getName().includes("field_boost") || this.getName().includes("field_winds")) {
			return "images/buffs_foregrounds/" + this.getVariety() + "_field.png";
		} else if (this.getName().includes("jelly_bean")) {
			return "images/buffs_foregrounds/" + this.getName() + ".png";
		} else if (this.getName().includes("corruption")) {
			return "images/buffs_foregrounds/field_corruption.png";
		}
		return "images/buffs_foregrounds/" + this.getName() + ".png";
	}

	getPct() {
		if (this.getTimed() || this.base.includes("aura")) {
			return (this.stack / buffs[this.base][3]);
		} else if (!this.getStackable()) {
			return (this.duration / buffs[this.base][1]);
		} else {
			return (this.duration / buffs[this.base][4]);
		}
	}

	calcBuff() {
		let names = [];
		for (let i = 0; i < this.lines.length; i++) {
			let action = this.lines[i].slice(0, 1);
			if (action != "+" && action != "x") continue;
			let temp = (this.lines[i][this.lines[i].indexOf(" ") - 1] == "%") ? "%" : " ";
			let num = parseFloat(this.lines[i].slice(1, this.lines[i].indexOf(temp)));
			let pct = (temp == "%") ? 0.01 : 1;
			let name = textHandler("change", [this.lines[i].slice(this.lines[i].indexOf(" ") + 1), "underscores"]);
			if (name == "capacity" && (action == "x" || temp == "%")) name = "capacity_multiplier";
			names.push(name);
			/*
			if (name == "unique_instant_conversion") {
				if (Object.keys(game.stats).includes(name)) {
					if (this.getName() in game.stats[name]) {
						game.stats[name][this.getName()] += num;
					} else {
						game.stats[name][this.getName()] = num;
					}
				} else {
					game.stats[name] = {};
					game.stats[name][this.getName()] = num;
				}
				continue;
			}
			*/
			if (name == "unique_instant_conversion") {
				if (!Object.keys(game.stats).includes(name)) {
					game.stats[name] = {};
				}
				game.stats[name][this.getName()] = num;
				continue;
			}
			if (!Object.keys(game.stats).includes(name)) {
				game.stats[name] = {};
				let base = baseStats[name] * (nonPctStats.includes(name) ? 1 : 100);
				if (nonPctStats.includes(name)) {
					game.stats[name]["base"] = [baseStats[name] * base, 100, 1];
				} else {
					game.stats[name]["base"] = [100, baseStats[name] * base, 1];
				}
			}
			if (action == "x") {
				game.stats[name][this.getName()] = [0, 0, num];
			} else if (temp == "%") {
				game.stats[name][this.getName()] = [0, num, 1];
			} else {
				game.stats[name][this.getName()] = [num, 0, 1];
			}
			game.stats[name]["calc"] = game.stats[name]["base"];
			Object.entries(game.stats[name]).forEach(([key, array]) => {
				if (key != "base" && key != "calc") {
					game.stats[name]["calc"] = game.stats[name]["calc"].map((num, index) => {
						if (index == 2) {
							return pf(num * array[2]);
						} else {
							return pf(num + array[index]);
						}
					});
				}
			})
			game.stats[name]["calc"][3] = Math.round(game.stats[name]["calc"][0] * game.stats[name]["calc"][1] / 100 * game.stats[name]["calc"][2]);
		}
		return names;
	}

	removeBuff() {
		let names = [];
		for (let i = 0; i < this.lines.length; i++) {
			//let action = this.lines[i].slice(0, 1);
			//if (action != "+" && action != "x") continue;
			//let temp = (this.lines[i][this.lines[i].indexOf(" ") - 1] == "%") ? "%" : " ";
			//let num = parseFloat(this.lines[i].slice(1, this.lines[i].indexOf(temp)));
			//let pct = (temp == "%") ? 0.01 : 1;
			let name = textHandler("change", [this.lines[i].slice(this.lines[i].indexOf(" ") + 1), "underscores"]);
			//if (name == "capacity" && (action == "x" || temp == "%")) name = "capacity_multiplier";
			names.push(name);
			if (name == "capacity") name = "capacity_multiplier";
			delete game.stats[name][this.getName()];
		}
		return names;
	}

	toString() {
		return this.name;
	}
}

class Instant extends Ability {
	constructor(base, variety) {
		super(undefined, "instant");
		this.base = base;
		this.variety = variety;
		this.name = variety === undefined ? base : variety + "_" + base;
	}
}

class Mob extends Data {
	constructor(old, type, hp, damage, level, respawn, despawn, speed, field, id, defense, identifier, gifted = false) {
		super(old);
		if (old) return;
		this.type = type;
		this.hp = hp;
		this.damage = damage;
		this.level = level;
		this.respawn = respawn;
		this.despawn = despawn;
		this.speed = speed;
		this.gifted = gifted;
		this.field = field;
		this.id = id;
		this.defense = defense;
		this.identifier = identifier;
		this.show = "";
	}

	getType() {
		return this.type;
	}

	getHP() {
		return this.hp;
	}
	addHP(value) {
		this.hp += value;
	}
	setHP(value) {
		this.hp = value;
	}
	resetHP() {
		if (this.type == "ladybug") {
			this.hp = 4 + this.level * 8;
		} else if (this.type == "rhino_beetle") {
			this.hp = 4 + this.level * 6;
		} else if (this.type == "mantis") {
			this.hp = 35 + this.level * 25;
		} else if (this.type == "wild_windy_bee") {
			this.hp = this.level ** 2 * 250 + 250;
		} else if (this.type == "rogue_vicious_bee") {
			this.hp = this.level * (this.level + 1) / (this.gifted ? 1 : 2);
		} else if (this.type == "stick_bug") {
			this.hp = 125 * this.level ** 3 + 1500 * this.level ** 2 - 2375 * this.level + 2000;
		} else if (this.type == "stick_nymph") {
			this.hp = 10 * this.level ** 2 - 10 * this.level + 50;
		} else if (this.type == "ant" || this.type == "fire_ant" || this.type == "flying_ant") {
			this.hp = 1.5 * this.level ** 2 + 14 * this.level;
		} else if (this.type == "army_ant") {
			this.hp = 3 * this.level ** 2 + 14 * this.level;
		} else if (this.type == "giant_ant") {
			this.hp = 100 * (1.5 * this.level ** 2 + 14 * this.level);
		} else {
			this.hp = mobTypeStats[this.type].hp;
		}
	}

	getDamage() {
		return this.damage;
	}
	setDamage(value) {
		if (this.type == "wild_windy_bee") {
			this.damage = this.level ** 2 + 20;
		} else if (this.type == "rogue_vicious_bee") {
			this.damage = (this.gifted ? 10 : 0) + 40;
		} else {
			this.damage = value;
		}
	}

	getLevel() {
		return this.level;
	}
	addLevel(value) {
		this.level += value;
	}
	setLevel() {
		if (this.type == "ladybug") {
			this.level = game.baseStats.field == "mushroom" ? 1 : game.baseStats.field == "clover" ? 2 : 3;
		} else if (this.type == "rhino_beetle") {
			this.level = game.baseStats.field == "blue_flower" ? 1 : game.baseStats.field == "clover" ? 2 : game.baseStats.field == "bamboo" ? 3 : 5;
		} else if (this.type == "mantis") {
			this.level = game.baseStats.field == "pineapple" ? 4 : 5;
		} else {
			this.level = mobTypeStats[this.type].level;
		}
	}

	getRespawn() {
		return this.respawn;
	}
	addRespawn(value) {
		this.respawn += value;
	}
	setRespawn(value) {
		this.respawn = value;
	}
	resetRespawn() {
		this.respawn = mobTypeStats[this.type].respawn;
	}

	getDespawn() {
		return this.despawn;
	}
	addDespawn(value) {
		this.despawn += value;
	}
	setDespawn(value) {
		this.despawn = value;
	}
	resetDespawn() {
		this.despawn = mobTypeStats[this.type].despawn;
	}

	getSpeed() {
		return this.speed;
	}
	setSpeed(value) {
		this.speed = speed;
	}

	getField() {
		return this.field;
	}

	getID() {
		return this.id;
	}

	getDefense() {
		return this.defense;
	}

	getIden() {
		return this.identifier;
	}

	getStats() {
		return {
			"type": this.type,
			"hp": this.hp,
			"damage": this.damage,
			"level": this.level,
			"respawn": this.respawn,
			"despawn": this.despawn,
			"speed": this.speed,
			"id": this.id,
			"field": this.field,
			"defense": this.defense,
			"gifted": this.gifted
		};
	}

	getShow() {
		this.getLines();
		return this.show;
	}

	getLines() {
		let lines = [];
		lines.push(textHandler("change", [this.type, "regular"]));
		lines.push("Level " + this.level);
		lines.push("HP - " + this.hp);
		lines.push("Damage - " + this.damage);
		lines.push("Speed - " + this.speed);
		lines.push("Hit Player Chance - " + Math.round(this.speed / (5 * calcStat("player_movespeed")) * 1000) / 10 + "%");
		lines.push("Defense - " + this.defense);
		this.show = lines[0];
		for (let i = 1; i < lines.length; i++) {
			this.show += "<br>";
			this.show += lines[i];
		}
	}
}






