status: pass

# AC1 — 8 CEZERI skill dosyası üretildi ve güncel Claude Code SKILL.md formatına uygun

## Doğrulama yöntemi
1. Dosya varlığı + SHA-256
2. Gerçek YAML parser (PyYAML) ile frontmatter parse
3. **Canlı discovery kanıtı**: Claude Code'un kendi skill listesi

## 1. Üretilen dosyalar (SHA-256)

```
fbf36c1d668ee2d5397adcbe4cc345c419cc7e95f36101a2712469cadf87c9c0  skills/cezeri-article-reader/SKILL.md
358f3d30b0832a5ad5c08b767f3873e42984bdfec7b2855808252bc35a6e5426  skills/cezeri-browser-agent/SKILL.md
945172d4483690e51d5e1ca90c71bedd7dc0a83aa717324b7cf6c13c477eea01  skills/cezeri-deep-research/SKILL.md
a32f3fd99445facb3a3217a65ca5ec21ea1bf7d88b690dd9197fb71a37cab8de  skills/cezeri-documentation-reader/SKILL.md
3ba7d8b332438e4ea802546e1e343028a058d73173b2548dd4624229875f5ef5  skills/cezeri-orchestrator/SKILL.md
bfc3b3aec261151b36680e7ef2b63ba991a40c7049588271c831b53a41b6b42a  skills/cezeri-source-verifier/SKILL.md
cf2c1f727a7cadb08e86fb3efcd246516f15d5a806ad2f4baa67cf5cba39e413  skills/cezeri-web-extractor/SKILL.md
093f9a4315239bc75b936e7306c0801e0bf03b79ba4d1e636717486cc4ac89a2  skills/cezeri-web-research/SKILL.md
```

8/8 dosya mevcut.

## 2. YAML frontmatter geçerliliği (kurulu hâl, PyYAML ile)

```
Kurulu CEZERI skill sayisi: 8

cezeri-article-reader            OK   desc=338 krk  alanlar=['name', 'description', 'when_to_use', 'allowed-tools']
cezeri-browser-agent             OK   desc=382 krk  alanlar=['name', 'description', 'when_to_use', 'allowed-tools']
cezeri-deep-research             OK   desc=335 krk  alanlar=['name', 'description', 'when_to_use', 'allowed-tools']
cezeri-documentation-reader      OK   desc=281 krk  alanlar=['name', 'description', 'when_to_use', 'allowed-tools']
cezeri-orchestrator              OK   desc=426 krk  alanlar=['name', 'description', 'when_to_use', 'allowed-tools']
cezeri-source-verifier           OK   desc=307 krk  alanlar=['name', 'description', 'when_to_use', 'allowed-tools']
cezeri-web-extractor             OK   desc=300 krk  alanlar=['name', 'description', 'when_to_use', 'allowed-tools']
cezeri-web-research              OK   desc=279 krk  alanlar=['name', 'description', 'when_to_use', 'allowed-tools']

SONUC: TUM SKILL FRONTMATTER'LARI GECERLI
```

Kullanılan alanlar (`name`, `description`, `when_to_use`, `allowed-tools`) güncel Claude Code
frontmatter referansında tanımlıdır — kaynak: `docs.claude.com/en/docs/claude-code/skills.md`,
Claude Code v2.1.231. Deprecated alan kullanılmamıştır.

## 3. Canlı discovery kanıtı

Kurulum sonrası Claude Code oturumu 8 skill'i **kendiliğinden keşfetti** ve
`Skill` aracının kullanılabilir skill listesine ekledi:

```
- cezeri-article-reader: Haber ve makale sayfalarından yapılandırılmış içerik çıkarır — ...
- cezeri-browser-agent: Playwright MCP ile gerçek tarayıcı kullanımı. URL açma, ...
- cezeri-deep-research: Çok kaynaklı derin araştırma döngüsü. ...
- cezeri-documentation-reader: Resmî teknik dokümantasyonu okur ve projedeki gerçek sürümlerle ...
- cezeri-orchestrator: CEZERI Web Intelligence yönlendiricisi. ...
- cezeri-source-verifier: Önemli ve doğrulanabilir iddiaları kaynağına kadar takip eder. ...
- cezeri-web-extractor: Web sayfalarından yapılandırılmış veri çıkarır — ...
- cezeri-web-research: Web arama ve hafif sayfa getirme katmanı. ...
```

Bu, dosya varlığından güçlü bir kanıttır: Claude Code frontmatter'ı gerçekten ayrıştırıp
`description` ve `when_to_use` alanlarını okuyabildi.

## 4. Süreçte yakalanan ve düzeltilen gerçek hata

İlk discovery çıktısında `cezeri-deep-research` yalnızca `"CEZERI Deep Research"` olarak
göründü — yani `description` okunamamış, gövdeden fallback yapılmıştı.

Kök neden: `when_to_use` değeri `"` karakteriyle başlıyordu; YAML bunu quoted-scalar sanıp
kapanış tırnağından sonraki metinde parse hatası veriyordu:

```
cezeri-deep-research/SKILL.md -> YAML HATASI: while parsing a block mapping
```

Düzeltme: değer tırnakla başlamayacak şekilde yeniden yazıldı. Ayrıca bu **hata sınıfını**
kalıcı yakalamak için `lib/common.mjs` içine `validateSkillFrontmatter()` eklendi ve hem
`install.mjs` hem `healthcheck.mjs` bu doğrulamayı kullanıyor.

Doğrulayıcının hatayı yakaladığının kanıtı:

```
BOZUK (acik tirnak)    valid=false | "when_to_use" degeri " ile basliyor ama ayni karakterle bitmiyor — YAML bunu gecersiz sayar
DUZGUN                 valid=true
description YOK        valid=false | description alani zorunlu
```

Düzeltmeden sonra Claude Code `cezeri-deep-research`'ü tam açıklamasıyla yeniden keşfetti.

## Sonuç
**PASS** — 8/8 skill üretildi, YAML geçerli, Claude Code tarafından canlı olarak discover
edildi; bulunan tek format hatası düzeltildi ve tekrarını önleyecek doğrulama eklendi.
