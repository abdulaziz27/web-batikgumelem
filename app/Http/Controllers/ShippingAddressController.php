<?php

namespace App\Http\Controllers;

use App\Models\ShippingAddress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ShippingAddressController extends Controller
{
    /**
     * Menampilkan semua alamat pengiriman milik user yang sedang login.
     */
    public function index()
    {
        $user = auth()->user();
        $addresses = ShippingAddress::where('user_id', $user->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Jika request ingin JSON, kembalikan data JSON
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'addresses' => $addresses
            ]);
        }

        // Jika tidak, tampilkan halaman alamat
        return inertia('User/Addresses', [
            'addresses' => $addresses
        ]);
    }

    /**
     * Mengambil alamat default user.
     */
    public function getDefault()
    {
        $user = auth()->user();
        $address = ShippingAddress::where('user_id', $user->id)
            ->where('is_default', true)
            ->first();

        if (!$address) {
            // Jika tidak ada default, ambil alamat terakhir
            $address = ShippingAddress::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->first();
        }

        return response()->json([
            'success' => true,
            'address' => $address
        ]);
    }

    /**
     * Menyimpan alamat pengiriman baru.
     */
    public function store(Request $request)
    {
        Log::info('ShippingAddressController@store dipanggil', [
            'user_id' => auth()->id(),
            'request' => $request->all(),
        ]);
        try {
            $request->validate([
                'full_name' => 'required|string|min:3|max:255',
                'address' => 'required|string|min:3|max:500',
                'city' => 'required|string|min:3|max:100',
                'province' => 'required|string|min:3|max:100',
                'postal_code' => 'required|string|regex:/^[0-9]{5}$/',
                'phone' => 'required|string|regex:/^[0-9]{10,15}$/',
                'is_default' => 'boolean',
            ], [
                'full_name.required' => 'Nama lengkap wajib diisi.',
                'full_name.min' => 'Nama lengkap minimal 3 karakter.',
                'address.required' => 'Alamat lengkap wajib diisi.',
                'address.min' => 'Alamat minimal 10 karakter.',
                'city.required' => 'Nama kota wajib diisi.',
                'city.min' => 'Nama kota minimal 3 karakter.',
                'province.required' => 'Nama provinsi wajib diisi.',
                'province.min' => 'Nama provinsi minimal 3 karakter.',
                'postal_code.required' => 'Kode pos wajib diisi.',
                'postal_code.regex' => 'Kode pos harus berupa 5 digit angka.',
                'phone.required' => 'Nomor telepon wajib diisi.',
                'phone.regex' => 'Nomor telepon harus berupa angka 10-15 digit.',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validasi gagal saat create alamat', [
                'errors' => $e->errors(),
                'user_id' => auth()->id(),
            ]);
            throw $e;
        }
        $user = auth()->user();
        // Jika alamat ini dijadikan default, reset default lain
        if ($request->is_default) {
            ShippingAddress::where('user_id', $user->id)
                ->update(['is_default' => false]);
        }
        $alamat = ShippingAddress::create([
            'user_id' => $user->id,
            'full_name' => $request->full_name,
            'address' => $request->address,
            'city' => $request->city,
            'province' => $request->province,
            'postal_code' => $request->postal_code,
            'phone' => $request->phone,
            'is_default' => $request->is_default ?? false,
        ]);
        Log::info('Alamat berhasil dibuat', [
            'alamat' => $alamat,
            'user_id' => $user->id,
        ]);
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Alamat berhasil ditambahkan',
            ]);
        }
        return redirect()->back()->with('success', 'Alamat berhasil ditambahkan');
    }

    /**
     * Mengupdate alamat pengiriman.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'full_name' => 'required|string|min:3|max:255',
            'address' => 'required|string|min:3|max:500',
            'city' => 'required|string|min:3|max:100',
            'province' => 'required|string|min:3|max:100',
            'postal_code' => 'required|string|regex:/^[0-9]{5}$/',
            'phone' => 'required|string|regex:/^[0-9]{10,15}$/',
            'is_default' => 'boolean',
        ], [
            'full_name.required' => 'Nama lengkap wajib diisi.',
            'full_name.min' => 'Nama lengkap minimal 3 karakter.',
            'address.required' => 'Alamat lengkap wajib diisi.',
            'address.min' => 'Alamat minimal 3 karakter.',
            'city.required' => 'Nama kota wajib diisi.',
            'city.min' => 'Nama kota minimal 3 karakter.',
            'province.required' => 'Nama provinsi wajib diisi.',
            'province.min' => 'Nama provinsi minimal 3 karakter.',
            'postal_code.required' => 'Kode pos wajib diisi.',
            'postal_code.regex' => 'Kode pos harus berupa 5 digit angka.',
            'phone.required' => 'Nomor telepon wajib diisi.',
            'phone.regex' => 'Nomor telepon harus berupa angka 10-15 digit.',
        ]);

        $user = auth()->user();
        $address = ShippingAddress::where('user_id', $user->id)
            ->findOrFail($id);

        // Jika dijadikan default, reset default lain
        if ($request->boolean('is_default')) {
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
            'is_default' => $request->boolean('is_default'),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Alamat berhasil diperbarui',
            ]);
        }

        return redirect()->route('addresses.index')->with('success', 'Alamat berhasil diperbarui');
    }

    /**
     * Menghapus alamat pengiriman.
     */
    public function destroy($id)
    {
        $user = auth()->user();
        $address = ShippingAddress::where('user_id', $user->id)
            ->findOrFail($id);

        $address->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Alamat berhasil dihapus',
            ]);
        }

        return redirect()->back()->with('success', 'Alamat berhasil dihapus');
    }

    /**
     * Menjadikan alamat tertentu sebagai default.
     */
    public function setDefault($id)
    {
        $user = auth()->user();
        $address = ShippingAddress::where('user_id', $user->id)
            ->findOrFail($id);

        // Reset semua alamat ke non-default
        ShippingAddress::where('user_id', $user->id)
            ->update(['is_default' => false]);

        // Set alamat terpilih sebagai default
        $address->update(['is_default' => true]);

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Alamat utama berhasil diubah',
            ]);
        }

        return redirect()->route('addresses.index')->with('success', 'Alamat utama berhasil diubah');
    }
}
