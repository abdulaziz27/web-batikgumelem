<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    // Menampilkan daftar kupon
    public function index()
    {
        $coupons = Coupon::latest()->paginate(10);
        
        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons
        ]);
    }

    // Menampilkan form tambah kupon
    public function create()
    {
        return Inertia::render('Admin/Coupons/Create');
    }

    // Menyimpan kupon baru ke database
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'discount_percent' => 'required|numeric|min:1|max:100',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after:valid_from',
            'active' => 'boolean',
            'description' => 'nullable|string'
        ]);

        // Simpan data kupon
        Coupon::create($request->all());

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Kupon berhasil dibuat');
    }

    // Menampilkan form edit kupon
    public function edit(Coupon $coupon)
    {
        return Inertia::render('Admin/Coupons/Edit', [
            'coupon' => $coupon
        ]);
    }

    // Update data kupon
    public function update(Request $request, Coupon $coupon)
    {
        // Validasi input
        $request->validate([
            'code' => 'required|string|unique:coupons,code,' . $coupon->id,
            'discount_percent' => 'required|numeric|min:1|max:100',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after:valid_from',
            'active' => 'boolean',
            'description' => 'nullable|string'
        ]);

        // Update data kupon
        $coupon->update($request->all());

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Kupon berhasil diperbarui');
    }

    // Menghapus kupon
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Kupon berhasil dihapus');
    }
} 