import { StockOpnameTypes } from '@/models/itemModel';

export const stockOpnameData: StockOpnameTypes[] = [
  {
    id: 1,
    date: new Date(2024, 2, 30),
    category: 'Makanan',
    name: 'Beras',
    final_stock: 100,
    uom: 'kg',
    average_price: 15000,
    total_amounts: 30
  },
  {
    id: 2,
    date: new Date(2024, 2, 30),
    category: 'Minuman',
    name: 'Teh Hijau',
    final_stock: 50,
    uom: 'bks',
    average_price: 5000,
    total_amounts: 25
  },
  {
    id: 3,
    date: new Date(2024, 2, 30),
    category: 'Peralatan Masak',
    name: 'Piring',
    final_stock: 200,
    uom: 'buah',
    average_price: 10000,
    total_amounts: 18
  },
  {
    id: 4,
    date: new Date(2024, 2, 31),
    category: 'Bahan Pokok',
    name: 'Gula',
    final_stock: 80,
    uom: 'kg',
    average_price: 12000,
    total_amounts: 12
  },
  {
    id: 5,
    date: new Date(2024, 2, 31),
    category: 'Minuman',
    name: 'Kopi Bubuk',
    final_stock: 40,
    uom: 'bks',
    average_price: 8000,
    total_amounts: 22
  },
  {
    id: 6,
    date: new Date(2024, 2, 31),
    category: 'Peralatan Masak',
    name: 'Sendok Garpu',
    final_stock: 150,
    uom: 'set',
    average_price: 20000,
    total_amounts: 29
  },
  {
    id: 7,
    date: new Date(2024, 3, 1),
    category: 'Makanan',
    name: 'Telur',
    final_stock: 120,
    uom: 'butir',
    average_price: 3000,
    total_amounts: 33
  },
  {
    id: 8,
    date: new Date(2024, 3, 1),
    category: 'Minuman',
    name: 'Air Mineral',
    final_stock: 60,
    uom: 'botol',
    average_price: 2000,
    total_amounts: 31
  },
  {
    id: 9,
    date: new Date(2024, 3, 1),
    category: 'Peralatan Masak',
    name: 'Panci',
    final_stock: 80,
    uom: 'buah',
    average_price: 25000,
    total_amounts: 12
  },
  {
    id: 10,
    date: new Date(2024, 3, 2),
    category: 'Makanan',
    name: 'Daging Sapi',
    final_stock: 90,
    uom: 'kg',
    average_price: 35000,
    total_amounts: 24
  }
];
