import { describe, it, expect } from "vitest";
import { clusterItems } from "@/lib/topics/cluster";

describe("clusterItems", () => {
  it("alakasiz ogeleri ayri kumelere koyar", () => {
    const clusters = clusterItems([
      { id: "1", sourceId: "s1", title: "Nöbet ücreti ödenmedi", content: "Batman'da nöbet ücretleri üç aydır ödenmedi." },
      { id: "2", sourceId: "s2", title: "Yeni hastane açılışı", content: "Bölgede yeni bir devlet hastanesi hizmete girdi." },
    ]);
    expect(clusters).toHaveLength(2);
    expect(clusters[0]!.distinctSourceCount).toBe(1);
  });

  it("farkli kaynaklardan benzer ogeleri tek kumede toplar", () => {
    const clusters = clusterItems([
      { id: "1", sourceId: "resmi-gazete", title: "Nöbet ücreti yönetmeliği yayımlandı", content: "Sağlık çalışanlarının nöbet ücretlerine dair yeni yönetmelik Resmî Gazete'de yayımlandı." },
      { id: "2", sourceId: "hepsen", title: "Nöbet ücreti yönetmeliği HEP-SEN değerlendirmesi", content: "HEP-SEN, nöbet ücretlerine dair yeni yönetmeliği değerlendirdi ve Resmî Gazete'deki yayımı duyurdu." },
    ]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]!.distinctSourceCount).toBe(2);
    expect(clusters[0]!.items).toHaveLength(2);
  });

  it("bos girdide bos dizi doner", () => {
    expect(clusterItems([])).toEqual([]);
  });

  it("ayni kaynaktan tekrarlanan benzer icerik distinctSourceCount'u artirmaz", () => {
    const clusters = clusterItems([
      { id: "1", sourceId: "resmi-gazete", title: "Aynı konu", content: "Nöbet ücretleri hakkında birinci haber metni burada." },
      { id: "2", sourceId: "resmi-gazete", title: "Aynı konu tekrar", content: "Nöbet ücretleri hakkında birinci haber metni burada tekrar." },
    ]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]!.distinctSourceCount).toBe(1);
  });
});
