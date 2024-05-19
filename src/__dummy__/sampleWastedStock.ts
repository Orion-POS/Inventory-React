export interface WastedStockTypes {
  sku: number;
  name: string;
  date: Date;
  actual_stock: number;
  wasted: number;
  uom: string;
  occasion: string;
}

export const wastedStockData: WastedStockTypes[] = [
  {
    sku: 1,
    name: 'Beras',
    date: new Date(2024, 2, 30), // 30 Maret 2024
    actual_stock: 100,
    wasted: 5,
    uom: 'kg',
    occasion: 'Kadaluarsa'
  },
  {
    sku: 2,
    name: 'Teh Hijau',
    date: new Date(2024, 2, 31), // 31 Maret 2024
    actual_stock: 50,
    wasted: 2,
    uom: 'bks',
    occasion: 'Rusak'
  },
  {
    sku: 3,
    name: 'Piring',
    date: new Date(2024, 3, 1), // 1 April 2024
    actual_stock: 200,
    wasted: 10,
    uom: 'buah',
    occasion: 'Pecah'
  },
  {
    sku: 4,
    name: 'Gula',
    date: new Date(2024, 3, 2), // 2 April 2024
    actual_stock: 80,
    wasted: 3,
    uom: 'kg',
    occasion: 'Bocor'
  },
  {
    sku: 5,
    name: 'Kopi Bubuk',
    date: new Date(2024, 3, 3), // 3 April 2024
    actual_stock: 40,
    wasted: 1,
    uom: 'bks',
    occasion: 'Habis Terjual'
  },
  {
    sku: 6,
    name: 'Sendok Garpu',
    date: new Date(2024, 3, 4), // 4 April 2024
    actual_stock: 150,
    wasted: 7,
    uom: 'set',
    occasion: 'Hilang'
  },
  {
    sku: 7,
    name: 'Telur',
    date: new Date(2024, 3, 5), // 5 April 2024
    actual_stock: 120,
    wasted: 6,
    uom: 'butir',
    occasion: 'Kadaluarsa'
  },
  {
    sku: 8,
    name: 'Air Mineral',
    date: new Date(2024, 3, 6), // 6 April 2024
    actual_stock: 60,
    wasted: 4,
    uom: 'botol',
    occasion: 'Rusak'
  },
  {
    sku: 9,
    name: 'Panci',
    date: new Date(2024, 3, 7), // 7 April 2024
    actual_stock: 80,
    wasted: 2,
    uom: 'buah',
    occasion: 'Pecah'
  },
  {
    sku: 10,
    name: 'Daging Sapi',
    date: new Date(2024, 3, 8), // 8 April 2024
    actual_stock: 90,
    wasted: 8,
    uom: 'kg',
    occasion: 'Bocor'
  }
];
