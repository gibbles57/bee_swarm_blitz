/* fun facts
started june 15, 2025 originally as a clicker/idle game, then transitioned into deckbuilder
inspires by bss (naturally), slay the spire, balatro
currently 736 images, mostly from bss wiki and onett's roblox inventory
biggest debugging issue took 16 console.logs to solve, damn animations
*/
/*
TODO LIST
instas
create player with hp and whatnot
make field stats in game - flowers level, fuzzy etc
custom background particle colors? - all settings stuff
check for quest completion and update in real time
maybe remove abilities from hive and make attacking bees have attacking abilities
finally change card size to % based on height and add setting to change size
set everything to hidden at beginning, show menu or sm
after round ends:
	hide containers
	player picks next quest
	show all bee icons top left, cycle through card types bottom left (treats, wax/beequips, eggs, jelly)
	shop on right:
		shows honey cost below card and mats cost below honey
		rows of 6?
		0 bee zone: noob - 12, misc - 6, tent - 11 total 29
		5 bee zone: blue - 10, red - 10 total 20
		10 bee zone: pro - 18, dapper - 11, bean 1 total 29
		15 bee zone: ace - 9, robo - 6 total 15
		25 bee zone: mount - 11 total 11
		35 bee zone: petal - 3, coconut - 3, gummy - 3 total 9
		-> noob 5T 4B 1M 1B 1B 0G 0G 0P 12
		-> pro 5T 4B 1M 1B 1B 4G 1G 1P 18
		-> blue 2T 1B 2M 0B 0B 3G 0G 2P 10 with mask
		-> red 2T 1B 2M 0B 0B 3G 0G 2P 10 with mask
		-> mount 3T 1B 1M 1B 1B 0G 1G 0P slot 9 + ticket 10 + eviction? 11 + field booster 12
		-> tent 4egg 6event 1star 11
		-> basic egg, jelly, treat, gumdrop, stinger, ant 6
			for eggs, if bee count less than slot count
		-> petal/coconut/gummy 2T 1B 2M 2B 2B 0G 0G 1P 9 shrine 10 condenser 11
		-> ace 5sprinkler 1M 1B 2G 9 moon amulet 10
		-> dapper 5planter 6beequip 11 + bean 12
		-> robo 4drives 1digi 5 + robo pass 6
		//maybe one from each shop? bias for shops in current zone, maybe 6 current zone 6 random?
		first row: 6 zone cards
		second row: 6 non zone cards
		third row: special zone things
			0: wealth clock, treat shop, basic egg shop 3
			5: red/blue boosters, blub straw disps, gumdrop shop 5
			10: memory match, bean shop, moon amu, beequip shop 4
			15: memory match, blender, sprout 3
			20: ant disp/shop, stinger shop, glue dist 4
			25: ticket shop, booster 2
			30: memory match, robo disp, nectar pot 3
			35: memory match, shrine, condenser, coco disp 4
		last row: 6 bee cards
		new?
		first row: 6 up to zone cards
		second row: random up to zone specials
		third row: 6 bee cards
	maybe rbc-like upgrades? kinda iffy
*/

var game = {
	menu: "none",
	baseStats: {
		"honey": 0,
		"honey_show": [],
		"pollen": 0,
		"pollen_show": [],
		"tickets": 0,
		"tickets_show": [],
		"field": "sunflower",
		"field_queue": "none",
		"bee_count": 0,
		"equipped": {
			"tool": "",
			"bag": "",
			"mask": "",
			"guard_left": "",
			"guard_right": "",
			"belt": "",
			"boots": "",
			"glider": ""
		}
	},
	cardList: [],
	drawPile: [],
	discardPile: [],
	hand: [],
	hiveBees: [],
	fieldBees: [],
	mobBees: [],
	round: 0,
	turn: 1,
	tutorial: [0, -1, "none", "hidden"],
	speed: 1,
	buffs: [],
	stats: {},
	miscStats: {
		"capacity": 200,
		"conversion_links": 0,
		//source, amount
		"unique_instant_conversion": {}
	},
	settings: {
		"fieldPct": 1
	},
	mobStats: {},
	questStats: {
		"count": 2,
		"scaling": 0.1,
		//pollen, honey, goo, convert, mob
		"type_biases": [0.8, 0.1, 0, 0.1],
		"current": [],
		"options": []
	},
	tokenCooldowns: {},
	permUpgrades: {},
	date: 0,
	shopStats: {
		"tab": "treat",
		"current": [],
		//zone cards, bee cards
		"unlocked": [2, 2],
		"bought": [],
		"rerolls": [3, 3]
	}
}
var loadedImages = [];
var elemDragging = 0;
var testMode = 1;

const template = document.getElementById("card_template");

window.addEventListener('resize', function(event) {
	particlesJS('particles-js', particlesData);
	cardHandler("set_size", "all");
	buffHandler("resize");
	fieldHandler("resize");
	dragHandler("update");
}, true);

function init() {
	statHandler("reset");
	bearHandler("create", "black");
	fieldHandler("set");
	fieldHandler("gen");
	mobHandler("setup");
	dragHandler("update");
}

function initSaved() {
	bearHandler("create", "black");
	fieldHandler("set");
	fieldHandler("gen");
	mobHandler("create");
	statHandler("reset");
	dragHandler("update");
	if (game.baseStats.field_queue != "none") fieldHandler("pre", 1);
}

function cardHandler(action, data) {
	if (action == "gen") {
		return genCard(data[0], data[1], data[2], data[3]);
	} else if (action == "draw") {
		drawToHand(data);
	} else if (action == "replenish") {
		replenishDeck();
	} else if (action == "shuffle") {
		shuffleDeck();
	} else if (action == "delete") {
		deleteCard(data);
	} else if (action == "update") {
		updateCardHolder(data);
	} else if (action == "set_size") {
		setSize();
	} else if (action == "get_index") {
		return getCardIndex(data);
	} else if (action == "send_discard") {
		sendToDiscard();
	} else if (action == "hand") {
		spawnHandCard(data[0], data[1]);
	} else if (action == "show") {
		showHand();
	}

	function genCard(type, subtype, name, count, shop) {
		if (type == "bee") {
			let b = new BeeCard(undefined, name, game.cardList.length);
			if (shop == 1) {
				return b;
			} else {
				game.baseStats.bee_count += 1;
				game.cardList.push(b);
				game.discardPile.push(b.getIndex());
			}
		} else if (type == "consumable" || type == "treat") {
			for (let i = 0; i < game.cardList.length; i++) {
				if (game.cardList[i].getSubtype() != subtype) continue;
				if (game.cardList[i].getID() == name) {
					game.cardList[i].addCount(count);
					return;
				}
			}
			if (count < 0) return;
			let b;
			if (type == "consumable") {
				b = new ConsumableCard(undefined, name, game.cardList.length, count, subtype);
				game.discardPile.push(b.getIndex());
			} else if (type == "treat") {
				b = new TreatCard(undefined, name, game.cardList.length, count);
			}
			game.cardList.push(b);
		} else if (type == "gear") {
			return new GearCard(undefined, name);
		}
	}

	function drawToHand(num) {
		let temp = 0;
		for (let i = 0; i < game.cardList.length; i++) {
			if (game.cardList[i].getType() == "bee" || game.cardList[i].getType() == "consumable") {
				temp += 1;
			}
		}
		if (num > temp - game.hand.length) {
			num = temp - game.hand.length;
		}
		let start = game.hand.length;
		for (let i = 0; i < num; i++) {
			if (game.drawPile[0]) {
				game.hand.push(game.drawPile.shift());
			} else {
				replenishDeck();
				updateCardHolder(document.getElementById("card_holder"));
				if (game.drawPile.length == 0) return;
				game.hand.push(game.drawPile.shift());
			}
		}
		/*
		let i = 0;
		updateCardHolder();
		let s = setInterval(function() {
			if (i >= num) {
				clearInterval(s);
				return;
			}
			spawnHandCard(i + start);
			i++;
		}, 200 / game.speed);
		*/
		//showHand();
	}

	async function showHand() {
		for (let i = 0; i < game.hand.length; i++) {
			await sleep(200);
			spawnHandCard(game.hand[i]);
		}
	}

	function spawnHandCard(i, location) {
		if (location === undefined) location = document.getElementById("card_holder");
		const a = template.cloneNode(true);
			a.removeAttribute("id");
			a.dataset.cardID = i;		
			a.onmouseenter = function() {
				if (elemDragging) return;
				a.dataset.bottom = a.style.bottom;
				a.style.bottom = parseInt(a.style.height) * 0.25 + 3 + (location.id != "card_holder" ? 30 : 0) + "px";
				a.dataset.rotate = a.style.rotate;
				a.style.rotate = "0deg";
				a.style.scale = "1.5";
				let b = beeHandler("relating", a.dataset.cardID);
				if (b != "none") {
					document.getElementById(b + "_container").children[0].children[game[b + "Bees"].indexOf(parseInt(a.dataset.cardID))].style.scale = "1.5";
				}

			}
			a.onmouseleave = function() {
				if (a.parentElement != location) return;
				a.style.bottom = a.dataset.bottom;
				a.style.rotate = a.dataset.rotate;
				a.style.scale = "1.0";
				let b = beeHandler("relating", a.dataset.cardID);
				if (b != "none") {
					document.getElementById(b + "_container").children[0].children[game[b + "Bees"].indexOf(parseInt(a.dataset.cardID))].style.scale = "1.0";
				}
				updateCardHolder(location);
			}
			location.append(a);
			styleCard(a);			
			setTimeout(function() {
				a.style.transition = "all 0.3s ease, left 0s, top 0s, margin 0s";
			}, 20);
			dragHandler(undefined, a);
			
			setCardSize(location);
	}

	function replenishDeck() {
		if (game.discardPile.length == 0) return;
		while (game.discardPile.length > 0) {
			game.drawPile.push(game.discardPile.shift());
		}
		shuffleDeck();
	}

	function shuffleDeck() {
		if (game.drawPile.length < 2) return;
    	for (let i = game.drawPile.length - 1; i > 0; i--) {
    	    let j = Math.floor(Math.random() * (i + 1));
    	    let temp = game.drawPile[i];
    	    game.drawPile[i] = game.drawPile[j];
    	    game.drawPile[j] = temp;
    	}
    	for (let i = 0; i < game.drawPile.length; i++) {
    		let b = game.drawPile[i];
    	}
	}

	function deleteCard(index) {
		game.cardList.splice(index, 1);
		for (let i = index; i < game.cardList.length; i++) {
			game.cardList[i].setIndex(i - 1);
		}
	}

	function updateCardHolder(location) {
		let p = window.innerWidth;
			const c = location.children;
			let r = 50;
			for (let i of c) {
				if (i.dataset.cardID && game.cardList[i.dataset.cardID].getType() == "treat" && game.cardList[i.dataset.cardID].getCount() == 0) {
					i.style.visibility = "hidden";
					i.style.display = "none";
				}
			}
			for (let i of c) {
				if (i.dataset.cardID && game.cardList[i.dataset.cardID].getType() == "treat" && game.cardList[i.dataset.cardID].getCount() == 0) {
					i.style.margin = "0px";
					continue; 
				}
				let len = c.length;
				for (let j of c) {
					if (j.style.display == "none") len -= 1;
				}
				i.style.margin = "0px " + (0 - (location.id != "card_holder" ? len/* ** 1.3*/ * 2 : len)) + "px";
			}
			if (location.id == "card_holder") {
				for (let i of c) {
					let x = (i.getBoundingClientRect().x + i.getBoundingClientRect().width / 2) - window.innerWidth / 2;
					i.style.bottom = r * r * Math.cos(x / (r * r)) - (r * r) + "px";
					i.style.rotate = (-1 * (Math.acos(x / (r * r)) * 180 / Math.PI + 270)) + 360 + "deg";
				}
			} else {
				for (let i of c) {
					if (i.dataset.cardID && game.cardList[i.dataset.cardID].getType() == "treat" && game.cardList[i.dataset.cardID].getCount() == 0) continue; 
					i.style.bottom = "30px";
				}
			}
		changeCards(location);
	}

	function changeCards(location) {
		for (let j = 0; j < location.children.length; j++) {
			styleCard(location.children[j]);
		}
	}

	function styleCard(a) {
			if (a.classList != "card") return;
			const b = game.cardList[parseInt(a.dataset.cardID)];
			const d = a.children;
			if (b.getType() == "bee") {
				d[0].innerHTML = (b.getGifted() ? "Gifted<br>" : "") + textHandler("change", [b.getName(), "regular"]) + " Bee";
				d[0].style.color = rarityColors[b.getRarity()];
				d[1].src = "images/bee_models/" + (b.getName() + (b.getGifted() ? "_gifted" : "")) + ".png";
				d[2].style.color = rarityColors[b.getRarity()];
				d[2].innerHTML = textHandler("change", [b.getColor(), "regular"]) + " " + textHandler("change", [b.getRarity(), "regular"]);
				d[3].children[1].innerHTML = textHandler("change", [b.getBeequip()[0], "regular"]);
				d[3].children[4].innerHTML = textHandler("change", [b.getMutation(), "regular"]);
				d[4].innerHTML = "Level " + b.getLevel();
			} else if (b.getType() == "consumable" || b.getType() == "treat") {
				if (b.getCount() == 0) {
					return;
				}
				a.style.display = "inline";
				d[0].innerHTML = textHandler("change", [b.getName(), "regular"]);
				d[1].src = "images/items/" + b.getID() + ".png";
				d[1].style.width = "50%";
				d[1].style.height = "43px";
				d[1].style.translate = "-50% 30%";
				d[3].innerHTML = b.getDesc();
				d[3].style.overflow = "visible";
				d[3].style.fontSize = "9px";
				while (d[3].scrollHeight > parseInt(a.style.height) * 0.36) {
					d[3].style.fontSize = parseInt(d[3].style.fontSize) - 1 + "px";
				}
				if (b.getType() == "consumable") {
					d[4].innerHTML = "" + b.getCount() + (b.getLimit() ? "/" + b.getMax() : "");
				} else {
					d[4].innerHTML = b.getCount();
				}
			}
			a.style.visibility = "inherit";
	}
		
	function setCardSize(location) {
			const c = location.children;
			for (let i of c) {
				//i.style.height = window.innerHeight / 4 + "px";
				i.style.height = "120px";
				//i.style.width = window.innerHeight / 6 + "px";
				i.style.width = "80px";
				i.style.borderRadius = window.innerHeight / 50 + "px";
				if (game.cardList[parseInt(i.dataset.cardID)].getType() != "consumable" && game.cardList[parseInt(i.dataset.cardID)].getType() != "treat") {
					while (i.children[3].children[1].getBoundingClientRect().width > i.getBoundingClientRect().width * 0.9) {
						i.children[3].children[1].style.fontSize = parseInt(i.children[3].children[1].style.fontSize) - 1 + "px";
					}
					while (i.children[3].children[4].getBoundingClientRect().width > i.getBoundingClientRect().width * 0.9) {
						i.children[3].children[4].style.fontSize = parseInt(i.children[3].children[4].style.fontSize) - 1 + "px";
					}
				}
				i.style.border = "3px solid " + cardColors[game.cardList[i.dataset.cardID].getType()];
				i.style.padding = "3px";
			}
			updateCardHolder(location);
	}

	function setSize() {
		setCardSize(document.getElementById("card_holder"));
		setCardSize(document.getElementById("shop_container").children[1]);
	}

	function getCardIndex(index) {
		for (let i = 0; i < game.hand.length; i++) {
			if (game.hand[i].getIndex() == index) {
				return i;
			}
		}
	}

	function sendToDiscard() {
		let temp = game.hand.length;
		for (let i = 0; i < temp; i++) {
			game.discardPile.push(game.hand.splice(0, 1)[0]);
		}
		temp = game.drawPile.length;
		for (let i = 0; i < temp; i++) {
			game.discardPile.push(game.drawPile.splice(0, 1)[0]);
		}
	}}

function bearHandler(action, data) {
	const c = document.getElementById("bear_container").children;
	let text = "";
	if (action == "create") {
		c[0].src = "images/" + data + "_bear.png";
		c[7].onclick = function(){nextDialogue(game.tutorial[1]);};
		c[7].style.visibility = "inherit";
		game.tutorial[0] = 1;
	} else if (action == "show_button") {
		showButton();
	} else if (action == "hide_button") {
		hideButton();
	} else if (action == "set") {
		if (game.tutorial[1] == -1) {
			bearHandler("create", "black");
		} else {
			c[7].style.visibility = game.tutorial[3];
			c[6].style.fontSize = bearTexts[game.tutorial[1]][0] + "px";
			if (game.tutorial[2] != "none") c[7].innerHTML = game.tutorial[2];
			text = bearTexts[game.tutorial[1]][1];
			showDialogue(1);
		}
	} else if (action == "quest") {
		questDialogue();
	}
	
	
	function nextDialogue() {
		c[6].innerHTML = "";
		hideButton();
		game.tutorial[1] += 1;
		text = bearTexts[game.tutorial[1]][1];
		showDialogue(0);
	}

	async function showDialogue(f) {
		if (game.tutorial[1] == 2 || game.tutorial[1] == 4) {
			game.tutorial[3] = "hidden";
		} else {
			game.tutorial[3] = "visible";
		}
		let i = 0;
		let t = 1;
		let temp = 0;
		c[6].style.fontSize = bearTexts[game.tutorial[1]][0] + "px";
		//let s = setInterval(function() {
		if (!f) {
				if (game.tutorial[1] == 2) {
					if (testMode == 0) {
						cardHandler("gen", ["bee", "none", "basic"]);
						cardHandler("gen", ["bee", "none", "basic"]);
						cardHandler("gen", ["bee", "none", "cool"]);
					} else {
						cardHandler("gen", ["bee", "none", "precise"]);
						game.cardList[0].setGifted(true);
						cardHandler("gen", ["bee", "none", "precise"]);
						cardHandler("gen", ["bee", "none", "cool"]);
						cardHandler("gen", ["treat", undefined, "pineapple", 1000]);
						cardHandler("gen", ["treat", undefined, "strawberry", 100]);
						cardHandler("gen", ["treat", undefined, "star_treat", 10000]);
						cardHandler("gen", ["treat", undefined, "blueberry", 10000]);
						cardHandler("gen", ["treat", undefined, "treat", 10000]);
						cardHandler("gen", ["treat", undefined, "sunflower_seed", 10000]);
						cardHandler("gen", ["treat", undefined, "neonberry", 10000]);
						cardHandler("gen", ["treat", undefined, "atomic_treat", 10000]);
						cardHandler("gen", ["treat", undefined, "bitterberry", 10000]);
						cardHandler("gen", ["treat", undefined, "moon_charm", 10000]);
						cardHandler("gen", ["treat", undefined, "gingerbread_bear", 10000]);
						cardHandler("gen", ["treat", undefined, "aged_gingerbread_bear", 10000]);
						cardHandler("gen", ["consumable", "consumable", "blue_extract", 10]);
					}
					cardHandler("draw", 5);
					saveHandler("save");
					cardHandler("show");
				}
			}
		for (let j = 0; j < 1000; j++) {
			if (!f) await sleep(testMode ? 1 : 50);
			
			if (text[i]) {
				if (text[i] == "<") {
					c[6].innerHTML += "<br>";
					i += 3;
				} else {
					if (i == bearTexts[game.tutorial[1]][1].indexOf(bearTexts[game.tutorial[1]][t + 2], temp)) {
						c[6].innerHTML += "<span style='color: " + bearTexts[game.tutorial[1]][t + 1] + ";'>" + text.slice(i, i + 1) + "</span>";
					} else if (bearTexts[game.tutorial[1]][t + 2] && i > bearTexts[game.tutorial[1]][1].indexOf(bearTexts[game.tutorial[1]][t + 2], temp) && i < bearTexts[game.tutorial[1]][1].indexOf(bearTexts[game.tutorial[1]][t + 2], temp) + bearTexts[game.tutorial[1]][t + 2].length) {
						c[6].innerHTML = c[6].innerHTML.slice(0, -7) + text[i] + "</span>";
						if (bearTexts[game.tutorial[1]][t + 2] && i + 1 >= bearTexts[game.tutorial[1]][1].indexOf(bearTexts[game.tutorial[1]][t + 2], temp) + bearTexts[game.tutorial[1]][t + 2].length) {
							t += 2;
							temp = i;
						}
					} else {
						c[6].innerHTML = c[6].innerHTML + text[i];
					}
				}
				/*
				if (text[i] == "<") {
					c[6].innerHTML += "<br>";
					i += 3;
				} else {
					if (i == bearTexts[game.tutorial[1]][t + 2]) {
						c[6].innerHTML += "<span style='color: " + bearTexts[game.tutorial[1]][t + 1] + ";'>" + text.slice(i, i + 1) + "</span>";
					} else if (i > bearTexts[game.tutorial[1]][t + 2] && i < bearTexts[game.tutorial[1]][t + 2] + bearTexts[game.tutorial[1]][t + 3]) {
						c[6].innerHTML = c[6].innerHTML.slice(0, -7) + text[i] + "</span>";
						if (i + 1 >= bearTexts[game.tutorial[1]][t + 2] + bearTexts[game.tutorial[1]][t + 3]) {
							t += 3;
						}
					} else {
						c[6].innerHTML = c[6].innerHTML + text[i];
					}
				}
				*/
			} else {
				if (f) break;
				if (game.tutorial[1] != 2 && game.tutorial[1] != 4) {
					showButton();
				}
				//cardHandler("show");
					//cardHandler("draw", 3);
								break;
				//clearInterval(s);
			}
			if (i == 48 && game.tutorial[1] == 0) {
				c[3].style.animation = "bear_wave 2.5s ease-in-out 1";
				c[7].innerHTML = "Continue";
			} else if (game.tutorial[1] == 2 && !f) {
				if (i == 94) {
					document.getElementById("hive_container").style.transition = "opacity 4s";
					document.getElementById("hive_container").style.opacity = 1;
					setTimeout(function() {
						document.getElementById("hive_container").style.transition = "opacity 0s";
					}, 40)
				} else if (i == 113) {
					document.getElementById("field_container").style.transition = "opacity 4s";
					document.getElementById("field_container").style.opacity = 1;
					setTimeout(function() {
						document.getElementById("field_container").style.transition = "opacity 0s";
					}, 40);
				} else if (i == 137) {
					document.getElementById("mob_container").style.transition = "opacity 4s";
					document.getElementById("mob_container").style.opacity = 1;
					setTimeout(function() {
						document.getElementById("mob_container").style.transition = "opacity 0s";
					}, 40);
				}
			} else if (game.tutorial[1] == 4 && i == 180) {
				document.getElementById("turn_end_button").style.visibility = "visible";
			}
			i++;
		//}, f ? 0 : testMode ? 1 : 50 / game.speed);
		}
		if (game.tutorial[0]) game.tutorial[2] = c[7].innerHTML;
	}

	function questDialogue() {
		c[6].style.fontSize = "14px";
		text = "Please select a quest for round " + game.round + ".";
		showDialogue();
		if (game.permUpgrades.rerolls) {
			c[7].innerHTML = "Reroll Quests";
			showButton();
		} else {
			hideButton();
		}
	}

	function hideButton() {
		game.tutorial[3] = "hidden";
		c[7].style.pointerEvents = "none";
		c[7].disabled = true;
		c[7].style.transition = "opacity 0s";
		c[7].style.opacity = 0;
		setTimeout(function() {
			c[7].style.transition = "opacity 4s";
		}, 10);
	}

	function showButton() {
		game.tutorial[3] = "inherit";
		c[7].style.opacity = 1;
		setTimeout(function() {
			c[7].disabled = false;
			c[7].style.pointerEvents = "auto";
		}, 500 / game.speed);
	}}

function beeHandler(action, data) {
	if (action == "end_turn") {
		return turnEnd();
	} else if (action == "relating") {
		return getRelatingIndex(data);
	}

	async function turnEnd() {
		return new Promise(async (resolve) => {
			let p = document.getElementById("resources_pollen").getBoundingClientRect();
			let pText = document.getElementById("resources_pollen");
			let h = document.getElementById("resources_honey").getBoundingClientRect();
			let hText = document.getElementById("resources_honey");
			let honeyBase = game.baseStats.honey;
			let pollenBase = game.baseStats.pollen;
			let pollenShow = [];
			let honeyShow = [];
			let attackShow = [];
			let queue = {
				"hive": [],
				"field": [],
				"mob": []
			};
			let attacks = [];
			let cats = ["hive", "field", "mob"];
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < game[cats[i] + "Bees"].length; j++) {
					queue[cats[i]].push(game[cats[i] + "Bees"][j]);
				}
			}
			//do all this for buffs at turn start
			for (let i = 0; i < game.hiveBees.length; i++) {
				let d = statHandler("get_pol", ["convert", game.cardList[game.hiveBees[i]]]);
				if (d == 0) break;
				game.baseStats.pollen -= d;
				game.baseStats.honey += d;
				pollenShow.push(-d);
				honeyShow.push(d);
			}
			for (let i = 0; i < game.fieldBees.length; i++) {
				let d = statHandler("get_pol", ["pollen", game.cardList[game.fieldBees[i]]]);
				if (d[0] >= game.miscStats.capacity * calcStat("capacity_multiplier")) break;
				game.baseStats.pollen += d[0];
				pollenShow.push(d);
				//add honey from ic here
			}
			for (let i = 0; i < game.mobBees.length; i++) {
				let actives = [];
				Object.keys(game.mobStats.actives).forEach((e) => {
					if (game.mobStats.actives[e].respawn == 0) {
						actives.push(game.mobStats.actives[e]);
					}
				});
				let mob = actives[Math.floor(Math.random() * actives.length)];
				if (mob === undefined) break;
				let mobPos;
				let mobElem;
				for (let j of document.getElementById("mob_container").children[1].children) {
					if (j.dataset.mobID == mob.getIden()) {
						mobPos = j.getBoundingClientRect();
						mobElem = j;
					}
				}
				let bee = game.cardList[game.mobBees[i]];
				let beePos = document.getElementById("mob_container").children[0].children[i].getBoundingClientRect();
				let d = statHandler("get_pol", ["attack", bee, mob]);
				let a = [d, mob, bee, beePos, mobPos, mobElem];
				attackShow.push(a);
				let b = mobHandler("attack", a);
				if (b == "end") {
					break;
				} else if (b == "kill" || b == "continue") {
					attackShow[attackShow.length - 1].push(b);
				}
			}
			saveHandler("save");
			for (let i = 0; i < Math.min(game.hiveBees.length, honeyShow.length + 1); i++) {
				let elem = document.getElementById("hive_container").children[0].children[i];
				let e = elem.getBoundingClientRect();
				await sleep(250);
				elem.style.scale = "1.5";
				if (elem.children[1]) elem.children[1].style.scale = 2 / 3;
				await sleep(250);
				let a = honeyShow[i];
				textHandler("pollen_text", [e.x + e.width / 2, e.y + e.height / 2, a ? "+" + a : "Collect pollen to convert.", "#fec650", "#fec650", 1, 0]);
				if (a) {
					createAnimatedCurve(p.x + p.width / 2, p.y + p.height / 2 + 20, h.x + h.width / 2, h.y + h.height / 2 + 20, Math.random() * 30 - 60, "#fec650", 2, 500);
					pText.innerHTML = pollenBase - a + " / " + game.miscStats.capacity * calcStat("capacity_multiplier") / 100;
					pollenBase -= a;
					setTimeout(function() {
						hText.innerHTML = honeyBase + a;
						honeyBase += a;
					}, 500 / game.speed);
				}
				await sleep(250);
				elem.style.scale = "1.0";
				if (elem.children[1]) elem.children[1].style.scale = "1.0";
				await sleep(500);
			}
			let j = 0;
			for (let i = 0; i < Math.min(game.fieldBees.length, pollenShow.length + 1); i++) {
				let elem = document.getElementById("field_container").children[0].children[i];
				let e = elem.getBoundingClientRect();
				await sleep(250);
				elem.style.scale = "1.5";
				if (elem.children[1]) elem.children[1].style.scale = 2 / 3;
				await sleep(250);
				while (typeof pollenShow[i + j] == "number") {
					j++;
					if (j == 10000) {
						console.error("error- while loop in bee turn end");
						break;
					}
				}
				let a = pollenShow[i + j];
				setTimeout(function() {
					if (pollenBase + a[0] >= game.miscStats.capacity * calcStat("capacity_multiplier")) {
						a[0] = game.miscStats.capacity * calcStat("capacity_multiplier") - pollenBase;
					}
					pText.innerHTML = pollenBase + a[0] + " / " + game.miscStats.capacity * calcStat("capacity_multiplier") / 100;
					pollenBase += a[0];
				}, 500 / game.speed);
				createAnimatedCurve(e.x + e.width / 2, e.y + e.height / 2, p.x + p.width / 2 + 20, p.y + p.height / 2, Math.random() * 30 - 15, "#00ff00", 2, 500);
				textHandler("pollen_text", [e.x + e.width / 2, e.y + e.height / 2, "+" + a[0], a[1], a[2], a[3], a[4]]);
				
				await sleep(250);
				elem.style.scale = "1.0";
				if (elem.children[1]) elem.children[1].style.scale = "1.0";
				await sleep(500);
			}
			for (let i = 0; i < Math.min(game.mobBees.length, attackShow.length + 1); i++) {
				let elem = document.getElementById("mob_container").children[0].children[i];
				let e = elem.getBoundingClientRect();
				await sleep(250);
				elem.style.scale = "1.5";
				if (elem.children[1]) elem.children[1].style.scale = 2 / 3;
				await sleep(250);
				let a = attackShow[i];
				if (a) {
					//with mob rect
					let color;
					createAnimatedCurve(a[3].x + a[3].width / 2, a[3].y + a[3].height / 2, a[4].x + a[4].width / 2, a[4].y + a[4].height / 2, Math.random() * 30 - 15, a[0][1], 2, 500);
					setTimeout(function() {
						textHandler("pollen_text", [a[4].x + a[4].width / 2, a[4].y + a[4].height / 2, a[0][0], a[0][1], a[0][2], a[0][3], a[0][4]]);
						if (attackShow[i][6] == "kill") {
							a[5].remove();
						} else if (attackShow[i][6] == "continue") {
							mobHandler("update", [a[1], a[5]]);
						}
					}, 500 / game.speed);
				}
				await sleep(250);
				elem.style.scale = "1.0";
				if (elem.children[1]) elem.children[1].style.scale = "1.0";
				await sleep(500);
			}
			textHandler("resources");
			return resolve("resolved");
		});
	}

	function getRelatingIndex(index) {
		index = parseInt(index);
		if (game.hiveBees.includes(index)) return "hive";
		if (game.fieldBees.includes(index)) return "field";
		if (game.mobBees.includes(index)) return "mob";
		return "none";
	}}

function fieldHandler(action, data) {
	let f = document.getElementById("field_container").children[1];
	let field = game.baseStats.field;
	if (action == "set") {
		setField(data);
	} else if (action == "gen") {
		genField(data);
	} else if (action == "resize") {
		resizeFieldData();
	} else if (action == "count") {
		return calcFlowers(data);
	} else if (action == "pre") {
		preField(data);
	}

	function preField(start) {
		if (document.getElementById("pre_field_temp")) {
			document.getElementById("pre_field_temp").remove();
			saveHandler("save")
			return;
		}
		if (start == 1) {
			f.children[4].src = "images/field_icons/" + game.baseStats.field_queue + ".png";
			saveHandler("save")
			return;
		}
		let c = document.createElement("div");
		c.id = "pre_field_temp";
		document.body.appendChild(c);
		let temp = f.children[1].getBoundingClientRect();
		for (let i of Object.keys(fieldStats).slice(0, -1)) {
			let img = document.createElement("img");
			img.src = "images/field_icons/" + i + ".png";
			Object.assign(img.style, {
				height: f.children[1].getBoundingClientRect().height + "px", width: f.children[1].getBoundingClientRect().height + "px",
				top: "0px", pointerEvents: "auto", cursor: "pointer"
			});
			img.dataset.field = i;
			img.onmouseenter = function() {
				img.style.scale = "1.5";
			}
			img.onmouseleave = function() {
				img.style.scale = "1.0";
			}
			img.onclick = function() {
				f.children[4].src = img.src;
				game.baseStats.field_queue = img.dataset.field;
				preField();
			}
			c.appendChild(img);
		}
		Object.assign(c.style, {
			position: "absolute", top: temp.y + temp.height + "px", height: temp.height, display: "flex", flexFlow: "row nowrap", zIndex: 6001
		});
		c.style.left = temp.x + temp.width / 2 - c.getBoundingClientRect().width / 2 + "px";
	}

	function setField(name) {
		if (name !== undefined) {
			field = name;
			game.baseStats.field = name;
		}
		f.children[0].innerHTML = textHandler("change", [field, "regular"]);
		f.children[1].src = "images/field_icons/" + field + ".png";
		if (f.children[4]) f.children[4].src = "images/empty.png";
		//f.children[0].style.top = "12.5%";
		//f.children[0].style.left = f.children[0].style.top;
		/*
		let h = Math.min(f.parentElement.getBoundingClientRect().height / 2, f.parentElement.getBoundingClientRect().width / 2);
		Object.assign(f.children[0].style, {
			top: h / 10 + "px", left: h / 10 + "px",
			height: h * 4 / 5 + "px", width: h * 4 / 5 + "px"
		});
		*/
		genField();
	}

	function genField() {
		let cols = ["Flowers", "Single", "Double", "Triple", "Large", "Star", "Total"];
		let flowers = [1, 2, 3, 4, 5];
		let colors = ["Flowers", "white", "red", "blue", "Total"];
		if (!f.children[4]) {
			let c = document.createElement("table");
			c.id = "fields_table";
			f.insertBefore(c, f.children[2]);
			for (let i = 0; i < 5; i++) {
				let a = document.createElement("tr");
				c.appendChild(a);
				for (let j = 0; j < 7; j++) {
					let b = document.createElement("td");
					a.appendChild(b);
				}
			}
		}
		let tempCol = [0, 0, 0, 0, 0, 0, 0];
		let size = fieldStats[field].size.r == 0 ? fieldStats[field].size.x * fieldStats[field].size.y : Math.round(fieldStats[field].size.r ** 2 * Math.PI);
		for (let i = 0; i < 5; i++) {
			let tempRow = 0;
			for (let j = 0; j < 7; j++) {
				let cell = f.children[2].children[i].children[j];
				if (i == 0) {
					cell.innerHTML = cols[j];
					continue;
				} else if (i == 4 && j > 0) {
					cell.innerHTML = Math.round(size * tempCol[j] / 100) + (game.settings.fieldPct ? "<br>(" + tempCol[j].toFixed(1) + "%)" : "");
					continue;
				}
				if (j == 0) {
					cell.innerHTML = textHandler("change", [colors[i], "regular"]);
				} else if (j == 6) {
					cell.innerHTML = Math.round(size * tempRow / 100) + (game.settings.fieldPct ? "<br>(" + tempRow.toFixed(1) + "%)" : "");
					tempCol[j] += tempRow;
				} else {
					//cell.innerHTML = 
					let value = fieldStats[field].counts[j][colors[i]];
					cell.innerHTML = Math.round(size * value / 100) + (game.settings.fieldPct ? "<br>(" + value.toFixed(1) + "%)" : "");
					tempRow += value;
					tempCol[j] += value;
				}
			}
		}
		mobHandler("switch");
		resizeFieldData(size);
	}

	function resizeFieldData(size) {
		//let h = Math.min(f.parentElement.getBoundingClientRect().height / 2, f.parentElement.getBoundingClientRect().width / 2);
		let w = f.parentElement.getBoundingClientRect().width;
		Object.assign(f.children[0].style, {
			top: w * -0.025 + "px"
		});
		Object.assign(f.children[1].style, {
			top: w * 0.075 + "px", left: w * 0.5 + "px",
			height: w * 0.2 + "px", width: w * 0.2 + "px",
			translate: "-50% 0%"
		});
		Object.assign(f.children[3].style, {
			top: (w * 0.075) + (w * 0.2) * 0.1 + "px", left: (w * 0.5) + "px",
			height: (w * 0.2) * 0.8 + "px", width: (w * 0.2) * 0.8 + "px",
			translate: "-50% 0%"
		});
		Object.assign(f.children[4].style, {
			top: w * (0.075 + 0.1) + "px", left: w * 0.65 + "px",
			height: w * 0.1 + "px", width: w * 0.1 + "px",
			translate: "-50% 0%"
		});
		Array.from(f.children[2].children).forEach((e) => {
			Array.from(e.children).forEach((a) => {
				a.style.padding = "0px 3px " + 0 + "px 3px";
			});
		});
		f.children[2].style.left = w * 0.5 - 3 + "px";
		f.children[2].style.top = w * 0.275 + "px";
		f.children[2].style.translate = "-50% 0%";
		f.children[2].style.fontSize = "100px";
		while (f.children[2].getBoundingClientRect().width > w/* && window.getComputedStyle(f.parentElement, null).getPropertyValue("opacity") != 0*/ && parseInt(f.children[2].style.fontSize) > 1) {
			f.children[2].style.fontSize = parseInt(f.children[2].style.fontSize) - 1 + "px";
		}
		f.children[0].style.fontSize = parseInt(f.children[2].style.fontSize) + 4 + "px";
		if (parseInt(f.children[2].style.fontSize) <= 1) {
			f.children[0].style.visibility = "hidden";
			f.children[2].style.visibility = "hidden";
		} else {
			f.children[0].style.visibility = "inherit";
			f.children[2].style.visibility = "inherit";
		}
		saveHandler("save");
		//game.stats["capacity_multiplier"].base = [0, statHandler("calc", "blue_field_capacity") + statHandler("calc", "red_field_capacity") + statHandler("calc", "white_field_capacity"), 1];
	}

	function calcFlowers(color) {
		let t = fieldStats[game.baseStats.field];
		let size = t.size.r == 0 ? t.size.x * t.size.y : Math.round(t.size.r ** 2 * Math.PI);
		let pct = 0;
		for (let i = 0; i < 5; i++) {
			pct += t.counts[i + 1][color];
		}
		return [Math.round(pct), [t.counts[1][color], t.counts[2][color], t.counts[3][color], t.counts[4][color], t.counts[5][color]]];
	}}

function buffHandler(action, data) {
	let c = document.getElementById("buffs_container");
	if (action == "tokens") {
		spawnTokens(data[0], data[1], data[2], data[3]);
	} else if (action == "add") {
		return addBuff(data[0], data[1], data[2]);
	} else if (action == "calc") {
		calcBuffs();
	} else if (action == "end_turn" || action == "end_round") {
		turnEnd(data);
	} else if (action == "remove") {
		removeBuff(data);
	} else if (action == "resize") {
		buffContainerResize();
	} else if (action == "turn_start") {
		turnStart();
	} else if (action == "reload") {
		reloadBuffs();
	} else if (action == "all") {
		allBuffs();
	} else if (action == "show") {
		showBuffs(data[0], data[1], data[2], data[3]);
	} else if (action == "get") {
		console.log("...");
		console.log(data);
		return getBuffContainer(data);
	}

	function spawnTokens(id, x, start) {
		return new Promise((resolve) => {
		let buffShow = [];
		let tokens;
		let a;
		let ids = [];
		if (start == 1) {
			//bees tokens on start
			let temp = id;
			let len = id.length;
			x = [];
			y = [];
			let t = [];
			for (let k = 0; k < len; k++) {
				id = parseInt(temp[k][0]);
				ids.push(id);
				x.push(temp[k][1]);
				y.push(temp[k][1]);
				a = game.cardList[id];
				tokens = JSON.parse(JSON.stringify(beeTypeStats[a.getName()].tokens));
				tokens = tokens.filter((e) => {
					return e.includes("#") ? a.getGifted() : true;
				});
				tokens = tokens.map((e) => {
					return e.includes("#") ? textHandler("change", [e.substring(1), "underscores"]) : textHandler("change", [e, "underscores"]);
				})
				tokens.unshift(a);
				for (let l = 0; l < tokens.length; l++) {
					t.push(tokens[l]);
				}
				t.push("next");
			}
			tokens = t;
			console.log(tokens);
		} else {
			id = parseInt(id);
			a = game.cardList[id];
			tokens = JSON.parse(JSON.stringify(beeTypeStats[a.getName()].tokens));
			tokens = tokens.filter((e) => {
				return e.includes("#") ? a.getGifted() : true;
			});
			tokens = tokens.map((e) => {
				return e.includes("#") ? textHandler("change", [e.substring(1), "underscores"]) : textHandler("change", [e, "underscores"]);
			});
			tokens.unshift(a);
		}
		activateTokens();

		function activateTokens() {
			let bee = 0;
			let beeObj = tokens[0];
			buffShow.push(["bee"]);
			for (let i = 1; i < tokens.length; i++) {
				if (tokens[i] == "next") {
					bee += 1;
					buffShow.push(["next"], ["bee"]);
					continue;
				} else if (tokens[i - 1] == "next") {
					beeObj = tokens[i];
					i++;
				}
				let pos = [];
				if (start == 1) {
					pos.push(x[bee]);
				} else {
					pos.push(x);
				}
				if ((beeObj.getCooldown(tokens[i]) == 0 && Math.random() < tokenStats[tokens[i]][3]) || game.tutorial[1] == 4 || testMode == 1) {
					beeObj.resetCooldown(tokens[i]);
					let t = tokenStats[tokens[i]][0];
					buffShow.push(["text", [pos[0], textHandler("change", [tokens[i], "regular"]), "#f0f0f0", "#f0f0f0", 1, 10]]);
					if (t) {
						for (let j = 0; j < t.length; j++) {
							let stack = -1;
							let arr = addBuff(t[j], pos[0]);
							for (let k = 0; k < game.buffs.length; k++) {
								if (game.buffs[k].getName() == t[j]) {
									stack = game.buffs[k].getStack();
									break;
								}
							}
							
							buffShow.push(["curve", arr, stack]);
							//buffShow.push(["update", stack]);
						}
					}
				}
			}
			start == 1 ? buffShow.pop() : buffShow.push(["next"]);
			saveHandler("save");
			show(buffShow);
		}

		async function show(z) {
			let bees = [];
			let cats = ["hive", "field", "mob"];
			if (start != 2) {
				for (let i = 0; i < 3; i++) {
					let a = document.getElementById(cats[i] + "_container").children[0].children;
					for (let j = 0; j < a.length; j++) {
						bees.push(a[j]);
					}
				}
			} else {
				bees.push(data[1]);
			}
			let temp = 0;
			for (let i = 0; i < z.length; i++) {
				if (z[i][0] == "text") {
					textHandler("pollen_text", [z[i][1][0].getBoundingClientRect().x + z[i][1][0].getBoundingClientRect().width / 2, z[i][1][0].getBoundingClientRect().y + z[i][1][0].getBoundingClientRect().height / 2, z[i][1][1], "#f0f0f0", "#f0f0f0", 1, 10]);
				} else if (z[i][0] == "curve") {
					let arr = z[i][1];
					let a = arr[8];
					if (c.children[game.buffs.indexOf(a)] === undefined) {
						game.buffs.splice(c.children.length, 0, game.buffs.splice(game.buffs.indexOf(a), 1)[0]);
					}
					showBuffs(a, 1, undefined, z[i][2]);
					createAnimatedCurve(arr[0].getBoundingClientRect().x + arr[0].getBoundingClientRect().width / 2, arr[0].getBoundingClientRect().y + arr[0].getBoundingClientRect().height / 2, arr[2](), arr[3](), arr[4], arr[5], arr[6], arr[7]);
					await sleep(1000);
				} else if (z[i][0] == "next") {
					await sleep(250);
					bees[temp].style.scale = "1.0";
					temp += 1;
					await sleep(250);
				} else if (z[i][0] == "bee") {
					bees[temp].style.scale = "1.5";
					await sleep(250);
				}
			}
			return resolve("resolved");
		}
		})
	}

	function addBuff(name, x2, y) {
		let variety;
		//game.buffs[0] = name, [1] = stacks, [2] = duration, [3] = variety
		if ((name.includes("boost") && !name.includes("cloud")) || name.includes("bomb_sync") || name.includes("extract") || (name.includes("bear_morph") && !name.includes("science") && !name.includes("mother")) ||name.includes("field_boost") || name.includes("field_winds") || (name.includes("drive") && !name.includes("glitched_drive"))) {
			//addBuff(name.substr(t[j].indexOf("_") + 1), t[j].substr(0, t[j].indexOf("_")), x, y);
			let n = name;
			if (name.includes("blue_flower") || name.includes("mountain_top") || name.includes("pine_tree") || name.includes("ant_challenge")) {
				name = name.substr(name.indexOf("_", name.indexOf("_") + 1) + 1);
				variety = n.substr(0, n.indexOf("_", n.indexOf("_") + 1));
			} else {
				name = name.substr(name.indexOf("_") + 1);
				variety = n.substr(0, n.indexOf("_"));
			}
		} else {
			variety = undefined;
		}
		let a;
		if (buffs[name]) {
			a = new Buff(undefined, name, 0, 1, variety);
		} else {
			a = new Instant(undefined, name, variety);
		}
		let n = 1;
		for (let i = 0; i < game.buffs.length; i++) {
			if (game.buffs[i].getName() == a.getName()) {
				a = game.buffs[i];
				console.log("true");
				n = 0;
			} 
		}
		if (n) {
			game.buffs.push(a);
		}
		a.addStack(1);
		if (a instanceof Buff) {
			a.calcBuff();
			let temp;
			if (a.getBase() == "field_boost") {
				temp = curveColors["field_boost"][0];
			} else if (a.getBase() == "field_winds") {
				temp = curveColors["field_winds"][0];
			} else {
				if (curveColors[a.getName()] === undefined) {
					temp = "#ffffff";
				} else {
					temp = curveColors[a.getName()][0];
				}
			}
			let arr = [
				//end x, y
				x2, 0,
				() => buffHandler("get", a).getBoundingClientRect().x + buffHandler("get", a).getBoundingClientRect().width / 2,
				() => buffHandler("get", a).getBoundingClientRect().y + buffHandler("get", a).getBoundingClientRect().height / 2,
				Math.random() * 60 - 30, temp, 2, 1000, a
			]
			return arr;
		} else {
			//pollen-like text for instas
			//showBuffs(a);
		}
	}

	function getBuffContainer(a) {
		for (let i = 0; i < c.children.length; i++) {
			if (c.children[i].dataset.buffID == a.getName()) {
				return c.children[i];
			}
		}
	}

	function removeBuff(name) {
		for (let i = 0; i < game.buffs.length; i++) {
			if (game.buffs[i].getName() == name) {
				game.buffs.splice(game.buffs[i], 1);
				c.children[i].remove();
				//showBuffs(game.buffs[i], 0);
				break;
			}
		}
	}

	function showBuffs(t, x, y, temp2) {
		if(!getBuffContainer(t)) {
			const a = document.createElement("div");
			a.dataset.buffID = t.getName();
			a.style.visibility = "hidden";
			a.onmouseenter = function() {
				const b = document.createElement("span");
				b.id = "buffs_infobox";
				b.dataset.buffID = game.buffs.indexOf(t);
				b.innerHTML = t.getShow();
				b.style.top = "30px";
				a.appendChild(b);
			}
			a.onmouseleave = function() {
				while (a.children.length > 4) {
					a.lastElementChild.remove();
				}
			}
			const b = document.createElement("div");
			const i = document.createElement("img");
			const f = document.createElement("div");
			f.style.bottom = "0px";
			const blend = document.createElement("div");
			//
			b.style.zIndex = 4996;
			i.style.zIndex = 4998;
			f.style.zIndex = 4997;
			i.src = t.getSrc();
			const p = document.createElement("p");
			if (y === undefined) {
				p.style.visibility = "hidden";
			}
			setTimeout(function() {
				a.style.visibility = "inherit";
				p.style.visibility = "inherit";
			}, y ? 0 : 1000 / game.speed);
			p.style.zIndex = 5000;
			c.appendChild(a);
			a.appendChild(p);
			a.appendChild(b);
			a.appendChild(f);
			a.appendChild(blend);
			blend.appendChild(i);
			if (buffColors[t.getBase()] && buffColors[t.getBase()] != "") {
				let temp = buffColors[t.getBase()];
				b.style.backgroundColor = "rgba(" + parseInt(temp[0].slice(1, 3), 16) + ", " + parseInt(temp[0].slice(3, 5), 16) + ", " + parseInt(temp[0].slice(5, 7), 16) + ", 0.2)";
				if (t.getBase() != "rage") {
					f.style.backgroundColor = temp[0];
				} else {
					f.style.backgroundImage = "linear-gradient(#f79f0a, #de680c)";
				}
				if (temp[1]) {
					const o = document.createElement("div");
					o.style.backgroundColor = temp[1];
					o.style.zIndex = 4999;
					o.style.maskSize = "100% 100%";
					o.style.maskImage = "url(images/buffs_foregrounds/" + t.getName() + ".png)";
					blend.appendChild(o);
				}
			}
			i.onload = function() {
				//p.style.visibility = "visible";
				if (t.getStack() == 1) {
					p.innerHTML = "";
				} else {
					if (t.getBase().includes("nectar")){
						p.innerHTML = "";
					} else {
						if (temp2) {
							p.innerHTMl = "x" + temp2;
						} else {
							p.innerHTML = "x" + t.getStack();
						}
					}
				}
				if (p.innerHTML.length == 2) {
					p.style.fontSize = "15px";
					p.style.lineHeight = "46px";
				} else if (p.innerHTML.length == 3) {
					p.style.fontSize = "13px";
					p.style.lineHeight = "48px";
				} else if (p.innerHTML.length == 4) {
					p.style.fontSize = "11px";
					p.style.lineHeight = "50px";
				} else if (p.innerHTML.length == 5) {
					p.style.fontSize = "9px";
					p.style.lineHeight = "51px";
				} else {
					p.style.fontSize = "8px";
					p.style.lineHeight = "52px";
				}
				
			}
		} else {
			let g = getBuffContainer(t).children[0];
			setTimeout(function() {
				if (t.getStack() == 1) {
					g.innerHTML + "";
				} else {
					if (t.getBase().includes("nectar")) {
						g.innerHTML = "";
					} else {
						if (temp2) {
							g.innerHTML = "x" + temp2;
						} else {
							g.innerHTML = "x" + t.getStack();
						}
					}
				}
				if (g.innerHTML.length == 2) {
					g.style.fontSize = "15px";
					g.style.lineHeight = "46px";
				} else if (g.innerHTML.length == 3) {
					g.style.fontSize = "13px";
					g.style.lineHeight = "48px";
				} else if (g.innerHTML.length == 4) {
						g.style.fontSize = "11px";
					g.style.lineHeight = "50px";
				} else if (g.innerHTML.length == 5) {
					g.style.fontSize = "9px";
					g.style.lineHeight = "51px";
				} else {
					g.style.fontSize = "8px";
					g.style.lineHeight = "52px";
				}
			}, 1000);
		}
		setTimeout(function() {
			getBuffContainer(t).children[2].style.height = Math.round(30 * t.getPct()) + "px";
			getBuffContainer(t).children[2].style.top = 30 - getBuffContainer(t).children[2].getBoundingClientRect().height + "px";
			buffContainerResize();
		}, (x == 1 ? 1000 / game.speed : 1));
		//t.calcBuff();
	}

	function turnEnd(r) {
		for (let i = 0; i < game.buffs.length; i++) {
			if (r && !roundStayBuffs.includes(game.buffs[i].getBase())) {
				game.buffs[i].removeBuff();
				game.buffs.splice(i, 1);
				c.children[i].remove();
				i--;
				continue;
			}
			if (game.buffs[i].getDuration() == 500) continue;
			if (game.buffs[i].getTimed()) {
				game.buffs[i].addStack(-1);
			} else {
				game.buffs[i].addDuration(-1);
			}
			if (game.buffs[i].getDuration() <= 0) {
				game.buffs[i].removeBuff();
				game.buffs.splice(i, 1);
				c.children[i].remove();
				i--;
				continue;
			} else {
				showBuffs(game.buffs[i], 0, undefined);
			}
		}
	}

	async function turnStart() {
		let cats = ["hive_container", "field_container", "mob_container"];
		let bees = [];
		for (let i = 0; i < 3; i++) {
			let temp = document.getElementById(cats[i]).children[0].children
			for (let j = 0; j < temp.length; j++) {
				bees.push([temp[j].dataset.index, temp[j]]);
			}
		}
		let i = 0;
		let arr = [];
		for (let i = 0; i < bees.length; i++) {
			game.cardList[bees[i][0]].decrementCooldowns();
			arr.push([bees[i][0], bees[i][1]]);
		}
		spawnTokens(arr, 0, 1);
	}

	function reloadBuffs() {
		while (c.children.length > 0) {
			c.firstElementChild.remove();
		}
		for (let i = 0; i < game.buffs.length; i++) {
			showBuffs(game.buffs[i], 0, 1);
		}
	}

	function allBuffs() {
		for (let i of totalBuffList) {
			if (i[1]) {
				addBuff(i[1] + "_" + i[0]);
			} else {
				addBuff(i[0]);
			}
		}
		reloadBuffs();
	}

	function buffContainerResize() {
		const c = document.getElementById("buffs_container");
		c.style.width = "100%";
		let i = c.getBoundingClientRect().width;
		if (i % 30 != window.innerWidth) {
			if (i % 30 > 25) {
				c.style.width = window.innerWidth + (i % 30) / 2 + "px";
				c.style.left = ((i % 30) - 30) / 2 + "px";
			} else {
				c.style.left = (i % 30) / 2 + "px";
			}
		} else {
			c.style.left = "0px";
		}
		let cats = ["hive", "field", "mob"];
		let h = window.innerHeight;
		let b = document.getElementById("buffs_container").getBoundingClientRect();
		for (let i = 0; i < 3; i++) {
			let a = document.getElementById(cats[i] + "_container");
			a.style.top = Math.max(h * 0.02 + b.height + b.y, h * 0.03 + 74) + "px";
			a.style.height = (h * 0.92 - 263) + (h * 0.03 + 74) - a.getBoundingClientRect().y + "px";
		}
		document.getElementById("bear_container").style.top = Math.max(h * 0.02 + b.height + b.y, h * 0.03 + 74) + "px";
	}}

function shopHandler(action, data) {
	const s = document.getElementById("shop_container");
	const c = ["hive_container", "field_container", "mob_container", "card_holder", "buffs_container", "bear_container", "quest_container", "turn_end_button"];
	if (action == "open") {
		openShop();
	} else if (action == "close") {
		closeShop();
	} else if (action == "pre") {
		preShop();
	}

	async function preShop() {
		game.menu = "quest_select";
		hideAll(0.5);
		let temp = game.baseStats.pollen;
		game.baseStats.pollen = 0;
		textHandler("resources");
		game.baseStats.honey += temp * calcStat("honey_per_pollen") / 100;
		saveHandler("save");
		await sleep(500);
		textHandler("resources");
		await sleep(1000);
		questHandler("show");
	}

	function hideAll(time) {
		c.forEach((e) => {
			document.getElementById(e).style.transition = "opacity " + pf(time / game.speed) + "s ease-in-out";
			document.getElementById(e).style.opacity = 0;
		});
		document.getElementById("hive_container").style.pointerEvents = "none";
		document.getElementById("field_container").style.pointerEvents = "none";
		document.getElementById("mob_container").style.pointerEvents = "none";
		document.getElementById("bear_container").style.pointerEvents = "none";
		cardHandler("send_discard");
		while (document.getElementById(c[3]).children.length > 0) {
			document.getElementById(c[3]).lastElementChild.remove();
		}
	}

	function openShop() {
		hideAll(0);
		//remove shop children
		while (s.children[0].firstElementChild) {
			s.children[0].children[0].remove();
		}
		while (s.children[1].firstElementChild) {
			s.children[1].children[0].remove();
		}
		console.log("open shop");
		s.style.opacity = 1;
		for (let i = 0; i < game.cardList.length; i++) {
			let card = game.cardList[i];
			if (card.getType() == "bee") {
				const b = document.createElement("div");
				const a = document.createElement("img");
    			a.src = "images/bee_models/" + (card.getGifted() ? card.getName() + "_gifted" : card.getName()) + ".png";
    			b.dataset.index = card.getIndex();
    			s.children[0].appendChild(b);
    			b.appendChild(a);
    			b.onmouseenter = function() {
    				const d = document.createElement("div");
    				d.id = "bees_infobox";
    				d.innerHTML = game.cardList[b.dataset.index].getShow();
 					d.style.left = "0px";
    				d.style.top = b.getBoundingClientRect().height + "px";
    				b.appendChild(d);
    			}
    			b.onmouseleave = function() {
    				while (b.children.length > 1) {
    					b.lastElementChild.remove();
    				}
    			}
    		} else if (card.getType() == game.shopStats.tab) {
    			cardHandler("hand", [card.getIndex(), s.children[1]]);
    		}
		}
		/*
		if (game.shopStats.current == "") {
			rerollShop(1);
			//add clicks and hovers to a
			//add prices for all next
			//add saving current shop
			//special zone things like dispensers, memory matches etc NOT CARDS
			//for loop 6 bee cards
			rerollShop(3);
			for (let i = 0; i < 12; i++) {
				game.shopStats.current.push(s.children[2].children[Math.floor(i / 6) * 2].children[i % 6].dataset.id);
			}
		} else {
			for (let i = 0; i < 12; i++) {
				if (game.shopStats.current[i] == "locked") {
					genLocked(Math.floor(i / 6) * 2 + 1, i % 6);
				} else {
					genShopCard((i < 6 ? "gear" : "bee"), (i < 6 ? game.shopStats.current[i] : undefined), (i < 6 ? undefined : game.shopStats.current[i]));
				}
			}
		}
		*/
		rerollShop(1, 0);
		rerollShop(3, 0);
		createReroll(1);
	}

	function createReroll(n) {
		for (let i = 0; i < 2; i++) {
			let a;
			let b;
			let d;
			let e;
			let f;
			if (n == 1) {
				a = document.createElement("div");
				d = document.createElement("span");
				b = document.createElement("p");
				e = document.createElement("img");
				f = document.createElement("p");
				s.children[2].appendChild(a);
				a.append(b, d);
				d.append(f, e);
			} else {
				a = s.children[2].children[i + 5];
				b = a.children[0];
				d = a.children[1];
				f = d.children[0];
				e = d.children[1];
			}
			Object.assign(a.style, {
				top: i == 0 ? "99px" : "calc(97% - 99px)", backgroundColor: game.baseStats.tickets >= game.shopStats.rerolls[i] ? "#229922" : "#992222", border: "3px solid " + (game.baseStats.tickets >= game.shopStats.rerolls[i] ? "#00bb00" : "#cc3333")
			});
			b.innerHTML = "Reroll";
			e.style.translate = 25 * game.shopStats.rerolls[i].toString().length - 100 + "% -50%"
			e.src = "images/items/ticket.png";
			f.style.translate = -25 * game.shopStats.rerolls[i].toString().length - 25 + "% -50%"
			f.innerHTML = game.shopStats.rerolls[i];
			a.onmouseenter = function() {if (elemDragging) {a.style.cursor = "default"; return;} a.style.scale = "1.5"};
			a.onmouseleave = function() {a.style.cursor = "pointer";  if (elemDragging) {return;} a.style.scale = "1.0"};
			a.onclick = function() {
				if (elemDragging) return;
				if (game.baseStats.tickets < game.shopStats.rerolls[i]) return;
				game.baseStats.tickets -= game.shopStats.rerolls[i];
				game.shopStats.rerolls[i] += 1;
				rerollShop(i * 2 + 1, 1);
				createReroll(0);
				textHandler("resources");
				saveHandler("save");
			}
		}
	}

	function rerollShop(row, n) {
		while (s.children[2].children[row - 1].children.length > 0) {
			s.children[2].children[row - 1].lastElementChild.remove();
			s.children[2].children[Math.floor(row / 2) + 3].lastElementChild.remove();
		}
		if (row == 1) {
			let keys = Object.keys(gearStats);
			let total = [];
			keys.forEach((e) => {
				if (gearStats[e].zone <= game.round) total.push(e);
			});
			let show = [];
			if (n == 1 || game.shopStats.current == "") {
				while (show.length < game.shopStats.unlocked[0]) {
					let temp = total[Math.floor(Math.random() * total.length)].toString();
					let contains = 0;
					for (let i = 0; i < show.length; i++) {
						if (show[i] == temp) {
							contains = 1;
							break;
						}
					}
					if (contains) continue;
					show.push(temp);
				}
				show.sort((a, b) => gearStats[a].zone - gearStats[b].zone);
			} else {
				show = game.shopStats.current;
			}
			for (let i = 0; i < 5; i++) {
				let a;
				if (show[i] && show[i] != "locked") {
					genShopCard("gear", show[i]);
					a = s.children[2].children[0].children[i];
					a.style.border = "3px solid " + cardColors.gear;
				} else {
					genLocked(1, i);
					a = s.children[2].children[0].children[i];
					a.style.border = "3px solid " + cardColors.locked;
				}
				a.style.pointerEvents = "auto";
				a.style.transition = "scale 0.3s";
				a.style.height = "120px";
				//i.style.width = window.innerHeight / 6 + "px";
				a.style.width = "80px";
				a.style.borderRadius = window.innerHeight / 50 + "px";
				while (a.children[4].getBoundingClientRect().width > a.getBoundingClientRect().width * 0.9) {
					a.children[4].style.fontSize = parseInt(a.children[4].style.fontSize) - 1 + "px";
				}
				a.style.padding = "3px";
				const d = document.createElement("div");
				a.onmouseenter = function() {
					if (elemDragging) return;
					a.style.scale = "1.5";
					if (a.children[0].innerHTML == "Locked") return;
					d.id = "shop_infobox";
    				d.innerHTML = formatText(a.children[0].innerHTML);
    				//d.style.transform = "scale(" + 2 / 3 + ")";
 					//d.style.left = ((a.getBoundingClientRect().width - (a.getBoundingClientRect().width / 1.5)) / 2) / 1.5 + "px";
    				//d.style.bottom = a.getBoundingClientRect().height / d.style.scale + "px";
    				//d.style.right = ((a.getBoundingClientRect().width - (a.getBoundingClientRect().width / 1.5)) / 2) / 1.5 + "px";
    				d.style.position = "absolute";
    				d.style.right = a.getBoundingClientRect().width / window.getComputedStyle(a).scale - 3 + "px";
    				d.style.top = "0px";
    				a.appendChild(d);
				}
				a.onmouseleave = function() {
					a.style.scale = "1.0";
					if (a.children[0].innerHTML == "Locked") return;
					while (a.children.length > 5) {
						a.lastElementChild.remove();
					}
				}
			}
			for (let i = 0; i < 5; i++) {
				const a = document.createElement("div");
				const b = document.createElement("p");
				const d = document.createElement("img");
				if (show[i] && show[i] != "locked") {
					let cost = gearStats[show[i]].cost;
					Object.assign(a.style, {
						backgroundColor: game.baseStats.honey >= cost ? "#33cc33aa" : "#cc3333aa",
						border: game.baseStats.honey >= cost ? "3px solid #33cc33aa" : "3px solid #cc3333aa"
					});
					if (game.shopStats.bought.indexOf(show[i]) != -1) {
						a.style.border = "3px solid #33cc33aa";
						a.style.backgroundColor = "#33cc33aa";
						if (game.baseStats.equipped[gearStats[show[i]].type] == show[i]) {
							b.innerHTML = "Equipped"
						} else {
							b.innerHTML = "Equip";
						}
					} else {
						b.innerHTML = nf(cost);
					}
					b.style.fontSize = b.innerHTML.length < 6 ? "16px" : b.innerHTML.length == 6 ? "12px" : "10px";
					d.src = "images/buffs_foregrounds/conversion_boost.png";
				} else {
					if (s.children[2].children[0].children[i].children[5].style.backgroundColor == "rgb(240, 240, 240)" && game.baseStats.tickets >= calcLocked(1, i)) {
						a.style.backgroundColor = "#aaaaaaaa";
						a.style.border = "3px solid #aaaaaaaa";
					} else {
						a.style.backgroundColor = "#505050aa";
						a.style.border = "3px solid #505050aa";
					}
					b.innerHTML = calcLocked(1, i);
					d.style.width = "30%";
					d.src = "images/items/ticket.png";
				}
				s.children[2].children[3].appendChild(a);
				a.append(b, d);
				a.onmouseenter = function() {if (elemDragging) {a.style.cursor = "default"; return;} a.style.scale = "1.5"};
				a.onmouseleave = function() {a.style.cursor = "pointer";  if (elemDragging) {return;} a.style.scale = "1.0"};
				a.onclick = function() {
					if (elemDragging) return;
					if (b.innerHTML == "Equip") {
						game.baseStats.equipped[gearStats[show[i]].type] = show[i];
					} else if (b.innerHTML == "Equipped") {
						return;
					} else if (d.src.includes("ticket")) {
						let cost = calcLocked(1, i);
						if (game.baseStats.tickets < cost) return;
						game.baseStats.tickets -= cost;
						game.shopStats.unlocked[0] += 1;
					} else if (d.src.includes("conversion")) {
						let cost = gearStats[show[i]].cost;
						if (game.baseStats.honey < cost) return;
						game.baseStats.honey -= cost;
						game.shopStats.bought.push(show[i]);
					}
					saveHandler("save");
					//reload shop if needed
					//add if equipped or can equip to items
					//equipped/can = green, can buy = yellow, cant = red
				}
			}
		} else if (row == 3) {
			let beeCats = {
				"common": [],
				"rare": [],
				"epic": [],
				"legendary": [],
				"mythic": [],
				"event": []
			};
			for (let i = 0; i < Object.keys(beeTypeStats).length; i++) {
				beeCats[beeTypeStats[Object.keys(beeTypeStats)[i]].rarity].push(Object.keys(beeTypeStats)[i]);
			}

			let r = pickRandom([0.7, 0.2, 0.07, 0.024, 0.005, 0.001], ["common", "rare", "epic", "legendary", "event", "mythic"]);
			//let bee = t ? t : beeCats[r][Math.floor(Math.random() * beeCats[r].length)];
			if (n == 1 || game.shopStats.current != "") {
				bee = game.shopStats.current;
			}
			for (let i = 0; i < 5; i++) {
				let a;
				let p = game.shopStats.current[i + 6];
				if (i < game.shopStats.unlocked[1]) {
					//genShopCard("bee", bee[i + 6]);
					genShopCard("bee", p);
					a = s.children[2].children[2].children[i];
					a.style.border = "3px solid " + cardColors.bee;
				} else {
					genLocked(3, i);
					a = s.children[2].children[2].children[i];
					a.style.border = "3px solid " + cardColors.locked;
				}
				a.style.pointerEvents = "auto";
				a.style.transition = "scale 0.3s";
				a.style.height = "120px";
				//i.style.width = window.innerHeight / 6 + "px";
				a.style.width = "80px";
				a.style.borderRadius = window.innerHeight / 50 + "px";
				a.style.padding = "3px";
				//const d = document.createElement("div");
				a.onmouseenter = function() {
					if (elemDragging) return;
					a.style.scale = "1.5";
					/*
					if (a.children[0].innerHTML == "Locked") return;
					d.id = "shop_infobox";
    				d.innerHTML = "bee";
    				d.style.transform = "scale(" + 2 / 3 + ")";
 					d.style.left = ((a.getBoundingClientRect().width - (a.getBoundingClientRect().width / 1.5)) / 2) / 1.5 + "px";
    				d.style.bottom = a.getBoundingClientRect().height / d.style.scale + "px";
    				a.appendChild(d);
    				*/
				}
				a.onmouseleave = function() {
					a.style.scale = "1.0";
					/*
					if (a.children[0].innerHTML == "Locked") return;
					while (a.children.length > 5) {
						a.lastElementChild.remove();
					}
					*/
				}
			}
		}
	}

	function formatText(item) {
		item = gearStats[textHandler("change", [item, "underscores"])];
		let stats = item.stats;
		let perks = item.perks;
		let lines = "";
		if (item.type == "tool") {
			lines += "Collects " + (stats[0] > 500 ? "all" : stats[0]) + " pollen from <br>" + stats[1] + " flower" + (stats[1] == 1 ? "" : "s") + " per turn.<br>";
		} else {
			for (let i of stats) {
				lines += textHandler("change", [i, "regular"]) + "<br>";
			}
		}
		for (let i of perks) {
			lines += textHandler("change", [i, "regular"]) + "<br>";
		}
		return lines;
	}

	function genShopCard(type, temp, t) {
		const a = template.cloneNode(true);
		a.id = "";
		if (type == "gear") {
			a.dataset.id = temp;
			let obj = gearStats[temp];
			a.children[0].innerHTML = textHandler("change", [temp, "regular"]);
			a.children[1].src = "images/" + (obj.type[obj.type.length - 1] == "s" ? obj.type : obj.type + "s") + "/" + temp + ".png";
			a.children[4].innerHTML = obj.description;
			a.children[4].style.fontSize = "9px";
			//a.children[4].style.filter = "drop-shadow(0px 0px 0.1px #000)";
			//maybe add filter instead of text shadow in bss texts
			a.style.visibility = "inherit";
			a.children[3].style.visibility = "hidden";
			a.children[1].style.filter = "drop-shadow(0px 0px 1px #f0f0f0)";
			s.children[2].children[0].appendChild(a);
			while (a.children[4].getBoundingClientRect().height + a.children[4].getBoundingClientRect().y > a.getBoundingClientRect().height + a.getBoundingClientRect().y) {
				a.children[4].style.fontSize = parseInt(a.children[4].style.fontSize) - 1 + "px";
			}
			a.children[1].style.width = "90%";
			a.children[1].style.height = "auto";
			a.children[1].style.top = "35%";
			a.children[1].style.translate = "-50% -50%";
			a.children[1].onload = function() {
				if (a.children[1].getBoundingClientRect().height < a.children[1].getBoundingClientRect().width) {
					a.children[1].style.width = a.children[1].getBoundingClientRect().width > a.getBoundingClientRect().width * 0.8 ? a.children[1].getBoundingClientRect().height * 0.8 + "px" : a.children[1].getBoundingClientRect().height + "px";
					a.children[1].style.height = "auto";
				} else {
					a.children[1].style.height = "45%";
					a.children[1].style.width = "auto";
				}
			}
		} else if (type == "bee") {
			/*
			let r = pickRandom([0.7, 0.2, 0.07, 0.024, 0.005, 0.001], ["common", "rare", "epic", "legendary", "event", "mythic"]);
			let bee = t ? t : temp[r][Math.floor(Math.random() * temp[r].length)];
			*/
			let bee = temp;
			a.dataset.id = bee;
			let g = Math.random() < 0.004 ? 1 : 0;
			let m = Math.random() < 0.01 ? 1 : 0;
			a.children[0].innerHTML = (g ? "Gifted<br>" : "") + textHandler("change", [bee, "regular"]) + " Bee";
			a.children[0].style.color = rarityColors[beeTypeStats[bee].rarity];
			a.children[1].src = "images/bee_models/" + (bee + (g ? "_gifted" : "")) + ".png";
			a.children[2].style.color = rarityColors[beeTypeStats[bee].rarity];
			a.children[2].innerHTML = (beeTypeStats[bee].color != "colorless" ? textHandler("change", [beeTypeStats[bee].color, "regular"]) : "") + " " + textHandler("change", [beeTypeStats[bee].rarity, "regular"]);
			a.children[3].children[1].innerHTML = "None";
			a.children[3].children[4].innerHTML = m ? genMutation(1) : "None";
			a.children[4].innerHTML = "Level " + 1;
			a.children[3].children[1].style.fontSize = "9px";
			a.children[3].children[4].style.fontSize = "9px";
			a.style.visibility = "inherit";
			s.children[2].children[2].appendChild(a);
			while (a.children[3].children[1].getBoundingClientRect().width > a.getBoundingClientRect().width * 0.9) {
				a.children[3].children[1].style.fontSize = parseInt(a.children[3].children[1].style.fontSize) - 1 + "px";
			}
			while (a.children[3].children[4].getBoundingClientRect().width > a.getBoundingClientRect().width * 0.9) {
				a.children[3].children[4].style.fontSize = parseInt(a.children[3].children[4].style.fontSize) - 1 + "px";
			}
		}
	}

	function genLocked(row, index) {
		const a = template.cloneNode(true);
		a.id = "";
		a.dataset.id = "locked";
		a.children[0].innerHTML = "Locked";
		if (index > game.shopStats.unlocked[row % 2 - 1]) {
			a.children[4].innerHTML = "Unlock previous slot";
		} else {
			a.children[4].innerHTML = "Purchase to permanently unlock in all future runs";
		}
		/*
		a.children[1].src = "images/lock.png";
		a.children[1].style.width = "40%";
		a.children[1].style.height = "auto";
		a.children[1].style.top = "35%";
		a.children[1].style.left = "50%";
		a.children[1].style.translate = "-50% -50%";
		a.children[1].style.aspectRatio = "0.85";
		*/
		a.children[3].style.visibility = "hidden";
		a.style.visibility = "inherit";
		s.children[2].children[row - 1].appendChild(a);
		const b = document.createElement("div");
		Object.assign(b.style, {
			position: "absolute", left: "50%", top: "35%", translate: "-50% -50%", height: a.getBoundingClientRect().width * 0.4 / 0.85 + "px", width: "40%",
			maskImage: "url(images/lock.png)", backgroundColor: game.baseStats.tickets >= calcLocked(row, index) && index <= game.shopStats.unlocked[row % 2 - 1] ? "#f0f0f0" : "#333333", maskSize: "100% 100%"
		});
		a.appendChild(b);
	}

	function calcLocked(row, index) {
		if (row == 1) {
			return 2 * (index - 1) ** 3 + 50;
		} else if (row == 3) {
			return (index - 1) ** 4 + 100;
		}
	}

	function genMutation(level) {
		let mutation = "";
		let a = 0;
		let lvl = level < 11 ? 1 : (level < 21 ? 2 : 3);
		let num = Math.random();
		for (let i = 0; i < mutationChances.length; i++) {
			a += mutationChances[i].chance;
			if (num < a) {
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

	function closeShop() {
		c.forEach((e) => {
			document.getElementById(e).style.visibility = "visible";
		});
		document.getElementById("hive_container").style.pointerEvents = "auto";
		document.getElementById("field_container").style.pointerEvents = "auto";
		document.getElementById("mob_container").style.pointerEvents = "auto";
	}}

function roundHandler(action, data) {
	if (action == "end_turn") {
		endTurn(0);
	} else if (action == "end_round") {
		endRound();
	} else if (action == "start_turn") {
		startTurn();
	}

	async function endTurn(r) {
		return new Promise(async (resolve) => {
			game.turn += 1;
			game.menu = "end_turn";
			if (r == 1) {
				game.round += 1;
				game.menu = "end_round";
				//add round end rewards here
			}
			const result = await beeHandler("end_turn");
			//beeHandler("turn_end");
			buffHandler("end_turn", r);
			
			if (r != 1) document.getElementById("turn_end_button").style.visibility = "hidden";
			if (game.tutorial[1] == 4) {
				document.getElementById("bear_container").children[7].dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: false, view: window}));
			}
			return resolve("resolved");
		})
	}

	function startTurn() {
		if (game.baseStats.field_queue != "none") {
			if (game.baseStats.field == game.baseStats.field_queue) {
				game.baseStats.field_queue = "none";
			} else {
				fieldHandler("set", game.baseStats.field_queue);
			}
		}
		Object.keys(game.mobStats.actives).forEach((e) => {
			if (game.mobStats.actives[e].respawn > 0) {
				game.mobStats.actives[e].addRespawn(-1);
			}
		});
		Object.keys(game.mobStats.inactives).forEach((e) => {
			if (game.mobStats.inactives[e].despawn > 0) {
				game.mobStats.inactives[e].despawn -= 1;
			} else {
				if (game.mobStats.inactives[e].getRespawn() > 0) game.mobStats.inactives[e].addRespawn(-1);
			}
			if (game.mobStats.inactives[e].despawn == 0 && game.mobStats.inactives[e].respawn == 0) {
				delete game.mobStats.inactives[e];
			}
		});
		mobHandler("spawn_round");
		buffHandler("start_turn");
		saveHandler("save");
	}

	async function endRound() {
		await endTurn(1);
		game.questStats.option = [];
		let p = document.getElementById("resources_pollen").getBoundingClientRect();
		let h = document.getElementById("resources_honey").getBoundingClientRect();
		createAnimatedCurve(p.x + p.width / 2, p.y + p.height / 2 + 20, h.x + h.width / 2, h.y + h.height / 2 + 20, Math.random() * 30 - 60, "#fec650", 2, 500);
		shopHandler("pre");
	}}

function textHandler(action, data) {
	//update honey pollen tickets text
	if (action == "pollen_text") {
		createPollenText(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);
	} else if (action == "resources") {
		updateResources()
	} else if (action == "change") {
		return changeText(data[0], data[1]);
	}

	function createPollenText(x, y, text, color, pulse, size = 1, rotation = 0, dur = 2000, t = 1) {
		const d = document.createElement("p");
		if (color === undefined) {
			color = "#f0f0f0";
		}
		if (size === undefined) {
			size = 1;
		}
		Object.assign(d.style, {
			position: "absolute", left: x + "px", top: y + "px", translate: (t ? "-50% -150%" : "0px 0px"), margin: "0px", fontSize: "16px",/* color: color,*/ zIndex: 4999, opacity: 1, scale: size, pointerEvents: "none"
		});
		if (pulse === undefined) {
			pulse = color;
		}
		d.animate([{rotate: "0deg", color: color}, {rotate: rotation + "deg", color: pulse}, {rotate: "0deg", color: color}, {rotate: "-" + rotation + "deg", color: pulse}, {rotate: "0deg", color: color}], {duration: 1000, iterations: Infinity,});
		d.animate([{opacity: 1, top: y + "px"}, {opacity: 0, top: y - 50 + "px"}], {duration: dur, iterations: 1, fill: "forwards",});
		setTimeout(function() {
			d.remove();
		}, dur + 200);
		d.innerHTML = text;
		document.body.appendChild(d);
	}

	function updateResources() {
		let types = ["honey", "pollen", "tickets"];
		for (let i = 0; i < 3; i++) {
			let c = document.getElementById("resources_" + types[i]);
			if (i == 1) {
				c.innerHTML = game.baseStats[types[i]] + " / " + game.miscStats.capacity * calcStat("capacity_multiplier") / 100;
			} else {
				c.innerHTML = game.baseStats[types[i]];
			}
		}
	}

	function changeText(text, type) {
		text = text.toString();
		let string;
		if (type == "underscores") {
			string = toUnderscores(text);
		} else if (type == "camelcase") {
			string = toCamelCase(text);
		} else if (type == "regular") {
			string = toRegular(text);
		}
		return string;
		function toUnderscores(text) {
			let string = "";
			if (text.includes(" ")) {
				for (let i = 0; i < text.length; i++) {
					if (text[i] == " ") {
						string += "_" + text[i + 1].toLowerCase();
						i++;
					} else {
						string += text[i].toLowerCase();
					}
				}
			} else {
				let uppers = [];
				for (let i = 0; i < text.length; i++) {
					if (text[i] == text[i].toUpperCase()) {
						uppers.push(i);
					}
				}
				if (uppers.length != text.length) {
					for (let i = 0; i < text.length; i++) {
						if (uppers.indexOf(i) != -1 && i !== 0) {
							string += "_";
						}
						string += text[i].toLowerCase();
					}
				}
			}
			return string;
		}

		function toCamelCase(text) {
			let string = text[0];
			if (text.includes("_")) {
				for (let i = 1; i < text.length; i++) {
					if (text[i - 1] == "_") {
						string = string + text[i].toUpperCase();
					} else if (text[i] == "_") {
						continue;
					} else {
						string = string + text[i];
					}
				}
			} else {
				string = text[0].toLowerCase();
				for (let i = 1; i < text.length; i++) {
					if (text[i] == " ") {
						continue;
					} else {
						string = string + text[i];
					}
				}
			}
			return string;
		}

		function toRegular(text) {
			let string = text[0].toUpperCase();
			if (text.includes("_")) {
				for (let i = 1; i < text.length; i++) {
					if (text[i] == "_") {
						string = string + " " + text[i + 1].toUpperCase();
						i += 1;
					} else {
						string = string + text[i];
					}
				}
			} else {
				for (let i = 1; i < text.length; i++) {
					if (text[i] == text[i].toUpperCase() && text[i] != text[i].toLowerCase()) {
						string = string + " " + text[i];
					} else {
						string = string + text[i];
					}
				}
			}
			return string;
		}
	}}

function statHandler(action, data) {
	if (action == "calc") {
		return calcStats(data, 0);
	} else if (action == "reset") {
		resetStats();
	} else if (action == "get_pol") {
		return getPol(data);
	}

	function resetStats() {
		game.stats = {};
		for (let i of Object.keys(baseStats)) {
			game.stats[i] = {};
			if (nonPctStats.includes(i)) {
				game.stats[i].base = [0/*baseStats[i]*/, 100, 1];
			} else {
				game.stats[i].base = [0, baseStats[i] * 100, 1];
			}
			game.stats[i].calc = game.stats[i].base;
		}
		game.miscStats["unique_instant_conversion"].calc = [0, 0, 1];
		//maybe calc them all?
		game.buffs.forEach((e) => {
			e.calcBuff();
		});
		for (let i of Object.keys(game.stats)) {
			calcStats(i);
		}
		saveHandler("save");
	}

	function calcStats(name, inner) {
		if (name == "unique_instant_conversion") {
			Object.keys(game.miscStats[name]).forEach((e) => {
				if (e == "base" || e == "calc") return;
				game.miscStats[name].calc = [0, game.miscStats[name].calc[1] + game.miscStats[name][e].calc[3] / 100 * (100 - game.miscStats[name].calc[1]), 1];
			});
			game.miscStats[name].calc[3] = game.miscStats[name].calc[1];
			return game.miscStats[name];
		}
		let base = game.stats[name].base;
		if (Object.keys(statSubCats).includes(name)) {
			statSubCats[name].forEach((e) => {
				game.stats[name][e] = calcStats(e).calc;
			});
		}
		
		if (name.includes("_field_capacity")) {
			game.stats[name].base = [game.stats[name].base[0], fieldHandler("count", name.substr(0, name.indexOf("_")))[0], game.stats[name].base[2]]
		}

		game.stats[name].calc = game.stats[name].base;
		if (name == "capacity_multiplier") {
			game.stats[name].calc = [0, 0, 1];
		}
		Object.keys(game.stats[name]).forEach((e) => {
			if (e == "base" || e == "calc") return;
			if (e.includes("_field_capacity")) {
				game.stats[name].calc[1] = game.stats[name].calc[1] + game.stats[name][e][3];
				return;
			}
			if (e == "field_capacity") {
				game.stats[name].calc[2] = pf(game.stats[name].calc[2] * game.stats[name][e][3] / 100);
				return;
			}
			game.stats[name].calc = [game.stats[name].calc[0] + game.stats[name][e][0], game.stats[name].calc[1] + game.stats[name][e][1], pf(game.stats[name].calc[2] * game.stats[name][e][2])];
		});
		if (nonPctStats.includes(name)) {
			game.stats[name].calc[3] = pf((baseStats[name] + game.stats[name].calc[0]) * game.stats[name].calc[1] / 100 * game.stats[name].calc[2]);
		} else {
			game.stats[name].calc[3] = pf(game.stats[name].calc[1] * game.stats[name].calc[2]);
		}
		return game.stats[name];
	}

	function getPol(info) {
		//info[1] = bee object
		let stats = info[1].getStats();
		//[0] = "pollen", [1] = strength (gather = bee's gather, bomb = else, etc)
		if (info[0] == "pollen") {
			//factor in ic
			let color = pickRandom([fieldHandler("count", "white")[0] / 100, fieldHandler("count", "red")[0] / 100, fieldHandler("count", "blue")[0] / 100], ["white", "red", "blue"]);
			let textColorBase = textColors[color + "_pollen"];
			let textColorOverlay = textColors[color + "_pollen"];
			let crit = 0;
			let scrit = 0;
			let rotation = 0;
			let size = 1;
			if (Math.random() < calcStat("critical_chance") / 100) {
				textColorOverlay = textColors["crit"];
				crit = 1;
				rotation = 15;
				size  = 1.5;
			}
			if (crit && Math.random() < calcStat("super-crit_chance") / 100) {
				textColorOverlay = textColors["super-crit"];
				scrit = 1;
				size = 2;
			}
			let flower = pickRandom(fieldHandler("count", color)[1].map((e) => {return e / 100;}), [1, 2, 3, 4, 5]);
			let pollen = stats.gather * flower * calcStat("pollen") / 100 * calcStat(color + "_pollen") / 100 * (crit ? calcStat("critical_power") / 100 : 1) * (scrit ? calcStat("super-crit_power") / 100 : 1);
			if (info[1].getGifted()) {
				pollen *= 1.5;
			}
			//MUTATIONS
			pollen = Math.round(pollen);
			if (pollen > game.miscStats.capacity * calcStat("capacity_multiplier") / 100 - game.baseStats.pollen) {
				pollen = pf(game.miscStats.capacity * calcStat("capacity_multiplier") / 100 - game.baseStats.pollen);
			}
			console.log("Pollen: " + pollen + " base: " + stats.gather + " crit: " + crit + " scrit: " + scrit + " flower: " + flower);
			return [pollen, textColorBase, textColorOverlay, size, rotation];
		} else if (info[0] == "convert") {
			//factor in hah and hpp
			let c = (stats.convert + calcStat("convert_amount")) / stats.convert_speed * calcStat("convert_rate") / 100;
			if (beeHandler("relating", info[1].getIndex()) == "hive") {
				c *= calcStat("convert_rate_at_hive") / 100;
			}
			c *= calcStat(stats.color + "_bee_convert_rate") / 100;
			if (info[1].getGifted()) {
				c *= 1.5;
			}
			//MUTATIONS
			c = Math.round(c);
			if (c > game.baseStats.pollen) {
				c = game.baseStats.pollen;
			}
			console.log("Convert: " + c + " base: " + stats.convert + " speed: " + stats.convert_speed);
			return c;
		} else if (info[0] == "attack") {
			let a = stats.attack;
			let level = info[1].getLevel();
			let mob = info[2];
			let mobLevel = mob.level;
			let mobDef = mob.defense;
			let hitChance = level >= mobLevel ? 1 : 1 / (2 ** (mobLevel - level));
			let hit = Math.random() < hitChance;
			if (!hit) {
				//TESTING
				return [100, "#f0f0f0", "#f0f0f0", 1, 0];
				//return ["MISS", "#f0f0f0", "#f0f0f0", 1, 0];
			}
			a += calcStat("bee_attack");
			a += calcStat(stats.color + "_bee_attack");
			a *= calcStat("attack") / 100;
			//MUTATIONS
			let crit = 0;
			let scrit = 0;
			let rotation = 0;
			let size = 1;
			let textColorOverlay;
			if (Math.random() < calcStat("critical_chance") / 100) {
				textColorOverlay = textColors["damage_crit"];
				crit = 1;
				rotation = 15;
				size  = 1.5;
			}
			if (crit && Math.random() < calcStat("super-crit_chance") / 100) {
				textColorOverlay = textColors["damage_super-crit"];
				scrit = 1;
				size = 2;
			}
			a = a * (crit ? calcStat("critical_power") / 100 : 1) * (scrit ? 0.33 * calcStat("super-crit_power") + 67 : 1);
			a *= 1 - mobDef / 100;
			return [a, textColors.damage, textColorOverlay, size, rotation];
		}
	}}

function mobHandler(action, data) {
	let c = document.getElementById("mob_container").children[1];
	if (action == "spawn_round") {
		spawnRound();
	} else if (action == "setup") {
		setup();
	} else if (action == "attack") {
		return attackMob(data);
	} else if (action == "update") {
		updateMob(data[0], data[1]);
	} else if (action == "create") {
		createMobs();
	} else if (action == "switch") {
		switchField();
	}

	function setup() {
		game.mobStats = {};
		Object.keys(mobTypeStats).forEach((e) => {
			game.mobStats[e] = {
				"respawn": mobTypeStats[e].respawn == 10000 ? 10000 : 0
			}
		});
		game.mobStats["actives"] = {};
		game.mobStats["inactives"] = {};
		saveHandler("save");
	}

	function spawnRound() {
		while (c.children.length > 0) {
			c.firstElementChild.remove();
		}
		Object.keys(game.mobStats.actives).forEach((e) => {
			game.mobStats.inactives[e] = game.mobStats.actives[e];
		});
		game.mobStats.actives = {};
		for (let i = 0; i < fieldMobs[game.baseStats.field].length; i++) {
			let count = Object.keys(game.mobStats.actives).filter(a => game.field + "_" + fieldMobs[game.baseStats.field][i]).length;
			let x = game.baseStats.field + "_" + fieldMobs[game.baseStats.field][i] + "_" + count;
			if (game.mobStats.inactives[x]) {
				game.mobStats.actives[x] = game.mobStats.inactives[x];
				game.mobStats.actives[x].resetDespawn();
				delete game.mobStats.inactives[x];
			} else {
				let mob = mobTypeStats[fieldMobs[game.baseStats.field][i]];
				game.mobStats.actives[x] = new Mob(undefined, fieldMobs[game.baseStats.field][i], mob.hp, mob.damage, mob.level, 0, mob.despawn, mob.speed, game.baseStats.field, count, 0, x, false);
			}
		}
		createMobs();
	}

	function createMobs() {
		/*
		let len = fieldMobs[game.baseStats.field].length;
		let a = 0;
		let contains = [];
		Object.keys(game.mobStats.inactives).forEach((e) => {
			//if blue flower or mountain top etc check by counting underscores
			if (e.splice(0, e.indexOf("_")) == game.baseStats.field) {
				a += 1;
				contains.push(e);
			}
		});
		if (a != len) {
			for (let i = 0; i < len; i++) {

			}
		}
		*/
		for (let i = 0; i < Object.keys(game.mobStats.actives).length; i++) {
			let mob = game.mobStats.actives[Object.keys(game.mobStats.actives)[i]];
			let timer = 0;
			if (mob.getRespawn() > 0) {
				timer = 1;
			}
			const a = document.createElement("div");
			c.appendChild(a);
			const b = document.createElement("p");
			const d = document.createElement("img");
			const f = document.createElement("p");
			a.appendChild(b);
			a.appendChild(d);
			a.appendChild(f);
			const g = document.createElement("div");
			a.appendChild(g);
			let r = a.getBoundingClientRect();
			let center = [r.x + r.width / 2, r.y + r.y / 2];
			g.onmouseenter = function() {
				console.log("here");
    			const h = document.createElement("div");
    			h.id = "bees_infobox";
    			//h.innerHTML = game.cardList[b.dataset.index].getShow();
    			h.innerHTML = game.mobStats.actives[a.dataset.mobID].getShow();
    			h.style.top = a.getBoundingClientRect().height + "px";
    			a.appendChild(h);    			
    		}
    		g.onmouseleave = function() {
    			while (a.children.length > 4) {
    				a.lastElementChild.remove();
    			}
    		}
			updateMob(game.mobStats.actives[Object.keys(game.mobStats.actives)[i]], a, timer);
		}
		saveHandler("save");
	}

	function updateMob(mob, a, timer) {
		let b = a.children[0];
		let d = a.children[1];
		let f = a.children[2];
		a.dataset.mobID = mob.getIden();
		if (timer) {
			d.src = "images/empty.png";
			f.innerHTML = "Respawn<br>" + mob.getRespawn() + " Turn" + (mob.getRespawn() > 1 ? "s" : "");
		} else {
			d.src = "images/mobs/" + mob.getType() + ".png";
			f.innerHTML = "Level " + mob.getLevel() + "<br>HP " + mob.getHP();
		}
		b.innerHTML = textHandler("change", [mob.getType(), "regular"]);
		let w = c.getBoundingClientRect().width;
		Object.assign(a.style, {
			position: "relative", width: w * 0.33 + "px", height: w * 0.33 + "px"
		});
		Object.assign(b.style, {
			color: "#f0f0f0", position: "absolute", left: "50%", top: "15%", fontSize: "8px", translate: "-50% -50%", textAlign: "center", margin: "0px"
		});
		if (mob.getType() == "stick_bug") {
			Object.assign(d.style, {
				position: "absolute", left: "50%", top: "50%", width: "50%", translate: "-50% -50%"
			});
		} else {
			Object.assign(d.style, {
				position: "absolute", left: "50%", top: "50%", width: "100%", translate: "-50% -50%"
			});
		}
		Object.assign(f.style, {
			color: "#f0f0f0", position: "absolute", left: "50%", top: "85%", fontSize: "8px", translate: "-50% -50%", textAlign: "center", margin: "0px"
		});
	}

	function attackMob(info) {
		let d = info[0];
		let mob = info[1];
		let bee = info[2];
		let beePos = info[3];
		//check respawn on turn start else show timer
		if (mob === undefined) {
			return "end";
		}
		mob.addHP(-d[0]);
		if (mob.getHP() <= 0) {
			//add loot
			game.mobStats.actives[mob.getIden()].resetRespawn();
			game.mobStats.inactives[mob.getIden()] = game.mobStats.actives[mob.getIden()];
			game.mobStats.inactives[mob.getIden()].resetHP();
			delete game.mobStats.actives[mob.getIden()];
			return "kill";
		}
		return "continue";
	}

	function switchField() {
		/*
		Object.keys(game.mobStats.actives).forEach((e) => {
			game.mobStats.inactives[e] = game.mobStats.actives[e];
			delete game.mobStats.actives[e];
		});
		*/
	}}

function questHandler(action, data) {
	const q = document.getElementById("quest_container");
	if (action == "gen") {
		return genQuest();
	} else if (action == "show") {
		show();
	}

	function genQuest() {
		let tasks = [];
		let round = game.round;
		let colors = ["white", "red", "blue"];
		let pollenBase = getBasePollen(round);
		let honeyBase = 2 * pollenBase;
		let gooBase = 1.2 * pollenBase;
		let convertBase = 0.8 * pollenBase;
		let sections = Math.floor(Math.random() * 3) + 1;
		let fields = [];
		let reward = round + 9;
		let beeCount = game.baseStats.bee_count;
		for (let i of Object.keys(fieldStats)) {
			if (fieldStats[i].zone <= beeCount && i != "ant_challenge") {
				fields.push(i);
			}
		}
		let fieldMult = {
			0: 0.5,
			5: 0.6,
			10: 0.6,
			15: 0.75,
			25: 0.8,
			35: 1
		};
		/*
		quest types - difficulty
		convert - +1
		honey - +1
		pollen - +1
		goo - +3
		honey convert - 2
		x field - 1
		x field convert - 2
		x field honey - 2
		white x pollen - 2
		red blue pollen - 3
		red white blue fields - 4
		3 x fields - 2
		goo x pollen - 4
		*/
		if (sections == 3 && Math.random() > 0.4 && beeCount >= 15) {
			let color = colors[Math.floor(Math.random() * 3)];
			fields = [];
			if (color == "blue") {
				fields.push("pine_tree", "bamboo", "blue_flower");
			} else if (color == "red") {
				fields.push("rose", "strawberry", "mushroom");
			} else {
				fields.push("pumpkin", "pineapple", "dandelion");
			}
			for (let i = 0; i < 3; i++) {
				let task = [fields[i] + "_pollen", 0.4 * pollenBase * (fieldMult[fieldStats[fields[i]].zone])	];
				tasks.push(task);
			}
			reward += 2;
			return [tasks, reward];
		}
		for (let i = 0; i < sections; i++) {
			let type = pickRandom(game.questStats.type_biases, ["pollen", "honey", "goo", "convert"]);
			let task;
			if (type == "pollen") {
				reward += 1;
				if (Math.random() > 0.333) {
					if (Math.random() > 0.5) {
						//color
						task = [5, colors[Math.floor(Math.random() * 3)] + "_pollen", pollenBase * (sections == 1 ? 0.8 : sections == 2 ? 0.4 : 0.25)];
					} else {
						//field
						//sort by field order
						let f = fields[Math.floor(Math.random() * fields.length)];
						task = [6, f + "_pollen", (sections == 1 ? 1 : sections == 2 ? 0.8 : 0.5) * pollenBase * (fieldMult[fieldStats[f].zone])];
					}
				} else {
					//regular pollen
					task = [4, "pollen", pollenBase * (1.25 - 0.25 * sections)];
				}
			} else if (type == "honey") {
				reward += 1;
				task = [1, "honey", honeyBase * (1.25 - 0.25 * sections)];
			} else if (type == "goo") {
				reward += 1;
				task = [3, "goo", gooBase * (1.25 - 0.25 * sections)];
			} else if (type == "convert") {
				reward += 1;
				task = [2, "convert", convertBase * (1.25 - 0.25 * sections)];
			}
			let same = 0;
			for (let j = 0; j < tasks.length; j++) {
				if (tasks[j][0] == task[0] && tasks[j][1] == task[1]) {
					same = 1;
					break;
				}
			}
			if (!same) {
				tasks.push(task);
			} else {
				i--;
			}
		}
		tasks.sort((a, b) => {return a[0] < b[0] ? -1 : 1});
		tasks = tasks.map((e) => {
			return e.splice(1);
		});
		return [tasks, reward];
	}

	function show() {
		let quests = [];
		if (game.questStats.options[0]) {
			quests = game.questStats.options;
		}
		document.getElementById("bear_container").style.opacity = 1;
		bearHandler("hide_button");
		document.getElementById("quest_container").style.opacity = 1;
		bearHandler("quest");
		for (let i = 0; i < game.questStats.count; i++) {
			q.children[i].style.pointerEvents = "auto";
			q.children[i].onmouseover = function() {
				q.children[i].style.boxShadow = "inset 0 0 10px 0px #ffff00";
				q.children[i].style.zIndex = 4000;
			};
			q.children[i].onmouseleave = function() {
				q.children[i].style.boxShadow = "none";
				q.children[i].style.zIndex = 498;
			}
			q.children[i].onclick = function() {
				game.questStats.current = quests[i];
				hide();
				for (let j = 0; j < 4; j++) {
					q.children[i].children[0].innerHTML = "";
				}
				saveHandler("save");
			}
			q.children[i].style.left = "calc(" + (50 * (i % 2)) + "% + " + (3 * (i % 2)) + "px)";
			q.children[i].style.top = "calc(" + (50 * Math.floor(i / 2)) + "% + " + (3 * Math.floor(i / 2)) + "px)";
			const a = q.children[i].children[0];
			if (game.questStats.options[0]) {

			} else {
				let quest = genQuest();
				while (quests.indexOf(quest.toString()) != -1) {
					quest = genQuest();
				}
				quests.push(quest);
			}
			a.innerHTML = "";
			quests[i][0].forEach((e) => {
				console.log(e);
				if (e[0].includes("pollen")) {
					if (e[0] == "pollen") {
						a.innerHTML += "Collect " + e[1] + " pollen.";
					} else if (e[0] == "red_pollen" || e[0] == "blue_pollen" || e[0] == "white_pollen") {
						a.innerHTML += "Collect " + e[1] + " " + textHandler("change", [e[0], "regular"]) + ".";
					} else {
						a.innerHTML += "Collect " + e[1] + " pollen from the " + textHandler("change", [e[0].substring(0, e[0].length - 7), "regular"]) + " field."; 
					}
				} else if (e[0].includes("convert")) {
					a.innerHTML += "Convert " + e[1] + " pollen from the hive.";
				} else if (e[0].includes("honey")) {
					a.innerHTML += "Make " + e[1] + " honey.";
				} else if (e[0].includes("goo")) {
					a.innerHTML += "Collect " + e[1] + " goo.";
				} else {
					a.innerHTML += "NONE";
				}
				a.innerHTML += "<br><br>";
			});
			q.children[i].appendChild(a);
			while (a.getBoundingClientRect().height < 143) {
				a.innerHTML += "<br>";
			}
			a.innerHTML += "Reward: " + quests[i][1] + " tickets.";
		}
		game.questStats.options = quests;
		saveHandler("save");
	}

	function hide() {
		document.getElementById("bear_container").style.opacity = 0;
		q.style.opacity = 0;
		q.style.zIndex = 498;
		game.menu = "shop_open";
		shopHandler("open");
	}

	function getBasePollen(round) {
		if (round == 0) round = 1;
		let p = Math.floor(20 * (10 * round) ** (2 ** (game.questStats.scaling * round)));
		if (p < 1000) {
			p = Math.round(p / 100) * 100;
		} else {
			p = parseInt(p.toString().substr(0, 2)) * 10 ** (Math.floor(Math.log10(p)) - 1);
		}
		return p;
	}}

function dragHandler(action, elem) {
  	let c0;
    let c1;
   	let c2;
	if (action == "update") {
  		updateContainers();
  		return;
  	}
  	let top;
  	let left;
  	let distX;
  	let distY;
  	elem.onmousedown = dragMouseDown;
  	let index;
  	let orig = [];
   	function updateContainers() {
   		c0 = document.getElementById("field_container").getBoundingClientRect();
    	c1 = document.getElementById("hive_container").getBoundingClientRect();
   		c2 = document.getElementById("mob_container").getBoundingClientRect();
   	}
  	function dragMouseDown(e) {
  		if (elemDragging) return;
  		elemDragging = 1;
    	e.preventDefault();
    	let rect = elem.getBoundingClientRect();
    	left = rect.x + (rect.width - rect.width / parseFloat(window.getComputedStyle(elem).getPropertyValue("scale"))) / 2;
    	top = rect.y + (rect.height - rect.height / parseFloat(window.getComputedStyle(elem).getPropertyValue("scale"))) / 2;
    	distX = e.clientX - left;
    	distY = e.clientY - top;
    	let temp = window.getComputedStyle(elem).getPropertyValue("bottom");
    	orig = [left + "px", top + parseFloat(temp) - (elem.parentElement == document.getElementById("card_holder") ? 0 : 30) + "px"];
    	index = Array.from(elem.parentNode.children).indexOf(elem);
    	let parent = elem.parentElement;
    	for (let i of parent.children) {
    		if (i != elem) {
    			i.style.pointerEvents = "none";
    		}
    	}
    	document.body.appendChild(elem);
    	cardHandler("update", parent);
    	elem.style.position = "absolute";
    	elem.style.margin = "0px";
    	elem.style.left = left + "px";
    	elem.style.top = top + "px";
    	document.onmouseup = function(e) {closeDragElement(e, parent)};
    	document.onmousemove = elementDrag;
  	}
  	function elementDrag(e) {
  		let c0 = document.getElementById("field_container").getBoundingClientRect();
    	let c1 = document.getElementById("hive_container").getBoundingClientRect();
   		let c2 = document.getElementById("mob_container").getBoundingClientRect();
    	e.preventDefault();
    	elem.style.pointerEvents = "none";
    	elem.style.scale = "1.5";
    	elem.style.left = e.clientX - distX + "px";
    	elem.style.top = e.clientY - distY + "px";
    	let x = e.clientX;
    	let y = e.clientY;
    	let colors = ["#006400", "#85670C", "#bc3c3c", "#a27417"];
    	let type = game.cardList[elem.dataset.cardID].getType();
    	if (type == "consumable") {
    		colors = ["#006464", "#006464", "#006464"];
    	}
    	if (y < window.innerHeight * 0.95 - 189 && type == "consumable" && game.menu != "quest_select" && game.menu != "shop_open") {
    		if (type == "consumable") {
    			let contains = 0;
    			if (elem.getAnimations().length != 0) {
    				for (let i of elem.getAnimations()) {
    					if (i.id != "move_back" && i.id != "consumable") {
    						i.cancel();
    					}
    					if (i.id == "consumable") {
    						contains = 1;
    					}
    				}
    			}
    			if (contains) return;
    			//const c = elem.animate([{backgroundColor: "#505050"}, {backgroundColor: "#006464"}, {backgroundColor: "#505050"}], {duration: 2000, iterations: Infinity,});
    			const c = elem.animate([{boxShadow: "inset 0 0 10px 0px #006464"}, {boxShadow: "inset 0 0 30px 0px #006464"}, {boxShadow: "inset 0 0 10px 0px #006464"}], {duration: 2000, iterations: Infinity, easing: "ease-in-out"});
    			c.id = "consumable";
    			return;
    		}
    	} else if (/*c0.x < x && x < c0.x + c0.width*/document.getElementById("field_container").matches(":hover") && game.menu != "quest_select" && game.menu != "shop_open") {
    			let contains = 0;
    			if (elem.getAnimations().length != 0) {
    				for (let i of elem.getAnimations()) {
    					if (i.id == "hive" || i.id == "mob") {
    						i.cancel();
    					}
    					if (i.id == "field") {
    						contains = 1;
    					}
    				}
    			}
    			if (contains) return;
    			//const c = elem.animate([{backgroundColor: "#505050"}, {backgroundColor: colors[0]}, {backgroundColor: "#505050"}], {duration: 2000, iterations: Infinity,});
    			const c = elem.animate([{boxShadow: "inset 0 0 10px 0px " + colors[0]}, {boxShadow: "inset 0 0 30px 0px " + colors[0]}, {boxShadow: "inset 0 0 10px 0px " + colors[0]}], {duration: 2000, iterations: Infinity, easing: "ease-in-out"});
    			c.id = "field";
    		} else if (/*c1.x < x && x < c1.x + c1.width*/document.getElementById("hive_container").matches(":hover") && game.menu != "quest_select" && game.menu != "shop_open") {
    			let contains = 0;
    			if (elem.getAnimations().length != 0) {
    				for (let i of elem.getAnimations()) {
    					if (i.id == "field" || i.id == "mob") {
    						i.cancel();
    					}
    					if (i.id == "hive") {
    						contains = 1;
    					}
    				}
    			}
    			if (contains) return;
   				//const c = elem.animate([{backgroundColor: "#505050"}, {backgroundColor: colors[1]}, {backgroundColor: "#505050"}], {duration: 2000, iterations: Infinity,});
   				const c = elem.animate([{boxShadow: "inset 0 0 10px 0px " + colors[1]}, {boxShadow: "inset 0 0 30px 0px " + colors[1]}, {boxShadow: "inset 0 0 10px 0px " + colors[1]}], {duration: 2000, iterations: Infinity, easing: "ease-in-out"});
   				c.id = "hive";
    		} else if (/*c2.x < x && x < c2.x + c2.width*/document.getElementById("mob_container").matches(":hover") && game.menu != "quest_select" && game.menu != "shop_open") {
    			let contains = 0;
    			if (elem.getAnimations().length != 0) {
    				for (let i of elem.getAnimations()) {
    					if (i.id == "field" || i.id == "hive") {
    						i.cancel();
    					}
    					if (i.id == "mob") {
    						contains = 1;
    					}
    				}
    			}
    			if (contains) return;
    			//const c = elem.animate([{backgroundColor: "#505050"}, {backgroundColor: colors[2]}, {backgroundColor: "#505050"}], {duration: 2000, iterations: Infinity,});
    			const c = elem.animate([{boxShadow: "inset 0 0 10px 0px " + colors[2]}, {boxShadow: "inset 0 0 30px 0px " + colors[2]}, {boxShadow: "inset 0 0 10px 0px " + colors[2]}], {duration: 2000, iterations: Infinity, easing: "ease-in-out"});
    			c.id = "mob";
    		} else if (game.menu == "shop_open") {
    			let contains = 0;
    			let temp = 0;
    			let a = document.getElementById("shop_container").children[0].children;
    			for (let i = 0; i < a.length; i++) {
    				if (a[i].matches(":hover")) {
    					temp = 1;
    					if (elem.getAnimations().length != 0) {
    						for (let j of elem.getAnimations()) {
    							if (j.id == "treat") {
    								contains = 1;
    							}
    						}
    					}
    				}
    			}
    			if (temp == 0) {
    				for (let i of elem.getAnimations()) {
    					if (i.id == "treat") {
    						i.cancel();
    					}
    				}
    			}
    			if (contains || temp == 0) return;
    			const c = elem.animate([{boxShadow: "inset 0 0 10px 0px " + colors[3]}, {boxShadow: "inset 0 0 30px 0px " + colors[3]}, {boxShadow: "inset 0 0 10px 0px " + colors[3]}], {duration: 2000, iterations: Infinity, easing: "ease-in-out"});
    			c.id = "treat";
    		} else {
    			for (let i of elem.getAnimations()) {
    				if (i.id == "field" || i.id == "hive" || i.id == "mob" || i.id == "consumable" || i.id == "treat") {
    					i.cancel();
    				}
    			}
    		}/*
    	} else {
    		for (let i of elem.getAnimations()) {
    			if (i.id == "field" || i.id == "hive" || i.id == "mob" || i.id == "consumable") {
    				i.cancel();
    			}
    		}
    	}*/
  	}

  	async function closeDragElement(e, location) {
  		elemDragging = 0;
    	let c;
    	let x = e.clientX;
    	let y = e.clientY;
    	let checks = 0;
    	for (let i of elem.getAnimations()) {
    		if (i.id == "field" || i.id == "hive" || i.id == "mob" || i.id == "consumable" || i.id == "treat") {
    			c = i.id;
    		}
    	}
    	if (c == "treat") {
    		let a = document.getElementById("shop_container").children[0].children;
    		for (let i = 0; i < a.length; i++) {
    			if (a[i].matches(":hover")) {
    				checks = 1;
    				break;
    			}
    		}
    	} else if (y < window.innerHeight * 0.95 - 189 && c == "consumable") {
    		checks = 1;
    	} else if (document.getElementById("field_container").matches(":hover") && c == "field") {
    		checks = 1;
    	} else if (document.getElementById("hive_container").matches(":hover") && c == "hive") {
    		checks = 1;
    	} else if (document.getElementById("mob_container").matches(":hover") && c == "mob") {
    		checks = 1;
    	}
    	if (c === undefined || checks == 0) {
   			moveCardBack(elem, orig, index, location);
    		return;
    	}
    	if (game.tutorial[0] == 1 && false) {
    		if (c == "field" || c == "hive" || c == "mob") {
    			if (document.getElementById(c + "_container").children[0].children.length > 0) {
    				moveCardBack(elem, orig, index, location);
    				return;
    			}
    		}
    	}    	
    	let card = game.cardList[elem.dataset.cardID];
    	if (card.getType() == "bee") {
    		const b = document.createElement("div");
    		const a = document.createElement("img");
    		a.src = "images/bee_models/" + (card.getGifted() ? card.getName() + "_gifted" : card.getName()) + ".png";
    		//a.style.scale = "1.5";
    		b.dataset.index = card.getIndex();
    		if (game[c + "Bees"].includes(card.getIndex())) {
    			document.getElementById(c + "_container").children[0].children[game[c + "Bees"].indexOf(card.getIndex())].remove();
    			game[c + "Bees"].splice(game[c + "Bees"].indexOf(card.getIndex()), 1);
    		}
    		document.getElementById(c + "_container").children[0].appendChild(b);
    		b.appendChild(a);
    		game[c + "Bees"].push(card.getIndex());
    		b.onmouseenter = function() {
    			const d = document.createElement("div");
    			d.id = "bees_infobox";
    			d.innerHTML = game.cardList[b.dataset.index].getShow();
    			if (b.style.scale == "1.5") d.style.transform = "scale(" + 2 / 3 + ")";
 				d.style.left = b.style.scale == "1.5" ? ((b.getBoundingClientRect().width - (b.getBoundingClientRect().width / 1.5)) / 2) / 1.5 + "px" : "0px";
    			d.style.bottom = b.getBoundingClientRect().height / b.style.scale + "px";
    			b.appendChild(d);
    			let s = setInterval(function() {
    				if (b.style.scale == "1.5") {
    					d.style.transform = "scale(" + 2 / 3 + ")";
    					d.style.bottom = b.getBoundingClientRect().height / 1.5 + "px";
    					d.style.left = ((b.getBoundingClientRect().width - (b.getBoundingClientRect().width / 1.5)) / 2) / 1.5 + "px";
    				} else {
    					d.style.transform = "scale(1)";
    					d.style.bottom = b.getBoundingClientRect().height + "px";
    					d.style.left = "0px";
    					clearInterval(s);
    				}
    			}, 10);
    		}
    		b.onmouseleave = function() {
    			while (b.children.length > 1) {
    				b.lastElementChild.remove();
    			}
    		}
    		buffHandler("tokens", [elem.dataset.cardID, b, 2]);
    		for (let i of location.children) {
    			i.style.pointerEvents = "auto";
    		}
    	} else if (card.getType() == "consumable") {
    		let arr = buffHandler("add", [card.getName(), {x: e.clientX, y: e.clientY}, 0]);
    		let stack = 0;
    		for (let k = 0; k < game.buffs.length; k++) {
				if (game.buffs[k].getName() == card.getName()) {
					stack = game.buffs[k].getStack();
					break;
				}
			}
    		buffHandler("show", [arr[8], 1, undefined, stack]);
    		createAnimatedCurve(e.clientX, e.clientY, arr[2](), arr[3](), arr[4], arr[5], arr[6], arr[7]);
    		card.addCount(-1);
    		if (card.getCount() <= 0) {
    			cardHandler("delete", card.getIndex());
    			saveHandler("save");
    		} else {
    			moveCardBack(elem, orig, index, location);
    			saveHandler("save");
    			return;
    		}
    	} else if (card.getType() == "treat") {
    		let a = document.getElementById("shop_container").children[0].children;
    		for (let i = 0; i < a.length; i++) {
    			if (a[i].matches(":hover")) {
    				//create info box for treat box; count, until gifted, until mutation etc
    				let beeIndex = a[i].dataset.index;
    				const b = document.createElement("div");
    				b.id = "treats_infobox";
    				document.body.appendChild(b);
    				Object.assign(b.style, {
    					top: a[i].getBoundingClientRect().y + a[i].getBoundingClientRect().height + "px",
    					left: a[i].getBoundingClientRect().x + "px"
    				});
    				for (let j = 0; j < 4; j++) {
    					b.appendChild(document.createElement("div"));
    				}
    				let temp = ["p", "button", "input", "button", "button", "button", "button"];
    				for (let j = 0; j < temp.length; j++) {
    					b.children[Math.floor((j + 1) / 2)].appendChild(document.createElement(temp[j]));
    				}
    				b.children[0].style.margin = "0px 0px 5px 0px";
    				b.children[1].style.margin = "0px 0px 5px 0px";
    				b.children[3].style.margin = "5px 0px 0px 0px";
    				b.children[0].children[0].innerHTML = "feed bee treats";
    				b.children[1].children[0].innerHTML = "Feed:";
    				b.children[1].children[0].onclick = function() {
    					if (b.children[1].children[1].value == "") b.children[1].children[1].value = 1;
    					if (b.children[1].children[1].value == 0) return;
    					card.useTreat(b.children[1].children[1].value, beeIndex, 0, 0, 0);
    					b.remove();
    				}
    				b.children[1].children[1].oninput = function() {
    					b.children[1].children[1].value = b.children[1].children[1].value.replace(/[^0-9]+/g, '');
    				}
    				Object.assign(b.children[1].children[1], {
    					type: "text", placeholder: 1, id: "temp_feed_num"
    				});
    				b.children[2].children[0].innerHTML = "Cancel";
    				b.children[2].children[0].onclick = function() {
    					b.remove();
    				}
    				let cal = card.calcTreatsBond(beeIndex, game.cardList[beeIndex].getBond(), bondLevels[game.cardList[beeIndex].getLevel() - 1]);
    				if (cal == "None") {
    					b.children[2].children[1].innerHTML = "All";
    				} else {
    					b.children[2].children[1].innerHTML = "Level up<br>(" + cal + ")";
    				}
    				b.children[2].children[1].onclick = function() {
    					card.useTreat(card.getCount(), beeIndex, 0, 0, 1);
    					b.remove();
    				}
    				if (game.cardList[beeIndex].getGifted() || card.getGifted()[Object.keys(rarityColors).indexOf(game.cardList[beeIndex].getRarity())] == 0) {
    					b.children[3].children[0].style.visibility = "hidden";
    				}
    				b.children[3].children[0].innerHTML = "Until Gifted";
    				b.children[3].children[0].onclick = function() {
    					card.useTreat(card.getCount(), beeIndex, 1, 0, 0);
    					b.remove();
    				}
    				if (game.cardList[beeIndex].getRadioactive() ? card.getMut() == 0 : card.getMutWO() == 0) {
    					b.children[3].children[1].style.visibility = "hidden";
    				}
    				b.children[3].children[1].innerHTML = "Until Mutation";
    				b.children[3].children[1].onclick = function() {
    					card.useTreat(card.getCount(), beeIndex, 0, 1, 0);
    					b.remove();
    				}
    				if (b.children[3].children[0].style.visibility == "hidden" && b.children[3].children[1].style.visibility == "hidden") {
    					b.children[3].style.margin = "0px";
    					b.children[3].children[0].style.display = "none";
    					b.children[3].children[1].style.display = "none";
    				}
    			}
    		}
    		moveCardBack(elem, orig, index, location);
    		return;
    	}
    	game.discardPile.push(game.hand.splice(game.hand.indexOf(card.getIndex()), 1)[0]);
    	saveHandler("save");
    	elem.remove();
    	cardHandler("update", location);
    	if (game.tutorial[0] == 1 && game.tutorial[1] == 2 && game.hiveBees.length > 0 && game.fieldBees.length > 0 && game.mobBees.length > 0) {
    		game.tutorial[3] = "visible";
    		setTimeout(function() {
    			bearHandler("show_button");
			}, 500 / game.speed);
    	}
    	document.onmouseup = null;
    	document.onmousemove = null;
  	}

  	async function moveCardBack(elem, orig, index, location) {
  		if (location === undefined) location = "card_holder";
		for (let i of elem.getAnimations()) {
    		if (i.id == "field" || i.id == "hive" || i.id == "mob" || i.id == "consumable" || i.id == "treat") {
    			i.cancel();
    		}
    	}
    	document.onmouseup = null;
    	document.onmousemove = null;
    	let vector = [parseInt(orig[0]) - parseInt(elem.style.left), parseInt(orig[1]) - parseInt(elem.style.top)];
    	let mag = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
    	let unit = vector.map((e) => {
    		return e / mag;
    	});
    	let total = mag;
    	elem.style.transition = "all 0.3s ease, left 0s, top 0s, margin 0s, scale 0s";
    	let temp = 1;
    	while (mag > 1.5) {
    		await sleep(10 / game.speed);
    		let speed = mag * 0.1;
    		speed = Math.max(speed, 0.5);
    		elem.style.left = parseFloat(elem.style.left) + unit[0] * speed + "px";
    		elem.style.top = parseFloat(elem.style.top) + unit[1] * speed + "px";
    		elem.style.scale = (1 + mag / (2 * total));
    		vector = [parseFloat(orig[0]) - parseFloat(elem.style.left), parseFloat(orig[1]) - parseFloat(elem.style.top)];
    		mag = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
    		if (mag < 50 && temp) {
    			const a = document.createElement("div");
    			Object.assign(a.style, {
    				width: "92px", position: "relative"
    			});
    			if (!location.firstChild) {
    				location.appendChild(a);
    			} else {
					location.insertBefore(a, Array.from(location.children)[index]);
				}
				cardHandler("update", location);
				temp = 0;
    		}
    	}
    	elem.style.left = parseFloat(orig[0]) + "px";
    	elem.style.top = parseFloat(orig[1])/* + 30*/ + "px";
    	elem.style.transition = "all 0.3s ease, left 0s, top 0s, margin 0s";
    	if (!location.firstChild) {
    		location.appendChild(elem);
    	} else {
    		location.children[index].remove();
			location.insertBefore(elem, Array.from(location.children)[index]);
		}
    	elem.style.transition = "all 0.3s ease, left 0s, top 0s, margin 0s, bottom 0s";
    	setTimeout(function() {
    		elem.style.transition = "all 0.3s ease, left 0s, top 0s, margin 0s";
    	}, 20);
    	elem.style.top = "";
    	elem.style.bottom = "";
    	elem.style.left = "0px";
    	elem.style.position = "relative";
    	elem.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true, cancelable: false, view: window}));
    	for (let i of location.children) {
    		i.style.pointerEvents = "auto";
    	}
	}}

function saveHandler(action, data) {
	if (action == "save") {
		save();
	} else if (action == "load") {
		load(data);
	} else if (action == "auto") {
		autoSave();
	}

	function autoSave() {
		setInterval(function() {
			save();
		}, 5000);
	}

	function save() {
		game.lastSave = Date.now();
		localStorage.setItem("game", JSON.stringify(game));
		localStorage.setItem("last", game.lastSave);
	}

	function load(t) {
		if (t) {
			localStorage.clear();
		}
		const temp = localStorage.getItem("game");
		if (temp != null) {
			let gameTemp = JSON.parse(temp);
			for (let i in gameTemp) {
				if (typeof gameTemp[i] === "object" && !Array.isArray(gameTemp[i])) {
					for (let j in gameTemp[i]) {
						game[i][j] = gameTemp[i][j];
					}
				} else {
					game[i] = gameTemp[i];
				}
			}
			textHandler("resources");

			game.cardList = game.cardList.map((e) => {
				return e[0][1] == "bee" ? new BeeCard(e) : e[0][1] == "consumable" ? new ConsumableCard(e) : new TreatCard(e);
			});
			game.buffs = game.buffs.map((e) => {
				return new Buff(e);
			});

			buffHandler("reload");
			//add if not in shop
			if (true) {
				bearHandler("set");
				if (game.tutorial[1] >= 2) {
					document.getElementById("field_container").style.opacity = 1;
					document.getElementById("hive_container").style.opacity = 1;
					document.getElementById("mob_container").style.opacity = 1;
					setTimeout(function() {
						fieldHandler("resize");
					}, 20);
					let cats = ["hive", "field", "mob"];
					for (let i = 0; i < 3; i++) {
						for (let j = 0; j < game[cats[i] + "Bees"].length; j++) {
							let card = game.cardList[game[cats[i] + "Bees"][j]];
							const b = document.createElement("div");
							const a = document.createElement("img");
    						a.src = "images/bee_models/" + (card.getGifted() ? card.getName() + "_gifted" : card.getName()) + ".png";
    						b.dataset.index = card.getIndex();
    						b.style.scale = "1.0";
    						document.getElementById(cats[i] + "_container").children[0].appendChild(b);
    						b.appendChild(a);
    						b.onmouseenter = function() {
    							const d = document.createElement("div");
    							d.id = "bees_infobox";
    							d.innerHTML = game.cardList[b.dataset.index].getShow();
    							if (b.style.scale == "1.5") d.style.transform = "scale(" + 2 / 3 + ")";
 								d.style.left = b.style.scale == "1.5" ? ((b.getBoundingClientRect().width - (b.getBoundingClientRect().width / 1.5)) / 2) / 1.5 + "px" : "0px";
    							d.style.bottom = b.getBoundingClientRect().height / b.style.scale + "px";
    							b.appendChild(d);
    							let s = setInterval(function() {
    								if (b.style.scale == "1.5") {
    									d.style.transform = "scale(" + 2 / 3 + ")";
    									d.style.bottom = b.getBoundingClientRect().height / 1.5 + "px";
    									d.style.left = ((b.getBoundingClientRect().width - (b.getBoundingClientRect().width / 1.5)) / 2) / 1.5 + "px";
    								} else {
    									d.style.transform = "scale(1)";
    									d.style.bottom = b.getBoundingClientRect().height + "px";
    									d.style.left = "0px";
    									clearInterval(s);
    								}
    							}, 100);
    						}
    						b.onmouseleave = function() {
    							while (b.children.length > 1) {
    								b.lastElementChild.remove();
    							}
    						}
						}
					}
					for (let i = 0; i < game.hand.length; i++) {
						cardHandler("hand", [game.hand[i]]);
					}
					Object.keys(game.mobStats.actives).forEach((e) => {
						game.mobStats.actives[e] = new Mob(game.mobStats.actives[e]);
					});
					Object.keys(game.mobStats.inactives).forEach((e) => {
						game.mobStats.inactives[e] = new Mob(game.mobStats.inactives[e]);
					});
					//set bear text to correct if quest
				}
			}
			console.log(game.cardList);
			menuHandler("reload");
			initSaved();
		} else {
			init();
		}
		autoSave();
	}}

function settingHandler(action, data) {
	if (action == "open") {
		openMenu();
	} else if (action == "close") {

	}

	function openMenu() {

	}

	function closeMenu() {

	}}

function menuHandler(action, data) {
	if (action == "reload") {
		reloadMenu();
	}

	async function reloadMenu() {
		await sleep(10);
		if (game.menu == "end_round") {
			buffHandler("end_turn", 1);
			game.questStats.option = [];
			let p = document.getElementById("resources_pollen").getBoundingClientRect();
			let h = document.getElementById("resources_honey").getBoundingClientRect();
			createAnimatedCurve(p.x + p.width / 2, p.y + p.height / 2 + 20, h.x + h.width / 2, h.y + h.height / 2 + 20, Math.random() * 30 - 60, "#fec650", 2, 500);
			shopHandler("pre");
		} else if (game.menu == "quest_select" || game.menu == "shop_open") {
			const c = ["hive_container", "field_container", "mob_container", "card_holder", "buffs_container", "bear_container", "quest_container", "turn_end_button"];
			c.forEach((e) => {
				document.getElementById(e).style.transition = "opacity 0s ease-in-out";
				document.getElementById(e).style.opacity = 0;
			});
			document.getElementById("hive_container").style.pointerEvents = "none";
			document.getElementById("field_container").style.pointerEvents = "none";
			document.getElementById("mob_container").style.pointerEvents = "none";
			if (game.menu == "quest_select") {
				questHandler("show");
			} else if (game.menu == "shop_open") {
				shopHandler("open");
			}
		}
		saveHandler("save");
	}}

function pickRandom(weights, values) {
	let final = [weights[0]];
	let r = Math.random();
	for (let i = 1; i < weights.length; i++) {
		final[i] = pf(final[i - 1] + weights[i]);
	}
	//if (final[final.length - 1] !== 1) {
		r = Math.random() * final[final.length - 1];
	//}
	for (let i = 0; i < weights.length; i++) {
		if (r < final[i]) {
			return values[i];
		}
	}}

function calcStat(stat) {
	return statHandler("calc", stat).calc[3];}

function createAnimatedCurve(startX, startY, endX, endY, angle, color = '#00f', width = 2, duration = 1000) {
  	const svg = document.getElementById("curves_svg");
  	duration = duration / game.speed;
  	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  	svg.appendChild(path);
  	const midX = (startX + endX) / 2;
  	const midY = (startY + endY) / 2;
  	const curveIntensity = Math.hypot(endX - startX, endY - startY) / 2;
  	const atan = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
  	angle += atan;
  	const controlX = startX + Math.cos(angle * Math.PI / 180) * curveIntensity;
  	const controlY = startY + Math.sin(angle * Math.PI / 180) * curveIntensity;
  	path.setAttribute('d', `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`);
  	const totalLength = path.getTotalLength();
  	const segmentLength = totalLength * 0.25;
  	path.setAttribute('stroke-dasharray', segmentLength);
  	path.setAttribute('stroke-dashoffset', segmentLength);
  	path.setAttribute('stroke', color);
  	path.setAttribute('fill', 'none');
  	path.setAttribute('stroke-width', width);
  	path.setAttribute('stroke-linecap', 'round');
  	let startTime = null;
  	const animate = (timestamp) => {
  	  	if (!startTime) startTime = timestamp;
  	  	const elapsed = timestamp - startTime;
  	  	const progress = Math.min(elapsed / duration, 1);
   	  	let tEnd, tStart;
  	  	if (progress < 0.2) {
  	    	tEnd = (progress / 0.2) * (segmentLength / totalLength);
  	    	tStart = 0;
  	  	} else if (progress < 0.85) {
  	    	const phaseProgress = (progress - 0.2) / 0.65;
  	    	tEnd = (segmentLength / totalLength) + phaseProgress * (1 - segmentLength / totalLength);
  	    	tStart = tEnd - (segmentLength / totalLength);
  	  	} else {
  	    	const phaseProgress = (progress - 0.85) / 0.15;
  	    	tEnd = 1;
  	    	tStart = tEnd - (segmentLength / totalLength) * (1 - phaseProgress);
  	  	}
    	const getPoint = t => ({
    	  	x: (1-t)**2 * startX + 2*(1-t)*t*controlX + t**2 * endX,
    	  	y: (1-t)**2 * startY + 2*(1-t)*t*controlY + t**2 * endY
    	});
    	const p1 = getPoint(tStart);
    	const p2 = getPoint(tEnd);
    	const mid = getPoint((tStart + tEnd) / 2);
    	const ctrlX = 2 * mid.x - p1.x/2 - p2.x/2;
    	const ctrlY = 2 * mid.y - p1.y/2 - p2.y/2;
    	path.setAttribute('d', `M ${p1.x},${p1.y} Q ${ctrlX},${ctrlY} ${p2.x},${p2.y}`);
    	path.setAttribute('stroke-dashoffset', segmentLength * (1 - progress));
    	if (progress < 1) {
    	  	requestAnimationFrame(animate);
    	} else {
    	  	path.setAttribute('d', `M ${endX},${endY} L ${endX},${endY}`);
    	  	setTimeout(() => path.remove(), 50);
    	}
  	}
  	requestAnimationFrame(animate);}

function pf(n) {
	return Math.round(n * 1e5) / 1e5;}

function nf(n) {
	let num = parseFloat(n).toPrecision(n > 99 ? 3 : n % 10 + 1);
	if (num.toString().includes("e")) {
		num = num.substring(0, num.length - 2) + num.substring(num.length - 1);
	}
	return num;}

function sleep(n) {
	return new Promise((resolve) => {
		setTimeout(function() {
			return resolve("resolved");
		}, n / game.speed);
	})}

const particlesData = {
  "particles": {
    "number": {
      "value": 120,
      "density": {
        "enable": true,
        "value_area": 600
      }
    },
    "color": {
      "value": "#a47620"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#a47620",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 0.2,
      "direction": "bottom-left",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "repulse"
      },
      "onclick": {
        "enable": false,
        "mode": "repulse"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 800,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 800,
        "size": 80,
        "duration": 2,
        "opacity": 0.8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.1
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true}

particlesJS('particles-js', particlesData);