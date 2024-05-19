export interface StockOpnameTypes {
  id: number;
  date: Date;
  name: string;
  final_stock: number;
  uom: string;
  average_price: number;
  total_amounts: number;
}

export const stockOpnameData: StockOpnameTypes[] = [
  {
    id: 1,
    date: new Date(2024, 2, 30), // 30 Maret 2024
    name: 'Beras',
    final_stock: 100,
    uom: 'kg',
    average_price: 15000,
    total_amounts: 30
  },
  {
    id: 2,
    date: new Date(2024, 2, 30),
    name: 'Teh Hijau',
    final_stock: 50,
    uom: 'bks',
    average_price: 5000,
    total_amounts: 25
  },
  {
    id: 3,
    date: new Date(2024, 2, 30),
    name: 'Piring',
    final_stock: 200,
    uom: 'buah',
    average_price: 10000,
    total_amounts: 18
  },
  {
    id: 4,
    date: new Date(2024, 2, 31), // 31 Maret 2024
    name: 'Gula',
    final_stock: 80,
    uom: 'kg',
    average_price: 12000,
    total_amounts: 12
  },
  {
    id: 5,
    date: new Date(2024, 2, 31),
    name: 'Kopi Bubuk',
    final_stock: 40,
    uom: 'bks',
    average_price: 8000,
    total_amounts: 22
  },
  {
    id: 6,
    date: new Date(2024, 2, 31),
    name: 'Sendok Garpu',
    final_stock: 150,
    uom: 'set',
    average_price: 20000,
    total_amounts: 29
  },
  {
    id: 7,
    date: new Date(2024, 3, 1), // 1 April 2024
    name: 'Telur',
    final_stock: 120,
    uom: 'butir',
    average_price: 3000,
    total_amounts: 33
  },
  {
    id: 8,
    date: new Date(2024, 3, 1),
    name: 'Air Mineral',
    final_stock: 60,
    uom: 'botol',
    average_price: 2000,
    total_amounts: 31
  },
  {
    id: 9,
    date: new Date(2024, 3, 1),
    name: 'Panci',
    final_stock: 80,
    uom: 'buah',
    average_price: 25000,
    total_amounts: 12
  },
  {
    id: 10,
    date: new Date(2024, 3, 2), // 2 April 2024
    name: 'Daging Sapi',
    final_stock: 90,
    uom: 'kg',
    average_price: 35000,
    total_amounts: 24
  }
];
