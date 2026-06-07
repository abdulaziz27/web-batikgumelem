#!/bin/bash

echo "🚀 Menghubungkan ke server hosting..."

ssh -p 65002 u770744195@153.92.10.49 << 'EOF'
  echo "📂 Masuk ke folder public_html..."
  cd ~/domains/e-commerce.karyalo.com/public_html || { echo "❌ Folder tidak ditemukan!"; exit 1; }

  echo "⬇️ Menarik kode terbaru dari repository..."
  git pull origin main

  echo "📦 Menginstal dependensi Composer..."
  composer install --no-dev --optimize-autoloader

  echo "🗄️ Menjalankan migrasi database..."
  php artisan migrate --force

  echo "🔗 Membuat symbolic link storage..."
  php artisan storage:link

  echo "🧹 Mengoptimasi cache Laravel..."
  php artisan optimize:clear
  php artisan config:cache
  php artisan event:cache
  php artisan route:cache
  php artisan view:cache

  echo "✅ Deployment selesai!"
EOF

echo "🎉 Selesai!"
