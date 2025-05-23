<!DOCTYPE html>
<html>
<head>
    <title>Laporan Penjualan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
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
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Penjualan</h1>
        <p>Periode: {{ \Carbon\Carbon::parse($start_date)->format('d F Y') }} - {{ \Carbon\Carbon::parse($end_date)->format('d F Y') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Jumlah Pesanan</th>
                <th>Total Penjualan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
            <tr>
                <td>
                    @if($type === 'daily')
                        {{ \Carbon\Carbon::parse($row->date)->format('d F Y') }}
                    @elseif($type === 'weekly')
                        Minggu ke-{{ $row->week }}
                    @else
                        {{ \Carbon\Carbon::createFromFormat('Y-m', $row->month)->format('F Y') }}
                    @endif
                </td>
                <td>{{ $row->total_orders }}</td>
                <td>Rp {{ number_format($row->total_sales, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2" class="total">Total Keseluruhan:</td>
                <td>Rp {{ number_format($data->sum('total_sales'), 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <p>Dicetak pada: {{ now()->format('d F Y H:i:s') }}</p>
    </div>
</body>
</html>
