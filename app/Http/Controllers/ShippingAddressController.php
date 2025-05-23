<?php

namespace App\Http\Controllers;

use App\Models\ShippingAddress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShippingAddressController extends Controller
{
    /**
     * Get all shipping addresses for the authenticated user
     */
    public function index()
    {
        $user = auth()->user();
        $addresses = ShippingAddress::where('user_id', $user->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Check if the request wants JSON
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'addresses' => $addresses
            ]);
        }

        // Otherwise return the Inertia view
        return inertia('User/Addresses', [
            'addresses' => $addresses
        ]);
    }

    /**
     * Get the default shipping address for the authenticated user
     */
    public function getDefault()
    {
        $user = auth()->user();
        $address = ShippingAddress::where('user_id', $user->id)
            ->where('is_default', true)
            ->first();

        if (!$address) {
            // If no default, get the most recently created address
            $address = ShippingAddress::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->first();
        }

        return response()->json([
            'success' => true,
            'address' => $address
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        $user = auth()->user();

        if ($request->is_default) {
            ShippingAddress::where('user_id', $user->id)
                ->update(['is_default' => false]);
        }

        ShippingAddress::create([
            'user_id' => $user->id,
            'full_name' => $request->full_name,
            'address' => $request->address,
            'city' => $request->city,
            'province' => $request->province,
            'postal_code' => $request->postal_code,
            'phone' => $request->phone,
            'is_default' => $request->is_default ?? false,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Address added successfully',
            ]);
        }

        return redirect()->back()->with('success', 'Address added successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        $user = auth()->user();
        $address = ShippingAddress::where('user_id', $user->id)
            ->findOrFail($id);

        if ($request->is_default) {
            ShippingAddress::where('user_id', $user->id)
                ->where('id', '!=', $id)
                ->update(['is_default' => false]);
        }

        $address->update([
            'full_name' => $request->full_name,
            'address' => $request->address,
            'city' => $request->city,
            'province' => $request->province,
            'postal_code' => $request->postal_code,
            'phone' => $request->phone,
            'is_default' => $request->is_default ?? false,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Address updated successfully',
            ]);
        }

        return redirect()->back()->with('success', 'Address updated successfully');
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $address = ShippingAddress::where('user_id', $user->id)
            ->findOrFail($id);

        $address->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Address deleted successfully',
            ]);
        }

        return redirect()->back()->with('success', 'Address deleted successfully');
    }

    /**
     * Set an address as the default address
     */
    public function setDefault($id)
    {
        $user = auth()->user();
        
        // Reset all default addresses
        ShippingAddress::where('user_id', $user->id)
            ->update(['is_default' => false]);
        
        // Set the selected address as default
        $address = ShippingAddress::where('user_id', $user->id)
            ->findOrFail($id);
        
        $address->update(['is_default' => true]);
        
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Address set as default successfully',
            ]);
        }
        
        return redirect()->back()->with('success', 'Address set as default successfully');
    }
}
