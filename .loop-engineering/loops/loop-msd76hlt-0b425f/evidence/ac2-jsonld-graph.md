# AC2 — JSON-LD @graph geçerliliği
status: pass
verified_at: 2026-08-03T18:34:35Z
method: file_check (ön-render edilmiş HTML'den ayrıştırma)

## Ham kanıt
```
@context: https://schema.org
node sayısı: 27
  EducationalOrganization+LocalBusiness: 1
  Place: 1
  Course: 10
  FAQPage: 1
  VideoObject: 6
  ImageObject: 5
  WebSite: 1
  WebPage: 1
  BreadcrumbList: 1
geo: 37.91029, 41.13921
telephone: +905406627272
sameAs: ["https://www.instagram.com/cezerirobotech/"]
VideoObject örneği: Saha fırlatma testi | PT11S | thumbnail: var
ImageObject örneği: Eğitmen kadrosu | 1200x1200
```

`VideoObject`/`ImageObject` düğümlerinde `uploadDate` KASITLI olarak yok:
çekim tarihleri elimizde değil ve uydurulmuş tarih structured data'yı
doğrulanamaz hâle getirirdi.
