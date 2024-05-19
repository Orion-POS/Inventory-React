export default function formatPrice(price: number): string {
  // Memisahkan bagian ribuan dan satuan
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Mengembalikan harga dengan format Rupiah
  return `Rp. ${formattedPrice}`;
}
