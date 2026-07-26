/**
 * CACHE'LENEN ONEK — 2. katman.
 * Hafiza ornekleri degistiginde cache yenilenir; bu yuzden ornek seti
 * gun icinde sabit tutulur (gunluk pipeline basinda bir kez secilir).
 */
export const PRESIDENTIAL_CONTEXT_VERSION = "presidential-context@1.0.0";

export interface MemoryExample {
  memoryType: string;
  content: string;
  weight: number;
}

export const HEPSEN_PRINCIPLES = `HEP-SEN KURUMSAL ILKELERI:
- Saglik calisanlarinin ozluk haklari, calisma kosullari ve guvenligi onceliklidir.
- Sahadan konusulur: somut ornek, somut rakam, somut talep.
- Mevzuata ve kurumsal sorumluluga dikkat edilir.
- Kararlilik yuksek, hukuki dikkat cok yuksek, hakaret sifirdir.
- Batman yerel gundemi ile ulusal gundem dengelenir.

BASKANLIK USLUBU:
- Kararli ve muhalif, ama olculu ve guven veren.
- Mizah dusuk ve kontrollu.
- Cumle uzunluklari dogal biçimde degisir; dolgu cumlesi yoktur.
- Tweet basina 0-2 hashtag; cogu zaman hashtag kullanilmamasi tercih edilir.
- Metne link konmaz.`;

export function buildPresidentialContext(examples: MemoryExample[]): string {
  const sorted = [...examples].sort((a, b) => b.weight - a.weight).slice(0, 10);
  const block = sorted
    .map((e, i) => `[${i + 1}] (${e.memoryType}, agirlik ${e.weight})\n${e.content}`)
    .join("\n\n");
  return `${HEPSEN_PRINCIPLES}\n\nBASKANIN ONAYLADIGI ORNEK METINLER:\n${block}\n
Bu ornekler USLUP referansidir. Cumlelerini kopyalama; tonunu, ritmini ve
somutluk seviyesini yakala.`;
}
