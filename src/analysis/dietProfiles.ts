import { DietProfile } from '../types';

export const DIET_PROFILES: DietProfile[] = [
  {
    key: 'glutenFree',
    label: 'Gluten Free',
    description: 'Avoids wheat, barley, rye and related grains',
    icon: '🌾',
  },
  {
    key: 'dairyFree',
    label: 'Dairy Free',
    description: 'Avoids milk, cheese, butter and dairy derivatives',
    icon: '🥛',
  },
  {
    key: 'lowFodmap',
    label: 'Low FODMAP',
    description: 'Avoids fermentable carbohydrates that trigger IBS',
    icon: '🫀',
  },
  {
    key: 'lowGI',
    label: 'Low GI',
    description: 'Avoids high glycaemic index ingredients',
    icon: '📊',
  },
  {
    key: 'lowHistamine',
    label: 'Low Histamine',
    description: 'Avoids histamine-rich and histamine-releasing foods',
    icon: '🌡️',
  },
];