import { UsedStockTypes } from '@/types/itemTypes';

export const usedStocksData: UsedStockTypes[] = [
  {
    id: 1,
    date: new Date(2022, 2, 30),
    category: 'Makanan',
    name: 'Beras',
    in_stock: 100,
    used_stock: 20,
    current_stock: 80,
    uom: 'kg'
  },
  {
    id: 2,
    date: new Date(2022, 2, 30),
    category: 'Minuman',
    name: 'Teh Hijau',
    in_stock: 50,
    used_stock: 10,
    current_stock: 40,
    uom: 'bks'
  },
  {
    id: 3,
    date: new Date(2022, 2, 30),
    category: 'Peralatan',
    name: 'Piring',
    in_stock: 200,
    used_stock: 50,
    current_stock: 150,
    uom: 'buah'
  },
  {
    id: 4,
    date: new Date(2022, 2, 31),
    category: 'Makanan',
    name: 'Gula',
    in_stock: 80,
    used_stock: 30,
    current_stock: 50,
    uom: 'kg'
  },
  {
    id: 5,
    date: new Date(2022, 2, 31),
    category: 'Minuman',
    name: 'Kopi Bubuk',
    in_stock: 40,
    used_stock: 15,
    current_stock: 25,
    uom: 'bks'
  },
  {
    id: 6,
    date: new Date(2022, 2, 31),
    category: 'Peralatan',
    name: 'Sendok Garpu',
    in_stock: 150,
    used_stock: 30,
    current_stock: 120,
    uom: 'set'
  },
  {
    id: 7,
    date: new Date(2022, 3, 1),
    category: 'Makanan',
    name: 'Telur',
    in_stock: 120,
    used_stock: 40,
    current_stock: 80,
    uom: 'butir'
  },
  {
    id: 8,
    date: new Date(2022, 3, 1),
    category: 'Minuman',
    name: 'Air Mineral',
    in_stock: 60,
    used_stock: 20,
    current_stock: 40,
    uom: 'botol'
  },
  {
    id: 9,
    date: new Date(2022, 3, 1),
    category: 'Peralatan',
    name: 'Panci',
    in_stock: 80,
    used_stock: 10,
    current_stock: 70,
    uom: 'buah'
  },
  {
    id: 10,
    date: new Date(2022, 3, 2),
    category: 'Makanan',
    name: 'Daging Sapi',
    in_stock: 90,
    used_stock: 30,
    current_stock: 60,
    uom: 'kg'
  }
];
