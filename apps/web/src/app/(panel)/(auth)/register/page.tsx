"use client";
import Link from "next/link";

// NOT: Telefon/SMS tabanlı kendi kendine kayıt akışı kaldırıldı
// (spec: "Telefon doğrulama olmayacak. SMS doğrulama olmayacak.").
// Yeni kullanıcılar yalnızca admin tarafından ön kayıt edilir, ardından
// kendileri /ilk-kurulum sayfasından e-posta+şifre ile kurulumu tamamlar.
export default function RegisterPage(): JSX.Element {
  return (
    <main className="min-h-screen flex items-center justify-center bg-lacivert p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden text-center">
        <div className="bg-lacivert px-6 py-5">
          <div className="text-2xl font-bold text-white">CEZERİ <span className="text-turkuaz">OS</span></div>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Yeni hesaplar yalnızca yöneticiniz tarafından oluşturulur.
            Hesabınız oluşturulduysa aşağıdan ilk kurulumunuzu tamamlayabilirsiniz.
          </p>
          <Link href="/ilk-kurulum" className="block w-full bg-mavi text-white py-3 rounded-lg font-semibold">
            İlk Kuruluma Git →
          </Link>
          <Link href="/login" className="block text-sm text-gray-400">← Giriş sayfasına dön</Link>
        </div>
      </div>
    </main>
  );
}
