const OFF_BASE = 'https://world.openfoodfacts.org/api/v2/product';
const USER_AGENT = 'GlutenScan/2.0 (glutenscan.app)';

export interface ProductData {
  productName: string | null;
  brand: string | null;
  ingredients: string | null;
  allergens: string | null;
}

export type FetchResult =
  | { found: true; product: ProductData }
  | { found: false; reason: 'not_found' | 'network_error' | 'timeout' };

export async function fetchProductByBarcode(barcode: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `${OFF_BASE}/${barcode}.json?fields=product_name,brands,ingredients_text,allergens`,
      {
        headers: { 'User-Agent': USER_AGENT },
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) throw new Error('API error');

    const data = await response.json();

    if (data.status === 0 || !data.product) {
      return { found: false, reason: 'not_found' };
    }

    return {
      found: true,
      product: {
        productName: data.product.product_name ?? null,
        brand: data.product.brands ?? null,
        ingredients: data.product.ingredients_text ?? null,
        allergens: data.product.allergens ?? null,
      },
    };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      return { found: false, reason: 'timeout' };
    }
    return { found: false, reason: 'network_error' };
  }
}