import { DietKey, DietResult, DietStatus } from '../types';
import { TRIGGER_LISTS } from './triggerLists';
import { DIET_PROFILES } from './dietProfiles';
import { parseIngredients, normaliseText } from './ingredientParser';

function checkIngredientAgainstTrigger(
  ingredient: string,
  trigger: string
): boolean {
  const normIngredient = normaliseText(ingredient);
  const normTrigger = normaliseText(trigger);

  if (normIngredient === normTrigger) return true;
  if (normIngredient.includes(normTrigger)) return true;
  if (normTrigger.length > 5 && normTrigger.includes(normIngredient)) return true;

  return false;
}

function analyseDiet(
  dietKey: DietKey,
  parsedIngredients: string[],
  rawText: string
): DietResult {
  const triggers = TRIGGER_LISTS[dietKey];
  const profile = DIET_PROFILES.find(p => p.key === dietKey)!;
  const triggeredIngredients: string[] = [];
  const normalisedRaw = normaliseText(rawText);

  for (const trigger of triggers) {
    const normTrigger = normaliseText(trigger);

    if (normalisedRaw.includes(normTrigger)) {
      if (!triggeredIngredients.includes(trigger)) {
        triggeredIngredients.push(trigger);
      }
      continue;
    }

    for (const ingredient of parsedIngredients) {
      if (checkIngredientAgainstTrigger(ingredient, trigger)) {
        if (!triggeredIngredients.includes(trigger)) {
          triggeredIngredients.push(trigger);
        }
        break;
      }
    }
  }

  const status: DietStatus =
    triggeredIngredients.length > 0 ? 'not_compatible' : 'compatible';

  return {
    dietKey,
    label: profile.label,
    status,
    triggeredIngredients,
  };
}

export function runDietAnalysis(
  activeDiets: DietKey[],
  ingredientsText: string | null,
  allergensText: string | null
): DietResult[] {
  if (!ingredientsText && !allergensText) {
    return activeDiets.map(dietKey => ({
      dietKey,
      label: DIET_PROFILES.find(p => p.key === dietKey)!.label,
      status: 'unknown' as DietStatus,
      triggeredIngredients: [],
    }));
  }

  const combinedText = `${ingredientsText ?? ''} ${allergensText ?? ''}`;
  const parsedIngredients = parseIngredients(combinedText);

  return activeDiets.map(dietKey =>
    analyseDiet(dietKey, parsedIngredients, combinedText)
  );
}