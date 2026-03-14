export type DietKey =
  | 'glutenFree'
  | 'dairyFree'
  | 'lowFodmap'
  | 'lowGI'
  | 'lowHistamine';

export type DietStatus = 'compatible' | 'not_compatible' | 'unknown';

export interface DietResult {
  dietKey: DietKey;
  label: string;
  status: DietStatus;
  triggeredIngredients: string[];
}

export interface ScanResult {
  productName: string | null;
  brand: string | null;
  ingredients: string | null;
  allergens: string | null;
  dietResults: DietResult[];
  scannedAt: string;
}

export interface ScanRecord extends ScanResult {
  barcode: string;
}

export interface DietProfile {
  key: DietKey;
  label: string;
  description: string;
  icon: string;
}