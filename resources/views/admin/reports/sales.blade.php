<!DOCTYPE html>
<html>
<head>
    <title>Laporan Penjualan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #333;
            font-size: 18px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 10px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
        }
        .total {
            font-weight: bold;
            text-align: right;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 10px;
        }
        .status {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
        }
        .status-completed {
            background-color: #dcfce7;
            color: #166534;
        }
        .status-processing {
            background-color: #fff7ed;
            color: #9a3412;
        }
        .status-pending {
            background-color: #fef9c3;
            color: #854d0e;
        }
        .summary-box {
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 20px;
            background-color: #f8f9fa;
        }
        .summary-item {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Penjualan</h1>
        <p>Periode: {{ \Carbon\Carbon::parse($start_date)->format('d F Y') }} - {{ \Carbon\Carbon::parse($end_date)->format('d F Y') }}</p>
    </div>

    @foreach($data as $group)
        <div class="summary-box">
            <div class="summary-item">
                <strong>Periode:</strong>
                @if($type === 'daily')
                    {{ \Carbon\Carbon::parse($group['date'])->format('d F Y') }}
                @elseif($type === 'weekly')
                    Minggu ke-{{ $group['week'] }}
                @else
                    {{ \Carbon\Carbon::createFromFormat('Y-m', $group['month'])->format('F Y') }}
                @endif
            </div>
            <div class="summary-item">
                <strong>Total Pesanan:</strong> {{ $group['total_orders'] }}
            </div>
            <div class="summary-item">
                <strong>Total Penjualan:</strong> Rp {{ number_format($group['total_sales'], 0, ',', '.') }}
            </div>
            <div class="summary-item">
                <strong>Total Penjualan (Selesai):</strong> Rp {{ number_format($group['completed_sales'], 0, ',', '.') }}
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>No. Order</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($group['orders'] as $order)
                    <tr>
                        <td>{{ $order['order_number'] }}</td>
                        <td>{{ $order['created_at'] }}</td>
                        <td>
                            <span class="status status-{{ $order['status'] }}">
                                @switch($order['status'])
                                    @case('completed')
                                        Selesai
                                        @break
                                    @case('processing')
                                        Diproses
                                        @break
                                    @case('pending')
                                        Menunggu
                                        @break
                                    @default
                                        {{ ucfirst($order['status']) }}
                                @endswitch
                            </span>
                        </td>
                        <td>Rp {{ number_format($order['total_amount'], 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endforeach

    <div class="footer">
        <p>Dicetak pada: {{ now()->format('d F Y H:i:s') }}</p>
    </div>
</body>
</html>
