@extends('emails.layout')

@section('content')
<div class="content">
    <h1>Status Pesanan Diperbarui</h1>
    <p>Halo {{ $order->user ? $order->user->name : $order->guest_name }},</p>
    
    <p>Status pesanan Anda <strong>#{{ $order->id }}</strong> telah diperbarui dari <strong>{{ ucfirst($oldStatus) }}</strong> menjadi <strong>{{ ucfirst($newStatus) }}</strong>.</p>
    
    @if($newStatus == 'processing')
    <p>Pesanan Anda sedang diproses dan akan segera dikirim.</p>
    @elseif($newStatus == 'shipped')
    <p>Pesanan Anda telah dikirim dan dalam perjalanan.</p>
    @elseif($newStatus == 'delivered')
    <p>Pesanan Anda telah diterima. Terima kasih telah berbelanja di Batik Gumelem!</p>
    @elseif($newStatus == 'cancelled')
    <p>Pesanan Anda telah dibatalkan. Jika pembayaran telah dilakukan, pengembalian dana akan diproses dalam 3-5 hari kerja.</p>
    @endif
    
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
        
        <div class="total">
            <span>Total:</span> <span>{{ format_rupiah($order->total_price) }}</span>
        </div>
    </div>
    
    <div class="actions">
        <a href="{{ route('orders.show', $order->id) }}" class="button">Lihat Detail Pesanan</a>
    </div>
</div>
@endsection