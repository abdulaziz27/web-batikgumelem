<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Batik Gumelem</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #8B4513;
            padding: 20px;
            color: white;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #ddd;
        }
        h1 {
            color: #8B4513;
            margin-bottom: 20px;
        }
        h2 {
            color: #8B4513;
            font-size: 18px;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table th, table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }
        table th {
            background-color: #f8f9fa;
        }
        .order-totals {
            margin-top: 20px;
        }
        .order-totals div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .total {
            font-weight: bold;
            margin-top: 10px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .button {
            display: inline-block;
            background-color: #8B4513;
            color: white;
            padding: 10px 20px;
            margin: 20px 0;
            text-decoration: none;
            border-radius: 4px;
        }
        .actions {
            text-align: center;
            margin: 25px 0;
        }
        .shipping-info, .payment-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Batik Gumelem</h1>
        </div>
        
        @yield('content')
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} Batik Gumelem. All rights reserved.</p>
            <p>Jl. Gumelem No. 123, Banjarnegara, Jawa Tengah</p>
        </div>
    </div>
</body>
</html> 