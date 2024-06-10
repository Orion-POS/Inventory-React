enum TransactionCategories {
  BAHAN_BAKU_DAN_PENDUKUNG = "Bahan Baku dan Pendukung",
  SERCVICE_MAIN_OTHERS = "Service, Maintenance, dan lainnya",
  BELANJA_HUTANG_BAYAR = "Belanja Hutang Bayar"
}

export interface TransactionTypesEntity {
  id: number | string;
  transactionName: string;
  transactionCategory: TransactionCategories;
  desc?: string;
}