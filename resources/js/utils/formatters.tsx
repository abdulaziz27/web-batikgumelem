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

/**
 * Format tanggal ke format Indonesia
 * @param date - tanggal dalam bentuk string atau Date
 * @returns string - format tanggal Indonesia, contoh: "24 Maret 2024"
 */
export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
