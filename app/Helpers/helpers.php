<?php

if (!function_exists('format_rupiah')) {
    /**
     * Format angka ke format Rupiah
     *
     * @param float $amount Jumlah uang yang akan diformat
     * @return string Hasil format dalam bentuk string, misal: Rp 10.000
     */
    function format_rupiah($amount)
    {
        // Mengubah angka menjadi format mata uang Rupiah dengan pemisah ribuan titik
        return 'Rp ' . number_format($amount, 0, ',', '.');
    }
}