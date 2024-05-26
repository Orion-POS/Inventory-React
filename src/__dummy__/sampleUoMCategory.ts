enum UoMTypes {
  asReference = 'Reference UoM for this category',
  smaller = 'Smaller than reference',
  bigger = 'Bigger than reference'
}

export interface UoMCategoryEntity {
  id: number | string;
  uomCategory: string;
  properties: {
    unitId: string;
    unit: string;
    type: UoMTypes;
    ratio: number;
    rounding: number;
    active: boolean;
    default: boolean;
  }[];
}

export const uOMCategories: UoMCategoryEntity[] = [
  {
    id: 1,
    uomCategory: 'Berat Beras',
    properties: [
      {
        unitId: 'BN-01',
        unit: 'ons',
        type: UoMTypes.asReference,
        ratio: 1.0,
        rounding: 0.1,
        active: true,
        default: true
      },
      {
        unitId: 'BN-02',
        unit: 'kg',
        type: UoMTypes.bigger,
        ratio: 1000,
        rounding: 0.1,
        active: true,
        default: false
      },
      {
        unitId: 'BN-03',
        unit: 'liter',
        type: UoMTypes.bigger,
        ratio: 1000,
        rounding: 0.1,
        active: true,
        default: false
      },
      {
        unitId: 'BN-03',
        unit: 'karung 5kg',
        type: UoMTypes.bigger,
        ratio: 5000,
        rounding: 0.1,
        active: true,
        default: false
      }
    ]
  },
  {
    id: 2,
    uomCategory: 'Standar Berat Pasar',
    properties: [
      {
        unitId: 'SBP-01',
        unit: 'ons',
        type: UoMTypes.asReference,
        ratio: 1.0,
        rounding: 0.1,
        active: true,
        default: true
      }
    ]
  }
];
