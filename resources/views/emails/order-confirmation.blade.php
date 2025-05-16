@extends('emails.layout')

@section('content')
<div class="content">
    <h1>Pesanan Anda Telah Diterima</h1>
    <p>Halo {{ $order->user ? $order->user->name : $order->guest_name }},</p>
    
    <p>Terima kasih telah berbelanja di Batik Gumelem. Pesanan Anda dengan nomor <strong>#{{ $order->id }}</strong> telah berhasil dibuat.</p>
    
    <div class="order-summary">
        <h2>Ringkasan Pesanan</h2>
        <table>
            <tr>
                <th>Produk</th>
                <th>Jumlah</th>
                <th>Harga</th>
            </tr>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ format_rupiah($item->price) }}</td>
            </tr>
            @endforeach
        </table>
        
        <div class="order-totals">
            <div><span>Subtotal:</span> <span>{{ format_rupiah($order->total_price - $order->shipping_cost + $order->discount) }}</span></div>
            <div><span>Biaya Pengiriman:</span> <span>{{ format_rupiah($order->shipping_cost) }}</span></div>
            @if($order->discount > 0)
            <div><span>Diskon:</span> <span>-{{ format_rupiah($order->discount) }}</span></div>
            @endif
            <div class="total"><span>Total:</span> <span>{{ format_rupiah($order->total_price) }}</span></div>
        </div>
    </div>
    
    <div class="shipping-info">
        <h2>Informasi Pengiriman</h2>
        <p>
            {{ $order->shippingAddress->name }}<br>
            {{ $order->shippingAddress->address }}<br>
            {{ $order->shippingAddress->city }}, {{ $order->shippingAddress->postal_code }}<br>
            {{ $order->shippingAddress->phone }}
        </p>
        <p>Metode pengiriman: {{ $order->shipping_method['courier_name'] }} - {{ $order->shipping_method['courier_service_name'] }}</p>
    </div>
    
    <div class="actions">
        <a href="{{ route('orders.show', $order->id) }}" class="button">Lihat Detail Pesanan</a>
    </div>
</div>
@endsection