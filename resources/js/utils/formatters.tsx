/**
 * Format angka ke format Rupiah
 * @param amount - jumlah dalam bentuk angka
 * @returns string - format Rupiah, contoh: "Rp 950.000"
 */
export function formatRupiah(amount: number, locale: 'id' | 'en' = 'id'): string {
    const numberLocale = locale === 'en' ? 'en-US' : 'id-ID';
    const formatter = new Intl.NumberFormat(numberLocale, {
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
export function formatDate(date: string | Date, locale: 'id' | 'en' = 'id'): string {
    const dateLocale = locale === 'en' ? 'en-US' : 'id-ID';
    return new Date(date).toLocaleDateString(dateLocale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
