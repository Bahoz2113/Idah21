import { describe, it, expect } from "vitest";
import { parseOfficialSitePage } from "@/lib/sources/official-site";

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>HEP-SEN Duyurular</title>
  <style>.x { color: red; }</style>
  <script>console.log("takip");</script>
</head>
<body>
  <nav>Menü</nav>
  <h1>Duyuru Başlığı</h1>
  <p>Nöbet ücretleri hakkında &amp; önemli bir duyuru metni.</p>
  <!-- yorum satırı -->
</body>
</html>`;

describe("parseOfficialSitePage", () => {
  it("script/style/yorum icermeyen duz metin uretir", () => {
    const item = parseOfficialSitePage(SAMPLE_HTML, "HEP-SEN", "https://www.hepsen.org.tr/duyurular");
    expect(item).not.toBeNull();
    expect(item!.content).not.toContain("console.log");
    expect(item!.content).not.toContain("color: red");
    expect(item!.content).not.toContain("yorum satırı");
    expect(item!.content).toContain("Nöbet ücretleri hakkında & önemli bir duyuru metni.");
  });

  it("title tag'inden basligi cikarir", () => {
    const item = parseOfficialSitePage(SAMPLE_HTML, "HEP-SEN", "https://www.hepsen.org.tr/duyurular");
    expect(item!.title).toBe("HEP-SEN Duyurular");
  });

  it("url'yi externalId ve url olarak kullanir", () => {
    const item = parseOfficialSitePage(SAMPLE_HTML, "HEP-SEN", "https://www.hepsen.org.tr/duyurular");
    expect(item!.externalId).toBe("https://www.hepsen.org.tr/duyurular");
    expect(item!.url).toBe("https://www.hepsen.org.tr/duyurular");
  });

  it("bos/anlamsiz HTML'de null doner", () => {
    expect(parseOfficialSitePage("<html><body></body></html>", "kaynak", "https://x")).toBeNull();
  });

  it("cok uzun sayfayi kirpar", () => {
    const longHtml = `<html><head><title>Uzun Sayfa</title></head><body>${"a ".repeat(10000)}</body></html>`;
    const item = parseOfficialSitePage(longHtml, "kaynak", "https://x");
    expect(item!.content.length).toBeLessThanOrEqual(8000);
  });
});
