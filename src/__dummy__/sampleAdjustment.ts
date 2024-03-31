export interface AdjustmentTypes {
  id: number;
  date: Date;
  category: string;
  name: string;
  in_stock: number;
  actual_stock: number;
  adjustment_stock: number;
  uom: string;
}

export const adjustmentData: AdjustmentTypes[] = [
  {
    id: 1,
    date: new Date(2022, 2, 30), // 30 Maret 2022
    category: 'Makanan',
    name: 'Beras',
    in_stock: 100,
    actual_stock: 20,
    adjustment_stock: 80,
    uom: 'kg'
  },
  {
    id: 2,
    date: new Date(2022, 2, 30),
    category: 'Minuman',
    name: 'Teh Hijau',
    in_stock: 50,
    actual_stock: 10,
    adjustment_stock: 40,
    uom: 'bks'
  },
  {
    id: 3,
    date: new Date(2022, 2, 30),
    category: 'Peralatan',
    name: 'Piring',
    in_stock: 200,
    actual_stock: 50,
    adjustment_stock: 150,
    uom: 'buah'
  },
  {
    id: 4,
    date: new Date(2022, 2, 31), // 31 Maret 2022
    category: 'Makanan',
    name: 'Gula',
    in_stock: 80,
    actual_stock: 30,
    adjustment_stock: 50,
    uom: 'kg'
  },
  {
    id: 5,
    date: new Date(2022, 2, 31),
    category: 'Minuman',
    name: 'Kopi Bubuk',
    in_stock: 40,
    actual_stock: 15,
    adjustment_stock: 25,
    uom: 'bks'
  },
  {
    id: 6,
    date: new Date(2022, 2, 31),
    category: 'Peralatan',
    name: 'Sendok Garpu',
    in_stock: 150,
    actual_stock: 30,
    adjustment_stock: 120,
    uom: 'set'
  },
  {
    id: 7,
    date: new Date(2022, 3, 1), // 1 April 2022
    category: 'Makanan',
    name: 'Telur',
    in_stock: 120,
    actual_stock: 40,
    adjustment_stock: 80,
    uom: 'butir'
  },
  {
    id: 8,
    date: new Date(2022, 3, 1),
    category: 'Minuman',
    name: 'Air Mineral',
    in_stock: 60,
    actual_stock: 20,
    adjustment_stock: 40,
    uom: 'botol'
  },
  {
    id: 9,
    date: new Date(2022, 3, 1),
    category: 'Peralatan',
    name: 'Panci',
    in_stock: 80,
    actual_stock: 10,
    adjustment_stock: 70,
    uom: 'buah'
  },
  {
    id: 10,
    date: new Date(2022, 3, 2), // 2 April 2022
    category: 'Makanan',
    name: 'Daging Sapi',
    in_stock: 90,
    actual_stock: 30,
    adjustment_stock: 60,
    uom: 'kg'
  }
];
