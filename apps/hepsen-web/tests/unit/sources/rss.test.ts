import { describe, it, expect } from "vitest";
import { parseRssFeed } from "@/lib/sources/rss";

const SAMPLE_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Resmi Gazete</title>
    <item>
      <title>Sağlık Bakanlığından Yönetmelik</title>
      <link>https://www.resmigazete.gov.tr/eskiler/2026/07/20260726-1.htm</link>
      <description>&lt;p&gt;Sağlık personeli nöbet ücretlerine ilişkin yönetmelik yayımlandı.&lt;/p&gt;</description>
      <pubDate>Sun, 26 Jul 2026 06:00:00 +0300</pubDate>
    </item>
    <item>
      <title>İçeriksiz öğe</title>
      <link>https://www.resmigazete.gov.tr/eskiler/2026/07/bos.htm</link>
      <description></description>
      <pubDate>Sun, 26 Jul 2026 05:00:00 +0300</pubDate>
    </item>
  </channel>
</rss>`;

const SAMPLE_ATOM = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Atom Duyuru</title>
    <link href="https://example.org/duyuru-1" />
    <summary>Kısa özet metni.</summary>
    <updated>2026-07-26T06:00:00Z</updated>
    <author><name>HEP-SEN</name></author>
  </entry>
</feed>`;

describe("parseRssFeed", () => {
  it("RSS 2.0 item'larını NormalizedItem'a çevirir", () => {
    const items = parseRssFeed(SAMPLE_RSS, "Resmi Gazete");
    expect(items).toHaveLength(1); // içeriksiz öğe elenir
    expect(items[0]).toMatchObject({
      title: "Sağlık Bakanlığından Yönetmelik",
      url: "https://www.resmigazete.gov.tr/eskiler/2026/07/20260726-1.htm",
      externalId: "https://www.resmigazete.gov.tr/eskiler/2026/07/20260726-1.htm",
      platform: "Resmi Gazete",
    });
    expect(items[0]!.content).toContain("nöbet ücretlerine ilişkin yönetmelik");
    expect(items[0]!.content).not.toContain("<p>");
    expect(items[0]!.publishedAt).toBe(new Date("Sun, 26 Jul 2026 06:00:00 +0300").toISOString());
  });

  it("link veya icerik olmayan ogeleri eler", () => {
    const items = parseRssFeed(SAMPLE_RSS, "Resmi Gazete");
    expect(items.find((i) => i.title === "İçeriksiz öğe")).toBeUndefined();
  });

  it("Atom feed'lerini de destekler", () => {
    const items = parseRssFeed(SAMPLE_ATOM, "Test Atom");
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      title: "Atom Duyuru",
      url: "https://example.org/duyuru-1",
      content: "Kısa özet metni.",
      author: "HEP-SEN",
    });
  });

  it("gecersiz XML'de bos dizi doner, hata firlatmaz", () => {
    expect(parseRssFeed("bu xml degil", "kaynak")).toEqual([]);
  });

  it("bos feed'de bos dizi doner", () => {
    expect(parseRssFeed(`<rss version="2.0"><channel></channel></rss>`, "kaynak")).toEqual([]);
  });
});
