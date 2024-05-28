import { WastedStockTypes } from "@/models/itemModel";

export const wastedStockData: WastedStockTypes[] = [
  {
    category: 'Makanan',
    name: 'Beras',
    id: 1,
    date: new Date(2024, 2, 30), // 30 Maret 2024
    actual_stock: 100,
    wasted: 5,
    uom: 'kg',
    occasion: 'Kadaluarsa'
  },
  {
    category: 'Minuman',
    name: 'Teh Hijau',
    id: 2,
    date: new Date(2024, 2, 31), // 31 Maret 2024
    actual_stock: 50,
    wasted: 2,
    uom: 'bks',
    occasion: 'Rusak'
  },
  {
    category: 'Peralatan Dapur',
    name: 'Piring',
    id: 3,
    date: new Date(2024, 3, 1), // 1 April 2024
    actual_stock: 200,
    wasted: 10,
    uom: 'buah',
    occasion: 'Pecah'
  },
  {
    category: 'Bahan Pokok',
    name: 'Gula',
    id: 4,
    date: new Date(2024, 3, 2), // 2 April 2024
    actual_stock: 80,
    wasted: 3,
    uom: 'kg',
    occasion: 'Bocor'
  },
  {
    category: 'Minuman',
    name: 'Kopi Bubuk',
    id: 5,
    date: new Date(2024, 3, 3), // 3 April 2024
    actual_stock: 40,
    wasted: 1,
    uom: 'bks',
    occasion: 'Habis Terjual'
  },
  {
    category: 'Peralatan Dapur',
    name: 'Sendok Garpu',
    id: 6,
    date: new Date(2024, 3, 4), // 4 April 2024
    actual_stock: 150,
    wasted: 7,
    uom: 'set',
    occasion: 'Hilang'
  },
  {
    category: 'Makanan',
    name: 'Telur',
    id: 7,
    date: new Date(2024, 3, 5), // 5 April 2024
    actual_stock: 120,
    wasted: 6,
    uom: 'butir',
    occasion: 'Kadaluarsa'
  },
  {
    category: 'Minuman',
    name: 'Air Mineral',
    id: 8,
    date: new Date(2024, 3, 6), // 6 April 2024
    actual_stock: 60,
    wasted: 4,
    uom: 'botol',
    occasion: 'Rusak'
  },
  {
    category: 'Peralatan Dapur',
    name: 'Panci',
    id: 9,
    date: new Date(2024, 3, 7), // 7 April 2024
    actual_stock: 80,
    wasted: 2,
    uom: 'buah',
    occasion: 'Pecah'
  },
  {
    category: 'Makanan',
    name: 'Daging Sapi',
    id: 10,
    date: new Date(2024, 3, 8), // 8 April 2024
    actual_stock: 90,
    wasted: 8,
    uom: 'kg',
    occasion: 'Bocor'
  }
];
