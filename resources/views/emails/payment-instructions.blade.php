@extends('emails.layout')

@section('content')
<div class="content">
    <h1>Instruksi Pembayaran</h1>
    <p>Halo {{ $order->user ? $order->user->name : $order->guest_name }},</p>
    
    <p>Berikut adalah instruksi pembayaran untuk pesanan <strong>#{{ $order->id }}</strong>:</p>
    
    <div class="payment-details">
        <h2>Detail Pembayaran</h2>
        <div><span>Total Pembayaran:</span> <span>{{ format_rupiah($order->total_price) }}</span></div>
        <div><span>Metode Pembayaran:</span> <span>{{ $order->payment_method === 'bank_transfer' ? 'Transfer Bank' : 'E-Wallet' }}</span></div>
    </div>
    
    @if($order->payment_url)
    <div class="payment-actions">
        <p>Silakan klik tombol di bawah untuk melanjutkan pembayaran:</p>
        <a href="{{ $order->payment_url }}" class="button">Bayar Sekarang</a>
    </div>
    <p>Link pembayaran ini akan kedaluwarsa dalam 24 jam.</p>
    @else
    <div class="manual-instructions">
        <p>Harap selesaikan pembayaran Anda dalam 24 jam untuk menghindari pembatalan pesanan.</p>
    </div>
    @endif
    
    <div class="help">
        <p>Jika Anda memerlukan bantuan, jangan ragu untuk menghubungi layanan pelanggan kami di <a href="mailto:help@batikgumelem.com">help@batikgumelem.com</a>.</p>
    </div>
</div>
@endsection