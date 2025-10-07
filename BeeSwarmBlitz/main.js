var game = {
	beeData: [],
	/*
	bgColor: 'orange',
	items: {
		"beequip_case": 0,
		"cog": 0,
		"ticket": 0,
		"sprinkler": "empty",
		"gumdrops": 0,
		"coconut": [0, 500],
		"stinger": 0,
		"snowflake": 0,
		"micro_converter": [0, 15],
		"honeysuckle": 0,
		"field_dice": 0,
		"smooth_dice": 0,
		"loaded_dice": [0, 25],
		"jelly_beans": [0, 100],
		"red_extract": 0,
		"blue_extract": 0,
		"glitter": 0,
		"glue": 0,
		"oil": 0,
		"enzymes": 0,
		"tropical_drink": 0,
		"purple_potion": 0,
		"super_smoothie": 0,
		"marshmallow_bee": 0,
		"magic_bean": 0,
		"festive_bean": 0,
		"cloud_vial": [0, 10],
		"night_bell": 0,
		"box-o-frogs": 0,
		"translator": 0,
		"present": 0,
		"spirit_petal": 0,
		"ant_pass": [0, 10],
		"robo_pass": [0, 10],
		"treat": 0,
		"atomic_treat": 0,
		"star_treat": 0,
		"sunflower_seed": 0,
		"strawberry": 0,
		"pineapple": 0,
		"blueberry": 0,
		"bitterberry": 0,
		"neonberry": 0,
		"moon_charm": 0,
		"gingerbread_bear": 0,
		"aged_gingerbread_bear": 0,
		"white_drive": [0, 5],
		"red_drive": [0, 5],
		"blue_drive": [0, 5],
		"glitched_drive": [0, 5],
		"comforting_vial": [0, 10],
		"invigorating_vial": [0, 10],
		"motivating_vial": [0, 10],
		"refreshing_vial": [0, 10],
		"satisfying_vial": [0, 10],
		"nectar_shower_vial": [0, 10],
		"pink_balloon": [0, 25],
		"red_balloon": [0, 25],
		"white_balloon": [0, 25],
		"black_balloon": [0, 25],
		"soft_wax": 0,
		"hard_wax": 0,
		"caustic_wax": 0,
		"debug_wax": 0,
		"swirled_wax": 0,
		"turpentine": [0, 25],
		"paper_planter": [0, 100],
		"ticket_planter": [0, 100],
		"festive_planter": [0, 100],
		"plastic_planter": [0, 1],
		"candy_planter": [0, 1],
		"tacky_planter": [0, 1],
		"pesticide_planter": [0, 1],
		"blue_clay_planter": [0, 1],
		"red_clay_planter": [0, 1],
		"heat-treated_planter": [0, 1],
		"hydroponic_planter": [0, 1],
		"petal_planter": [0, 1],
		"the_planter_of_plenty": [0, 1],
		"basic_egg": 0,
		"silver_egg": 0,
		"gold_egg": 0,
		"diamond_egg": 0,
		"mythic_egg": 0,
		"gifted_silver_egg": 0,
		"gifted_gold_egg": 0,
		"gifted_diamond_egg": 0,
		"gifted_mythic_egg": 0,
		"star_egg": 0,
		"royal_jelly": 0,
		"star_jelly": 0,
		"bumble_bee_egg": 0,
		"rascal_bee_egg": 0,
		"baby_bee_egg": 0,
		"commander_bee_egg": 0,
		"bear_bee_egg": 0,
		"cobalt_bee_egg": 0,
		"crimson_bee_egg": 0,
		"digital_bee_egg": 0,
		"festive_bee_egg": 0,
		"gummy_bee_egg": 0,
		"photon_bee_egg": 0,
		"puppy_bee_egg": 0,
		"tabby_bee_egg": 0,
		"vicious_bee_egg": 0,
		"windy_bee_egg": 0,
		"bear_bee_jelly": 0,
		"cobalt_bee_jelly": 0,
		"crimson_bee_jelly": 0,
		"digital_bee_jelly": 0,
		"festive_bee_jelly": 0,
		"gummy_bee_jelly": 0,
		"photon_bee_jelly": 0,
		"puppy_bee_jelly": 0,
		"tabby_bee_jelly": 0,
		"vicious_bee_jelly": 0,
		"windy_bee_jelly": 0},
	gear: {
		dipper: {
			equipped: "scooper",
			unlocked: ["scooper"]
		},
		bag: {
			equipped: "pouch",
			unlocked: ["pouch"]
		},
		mask: {
			equipped: "empty",
			unlocked: []
		},
		sprinkler: {
			equipped: "empty",
			unlocked: []
		},
		guards: {
			equipped: ["empty", "empty"],
			unlocked: []
		},
		belt: {
			equipped: "empty",
			unlocked: []
		},
		boots: {
			equipped: "empty",
			unlocked: []
		},
		gliders: {
			equipped: "empty",
			unlocked: []
		}},
	*/
	menu: "none",
	baseStats: {
		"bond_from_treats": "100%"
	},
	hand: [],
	cardList: []
}
const backgroundColors = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "gray", "rainbow"];
const tokenStats = [
  'honey_token',
  'blue_boost_token',
  'red_boost_token',
  'white_boost_token',
  'blue_bomb_token',
  'blue_bomb_plus_token',
  'red_bomb_token',
  'red_bomb_plus_token',
  'buzz_bomb_token',
  'buzz_bomb_plus_token'];
const fieldStats = {
  'Sunflower': { 'zone': 0, 'color': 'White', 'size': { 'x': 33, 'y': 20, 'r': 0 }, 'counts': { '1': { 'White': 62, 'Red': 15, 'Blue': 12.9 }, '2': { 'White': 6.3, 'Red': 1.7, 'Blue': 2.1 }, '3': { 'White': 0, 'Red': 0, 'Blue': 0 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Dandelion': { 'zone': 0, 'color': 'White', 'size': { 'x': 36, 'y': 18, 'r': 0 }, 'counts': { '1': { 'White': 74.1, 'Red': 4.8, 'Blue': 8.2 }, '2': { 'White': 10.6, 'Red': 0.8, 'Blue': 1.5 }, '3': { 'White': 0, 'Red': 0, 'Blue': 0 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Mushroom': { 'zone': 0, 'color': 'Red', 'size': { 'x': 32, 'y': 23, 'r': 0 }, 'counts': { '1': { 'White': 28.7, 'Red': 61.5, 'Blue': 0 }, '2': { 'White': 2.9, 'Red': 6.9, 'Blue': 0 }, '3': { 'White': 0, 'Red': 0, 'Blue': 0 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Blue Flower': { 'zone': 0, 'color': 'Blue', 'size': { 'x': 43, 'y': 17, 'r': 0 }, 'counts': { '1': { 'White': 24.9, 'Red': 0, 'Blue': 66.2 }, '2': { 'White': 2.6, 'Red': 0, 'Blue': 6.3 }, '3': { 'White': 0, 'Red': 0, 'Blue': 0 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Clover': { 'zone': 0, 'color': 'Mixed', 'size': { 'x': 29, 'y': 26, 'r': 0 }, 'counts': { '1': { 'White': 16, 'Red': 18, 'Blue': 17 }, '2': { 'White': 16, 'Red': 16, 'Blue': 17 }, '3': { 'White': 0, 'Red': 0, 'Blue': 0 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Strawberry': { 'zone': 5, 'color': 'Red', 'size': { 'x': 26, 'y': 22, 'r': 0 }, 'counts': { '1': { 'White': 7, 'Red': 14, 'Blue': 0 }, '2': { 'White': 23, 'Red': 52, 'Blue': 0 }, '3': { 'White': 1, 'Red': 3, 'Blue': 0 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Spider': { 'zone': 5, 'color': 'White', 'size': { 'x': 28, 'y': 26, 'r': 0 }, 'counts': { '1': { 'White': 10, 'Red': 0, 'Blue': 0 }, '2': { 'White': 80, 'Red': 0, 'Blue': 0 }, '3': { 'White': 10, 'Red': 0, 'Blue': 0 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Bamboo': { 'zone': 5, 'color': 'Blue', 'size': { 'x': 39, 'y': 18, 'r': 0 }, 'counts': { '1': { 'White': 5, 'Red': 0, 'Blue': 15 }, '2': { 'White': 18.7, 'Red': 0, 'Blue': 56.3 }, '3': { 'White': 1.2, 'Red': 0, 'Blue': 3.8 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Pineapple': { 'zone': 10, 'color': 'White', 'size': { 'x': 33, 'y': 23, 'r': 0 }, 'counts': { '1': { 'White': 17, 'Red': 1, 'Blue': 1 }, '2': { 'White': 45, 'Red': 3, 'Blue': 2 }, '3': { 'White': 27, 'Red': 2, 'Blue': 2 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Stump': { 'zone': 10, 'color': 'Blue', 'size': { 'x': 0, 'y': 0, 'r': 26 }, 'counts': { '1': { 'White': 0, 'Red': 0, 'Blue': 0 }, '2': { 'White': 0, 'Red': 0, 'Blue': 0 }, '3': { 'White': 19, 'Red': 6, 'Blue': 75 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Cactus': { 'zone': 15, 'color': 'Mixed', 'size': { 'x': 33, 'y': 18, 'r': 0 }, 'counts': { '1': { 'White': 0, 'Red': 0, 'Blue': 0 }, '2': { 'White': 4, 'Red': 18, 'Blue': 22 }, '3': { 'White': 3, 'Red': 25, 'Blue': 28 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Pumpkin': { 'zone': 15, 'color': 'Mixed', 'size': { 'x': 33, 'y': 17, 'r': 0 }, 'counts': { '1': { 'White': 0, 'Red': 0, 'Blue': 0 }, '2': { 'White': 14, 'Red': 5, 'Blue': 5 }, '3': { 'White': 43, 'Red': 16, 'Blue': 17 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Pine Tree': { 'zone': 15, 'color': 'Blue', 'size': { 'x': 31, 'y': 23, 'r': 0 }, 'counts': { '1': { 'White': 1.1, 'Red': 0, 'Blue': 4.7 }, '2': { 'White': 8.5, 'Red': 0, 'Blue': 39.5 }, '3': { 'White': 6.4, 'Red': 0, 'Blue': 39.5 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Rose': { 'zone': 15, 'color': 'Red', 'size': { 'x': 31, 'y': 20, 'r': 0 }, 'counts': { '1': { 'White': 2, 'Red': 4, 'Blue': 0 }, '2': { 'White': 8, 'Red': 36, 'Blue': 0 }, '3': { 'White': 8, 'Red': 42, 'Blue': 0 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Mountain Top': { 'zone': 25, 'color': 'Mixed', 'size': { 'x': 28, 'y': 24, 'r': 0 }, 'counts': { '1': { 'White': 0, 'Red': 0, 'Blue': 0 }, '2': { 'White': 0, 'Red': 0, 'Blue': 0 }, '3': { 'White': 0, 'Red': 50, 'Blue': 50 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Pepper': { 'zone': 35, 'color': 'Red', 'size': { 'x': 27, 'y': 21, 'r': 0 }, 'counts': { '1': { 'White': 0, 'Red': 0, 'Blue': 0 }, '2': { 'White': 0, 'Red': 0, 'Blue': 0 }, '3': { 'White': 8, 'Red': 92, 'Blue': 0 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Coconut': { 'zone': 35, 'color': 'White', 'size': { 'x': 30, 'y': 21, 'r': 0 }, 'counts': { '1': { 'White': 0, 'Red': 0, 'Blue': 0 }, '2': { 'White': 0, 'Red': 0, 'Blue': 0 }, '3': { 'White': 89.4, 'Red': 6, 'Blue': 4.6 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } },
  'Ant Challenge': { 'zone': 20, 'color': 'Mixed', 'size': { 'x': 32, 'y': 12, 'r': 0 }, 'counts': { '1': { 'White': 20, 'Red': 35.6, 'Blue': 44.5 }, '2': { 'White': 0, 'Red': 0, 'Blue': 0 }, '3': { 'White': 0, 'Red': 0, 'Blue': 0 }, '4': {'White': 0, 'Red': 0, 'Blue': 0}, '5': {'White': 0, 'Red': 0, 'Blue': 0} } }};
const fieldNames = ['Sunflower', 'Dandelion', 'Mushroom', 'Blue Flower', 'Clover', 'Strawberry', 'Spider', 'Bamboo', 'Pineapple', 'Stump', 'Cactus', 'Pumpkin', 'Pine Tree', 'Rose', 'Mountain Top', 'Pepper', 'Coconut', 'Ant Challenge'];
const beeTypeStats = {
  'Basic': { 'rarity': 'Common', 'color': 'Colorless', 'energy': 20, 'speed': 14, 'attack': 1, 'gather': 10, 'gather_speed': 4, 'convert': 80, 'convert_speed': 4, 'gifted_bonus': 'x1.2 Pollen', 'tokens': ['#Inspire'], 'passives': [], 'likes': ['Sunflower', 'Clover', 'Mountain Top'], 'dislikes': ['Spider'], 'favorite': 'sunflower_seed' },
  'Bomber': { 'rarity': 'Rare', 'color': 'Colorless', 'energy': 20, 'speed': 15.4, 'attack': 2, 'gather': 10, 'gather_speed': 4, 'convert': 120, 'convert_speed': 4, 'gifted_bonus': 'x1.1 Bomb Pollen', 'tokens': ['Buzz Bomb', '#Inspire'], 'passives': [], 'likes': ['Dandelion', 'Cactus'], 'dislikes': ['Pumpkin'], 'favorite': 'sunflower_seed' },
  'Brave': { 'rarity': 'Rare', 'color': 'Colorless', 'energy': 30, 'speed': 16.8, 'attack': 5, 'gather': 10, 'gather_speed': 4, 'convert': 200, 'convert_speed': 4, 'gifted_bonus': '+1 Bee Attack', 'tokens': ['#Inspire'], 'passives': [], 'likes': ['Spider', 'Clover'], 'dislikes': ['Dandelion'], 'favorite': 'pineapple' },
  'Bumble': { 'rarity': 'Rare', 'color': 'Blue', 'energy': 50, 'speed': 10.5, 'attack': 1, 'gather': 18, 'gather_speed': 4, 'convert': 80, 'convert_speed': 4, 'gifted_bonus': 'x1.1 Capacity', 'tokens': ['Blue Bomb', '#Inspire'], 'passives': [], 'likes': ['Blue Flower', 'Pine Tree', 'Stump'], 'dislikes': ['Mushroom'], 'favorite': 'blueberry' },
  'Cool': { 'rarity': 'Rare', 'color': 'Blue', 'energy': 20, 'speed': 14, 'attack': 2, 'gather': 10, 'gather_speed': 3, 'convert': 120, 'convert_speed': 4, 'gifted_bonus': 'x1.1 Blue Boost', 'tokens': ['Blue Boost', '#Inspire'], 'passives': [], 'likes': ['Bamboo', 'Pine'], 'dislikes': ['Strawberry'], 'favorite': 'blueberry' },
  'Hasty': { 'rarity': 'Rare', 'color': 'Colorless', 'energy': 20, 'speed': 19.6, 'attack': 1, 'gather': 10, 'gather_speed': 3, 'convert': 80, 'convert_speed': 3, 'gifted_bonus': '+15% Player Movespeed', 'tokens': ['Haste', '#Inspire'], 'passives': [], 'likes': ['Sunflower', 'Cactus'], 'dislikes': ['Pumpkin', 'Stump'], 'favorite': 'pineapple' },
  'Looker': { 'rarity': 'Rare', 'color': 'Colorless', 'energy': 20, 'speed': 14, 'attack': 1, 'gather': 13, 'gather_speed': 4, 'convert': 160, 'convert_speed': 4, 'gifted_bonus': '+25% Critical Power', 'tokens': ['Focus', '#Inspire'], 'passives': [], 'likes': ['Clover', 'Mountain Top'], 'dislikes': ['Sunflower'], 'favorite': 'sunflower_seed' },
  'Rad': { 'rarity': 'Rare', 'color': 'Red', 'energy': 20, 'speed': 14, 'attack': 1, 'gather': 13, 'gather_speed': 4, 'convert': 80, 'convert_speed': 3, 'gifted_bonus': 'x1.1 Red Pollen', 'tokens': ['Red Boost', '#Inspire'], 'passives': [], 'likes': ['Rose', 'Mushroom'], 'dislikes': ['Pine Tree'], 'favorite': 'strawberry' },
  'Rascal': { 'rarity': 'Rare', 'color': 'Red', 'energy': 20, 'speed': 16.1, 'attack': 3, 'gather': 10, 'gather_speed': 4, 'convert': 80, 'convert_speed': 4, 'gifted_bonus': 'x1.25 Red Bomb Pollen', 'tokens': ['Red Bomb', '#Inspire'], 'passives': [], 'likes': ['Rose', 'Mushroom'], 'dislikes': ['Pine Tree'], 'favorite': 'strawberry' },
  'Stubborn': { 'rarity': 'Rare', 'color': 'Colorless', 'energy': 20, 'speed': 11.9, 'attack': 2, 'gather': 10, 'gather_speed': 4, 'convert': 80, 'convert_speed': 3, 'gifted_bonus': '+15% Ability Token Lifespan', 'tokens': ['Pollen Mark', '#Inspire'], 'passives': [], 'likes': ['Dandelion', 'Pineapple'], 'dislikes': ['Rose'], 'favorite': 'strawberry' },
  'Bubble': { 'rarity': 'Epic', 'color': 'Blue', 'energy': 20, 'speed': 16.1, 'attack': 3, 'gather': 10, 'gather_speed': 4, 'convert': 160, 'convert_speed': 4, 'gifted_bonus': '1.25 Bubble Pollen', 'tokens': ['Blue Bomb', '#Inspire'], 'passives': ['Gathering Bubbles'], 'likes': ['Blue Flower', 'Pine Tree'], 'dislikes': ['Strawberry'], 'favorite': 'blueberry' },
  'Bucko': { 'rarity': 'Epic', 'color': 'Blue', 'energy': 30, 'speed': 15.4, 'attack': 5, 'gather': 17, 'gather_speed': 4, 'convert': 80, 'convert_speed': 3, 'gifted_bonus': '+20% Blue Field Capacity', 'tokens': ['Blue Boost', '#Inspire'], 'passives': [], 'likes': ['Pine Tree', 'Bamboo', 'Blue Flower'], 'dislikes': ['Rose', 'Strawberry'], 'favorite': 'blueberry' },
  'Commander': { 'rarity': 'Epic', 'color': 'Colorless', 'energy': 20, 'speed': 14, 'attack': 4, 'gather': 15, 'gather_speed': 4, 'convert': 80, 'convert_speed': 4, 'gifted_bonus': '+3% Critical Chance', 'tokens': ['Buzz Bomb', 'Focus', '#Inspire'], 'passives': [], 'likes': ['Cactus', 'Spider'], 'dislikes': ['Dandelion'], 'favorite': 'sunflower_seed' },
  'Demo': { 'rarity': 'Epic', 'color': 'Colorless', 'energy': 20, 'speed': 16.8, 'attack': 3, 'gather': 10, 'gather_speed': 4, 'convert': 200, 'convert_speed': 4, 'gifted_bonus': 'x1.25 Buzz Bomb Pollen', 'tokens': ['Buzz Bomb+', '#Inspire'], 'passives': [], 'likes': ['Cactus', 'Dandelion'], 'dislikes': ['Rose'], 'favorite': 'sunflower_seed' },
  'Exhausted': { 'rarity': 'Epic', 'color': 'Colorless', 'energy': Infinity, 'speed': 10.5, 'attack': 1, 'gather': 10, 'gather_speed': 4.6, 'convert': 240, 'convert_speed': 4, 'gifted_bonus': '20% White Field Capacity', 'tokens': ['Buzz Bomb', 'Token Link', '#Inspire'], 'passives': [], 'likes': ['Sunflower', 'Dandelion', 'Stump'], 'dislikes': ['Cactus'], 'favorite': 'pineapple' },
  'Fire': { 'rarity': 'Epic', 'color': 'Red', 'energy': 25, 'speed': 11.2, 'attack': 4, 'gather': 10, 'gather_speed': 4, 'convert': 80, 'convert_speed': 4, 'gifted_bonus': 'x1.25 Flame Pollen', 'tokens': ['Red Bomb+', '#inspire'], 'passives': ['Gathering Flames'], 'likes': ['Mushroom', 'Strawberry'], 'dislikes': ['Pine Tree'], 'favorite': 'pineapple' },
  'Frosty': { 'rarity': 'Epic', 'color': 'Blue', 'energy': 25, 'speed': 11.2, 'attack': 1, 'gather': 10, 'gather_speed': 4, 'convert': 80, 'convert_speed': 4, 'gifted_bonus': 'x1.25 Blue Bomb Pollen', 'tokens': ['Blue Bomb+', 'Blue Boost', '#Inspire'], 'passives': [], 'likes': ['Blue Flower', 'Mountain Top'], 'dislikes': ['Mushroom'], 'favorite': 'blueberry' },
  'Honey': { 'rarity': 'Epic', 'color': 'Colorless', 'energy': 20, 'speed': 14, 'attack': 1, 'gather': 10, 'gather_speed': 4, 'convert': 360, 'convert_speed': 2, 'gifted_bonus': '1.5x Honey From Tokens', 'tokens': ['Honey Gift', 'Honey Mark', '#Inspire'], 'passives': [], 'likes': ['Mountain Top', 'Pumpkin'], 'dislikes': ['Spider'], 'favorite': 'pineapple' },
  'Rage': { 'rarity': 'Epic', 'color': 'Red', 'energy': 20, 'speed': 15.4, 'attack': 4, 'gather': 10, 'gather_speed': 4, 'convert': 80, 'convert_speed': 4, 'gifted_bonus': '+10% Bee Attack', 'tokens': ['Token Link', 'Rage', '#Inspire'], 'passives': [], 'likes': ['Rose', 'Spider'], 'dislikes': ['Blue Flower'], 'favorite': 'strawberry' },
  'Riley': { 'rarity': 'Epic', 'color': 'Red', 'energy': 25, 'speed': 15.4, 'attack': 5, 'gather': 10, 'gather_speed': 2, 'convert': 140, 'convert_speed': 4, 'gifted_bonus': '+20% Red Field Capacity', 'tokens': ['Red Boost', '#Inspire'], 'passives': [], 'likes': ['Rose', 'Strawberry', 'Mushroom'], 'dislikes': ['Pine Tree', 'Bamboo'], 'favorite': 'strawberry' },
  'Shocked': { 'rarity': 'Epic', 'color': 'Colorless', 'energy': 20, 'speed': 19.6, 'attack': 2, 'gather': 10, 'gather_speed': 4, 'convert': 80, 'convert_speed': 2, 'gifted_bonus': 'x1.1 White Pollen', 'tokens': ['Haste', 'Token Link', '#Inspire'], 'passives': ['-50% Sleep Time'], 'likes': ['Spider', 'Pineapple'], 'dislikes': ['Mushroom'], 'favorite': 'pineapple' },
  'Baby': { 'rarity': 'Legendary', 'color': 'Colorless', 'energy': 15, 'speed': 10.5, 'attack': 0, 'gather': 10, 'gather_speed': 5, 'convert': 80, 'convert_speed': 5, 'gifted_bonus': '+25% Loot Luck', 'tokens': ['Baby Love', '#Inspire'], 'passives': [], 'likes': ['Dandelion', 'Sunflower', 'Mushroom', 'Blue Flower'], 'dislikes': ['Spider', 'Cactus', 'Pine Tree', 'Rose', 'Stump'], 'favorite': 'strawberry' },
  'Carpenter': { 'rarity': 'Legendary', 'color': 'Colorless', 'energy': 25, 'speed': 11.2, 'attack': 4, 'gather': 10, 'gather_speed': 3, 'convert': 120, 'convert_speed': 4, 'gifted_bonus': '+25% Tool Pollen', 'tokens': ['Pollen Mark', 'Honey Mark+', '#Inspire'], 'passives': [], 'likes': ['Pine Tree', 'Bamboo'], 'dislikes': ['Mountain Top'], 'favorite': 'sunflower_seed' },
  'Demon': { 'rarity': 'Legendary', 'color': 'Red', 'energy': 20, 'speed': 10.5, 'attack': 8, 'gather': 35, 'gather_speed': 4, 'convert': 60, 'convert_speed': 4, 'gifted_bonus': '+20% Instant Bomb Conversion', 'tokens': ['Red Bomb', 'Red Bomb+', '#Inspire'], 'passives': ['Gathering Flames+'], 'likes': ['Spider', 'Mushroom'], 'dislikes': ['Mountain Top'], 'favorite': 'pineapple' },
  'Diamond': { 'rarity': 'Legendary', 'color': 'Blue', 'energy': 20, 'speed': 14, 'attack': 1, 'gather': 10, 'gather_speed': 4, 'convert': 1000, 'convert_speed': 4, 'gifted_bonus': 'x1.2 Convert Rate', 'tokens': ['Honey Gift', 'Blue Boost', '#Inspire'], 'passives': ['Shimmering Honey'], 'likes': ['Blue Flower', 'Pineapple'], 'dislikes': ['Rose'], 'favorite': 'blueberry' },
  'Lion': { 'rarity': 'Legendary', 'color': 'Colorless', 'energy': 60, 'speed': 19.6, 'attack': 9, 'gather': 20, 'gather_speed': 4, 'convert': 160, 'convert_speed': 2, 'gifted_bonus': '+5% Gifted Bee Pollen', 'tokens': ['Buzz Bomb+', '#Inspire'], 'passives': [], 'likes': ['Pineapple', 'Ant Challenge'], 'dislikes': ['Cactus'], 'favorite': 'pineapple' },
  'Music': { 'rarity': 'Legendary', 'color': 'Colorless', 'energy': 20, 'speed': 16.1, 'attack': 1, 'gather': 16, 'gather_speed': 4, 'convert': 240, 'convert_speed': 4, 'gifted_bonus': '+25% Polle From Bee Gathering', 'tokens': ['Focus', 'Token Link', 'Melody', '#Inspire'], 'passives': [], 'likes': ['Clover', 'Dandelion'], 'dislikes': ['Cactus'], 'favorite': 'blueberry' },
  'Ninja': { 'rarity': 'Legendary', 'color': 'Blue', 'energy': 20, 'speed': 21, 'attack': 4, 'gather': 10, 'gather_speed': 2, 'convert': 80, 'convert_speed': 3, 'gifted_bonus': '+5% Bee Movespeed', 'tokens': ['Blue Bomb+', 'Haste', '#Inspire'], 'passives': [], 'likes': ['Bamboo', 'Blue Flower'], 'dislikes': ['Mushroom'], 'favorite': 'sunflower_seed' },
  'Shy': { 'rarity': 'Legendary', 'color': 'Red', 'energy': 40, 'speed': 18.2, 'attack': 2, 'gather': 10, 'gather_speed': 2, 'convert': 320, 'convert_speed': 4, 'gifted_bonus': '+5% Bee Ability Pollen', 'tokens': ['Red Bomb', 'Red Boost', '#Inspire'], 'passives': ['Nectar Lover'], 'likes': ['Strawberry', 'Pumpkin'], 'dislikes': ['Pine Tree'], 'favorite': 'strawberry' },
  'Buoyant': { 'rarity': 'Mythic', 'color': 'Blue', 'energy': 60, 'speed': 14, 'attack': 3, 'gather': 15, 'gather_speed': 5, 'convert': 150, 'convert_speed': 3, 'gifted_bonus': 'x1.2 Capacity', 'tokens': ['Blue Bomb+', 'Inflate Balloon', '#Suprise Party', '#Inspire'], 'passives': ['Balloon Enthusiast'], 'likes': ['Coconut', 'Mountain Top', 'Bamboo', 'Blue Flower'], 'dislikes': [], 'favorite': 'blueberry' },
  'Fuzzy': { 'rarity': 'Mythic', 'color': 'Colorless', 'energy': 50, 'speed': 11.9, 'attack': 3, 'gather': 100, 'gather_speed': 6, 'convert': 40, 'convert_speed': 6, 'gifted_bonus': 'x1.1 Bomb Power', 'tokens': ['Buzz Bomb+', 'Fuzz Bombs', '#Pollen Haze', '#Inspire'], 'passives': ['Fuzzy Coat'], 'likes': ['Pine Tree', 'Dandelion'], 'dislikes': ['Pepper'], 'favorite': 'pineapple' },
  'Precise': { 'rarity': 'Mythic', 'color': 'Red', 'energy': 40, 'speed': 11.2, 'attack': 8, 'gather': 20, 'gather_speed': 4, 'convert': 130, 'convert_speed': 4, 'gifted_bonus': '+3% Super-Crit Chance', 'tokens': ['Target Practice', '#Inspire'], 'passives': ['+5% Critical Chance', '+3% Super-Crit Chance', 'Sniper'], 'likes': ['Rose', 'Mountain Top'], 'dislikes': ['Pine Tree', 'Bamboo'], 'favorite': 'sunflower_seed' },
  'Spicy': { 'rarity': 'Mythic', 'color': 'Red', 'energy': 20, 'speed': 14, 'attack': 5, 'gather': 14, 'gather_speed': 4, 'convert': 200, 'convert_speed': 2, 'gifted_bonus': '+25% Flame Duration', 'tokens': ['Rage', 'Inferno', '#Flame Fuel', '#Inspire'], 'passives': ['Steam Engine'], 'likes': ['Pepper'], 'dislikes': ['Stump'], 'favorite': 'strawberry' },
  'Tadpole': { 'rarity': 'Mythic', 'color': 'Blue', 'energy': 10, 'speed': 11.2, 'attack': 0.5, 'gather': 10, 'gather_speed': 6, 'convert': 120, 'convert_speed': 4, 'gifted_bonus': '+25% Bubble Duration', 'tokens': ['Blue Boost', '#Baby Love', 'Summon Frog', '#Inspire'], 'passives': ['Gathering Bubbles+'], 'likes': ['Pine Tree', 'Stump'], 'dislikes': ['Cactus'], 'favorite': 'blueberry' },
  'Vector': { 'rarity': 'Mythic', 'color': 'Colorless', 'energy': 45.6, 'speed': 16.24, 'attack': 5, 'gather': 18, 'gather_speed': 4, 'convert': 144, 'convert_speed': 2.72, 'gifted_bonus': '+15% Mark Duration', 'tokens': ['Pollen Mark+', 'Triangluate', '#Mark Surge', '#Inspire'], 'passives': [], 'likes': ['Coconut', 'Spider'], 'dislikes': ['Pineapple'], 'favorite': 'sunflower_seed' },
  'Bear': { 'rarity': 'Event', 'color': 'Colorless', 'energy': 35, 'speed': 14, 'attack': 5, 'gather': 15, 'gather_speed': 2, 'convert': 200, 'convert_speed': 2, 'gifted_bonus': '+10% Pollen', 'tokens': ['Bear Morph', '#Inspire'], 'passives': [], 'likes': ['Pine Tree', 'Pumpkin',], 'dislikes': ['Blue Flower'] },
  'Cobalt': { 'rarity': 'Event', 'color': 'Blue', 'energy': 35, 'speed': 18.2, 'attack': 6, 'gather': 10, 'gather_speed': 4, 'convert': 120, 'convert_speed': 3, 'gifted_bonus': '+15% Instant Blue Conversion', 'tokens': ['Blue Pulse', 'Blue Bomb Sync', '#Inspire'], 'passives': [], 'likes': ['Pine Tree', 'Clover'], 'dislikes': ['Pineapple'] },
  'Crimson': { 'rarity': 'Event', 'color': 'Red', 'energy': 35, 'speed': 18.2, 'attack': 6, 'gather': 10, 'gather_speed': 4, 'convert': 120, 'convert_speed': 3, 'gifted_bonus': '+15% Instant Red Conversion', 'tokens': ['Red Pulse', 'Red Bomb Sync', '#Inspire'], 'passives': [], 'likes': ['Rose', 'Clover'], 'dislikes': ['Pineapple'] },
  'Digital': { 'rarity': 'Event', 'color': 'Colorless', 'energy': 20, 'speed': 11.9, 'attack': 1, 'gather': 10, 'gather_speed': 4, 'convert': 80, 'convert_speed': 4, 'gifted_bonus': '+1% Ability Duplication Chance', 'tokens': ['Glitch', 'Mind Hack', '#Map Corruption', '#Inspire'], 'passives': ['Drive Expansion'], 'likes': ['Coconut', 'Mountain Top', 'Dandelion'], 'dislikes': ['Pine Tree'] },
  'Festive': { 'rarity': 'Event', 'color': 'Red', 'energy': 20, 'speed': 16.1, 'attack': 1, 'gather': 40, 'gather_speed': 4, 'convert': 150, 'convert_speed': 1, 'gifted_bonus': 'x1.25 Convert Rate At Hive', 'tokens': ['Honey Mark', 'Red Bomb+', 'Festive Gift', '#Inspire'], 'passives': [], 'likes': ['Pine Tree', 'Mountain Top', 'Mushroom'], 'dislikes': ['Blue Flower'] },
  'Gummy': { 'rarity': 'Event', 'color': 'Colorless', 'energy': 50, 'speed': 14, 'attack': 3, 'gather': 10, 'gather_speed': 4, 'convert': 700, 'convert_speed': 4, 'gifted_bonus': '+5% Honey Per Pollen', 'tokens': ['Glob', 'Gumdrop Barrage', '#Inspire'], 'passives': [], 'likes': ['Mountain Top', 'Pineapple', 'Stump'], 'dislikes': ['Pumpkin'] },
  'Photon': { 'rarity': 'Event', 'color': 'Colorless', 'energy': Infinity, 'speed': 21, 'attack': 3, 'gather': 20, 'gather_speed': 2, 'convert': 240, 'convert_speed': 2, 'gifted_bonus': '+5% Instant Conversion', 'tokens': ['Haste', 'Beamstorm', '#Inspire'], 'passives': [], 'likes': ['Pumpkin', 'Pineapple'], 'dislikes': ['Clover'] },
  'Puppy': { 'rarity': 'Event', 'color': 'Colorless', 'energy': 40, 'speed': 16.1, 'attack': 2, 'gather': 25, 'gather_speed': 4, 'convert': 280, 'convert_speed': 4, 'gifted_bonus': '+20% Bond From Treats', 'tokens': ['Puppy Love', 'Fetch', '#Inspire'], 'passives': [], 'likes': ['Pumpkin', 'Clover'], 'dislikes': ['Rose'] },
  'Tabby': { 'rarity': 'Event', 'color': 'Colorless', 'energy': 28, 'speed': 16.1, 'attack': 4, 'gather': 10, 'gather_speed': 4, 'convert': 160, 'convert_speed': 3, 'gifted_bonus': '+50% Critical Power', 'tokens': ['Scratch', 'Tabby Love', '#Inspire'], 'passives': [], 'likes': ['Spider', 'Clover'], 'dislikes': ['Cactus'] },
  'Vicious': { 'rarity': 'Event', 'color': 'Blue', 'energy': 50, 'speed': 17.5, 'attack': 8, 'gather': 10, 'gather_speed': 4, 'convert': 80, 'convert_speed': 4, 'gifted_bonus': '-15% Monster Respawn Time', 'tokens': ['Blue Bomb+', 'Impale', '#Inspire'], 'passives': [], 'likes': ['Rose', 'Cactus'], 'dislikes': ['Dandelion'] },
  'Windy': { 'rarity': 'Event', 'color': 'Colorless', 'energy': 20, 'speed': 19.6, 'attack': 3, 'gather': 10, 'gather_speed': 3, 'convert': 180, 'convert_speed': 2, 'gifted_bonus': '+15% Instant White Conversion, x2 Boosts From Clouds', 'tokens': ['White Boost', 'Rain Cloud', 'Tornado', '#Inspire'], 'passives': [], 'likes': ['Coconut', 'Dandelion'], 'dislikes': ['Strawberry', 'Bamboo'] }};
const menuNames = ["items", "quests", "bees", "badges", "settings", "shop"];
const itemStats = {
	//type
	//consumables: cooldown in secs, duration, buff name, buff desc
	"beequip_case": ["case"],
	"cog": ["misc"],
	"ticket": ["misc"],
	"sprinkler": ["consumable", 1, Infinity, undefined],
	"gumdrops": ["consumable", 2, 5, "Gumdrops", "Goo grants bonus honey"],
	"coconut": ["consumable", 10, undefined],
	"stinger": ["consumable", 1, 30, "Stinger", "x1.5 attack"],
	"snowflake": ["consumable", 3, 9, "Cool Breeze", "+*% Convert Rate At Hive<br>+*% Pollen From Tools<br>+*% Bee Gather Pollen<br>+*% Honey Per Pollen<br>+*% Loot Luck<br>x1.25 Capacity"],
	"micro_converter": ["consumable", 5, undefined],
	"honeysuckle": ["toggleable", 30, undefined],
	"field_dice": ["dice", 1, 900, "* Field Boost", "+100% * Field Pollen"],
	"smooth_dice": ["dice", 2, 900, "x2 * Field Boost", "+200% * Field Pollen"],
	"loaded_dice": ["dice", 3, 900, "x3 * Field Boost", "+300% * Field Pollen"],
	"jelly_beans": ["consumable", 30, 60, "* Jelly Bean"],
	"red_extract": ["consumable", 1, 600, "Red Extract", "x1.25 Red Pollen"],
	"blue_extract": ["consumable", 1, 600, "Blue Extract", "x1.25 Blue Pollen"],
	"glitter": ["consumable", 1, 900, "* Field Boost", "+100% * Field Pollen"],
	"glue": ["consumable", 1, 600, "Glue", "x1.25 Bee Gather Pollen and Tools"],
	"oil": ["consumable", 1, 600, "Oil", "x1.2 Bee and Player Movespeed"],
	"enzymes": ["consumable", 1, 600, "Enzymes", "+10% Instant Conversion<br>x1.25 Conversion Rate"],
	"tropical_drink": ["consumable", 1, 600, "Tropical Drink", "x1.25 White Pollen<br>+5% Critical Chance"],
	"purple_potion": ["consumable", 2, 900, "Purple Potion", "x1.25 Capacity<br>x1.25 Convert Rate At Hive<br>x1.5 Red Pollen<br>x1.5 Blue Pollen<br>x1.3 Bee Gather Pollen<br>x1.3 Pollen From Tools"],
	"super_smoothie": ["consumable", 3, 1200, "Super Smoothie", "x1.5 Capacity<br>x1.6 Red Pollen<br>x1.6 Blue Pollen<br>x1.6 White Pollen<br>x1.4 Bee Gather Pollen<br>x1.4 Pollen From Tools<br>x2 Convert Rate<br>x1.5 Convert Rate At Hive<br>+12% Instant Conversion<br>+7% Critical Chance<br>x1.25 Bee Movespeed<br>x1.25 Player Movespeed"],
	"marshmallow_bee": ["consumable", 1, 1800, "Marshmallow Bee", "+50% White Pollen<br>+50% Capacity<br>+250% Conversion Rate"],
	"magic_bean": ["consumable", 3, undefined],
	"festive_bean": ["consumable", 3, undefined],
	"cloud_vial": ["consumable", 2, 180, "Cloud Boost", "+25% Pollen<br>+10% Unique Instant Conversion"],
	"night_bell": ["consumable", 1, undefined],
	"box-o-frogs": ["consumable", 1, 180, "Box-O-Frogs", "+3 Bubbles Per Second"],
	"translator": ["npcs"],
	"present": ["npcs"],
	"spirit_petal": ["misc"],
	"ant_pass": ["misc"],
	"robo_pass": ["misc"],
	//treats: bond, gifted chance, req favorite, favorite mult, mutation chance w/ radio, radio chance, mut chance w/o radio
	"treat": ["treat", 10, [0, 0, 0, 0, 0, 0], false, 0, 0, 0, 0],
	"atomic_treat": ["treat", 1000, [0, 0, 0, 0, 0, 0], false, 0, 1, 0, 1],
	"star_treat": ["treat", 1000, [1, 1, 1, 1, 1, 1], false, 0, 0, 0, 0],
	"sunflower_seed": ["treat", 25, [0.000083, 0.000125, 0.0001, 0.000083, 0.0000417, 0], true, 2, 0.00004, 0, 0],
	"strawberry": ["treat", 25, [0, 0.000125, 0.0001, 0.000083, 0.0000417, 0], true, 2, 0.00004, 0, 0],
	"pineapple": ["treat", 25, [0, 0.000125, 0.0001, 0.000083, 0.0000417, 0], true, 2, 0.00004, 0, 0],
	"blueberry": ["treat", 25, [0, 0.000125, 0.0001, 0.000083, 0.0000417, 0], true, 2, 0.00004, 0, 0],
	"bitterberry": ["treat", 100, [0, 0, 0, 0, 0, 0], false, 0, 0.01, 0, 0.001],
	"neonberry": ["treat", 500, [0, 0, 0, 0, 0, 0], false, 0, 0, 1, 0],
	"moon_charm": ["treat", 250, [0, 0, 0, 0, 0, 0], false, 0, 0.0004, 0, 0],
	"gingerbread_bear": ["treat", 250, [0.01, 0.01, 0.01, 0.01, 0.01, 0.01], false, 0, 0, 0, 0],
	"aged_gingerbread_bear": ["treat", 500, [0.011, 0.011, 0.011, 0.011, 0.011, 0.011], false, 0, 0, 0, 0],
	//drives: consumables, buff name, buff desc, digital buff
	"white_drive": ["drive", "White Drive", "x1.25 White Pollen<br>x1.25 White Field Capacity<br>+1 White Bee Attack", "+0.25 Gather Amount"],
	"red_drive": ["drive", "Red Drive", "x1.25 Red Pollen<br>x1.25 Red Pollen Capacity<br>+1 Red Bee Attack", "+0.03 Attack"],
	"blue_drive": ["drive", "Blue Drive", "x1.25 Blue Pollen<br>x1.25 Blue Field Capacity<br>+1 Blue Bee Attack", "+2 Convert Amount"],
	"glitched_drive": ["drive", "Glitched Drive", "x1.25 Pollen<br>x1.25 Capacity<br>+1 Bee Attack", "+0.05% Ability Rate"],
	"comforting_vial": ["consumable", 1, undefined],
	"invigorating_vial": ["consumable", 1, undefined],
	"motivating_vial": ["consumable", 1, undefined],
	"refreshing_vial": ["consumable", 1, undefined],
	"satisfying_vial": ["consumable", 1, undefined],
	"nectar_shower_vial": ["consumable", 1, undefined],
	"pink_balloon": ["consumable", 300, 180, "Balloon Aura", "x0.004 Pollen<br>+0.4% Honey From Tokens"],
	"red_balloon": ["consumable", 300, 180, "Balloon Aura", "x0.004 Pollen<br>+0.4% Honey From Tokens"],
	"white_balloon": ["consumable", 420, 300, "Balloon Aura", "x0.004 Pollen<br>+0.4% Honey From Tokens"],
	"black_balloon": ["consumable", 900, 300, "Balloon Aura", "x0.004 Pollen<br>+0.4% Honey From Tokens"],
	"soft_wax": ["wax"],
	"hard_wax": ["wax"],
	"caustic_wax": ["wax"],
	"debug_wax": ["wax"],
	"swirled_wax": ["wax"],
	"turpentine": ["wax"],
	"paper_planter": ["planter"],
	"ticket_planter": ["planter"],
	"festive_planter": ["planter"],
	"plastic_planter": ["planter"],
	"candy_planter": ["planter"],
	"tacky_planter": ["planter"],
	"pesticide_planter": ["planter"],
	"blue_clay_planter": ["planter"],
	"red_clay_planter": ["planter"],
	"heat-treated_planter": ["planter"],
	"hydroponic_planter": ["planter"],
	"petal_planter": ["planter"],
	"the_planter_of_plenty": ["planter"],
	//eggs: hatch type, chances, gifted chance
	//jelly: hatch type, chances, gifted chance, mutation chance
	"basic_egg": ["egg", false, [0.87, 0.1, 0.025, 0.005, 0], 0.004],
	"silver_egg": ["egg", false, [0, 0.649, 0.3, 0.05, 0.001], 0.004],
	"gold_egg": ["egg", false, [0, 0, 0.79, 0.2, 0.01], 0.004],
	"diamond_egg": ["egg", false, [0, 0, 0, 0.95, 0.05], 0.004],
	"mythic_egg": ["egg", false, [0, 0, 0, 0, 1], 0.004],
	"gifted_silver_egg": ["egg", false, [0, 0.649, 0.3, 0.05, 0.001], 1],
	"gifted_gold_egg": ["egg", false, [0, 0, 0.79, 0.2, 0.01], 1],
	"gifted_diamond_egg": ["egg", false, [0, 0, 0, 0.95, 0.05], 1],
	"gifted_mythic_egg": ["egg", false, [0, 0, 0, 0, 1], 1],
	"star_egg": ["egg", undefined],
	"royal_jelly": ["jelly", false, [0, 0.69996, 0.27, 0.03, 0.00004], 0.004, 0.001],
	"star_jelly": ["jelly", false, [0, 0.69996, 0.27, 0.03, 0.00004], 1, 0.001],
	"bumble_bee_egg": ["egg", true, 0, 0.004],
	"rascal_bee_egg": ["egg", true, 0, 0.004],
	"baby_bee_egg": ["egg", true, 0, 0.004],
	"commander_bee_egg": ["egg", true, 0, 0.004],
	"bear_bee_egg": ["egg", true, 0, 0],
	"cobalt_bee_egg": ["egg", true, 0, 0],
	"crimson_bee_egg": ["egg", true, 0, 0],
	"digital_bee_egg": ["egg", true, 0, 0],
	"festive_bee_egg": ["egg", true, 0, 0],
	"gummy_bee_egg": ["egg", true, 0, 0],
	"photon_bee_egg": ["egg", true, 0, 0],
	"puppy_bee_egg": ["egg", true, 0, 0],
	"tabby_bee_egg": ["egg", true, 0, 0],
	"vicious_bee_egg": ["egg", true, 0, 0],
	"windy_bee_egg": ["egg", true, 0, 0],
	"bear_bee_jelly": ["jelly", true, 0, 0],
	"cobalt_bee_jelly": ["jelly", true, 0, 0],
	"crimson_bee_jelly": ["jelly", true, 0, 0],
	"digital_bee_jelly": ["jelly", true, 0, 0],
	"festive_bee_jelly": ["jelly", true, 0, 0],
	"gummy_bee_jelly": ["jelly", true, 0, 0],
	"photon_bee_jelly": ["jelly", true, 0, 0],
	"puppy_bee_jelly": ["jelly", true, 0, 0],
	"tabby_bee_jelly": ["jelly", true, 0, 0],
	"vicious_bee_jelly": ["jelly", true, 0, 0],
	"windy_bee_jelly": ["jelly", true, 0, 0]};
const rarityColors = {
	"Common": "#B7751F",
	"Rare": "#E4E4E4",
	"Epic": "#FFCC33",
	"Legendary": "#00FFFF",
	"Mythic": "#CC99FF",
	"Event": "#99FF99",
	"gifted": "#FFFF66",
	"ungifted": "#BD9B32"};
const mutationChances = [
	//range: levels 0-10, 11-20, 20+
	//range: min, max 0-10, max 11-20, max 20+
	{name: "+%Attack", chance: 0.179, range: [5, 12.5, 20, 25]},
	{name: "+Attack", chance: 0.0387, range: [1, 1, 2, 3]},
	{name: "+%Convert Amount", chance: 0.179, range: [10, 20, 30, 40]},
	{name: "+Convert Amount", chance: 0.0855, range: [20, 50, 80, 110]},
	{name: "+%Gather Amount", chance: 0.179, range: [10, 20, 30, 40]},
	{name: "+Gather Amount", chance: 0.0855, range: [2, 6, 10, 14]},
	{name: "+%Energy", chance: 0.179, range: [10, 25, 40, 55]},
	{name: "+%Bee Ability Rate", chance: 0.0187, range: [1, 3, 5, 7]},
	{name: "+%Critical Chance", chance: 0.0187, range: [1, 2, 3, 4]},
	{name: "+Movespeed", chance: 0.0187, range: [2, 4, 6, 8]},
	{name: "+%Instant Conversion", chance: 0.0457, range: [8, 14, 20, 26]}];
const bondLevels = [
	10,
	50,
	250,
	1000,
	5000,
	20000,
	80000,
	350000,
	800000,
	2000000,
	4000000,
	8000000,
	15000000,
	30000000,
	150000000,
	600000000,
	2500000000,
	10000000000,
	25000000000,
	500000000000,
	5000000000000,
	100000000000000,
	5000000000000000,
	100000000000000000];
const template = document.getElementById("card_template");

class Card {
	constructor(type) {
		this.type = type;
	}
}

class BeeCard extends Card {
	constructor(name = "none", gifted = false, level = 1, bond = 0, beequip = ["none", {}], mutation = ["none", {}]) {
		super("bee");
		this.name = name;
		this.gifted = gifted;
		this.level = level;
		this.bond = bond;
		this.beequip = beequip;
		this.mutation = mutation;
	}

	setName(value) {
		this.name = value;
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

	setMutation(name, stats) {
		this.mutation = [name, stats];
	}
	getMutation() {
		return this.mutation;
	}

	getRarity() {
		return beeTypeStats[this.getName()].rarity;
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
}

var cardHovering = 0;

window.addEventListener('resize', function(event) {
	console.log(window.innerHeight);
	setCardSize();
}, true);

function init() {

}

function setCardSize() {
	const c = document.getElementsByClassName("card");
	for (let i of c) {
		//i.style.height = window.innerHeight / 4 + "px";
		i.style.height = "120px";
		//i.style.width = window.innerHeight / 6 + "px";
		i.style.width = "80px";
		i.style.borderRadius = window.innerHeight / 50 + "px";
		while (i.children[3].children[1].getBoundingClientRect().width > i.getBoundingClientRect().width * 0.9) {
			i.children[3].children[1].style.fontSize = parseInt(i.children[3].children[1].style.fontSize) - 1 + "px";
		}
		while (i.children[3].children[4].getBoundingClientRect().width > i.getBoundingClientRect().width * 0.9) {
			i.children[3].children[4].style.fontSize = parseInt(i.children[3].children[4].style.fontSize) - 1 + "px";
		}
		i.style.border = "3px solid";
		i.style.padding = "3px";
	}
	updateCardHolder();
}

function genCard(type, name) {
	if (game.hand.length > 23) return;
	//24 cards max
	if (type == "bee") {
		const b = new BeeCard(name);
		game.cardList.push(b);
	}
	//bee, name, gifted, level
	/*
	game.hand.push([type, name, true, 1]);
	let c = template.cloneNode(true);
	c.onmouseover = function() {
		c.style.transition = "all 0.3s ease";
		c.dataset.bottom = c.style.bottom;
		c.style.bottom = parseInt(c.style.height) * 0.25 + "px";
		c.dataset.rotate = c.style.rotate;
		c.style.rotate = "0deg";
		c.style.scale = "1.5";
		c.dataset.margin = c.style.margin;
		c.style.margin = "0px " + (parseInt(c.style.margin.slice(3)) * -1.5) + "px";
	}
	c.onmouseout = function() {
		c.style.transition = "all 0.3s ease";
		c.style.bottom = c.dataset.bottom;
		c.style.rotate = c.dataset.rotate;
		c.style.scale = "1.0";
		c.style.margin = c.dataset.margin;
	}
	c.children[0].innerHTML = "Gifted " + name + " Bee";
	c.children[0].style.color = rarityColors[beeTypeStats[name].rarity];
	c.children[1].src = "images/bee_models/" + changeText(name, "underscores") + ".png";
	c.children[2].style.color = rarityColors[beeTypeStats[name].rarity];
	c.children[2].innerHTML = beeTypeStats[name].rarity;
	c.style.visibility = "visible";
	document.getElementById("card_holder").append(c);
	setCardSize();
	*/
}

function genHand(num) {
	const c = document.getElementsByClassName("card");
	while (c[1]) {
		c[1].remove();
	}
	if (num > 23) num = 23;
	let temp = [];
	for (let i = 0; i < game.cardList.length; i++) {
		temp.push(i);
	}
	let hand = [];
	for (let i = 0; i < num; i++) {
		if (temp.length == 0) break;
		let index = Math.floor(Math.random() * temp.length);
		hand.push(temp[index]);
		temp.splice(index, 1);
	}
	for (let i = 0; i < hand.length; i++) {
		const b = game.cardList[i];
		const a = template.cloneNode(true);
		a.onmouseenter = function() {
			a.dataset.hover = true;
			cardHover(a);
			//a.style.transition = "all 0.3s ease";
			a.dataset.bottom = a.style.bottom;
			a.style.bottom = parseInt(a.style.height) * 0.25 + "px";
			a.dataset.rotate = a.style.rotate;
			a.style.rotate = "0deg";
			a.style.scale = "1.5";
			a.dataset.margin = a.style.margin;
			a.style.margin = "0px " + (parseInt(a.style.margin.slice(3)) * -1.5) + "px";
		}
		a.onmouseleave = function() {
			a.dataset.hover = false;
			
			//a.style.transition = "all 0.3s ease";
			a.style.bottom = a.dataset.bottom;
			a.style.rotate = a.dataset.rotate;
			a.style.scale = "1.0";
			a.style.margin = a.dataset.margin;
			updateCardHolder();
		}
		a.children[0].innerHTML = (b.getGifted() ? "Gifted<br>" : "") + b.getName() + " Bee";
		a.children[0].style.color = rarityColors[b.getRarity()];
		a.children[1].src = "images/bee_models/" + changeText(b.getName(), "underscores") + ".png";
		a.children[2].style.color = rarityColors[b.getRarity()];
		a.children[2].innerHTML = b.getRarity();
		a.style.visibility = "visible";
		a.dataset.hover = false;
		document.getElementById("card_holder").append(a);
	}
	setCardSize();
}

function cardHover(elem) {
	cardHovering = 1;
	const c = document.getElementById("card_holder").children;
	let r = 50;
	for (let i of c) {
		i.style.margin = "0px " + (0 - c.length) + "px";
		i.style.bottom = "0px";
	}
	if (elem.previousElementSibling) {
		elem.previousElementSibling.style.margin = "0px " + (-0.5 * c.length) + "px 0px " + (-4 * c.length) + "px";
	}
	if (elem.nextElementSibling) {
		elem.nextElementSibling.style.margin = "0px " + (-4 * c.length) + "px 0px " + (-0.5 * c.length) + "px";
	}
	for (let i of c) {
		let x = (i.getBoundingClientRect().x + i.getBoundingClientRect().width / 2) - window.innerWidth / 2;
		i.style.bottom = r * r * Math.cos(x / (r * r)) - (r * r) + "px";
		i.style.rotate = (-1 * (Math.acos(x / (r * r)) * 180 / Math.PI + 270)) + 360 + "deg";
	}
}

function updateCardHolder() {
	resetCards();
	const c = document.getElementById("card_holder").children;
	let p = window.innerWidth;
	let r = 50;
	for (let i of c) {
		i.style.margin = "0px " + (0 - c.length) + "px";
		i.style.bottom = "0px";
	}
	for (let i of c) {
		let x = (i.getBoundingClientRect().x + i.getBoundingClientRect().width / 2) - window.innerWidth / 2;
		i.style.bottom = r * r * Math.cos(x / (r * r)) - (r * r) + "px";
		i.style.rotate = (-1 * (Math.acos(x / (r * r)) * 180 / Math.PI + 270)) + 360 + "deg";
	}

	function resetCards() {
		if (cardHovering == 1) {
			let i = 0;
			s = setInterval(function() {
				if (cardHovering == 1) {
					if (i == 5) {
						updateCardHolder();
						clearInterval(s);
					}
					i++;
				} else {
					clearInterval(s);
				}
				
			}, 20);
		}
	}
}

function changeText(text, type) {
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
		for (let i = 0; i < text.length; i++) {
			if (text[i] == text[i].toUpperCase()) {
				if (text[i] == " ") continue;
				if (i !== 0) string = string + "_";
				string = string + text[i].toLowerCase();
			} else {
				string = string + text[i];
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
				if (text[i] == text[i].toUpperCase()) {
					string = string + " " + text[i];
				} else {
					string = string + text[i];
				}
			}
		}
		return string;
	}
}