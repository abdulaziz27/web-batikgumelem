/**
 * Format angka ke format Rupiah
 * @param amount - jumlah dalam bentuk angka
 * @returns string - format Rupiah, contoh: "Rp 950.000"
 */
export function formatRupiah(amount: number): string {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return formatter.format(amount);
}
