# CEZERİ Education OS — Windows Kurulum Scripti
# PowerShell'de çalıştır: .\setup.ps1

Write-Host "`n🚀 CEZERİ Education OS kurulum başlıyor...`n" -ForegroundColor Cyan

# 1. Paketleri yükle
Write-Host "📦 Paketler yükleniyor..." -ForegroundColor Yellow
pnpm install

# 2. Prisma client oluştur
Write-Host "`n🔧 Prisma client oluşturuluyor..." -ForegroundColor Yellow
pnpm db:generate

# 3. Demo kullanıcıları oluştur
Write-Host "`n👥 Demo kullanıcılar oluşturuluyor..." -ForegroundColor Yellow
pnpm db:demo

# 4. Başlat
Write-Host "`n✅ Kurulum tamamlandı! Uygulama başlatılıyor...`n" -ForegroundColor Green
Write-Host "Demo giriş bilgileri (şifre: Cezeri2026!):" -ForegroundColor Cyan
Write-Host "  +905000000001 → Admin" -ForegroundColor White
Write-Host "  +905000000002 → Öğretmen" -ForegroundColor White
Write-Host "  +905000000003 → Veli" -ForegroundColor White
Write-Host "  +905000000004 → Öğrenci`n" -ForegroundColor White
pnpm dev
