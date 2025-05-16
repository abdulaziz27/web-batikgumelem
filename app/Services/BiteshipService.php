<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class BiteshipService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.biteship.key');
        $this->baseUrl = config('services.biteship.url');
    }

    public function getShippingCost($origin, $destination, $weight, $courier = null)
    {
        try {
            // Get cart data from session
            $cart = session('cart', ['items' => [], 'total' => 0]);
            
            // Prepare items for Biteship API
            $items = [];
            $totalValue = 0;
            
            foreach ($cart['items'] as $item) {
                $items[] = [
                    'name' => $item['name'],
                    'value' => $item['price'] * $item['quantity'],
                    'weight' => 0.5, // 500g per item
                    'quantity' => $item['quantity']
                ];
                $totalValue += $item['price'] * $item['quantity'];
            }

            $requestData = [
                'origin_postal_code' => (int)$origin,
                'destination_postal_code' => (int)$destination,
                'couriers' => $courier ? $courier : 'jne,sicepat,anteraja,pos',
                'items' => $items
            ];

            \Log::info('Biteship API Request', [
                'url' => $this->baseUrl . '/rates/couriers',
                'data' => $requestData
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/rates/couriers', $requestData);

            \Log::info('Biteship API Response', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'data' => $data['pricing'] ?? [],
                ];
            }

            \Log::error('Biteship API Error', [
                'status' => $response->status(),
                'response' => $response->json()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to get shipping rates: ' . ($response->json()['error'] ?? 'Unknown error'),
                'error' => $response->json(),
            ];
        } catch (\Exception $e) {
            \Log::error('Biteship Service Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Error calculating shipping: ' . $e->getMessage(),
            ];
        }
    }
}