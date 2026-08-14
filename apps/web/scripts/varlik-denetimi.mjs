#!/usr/bin/env node
/**
 * VARLIK DENETİMİ — kaynak kodda geçen her `/assets/...` yolunun `public/`
 * altında gerçekten bir dosyaya karşılık geldiğini doğrular.
 *
 * NEDEN GEREKLİ. Görsel yolları sıradan metin dizeleridir; TypeScript de
 * `next build` de bunları doğrulamaz. Yanlış yazılmış tek bir dosya adı
 * sessizce derlenir, üretime çıkar ve ancak tarayıcıda görülür:
 * `/_next/image` isteği 400 döner, kartın yerinde boşluk kalır.
 *
 * Ölçüldü: basın bölümünün ilk kartı `ziyaret-vekil-vitrin-01.webp` diyordu,
 * dosyanın gerçek adı ise `ziyaret-nasiroglu-vitrin-01.webp` idi. Derleme
 * sorunsuz geçti; kırıklık yalnızca mobil konsolunda bir 400 satırıydı.
 *
 * Bu yüzden denetim `build` betiğinin ÖNÜNE bağlandı: eksik varlık artık
 * derlemeyi durdurur.
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..");
const KAYNAK = join(KOK, "src");
const KAMUSAL = join(KOK, "public");

/** `"/assets/..."` biçiminde yazılmış her yol. Tırnak içi olması şart:
 *  dize birleştirmeyle kurulan yollar zaten statik olarak denetlenemez. */
const DESEN = /"(\/assets\/[^"]+)"/g;

function* dosyalar(dizin) {
  for (const giris of readdirSync(dizin, { withFileTypes: true })) {
    const yol = join(dizin, giris.name);
    if (giris.isDirectory()) yield* dosyalar(yol);
    else if (/\.tsx?$/.test(giris.name)) yield yol;
  }
}

const eksik = [];
let toplam = 0;
const gorulen = new Set();

for (const dosya of dosyalar(KAYNAK)) {
  const metin = readFileSync(dosya, "utf8");
  for (const [, yol] of metin.matchAll(DESEN)) {
    toplam += 1;
    if (gorulen.has(yol)) continue;
    gorulen.add(yol);
    const hedef = join(KAMUSAL, yol);
    if (!existsSync(hedef) || !statSync(hedef).isFile()) {
      eksik.push({ yol, dosya: dosya.slice(KOK.length + 1) });
    }
  }
}

if (eksik.length > 0) {
  console.error(`\nVARLIK DENETİMİ BAŞARISIZ — ${eksik.length} eksik dosya:\n`);
  for (const { yol, dosya } of eksik) console.error(`  ${yol}\n    ↳ ${dosya}`);
  console.error("");
  process.exit(1);
}

console.log(
  `varlık denetimi: ${gorulen.size} benzersiz yol (${toplam} referans) — hepsi mevcut`,
);
