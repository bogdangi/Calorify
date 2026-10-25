import type { FoodNutrition } from '../../types/nutrition';

// ponytail: kcal-per-100g and default serving sizes are hand-estimated
// approximations (TODO.md §9: 'Values are approximate'). Verify against a
// real table (e.g. USDA) before any medical claim; upgrade path: swap values,
// keep ids.
export const FOOD_DATABASE: FoodNutrition[] = [

  {
    id: 'apple',
    translations: {
      de: 'Apfel',
      uk: 'Яблуко',
    },
    caloriesPer100g: 52,
    defaultServingGrams: 150,
    category: 'fruits',
  },
  {
    id: 'banana',
    translations: {
      de: 'Banane',
      uk: 'Банан',
    },
    caloriesPer100g: 89,
    defaultServingGrams: 120,
    category: 'fruits',
  },
  {
    id: 'pizza',
    translations: {
      de: 'Pizza',
      uk: 'Піца',
    },
    caloriesPer100g: 250,
    defaultServingGrams: 250,
    category: 'meals',
  },
  {
    id: 'rice',
    translations: {
      de: 'Gekochter Reis',
      uk: 'Варений рис',
    },
    caloriesPer100g: 130,
    defaultServingGrams: 180,
    category: 'grains',
  },
  {
    id: 'pasta',
    translations: {
      de: 'Pasta / Nudeln',
      uk: 'Паста / Макарони',
    },
    caloriesPer100g: 157,
    defaultServingGrams: 200,
    category: 'grains',
  },
  {
    id: 'chicken',
    translations: {
      de: 'Hähnchenbrust',
      uk: 'Куряче філе',
    },
    caloriesPer100g: 165,
    defaultServingGrams: 160,
    category: 'proteins',
  },
  {
    id: 'salad',
    translations: {
      de: 'Gemischter Salat',
      uk: 'Свіжий салат',
    },
    caloriesPer100g: 20,
    defaultServingGrams: 150,
    category: 'vegetables',
  },
  {
    id: 'hamburger',
    translations: {
      de: 'Burger',
      uk: 'Бургер',
    },
    caloriesPer100g: 295,
    defaultServingGrams: 220,
    category: 'meals',
  },
  {
    id: 'french_fries',
    translations: {
      de: 'Pommes Frites',
      uk: 'Картопля фрі',
    },
    caloriesPer100g: 312,
    defaultServingGrams: 150,
    category: 'snacks',
  },
  {
    id: 'bread',
    translations: {
      de: 'Vollkornbrot',
      uk: 'Цільнозерновий хліб',
    },
    caloriesPer100g: 265,
    defaultServingGrams: 60,
    category: 'grains',
  },
  {
    id: 'egg',
    translations: {
      de: 'Gekochtes Ei',
      uk: 'Варене яйце',
    },
    caloriesPer100g: 155,
    defaultServingGrams: 60,
    category: 'proteins',
  },
  {
    id: 'yogurt',
    translations: {
      de: 'Griechischer Joghurt',
      uk: 'Грецький йогурт',
    },
    caloriesPer100g: 59,
    defaultServingGrams: 150,
    category: 'dairy',
  },
  {
    id: 'salmon',
    translations: {
      de: 'Lachsfilet',
      uk: 'Філе лосося',
    },
    caloriesPer100g: 208,
    defaultServingGrams: 180,
    category: 'proteins',
  },
  {
    id: 'oatmeal',
    translations: {
      de: 'Haferflocken / Porridge',
      uk: 'Вівсянка / Каша',
    },
    caloriesPer100g: 68,
    defaultServingGrams: 200,
    category: 'grains',
  },
  {
    id: 'orange',
    translations: {
      de: 'Orange',
      uk: 'Апельсин',
    },
    caloriesPer100g: 47,
    defaultServingGrams: 150,
    category: 'fruits',
  },
  {
    id: 'avocado',
    translations: {
      de: 'Avocado',
      uk: 'Авокадо',
    },
    caloriesPer100g: 160,
    defaultServingGrams: 100,
    category: 'fruits',
  },
  {
    id: 'steak',
    translations: {
      de: 'Rindersteak',
      uk: 'Яловичий стейк',
    },
    caloriesPer100g: 250,
    defaultServingGrams: 200,
    category: 'proteins',
  },
  {
    id: 'chocolate',
    translations: {
      de: 'Schokolade',
      uk: 'Шоколад',
    },
    caloriesPer100g: 546,
    defaultServingGrams: 30,
    category: 'snacks',
  },
  {
    id: 'apple_pie',
    translations: {
      de: 'Apfelkuchen',
      uk: 'Яблучний пиріг',
    },
    caloriesPer100g: 265,
    defaultServingGrams: 125,
    category: 'desserts',
  },
  {
    id: 'baby_back_ribs',
    translations: {
      de: 'Spareribs',
      uk: 'Свинячі реберця',
    },
    caloriesPer100g: 290,
    defaultServingGrams: 300,
    category: 'meals',
  },
  {
    id: 'baklava',
    translations: {
      de: 'Baklava',
      uk: 'Пахлава',
    },
    caloriesPer100g: 440,
    defaultServingGrams: 80,
    category: 'desserts',
  },
  {
    id: 'beef_carpaccio',
    translations: {
      de: 'Rindercarpaccio',
      uk: 'Яловичий карпаччо',
    },
    caloriesPer100g: 250,
    defaultServingGrams: 100,
    category: 'meals',
  },
  {
    id: 'beef_tartare',
    translations: {
      de: 'Beef Tartare',
      uk: 'Тартар з яловичини',
    },
    caloriesPer100g: 220,
    defaultServingGrams: 150,
    category: 'meals',
  },
  {
    id: 'beignets',
    translations: {
      de: 'Beignets',
      uk: 'Біньє (смажені пончики)',
    },
    caloriesPer100g: 400,
    defaultServingGrams: 90,
    category: 'desserts',
  },
  {
    id: 'bibimbap',
    translations: {
      de: 'Bibimbap',
      uk: 'Бібімбап',
    },
    caloriesPer100g: 140,
    defaultServingGrams: 450,
    category: 'meals',
  },
  {
    id: 'bread_pudding',
    translations: {
      de: 'Brot-Pudding',
      uk: 'Хлібний пудинг',
    },
    caloriesPer100g: 230,
    defaultServingGrams: 140,
    category: 'desserts',
  },
  {
    id: 'breakfast_burrito',
    translations: {
      de: 'Frühstücksburrito',
      uk: 'Сніданковий буріто',
    },
    caloriesPer100g: 200,
    defaultServingGrams: 250,
    category: 'meals',
  },
  {
    id: 'bruschetta',
    translations: {
      de: 'Bruschetta',
      uk: 'Брускета',
    },
    caloriesPer100g: 200,
    defaultServingGrams: 150,
    category: 'meals',
  },
  {
    id: 'cannoli',
    translations: {
      de: 'Cannoli',
      uk: 'Каннолі',
    },
    caloriesPer100g: 320,
    defaultServingGrams: 100,
    category: 'desserts',
  },
  {
    id: 'carrot_cake',
    translations: {
      de: 'Karottenkuchen',
      uk: 'Морквяний торт',
    },
    caloriesPer100g: 400,
    defaultServingGrams: 120,
    category: 'desserts',
  },
  {
    id: 'ceviche',
    translations: {
      de: 'Ceviche',
      uk: 'Севіче',
    },
    caloriesPer100g: 120,
    defaultServingGrams: 180,
    category: 'meals',
  },
  {
    id: 'cheese_plate',
    translations: {
      de: 'Käseplatte',
      uk: 'Сирна тарілка',
    },
    caloriesPer100g: 380,
    defaultServingGrams: 100,
    category: 'snacks',
  },
  {
    id: 'cheesecake',
    translations: {
      de: 'Käsekuchen',
      uk: 'Чізкейк',
    },
    caloriesPer100g: 320,
    defaultServingGrams: 125,
    category: 'desserts',
  },
  {
    id: 'chicken_curry',
    translations: {
      de: 'Hähnchen-Curry',
      uk: 'Курка в соусі каррі',
    },
    caloriesPer100g: 145,
    defaultServingGrams: 300,
    category: 'meals',
  },
  {
    id: 'chicken_quesadilla',
    translations: {
      de: 'Hähnchen-Quesadilla',
      uk: 'Кесадилья з куркою',
    },
    caloriesPer100g: 220,
    defaultServingGrams: 200,
    category: 'meals',
  },
  {
    id: 'chicken_wings',
    translations: {
      de: 'Chicken Wings',
      uk: 'Курячі крильця',
    },
    caloriesPer100g: 210,
    defaultServingGrams: 220,
    category: 'meals',
  },
  {
    id: 'chocolate_cake',
    translations: {
      de: 'Schokoladenkuchen',
      uk: 'Шоколадний торт',
    },
    caloriesPer100g: 370,
    defaultServingGrams: 110,
    category: 'desserts',
  },
  {
    id: 'chocolate_mousse',
    translations: {
      de: 'Schokoladenmousse',
      uk: 'Шоколадний мус',
    },
    caloriesPer100g: 370,
    defaultServingGrams: 100,
    category: 'desserts',
  },
  {
    id: 'churros',
    translations: {
      de: 'Churros',
      uk: 'Чуррос',
    },
    caloriesPer100g: 400,
    defaultServingGrams: 100,
    category: 'desserts',
  },
  {
    id: 'clam_chowder',
    translations: {
      de: 'Clam Chowder',
      uk: 'Юшка з морських молюсків',
    },
    caloriesPer100g: 90,
    defaultServingGrams: 300,
    category: 'soups',
  },
  {
    id: 'club_sandwich',
    translations: {
      de: 'Club-Sandwich',
      uk: 'Клубний сендвіч',
    },
    caloriesPer100g: 250,
    defaultServingGrams: 230,
    category: 'meals',
  },
  {
    id: 'crab_cakes',
    translations: {
      de: 'Krabbenküchlein',
      uk: 'Крабові котлетки',
    },
    caloriesPer100g: 210,
    defaultServingGrams: 150,
    category: 'meals',
  },
  {
    id: 'creme_brulee',
    translations: {
      de: 'Crème brûlée',
      uk: 'Крем-брюле',
    },
    caloriesPer100g: 330,
    defaultServingGrams: 120,
    category: 'desserts',
  },
  {
    id: 'croque_madame',
    translations: {
      de: 'Croque Madame',
      uk: 'Крок-мадам',
    },
    caloriesPer100g: 300,
    defaultServingGrams: 250,
    category: 'meals',
  },
  {
    id: 'cup_cakes',
    translations: {
      de: 'Cupcakes',
      uk: 'Капкейки',
    },
    caloriesPer100g: 380,
    defaultServingGrams: 90,
    category: 'desserts',
  },
  {
    id: 'donuts',
    translations: {
      de: 'Donuts',
      uk: 'Пончики',
    },
    caloriesPer100g: 420,
    defaultServingGrams: 60,
    category: 'desserts',
  },
  {
    id: 'dumplings',
    translations: {
      de: 'Dumplings',
      uk: 'Пельмені',
    },
    caloriesPer100g: 200,
    defaultServingGrams: 240,
    category: 'meals',
  },
  {
    id: 'edamame',
    translations: {
      de: 'Edamame',
      uk: 'Едамаме',
    },
    caloriesPer100g: 120,
    defaultServingGrams: 100,
    category: 'meals',
  },
  {
    id: 'escargots',
    translations: {
      de: 'Escargots',
      uk: 'Ескарго (м’ясо равликів)',
    },
    caloriesPer100g: 190,
    defaultServingGrams: 100,
    category: 'meals',
  },
  {
    id: 'falafel',
    translations: {
      de: 'Falafel',
      uk: 'Фалафель',
    },
    caloriesPer100g: 330,
    defaultServingGrams: 150,
    category: 'meals',
  },
  {
    id: 'fish_and_chips',
    translations: {
      de: 'Fish and Chips',
      uk: 'Риба з картоплею фрі',
    },
    caloriesPer100g: 230,
    defaultServingGrams: 350,
    category: 'meals',
  },
  {
    id: 'foie_gras',
    translations: {
      de: 'Foie Gras',
      uk: 'Фуа-гра',
    },
    caloriesPer100g: 460,
    defaultServingGrams: 60,
    category: 'meals',
  },
  {
    id: 'fried_calamari',
    translations: {
      de: 'Frittierter Kalamar',
      uk: 'Смажені кальмари',
    },
    caloriesPer100g: 260,
    defaultServingGrams: 180,
    category: 'meals',
  },
  {
    id: 'fried_rice',
    translations: {
      de: 'Gebratener Reis',
      uk: 'Смажений рис',
    },
    caloriesPer100g: 160,
    defaultServingGrams: 300,
    category: 'grains',
  },
  {
    id: 'french_onion_soup',
    translations: {
      de: 'Überbackene Zwiebelsuppe',
      uk: 'Цибулевий суп',
    },
    caloriesPer100g: 120,
    defaultServingGrams: 300,
    category: 'soups',
  },
  {
    id: 'french_toast',
    translations: {
      de: 'French Toast',
      uk: 'Гренки у яєчному клярі',
    },
    caloriesPer100g: 230,
    defaultServingGrams: 180,
    category: 'meals',
  },
  {
    id: 'gnocchi',
    translations: {
      de: 'Gnocchi',
      uk: 'Ньоккі',
    },
    caloriesPer100g: 160,
    defaultServingGrams: 250,
    category: 'grains',
  },
  {
    id: 'grilled_cheese_sandwich',
    translations: {
      de: 'Grilled-Cheese-Sandwich',
      uk: 'Сендвіч з плавленим сиром',
    },
    caloriesPer100g: 300,
    defaultServingGrams: 180,
    category: 'meals',
  },
  {
    id: 'gyoza',
    translations: {
      de: 'Gyoza',
      uk: 'Гьодза',
    },
    caloriesPer100g: 200,
    defaultServingGrams: 180,
    category: 'meals',
  },
  {
    id: 'hot_and_sour_soup',
    translations: {
      de: 'Würzig-saure Suppe',
      uk: 'Гострокислий суп',
    },
    caloriesPer100g: 80,
    defaultServingGrams: 300,
    category: 'soups',
  },
  {
    id: 'hot_dog',
    translations: {
      de: 'Hot Dog',
      uk: 'Хот-дог',
    },
    caloriesPer100g: 290,
    defaultServingGrams: 150,
    category: 'meals',
  },
  {
    id: 'huevos_rancheros',
    translations: {
      de: 'Huevos Rancheros',
      uk: 'Уевос ранчерос',
    },
    caloriesPer100g: 180,
    defaultServingGrams: 250,
    category: 'meals',
  },
  {
    id: 'hummus',
    translations: {
      de: 'Hummus',
      uk: 'Хумус',
    },
    caloriesPer100g: 170,
    defaultServingGrams: 100,
    category: 'meals',
  },
  {
    id: 'ice_cream',
    translations: {
      de: 'Eis',
      uk: 'Морозиво',
    },
    caloriesPer100g: 210,
    defaultServingGrams: 120,
    category: 'desserts',
  },
  {
    id: 'lasagna',
    translations: {
      de: 'Lasagne',
      uk: 'Лазанья',
    },
    caloriesPer100g: 135,
    defaultServingGrams: 350,
    category: 'meals',
  },
  {
    id: 'lobster_bisque',
    translations: {
      de: 'Hummer-Bisque',
      uk: 'Юшка з лобстера',
    },
    caloriesPer100g: 110,
    defaultServingGrams: 250,
    category: 'soups',
  },
  {
    id: 'lobster_roll_sandwich',
    translations: {
      de: 'Lobster Roll',
      uk: 'Сендвіч з лобстером',
    },
    caloriesPer100g: 230,
    defaultServingGrams: 180,
    category: 'meals',
  },
  {
    id: 'macaroni_and_cheese',
    translations: {
      de: 'Mac and Cheese',
      uk: 'Макарони з сиром',
    },
    caloriesPer100g: 165,
    defaultServingGrams: 300,
    category: 'grains',
  },
  {
    id: 'macarons',
    translations: {
      de: 'Macarons',
      uk: 'Макаронс',
    },
    caloriesPer100g: 400,
    defaultServingGrams: 60,
    category: 'desserts',
  },
  {
    id: 'miso_soup',
    translations: {
      de: 'Miso-Suppe',
      uk: 'Місо-суп',
    },
    caloriesPer100g: 40,
    defaultServingGrams: 250,
    category: 'soups',
  },
  {
    id: 'mussels',
    translations: {
      de: 'Muscheln',
      uk: 'Мідії',
    },
    caloriesPer100g: 90,
    defaultServingGrams: 250,
    category: 'seafood',
  },
  {
    id: 'nachos',
    translations: {
      de: 'Nachos',
      uk: 'Начос',
    },
    caloriesPer100g: 300,
    defaultServingGrams: 250,
    category: 'snacks',
  },
  {
    id: 'onion_rings',
    translations: {
      de: 'Onion Rings',
      uk: 'Цибулеві кільця',
    },
    caloriesPer100g: 380,
    defaultServingGrams: 120,
    category: 'snacks',
  },
  {
    id: 'oysters',
    translations: {
      de: 'Austern',
      uk: 'Устриці',
    },
    caloriesPer100g: 70,
    defaultServingGrams: 150,
    category: 'seafood',
  },
  {
    id: 'pad_thai',
    translations: {
      de: 'Pad Thai',
      uk: 'Пад-тай',
    },
    caloriesPer100g: 160,
    defaultServingGrams: 350,
    category: 'meals',
  },
  {
    id: 'paella',
    translations: {
      de: 'Paella',
      uk: 'Паелья',
    },
    caloriesPer100g: 175,
    defaultServingGrams: 350,
    category: 'grains',
  },
  {
    id: 'pancakes',
    translations: {
      de: 'Pancakes',
      uk: 'Млинці',
    },
    caloriesPer100g: 230,
    defaultServingGrams: 180,
    category: 'meals',
  },
  {
    id: 'panna_cotta',
    translations: {
      de: 'Panna Cotta',
      uk: 'Панна-котта',
    },
    caloriesPer100g: 260,
    defaultServingGrams: 110,
    category: 'desserts',
  },
  {
    id: 'peking_duck',
    translations: {
      de: 'Peking-Ente',
      uk: 'Качка по-пекінськи',
    },
    caloriesPer100g: 300,
    defaultServingGrams: 200,
    category: 'meals',
  },
  {
    id: 'pho',
    translations: {
      de: 'Pho',
      uk: 'Фо',
    },
    caloriesPer100g: 90,
    defaultServingGrams: 450,
    category: 'soups',
  },
  {
    id: 'pork_chop',
    translations: {
      de: 'Schweinekotelett',
      uk: 'Свиняча відбивна',
    },
    caloriesPer100g: 230,
    defaultServingGrams: 200,
    category: 'meals',
  },
  {
    id: 'pulled_pork_sandwich',
    translations: {
      de: 'Pulled-Pork-Sandwich',
      uk: 'Сендвіч з свинячим барбекю',
    },
    caloriesPer100g: 250,
    defaultServingGrams: 250,
    category: 'meals',
  },
  {
    id: 'ravioli',
    translations: {
      de: 'Ravioli',
      uk: 'Равіолі',
    },
    caloriesPer100g: 145,
    defaultServingGrams: 300,
    category: 'grains',
  },
  {
    id: 'ramen',
    translations: {
      de: 'Ramen',
      uk: 'Рамен',
    },
    caloriesPer100g: 110,
    defaultServingGrams: 450,
    category: 'soups',
  },
  {
    id: 'red_velvet_cake',
    translations: {
      de: 'Red-Velvet-Cake',
      uk: 'Торт «Ред Велвет»',
    },
    caloriesPer100g: 390,
    defaultServingGrams: 110,
    category: 'desserts',
  },
  {
    id: 'risotto',
    translations: {
      de: 'Risotto',
      uk: 'Різотто',
    },
    caloriesPer100g: 160,
    defaultServingGrams: 300,
    category: 'grains',
  },
  {
    id: 'samosa',
    translations: {
      de: 'Samosa',
      uk: 'Самоса',
    },
    caloriesPer100g: 300,
    defaultServingGrams: 120,
    category: 'snacks',
  },
  {
    id: 'sashimi',
    translations: {
      de: 'Sashimi',
      uk: 'Сашимі',
    },
    caloriesPer100g: 130,
    defaultServingGrams: 150,
    category: 'seafood',
  },
  {
    id: 'scallops',
    translations: {
      de: 'Jakobsmuscheln',
      uk: 'Гребінці',
    },
    caloriesPer100g: 110,
    defaultServingGrams: 150,
    category: 'seafood',
  },
  {
    id: 'shrimp_and_grits',
    translations: {
      de: 'Shrimp and Grits',
      uk: 'Креветки з кукурудзяною кашею',
    },
    caloriesPer100g: 190,
    defaultServingGrams: 300,
    category: 'seafood',
  },
  {
    id: 'spaghetti_bolognese',
    translations: {
      de: 'Spaghetti Bolognese',
      uk: 'Спагеті болоньєзе',
    },
    caloriesPer100g: 160,
    defaultServingGrams: 350,
    category: 'grains',
  },
  {
    id: 'spaghetti_carbonara',
    translations: {
      de: 'Spaghetti Carbonara',
      uk: 'Спагеті карбонара',
    },
    caloriesPer100g: 190,
    defaultServingGrams: 350,
    category: 'grains',
  },
  {
    id: 'spring_rolls',
    translations: {
      de: 'Frühlingsrollen',
      uk: 'Весняні рулети',
    },
    caloriesPer100g: 220,
    defaultServingGrams: 200,
    category: 'meals',
  },
  {
    id: 'strawberry_shortcake',
    translations: {
      de: 'Erdbeerkuchen',
      uk: 'Полуничний торт',
    },
    caloriesPer100g: 290,
    defaultServingGrams: 120,
    category: 'desserts',
  },
  {
    id: 'sushi',
    translations: {
      de: 'Sushi',
      uk: 'Суші',
    },
    caloriesPer100g: 150,
    defaultServingGrams: 250,
    category: 'meals',
  },
  {
    id: 'tacos',
    translations: {
      de: 'Tacos',
      uk: 'Такос',
    },
    caloriesPer100g: 220,
    defaultServingGrams: 250,
    category: 'meals',
  },
  {
    id: 'takoyaki',
    translations: {
      de: 'Takoyaki',
      uk: 'Такоякі',
    },
    caloriesPer100g: 220,
    defaultServingGrams: 120,
    category: 'meals',
  },
  {
    id: 'tiramisu',
    translations: {
      de: 'Tiramisù',
      uk: 'Тірамісу',
    },
    caloriesPer100g: 300,
    defaultServingGrams: 120,
    category: 'desserts',
  },
  {
    id: 'tuna_tartare',
    translations: {
      de: 'Thunfisch-Tartare',
      uk: 'Тартар з тунця',
    },
    caloriesPer100g: 150,
    defaultServingGrams: 120,
    category: 'seafood',
  },
  {
    id: 'waffles',
    translations: {
      de: 'Waffeln',
      uk: 'Вафлі',
    },
    caloriesPer100g: 290,
    defaultServingGrams: 150,
    category: 'meals',
  },
];
