"""
Catalog data for Snake Legends.

This is a 1:1 Python port of the `buildSnakes()` / `buildFoods()` generator
functions from the original single-file HTML/JS game, so ids, names, prices
and colors match exactly between the old and new versions.
"""

ADJECTIVES = [
    "Forest", "Crimson", "Azure", "Emerald", "Golden", "Shadow", "Coral", "Amber", "Violet", "Jade",
    "Scarlet", "Cobalt", "Copper", "Silver", "Onyx", "Ruby", "Sapphire", "Ivory", "Sunset", "Midnight",
    "Tropical", "Arctic", "Desert", "Jungle", "Volcanic", "Electric", "Toxic", "Mystic", "Royal", "Storm",
    "Frosted", "Molten", "Painted", "Gilded", "Spotted", "Banded", "Dusky", "Radiant", "Glacial", "Ember",
]
NOUNS = [
    "Viper", "Cobra", "Python", "Adder", "Mamba", "Serpent", "Anaconda", "Rattler", "Boa", "Krait",
    "Asp", "Racer", "Whipsnake", "Sidewinder", "Constrictor",
]
PATTERNS = ["solid", "stripe", "scale", "gradient"]

LEGENDS = [
    {"name": "Golden Python", "primary": "hsl(45,90%,52%)", "secondary": "hsl(38,80%,35%)", "light": "hsl(48,95%,72%)", "pattern": "gold"},
    {"name": "Rainbow Serpent", "primary": "hsl(300,70%,55%)", "secondary": "hsl(260,60%,40%)", "light": "hsl(340,90%,70%)", "pattern": "rainbow"},
    {"name": "Shadow Viper", "primary": "hsl(230,10%,22%)", "secondary": "hsl(230,10%,10%)", "light": "hsl(230,10%,40%)", "pattern": "shadow"},
    {"name": "Fire Drake", "primary": "hsl(14,90%,52%)", "secondary": "hsl(0,80%,32%)", "light": "hsl(30,100%,62%)", "pattern": "fire"},
    {"name": "Ice Serpent", "primary": "hsl(195,75%,62%)", "secondary": "hsl(205,60%,40%)", "light": "hsl(190,90%,85%)", "pattern": "ice"},
    {"name": "Neon Viper", "primary": "hsl(140,100%,50%)", "secondary": "hsl(140,100%,28%)", "light": "hsl(140,100%,72%)", "pattern": "neon"},
    {"name": "Crystal Serpent", "primary": "hsl(190,50%,72%)", "secondary": "hsl(200,40%,50%)", "light": "hsl(190,60%,92%)", "pattern": "ice"},
    {"name": "Void Serpent", "primary": "hsl(265,60%,30%)", "secondary": "hsl(265,60%,14%)", "light": "hsl(265,80%,55%)", "pattern": "shadow"},
    {"name": "Solar Serpent", "primary": "hsl(50,95%,55%)", "secondary": "hsl(25,90%,45%)", "light": "hsl(55,100%,78%)", "pattern": "fire"},
    {"name": "Cosmic Serpent", "primary": "hsl(255,80%,55%)", "secondary": "hsl(280,70%,30%)", "light": "hsl(200,100%,75%)", "pattern": "rainbow"},
    {"name": "Toxic Fang", "primary": "hsl(90,80%,45%)", "secondary": "hsl(90,80%,25%)", "light": "hsl(90,90%,68%)", "pattern": "neon"},
    {"name": "Blood Moon Adder", "primary": "hsl(355,75%,42%)", "secondary": "hsl(355,75%,22%)", "light": "hsl(355,85%,62%)", "pattern": "stripe"},
    {"name": "Storm Cobra", "primary": "hsl(220,55%,45%)", "secondary": "hsl(220,55%,22%)", "light": "hsl(220,75%,72%)", "pattern": "gradient"},
    {"name": "Diamond Serpent", "primary": "hsl(200,20%,80%)", "secondary": "hsl(200,20%,55%)", "light": "hsl(200,30%,96%)", "pattern": "scale"},
    {"name": "Obsidian Mamba", "primary": "hsl(0,0%,15%)", "secondary": "hsl(0,0%,5%)", "light": "hsl(0,0%,35%)", "pattern": "shadow"},
    {"name": "Amethyst Python", "primary": "hsl(275,55%,50%)", "secondary": "hsl(275,55%,28%)", "light": "hsl(275,70%,75%)", "pattern": "gradient"},
    {"name": "Sunfire Boa", "primary": "hsl(35,95%,52%)", "secondary": "hsl(15,85%,38%)", "light": "hsl(45,100%,70%)", "pattern": "fire"},
    {"name": "Glacier Krait", "primary": "hsl(190,60%,68%)", "secondary": "hsl(205,55%,45%)", "light": "hsl(190,80%,90%)", "pattern": "ice"},
    {"name": "Phantom Racer", "primary": "hsl(250,20%,30%)", "secondary": "hsl(250,20%,14%)", "light": "hsl(250,40%,55%)", "pattern": "shadow"},
    {"name": "Prism Serpent", "primary": "hsl(320,75%,58%)", "secondary": "hsl(180,60%,45%)", "light": "hsl(60,90%,68%)", "pattern": "rainbow"},
]

FOOD_ITEMS = [
    ("Apple", "🍎"), ("Orange", "🍊"), ("Lemon", "🍋"), ("Banana", "🍌"), ("Watermelon", "🍉"),
    ("Grapes", "🍇"), ("Strawberry", "🍓"), ("Blueberry", "🫐"), ("Melon", "🍈"), ("Cherry", "🍒"),
    ("Peach", "🍑"), ("Mango", "🥭"), ("Pineapple", "🍍"), ("Coconut", "🥥"), ("Kiwi", "🥝"),
    ("Tomato", "🍅"), ("Avocado", "🥑"), ("Eggplant", "🍆"), ("Broccoli", "🥦"), ("Lettuce", "🥬"),
    ("Cucumber", "🥒"), ("Corn", "🌽"), ("Carrot", "🥕"), ("Bell Pepper", "🫑"), ("Garlic", "🧄"),
    ("Onion", "🧅"), ("Potato", "🥔"), ("Sweet Potato", "🍠"), ("Croissant", "🥐"), ("Bread", "🍞"),
    ("Baguette", "🥖"), ("Cheese", "🧀"), ("Egg", "🥚"), ("Fried Egg", "🍳"), ("Bacon", "🥓"),
    ("Burger", "🍔"), ("Pizza", "🍕"), ("Hot Dog", "🌭"), ("Taco", "🌮"), ("Burrito", "🌯"),
    ("Chicken Leg", "🍗"), ("Meat", "🍖"), ("Shrimp", "🍤"), ("Sushi", "🍣"), ("Donut", "🍩"),
    ("Cookie", "🍪"), ("Cake", "🎂"), ("Chocolate", "🍫"), ("Lollipop", "🍭"), ("Ice Cream", "🍦"),
    ("Pretzel", "🥨"), ("Pancakes", "🥞"), ("Waffle", "🧇"), ("Bagel", "🥯"), ("Popcorn", "🍿"),
    ("French Fries", "🍟"), ("Falafel", "🧆"), ("Dumpling", "🥟"), ("Spring Roll", "🥠"), ("Fish Cake", "🍥"),
    ("Rice Ball", "🍙"), ("Curry Rice", "🍛"), ("Ramen", "🍜"), ("Spaghetti", "🍝"), ("Stew", "🍲"),
    ("Fondue", "🫕"), ("Salad", "🥗"), ("Sandwich", "🥪"), ("Stuffed Flatbread", "🥙"), ("Tamale", "🫓"),
    ("Oyster", "🦪"), ("Lobster", "🦞"), ("Crab", "🦀"), ("Squid", "🦑"), ("Octopus", "🐙"),
    ("Fish", "🐟"), ("Bento Box", "🍱"), ("Mooncake", "🥮"), ("Dango", "🍡"), ("Candy", "🍬"),
    ("Honey", "🍯"), ("Custard", "🍮"), ("Shortcake", "🍰"), ("Cupcake", "🧁"), ("Pie", "🥧"),
    ("Preserve Jar", "🫙"), ("Olive", "🫒"), ("Chestnut", "🌰"), ("Peanuts", "🥜"), ("Bean", "🫘"),
    ("Butter", "🧈"), ("Milk", "🥛"), ("Mate Drink", "🧉"), ("Bubble Tea", "🧋"), ("Hot Beverage", "☕"),
    ("Champagne", "🍾"), ("Cocktail", "🍹"), ("Beer Mug", "🍺"), ("Wine Glass", "🍷"), ("Sake", "🍶"),
]


def _hsl(h: float, s: float, l: float) -> str:
    return f"hsl({round(h)},{s}%,{l}%)"


def build_snakes():
    snakes = []
    idx = 0
    regular_count = 80
    for i in range(regular_count):
        hue = (i * 137.508) % 360
        adj = ADJECTIVES[i % len(ADJECTIVES)]
        noun = NOUNS[(i // len(ADJECTIVES)) % len(NOUNS)]
        snakes.append({
            "id": idx,
            "name": f"{adj} {noun}",
            "primary": _hsl(hue, 62, 46),
            "secondary": _hsl(hue, 62, 30),
            "light": _hsl(hue, 70, 62),
            "pattern": PATTERNS[i % len(PATTERNS)],
            "price": idx * 15,
        })
        idx += 1
    for i, s in enumerate(LEGENDS):
        snakes.append({
            "id": idx,
            "name": s["name"],
            "primary": s["primary"],
            "secondary": s["secondary"],
            "light": s["light"],
            "pattern": s["pattern"],
            "price": 1300 + i * 120,
        })
        idx += 1
    return snakes


def build_foods():
    foods = []
    for i, (name, emoji) in enumerate(FOOD_ITEMS):
        foods.append({
            "id": i,
            "name": name,
            "emoji": emoji,
            "color": _hsl((i * 67) % 360, 65, 55),
            "price": i * 8,
        })
    return foods


SNAKES = build_snakes()
FOODS = build_foods()
SNAKES_BY_ID = {s["id"]: s for s in SNAKES}
FOODS_BY_ID = {f["id"]: f for f in FOODS}

SPEED_MS = {"slow": 150, "normal": 105, "fast": 75, "turbo": 52}
