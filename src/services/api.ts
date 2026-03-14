const BASE_URL = 'https://glutenscan-api-production.up.railway.app';

export async function scanBarcode(barcode: string) {
  const response = await fetch(`${BASE_URL}/scan/${barcode}`);
  if (!response.ok) throw new Error('API error');
  return response.json();
}