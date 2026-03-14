const BACKEND_URL = 'https://glutenscan-api-production.up.railway.app';

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
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `${BACKEND_URL}/scan/${barcode}`,
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) throw new Error('API error');

    const data = await response.json();

    if (data.status === 'unknown_product') {
      return { found: false, reason: 'not_found' };
    }

    return {
      found: true,
      product: {
        productName: data.productName ?? null,
        brand: data.brand ?? null,
        ingredients: data.ingredients ?? null,
        allergens: data.allergens ?? null,
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