# Batik Gumelem - E-Commerce Platform

<div align="center">
  <img src="public/assets/logo.png" alt="Batik Gumelem Logo" width="200" />
  <br />
  <p>Melestarikan warisan budaya batik tradisional Gumelem dari Banjarnegara</p>
</div>

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [File Structure](#-file-structure)
- [Application Routes](#-application-routes)
- [Contributors](#-contributors)
- [License](#-license)

## 🌟 About

Batik Gumelem E-Commerce adalah platform online untuk menjual produk batik tradisional dari Desa Gumelem, Banjarnegara, Jawa Tengah. Aplikasi ini menawarkan berbagai produk batik berkualitas tinggi dengan motif khas Gumelem, sekaligus memberikan pengetahuan tentang sejarah dan filosofi di balik setiap motif.

Batik Gumelem adalah warisan budaya Indonesia yang telah ada sejak zaman Kerajaan Mataram. Keunikannya terletak pada motif-motif yang terinspirasi dari lingkungan alam sekitar dan filosofi kehidupan masyarakat setempat. Platform ini dibangun untuk mendukung pengrajin lokal dan melestarikan warisan budaya batik Indonesia.

## 🚀 Features

### 🛒 For Customers

- **Browsing Produk**: Menjelajahi berbagai produk batik Gumelem dengan berbagai motif dan ukuran
- **Filter dan Pencarian**: Mencari produk berdasarkan kategori, harga, dan fitur lainnya
- **Keranjang Belanja**: Menambahkan produk ke keranjang dan mengelola item sebelum checkout
- **Checkout**: Proses pembayaran yang mudah dan aman menggunakan Midtrans
- **Manajemen Akun**: Pendaftaran, login, dan pengelolaan profil pengguna
- **Riwayat Pesanan**: Melihat status dan riwayat pesanan sebelumnya
- **Blog**: Membaca artikel tentang batik Gumelem, proses pembuatan, dan filosofinya
- **AI Chat Assistant**: Fitur chatbot pintar untuk membantu pelanggan dengan pertanyaan mereka

### 👨‍💼 For Admin

- **Dashboard Admin**: Panel admin untuk mengelola seluruh aspek toko
- **Manajemen Produk**: Menambah, mengedit, dan menghapus produk
- **Manajemen Pesanan**: Memproses dan melacak pesanan pelanggan
- **Manajemen Blog**: Menulis dan mempublikasikan artikel blog
- **Manajemen Pengguna**: Mengelola akun pengguna dan kontrol akses

## 💻 Tech Stack

### Frontend
- **React** - Library JavaScript untuk membangun antarmuka pengguna
- **TypeScript** - Bahasa pemrograman tipisan untuk JavaScript
- **Tailwind CSS** - Framework CSS utility-first
- **Inertia.js** - Library untuk membuat aplikasi SPA tanpa API
- **Framer Motion** - Library animasi untuk React
- **React Hook Form** - Library untuk validasi dan penanganan form

### Backend
- **Laravel** - Framework PHP untuk aplikasi web
- **MySQL** - Sistem manajemen database relasional
- **Spatie Laravel Permission** - Manajemen peran dan izin
- **Midtrans** - Gateway pembayaran online Indonesia
- **Google Gemini AI** - Model AI untuk fitur chatbot

### Tools & Infrastructure
- **Vite** - Build tool frontend
- **TypeScript** - Static type checking
- **ESLint & Prettier** - Code linting dan formatting

## 🛠️ Installation

### Prerequisites

- PHP 8.2+
- Node.js 18+
- Composer
- MySQL 8.0+

### Setup

1. Clone repository
```bash
git clone https://github.com/username/web-batikgumelem.git
cd web-batikgumelem
```

2. Install PHP dependencies
```bash
composer install
```

3. Install JavaScript dependencies
```bash
npm install
```

4. Copy file .env.example menjadi .env
```bash
cp .env.example .env
```

5. Generate application key
```bash
php artisan key:generate
```

6. Setup database di file .env
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=batikgumelem
DB_USERNAME=root
DB_PASSWORD=
```

7. Jalankan migrasi dan seeder database
```bash
php artisan migrate --seed
```

8. Build assets
```bash
npm run build
```

9. Jalankan aplikasi
```bash
php artisan serve
```

10. Akses aplikasi melalui browser di http://localhost:8000

## 🔐 Environment Variables

Beberapa konfigurasi penting yang harus diatur di file `.env`:

```
APP_NAME="Batik Gumelem"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=batikgumelem
DB_USERNAME=root
DB_PASSWORD=

MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_PAYMENT_CALLBACK_URL=https://your-domain/checkout/notification

GEMINI_API_KEY=your-gemini-api-key
```

## ⚡ Development

### Development server

```bash
# Mode development dengan hot-reload
npm run dev

# Mode development ssr
npm run dev:ssr

# Atau menggunakan script Composer (server, queue, logs, vite)
composer dev
```

### Build untuk production

```bash
# Build assets
npm run build

# Build dengan SSR
npm run build:ssr
```

### Testing

```bash
# Jalankan tests
composer test

# Atau langsung dengan PHPUnit
php artisan test
```

### Linting & Formatting

```bash
# Check linting
npm run lint

# Format code
npm run format
```

## 📁 File Structure

```
web-batikgumelem/
├── app/                    # PHP application code
│   ├── Console/            # Console commands
│   ├── Events/             # Event classes
│   ├── Exceptions/         # Exception handlers
│   ├── Helpers/            # Helper functions
│   ├── Http/               # HTTP layer (controllers, middlewares)
│   ├── Listeners/          # Event listeners
│   ├── Mail/               # Mail classes
│   ├── Models/             # Eloquent models
│   ├── Observers/          # Model observers
│   ├── Providers/          # Service providers
│   └── Services/           # Business logic services
├── bootstrap/              # Laravel bootstrap files
├── config/                 # Configuration files
├── database/               # Database migrations, factories, seeders
├── public/                 # Public assets
├── resources/              # Frontend code and views
│   ├── css/                # CSS files
│   ├── js/                 # TypeScript / React code
│   │   ├── components/     # React components
│   │   ├── hooks/          # React custom hooks
│   │   ├── layouts/        # Layout components
│   │   ├── lib/            # Library code
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── views/              # Laravel blade views
├── routes/                 # Route definitions
├── storage/                # Application storage
├── tests/                  # Test files
└── vendor/                 # Composer dependencies
```

## 📚 Application Routes

### Inertia Page Routes
Rute-rute berikut merender halaman menggunakan Inertia.js:

#### Authentication
- `GET /login` - Halaman login user
- `GET /register` - Halaman registrasi user baru
- `POST /login` - Proses login user
- `POST /register` - Proses registrasi user baru
- `POST /logout` - Proses logout user

#### Products
- `GET /products` - Halaman daftar produk
- `GET /products/{slug}` - Halaman detail produk

#### Cart
- `GET /cart` - Halaman keranjang belanja
- `POST /cart` - Proses menambahkan item ke keranjang
- `PUT /cart` - Proses memperbarui item di keranjang
- `DELETE /cart` - Proses menghapus item dari keranjang

#### Checkout
- `GET /checkout` - Halaman checkout
- `POST /checkout` - Proses checkout
- `GET /checkout/payment` - Halaman pembayaran
- `GET /checkout/success` - Halaman sukses checkout
- `GET /checkout/cancel` - Halaman pembatalan checkout

#### Blog
- `GET /blog` - Halaman daftar artikel blog
- `GET /blog/{slug}` - Halaman detail artikel blog

#### Admin Area
- `GET /admin/dashboard` - Halaman dashboard admin
- `GET /admin/products` - Halaman manajemen produk
- `GET /admin/orders` - Halaman manajemen pesanan
- `GET /admin/blogs` - Halaman manajemen blog

### API Endpoints
Endpoint-endpoint berikut mengembalikan data dalam format JSON:

#### AI Chat
- `POST /api/ai-chat` - Endpoint untuk chat dengan AI assistant

#### AJAX Endpoints
- `POST /checkout/shipping` - Menghitung biaya pengiriman secara real-time
- `POST /checkout/coupon` - Menerapkan dan validasi kupon diskon
- `DELETE /checkout/coupon` - Menghapus kupon diskon
- `GET /checkout/check-status/{order_id}` - Memeriksa status pembayaran
- `GET /addresses/default` - Mendapatkan alamat default pengguna

## 👥 Contributors

- [Abdul Aziz](https://github.com/abdulaziz27) - Website Developer

## 📄 License

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ for preserving Indonesian Batik culture
</p> 