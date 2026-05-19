# Cordelio Dashboard

Modern, çok temalı ve çift dilli bir **Next.js** yönetim paneli. Oturum korumalı sayfalar, demo kimlik doğrulama, profil yönetimi ve mobil uyumlu arayüz bileşenleri içerir.

---

## Özellikler

| Alan | Açıklama |
|------|----------|
| **Renk temaları** | Kırmızı, yeşil, mavi — topbar ve sidebar anında güncellenir |
| **Dark / Light mod** | CSS değişkenleriyle tam tema desteği |
| **TR / EN** | Topbar menüsünden anlık dil değiştirme |
| **Kimlik doğrulama** | JWT tabanlı oturum (Edge uyumlu Web Crypto), `middleware` ile korumalı rotalar |
| **Responsive** | ≤1024px drawer sidebar, mobil sohbet/posta görünümleri, tablo kart düzenleri |
| **Stil** | SCSS modülleri + Tailwind (karma kullanım) |

---

## Hızlı başlangıç

```bash
# Proje klasörüne girin
cd dashboard

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusu (http://localhost:3000)
npm run dev
```

### Demo giriş

| Alan | Değer |
|------|--------|
| E-posta | `cordelio@dev.com` |
| Şifre | `test123` |

Kayıt sayfası (`/register`) yalnızca form doğrulaması yapar; gerçek kullanıcı oluşturmaz. Başarılı doğrulamadan sonra `/login?registered=1` adresine yönlendirir.

---

## Sayfalar

### Kimlik doğrulama (layout dışı)

| Rota | Açıklama |
|------|----------|
| `/login` | Giriş formu, arka planda video (`public/video/login-video.mp4`), şifre göster/gizle |
| `/register` | Kayıt formu (ad, e-posta, şifre doğrulama) |

`/` adresi oturuma göre `/dashboard` veya `/login` yönlendirmesi yapar.

### Panel sayfaları (giriş gerekli)

| Rota | Açıklama |
|------|----------|
| `/dashboard` | Özet kartlar, çizgi/bar/pasta grafikler (Recharts), sipariş tablosu, bildirim paneli |
| `/tables` | Üç tablo örneği tek sayfada: açılır alan adları, sütun seçici, standart tablo |
| `/tables/expandable` | → `/tables#expandable` yönlendirmesi |
| `/tables/data-grid` | → `/tables#data-grid` yönlendirmesi |
| `/tables/standard` | → `/tables#standard` yönlendirmesi |
| `/kanban` | Sürükle-bırak kanban panosu (mock görevler), yatay kaydırma |
| `/chat` | Sohbet listesi + mesaj alanı; mobilde liste ↔ sohbet geçişi |
| `/mail` | Gelen kutusu, klasörler, mesaj detayı; mobilde drawer + liste/detay |
| `/profile` | Profil düzenleme (topbar’dan veya doğrudan URL) |
| `/components` | Bileşen vitrini (placeholder) |
| `/tags` | Etiketler (placeholder) |
| `/settings` | Ayarlar (placeholder) |

### Tablolar (`/tables`)

1. **Açılır tablo** — Alan adı kartları, alt satırlarda alt domainler; disk/bant/kota metin olarak; mobilde chip özetleri.
2. **Sütun seçici** — Görünür sütunları açıp kapatma.
3. **Standart tablo** — Klasik satır düzeni, durum rozetleri, işlem menüsü.

---

## Profil (`/profile`)

Topbar’daki isme tıklayarak veya `/profile` ile erişilir.

- Avatar yükleme (base64, max 2 MB)
- Ad, e-posta, iş rolü, unvan, bio, telefon, konum, web sitesi, saat dilimi
- Yetenek etiketleri (ekle / kaldır)
- Profil doluluk yüzdesi
- Aktif görevler listesi (mock)
- Şifre değiştirme formu

Veriler `GET/PATCH /api/profile` ve `POST /api/profile/password` üzerinden sunulur. Store şu an **bellek içi** (`lib/profile/store.ts`); sunucu yeniden başlayınca sıfırlanır.

---

## API uçları

| Metot | Rota | Açıklama |
|--------|------|----------|
| `POST` | `/api/auth/login` | Oturum çerezi oluşturur |
| `POST` | `/api/auth/logout` | Oturumu sonlandırır |
| `GET` | `/api/auth/me` | Oturumdaki kullanıcı |
| `GET` | `/api/profile` | Profil + görevler |
| `PATCH` | `/api/profile` | Profil güncelleme |
| `POST` | `/api/profile/password` | Şifre değiştirme (demo: mevcut `test123`) |

---

## Mobil davranış

- **Sidebar:** ≤1024px’te gizlenir; topbar **sol** menü butonu drawer açar.
- **Sohbet / Posta:** Dar ekranda tek panel; geri butonu ile liste görünümüne dönüş.
- **Tablolar:** Yatay kaydırma veya kart düzeni (açılır tabloda mobil chip’ler).

---

## Proje yapısı (özet)

```
dashboard/
├── app/
│   ├── (dashboard)/     # Panel layout (sidebar + topbar)
│   ├── login/           # Giriş
│   ├── register/        # Kayıt
│   └── api/             # auth + profile
├── components/
│   ├── auth/            # LoginForm, RegisterForm, PasswordInput
│   ├── profile/         # ProfileView
│   ├── tables/          # Expandable, ColumnPicker, Standard
│   └── ...
├── context/             # App, Auth, Profile, Sidebar
├── lib/
│   ├── auth/            # JWT, session, kullanıcılar
│   └── profile/         # store, tipler
├── styles/              # SCSS modülleri
├── public/
│   ├── image/
│   └── video/           # login-video.mp4
└── middleware.ts        # Oturum koruması
```

---

## Scriptler

```bash
npm run dev      # Geliştirme sunucusu
npm run build    # Production build
npm run start    # Production sunucusu
npm run lint     # ESLint
```

---

## Teknolojiler

| Teknoloji | Versiyon |
|-----------|----------|
| [Next.js](https://nextjs.org) | 16.x |
| [React](https://react.dev) | 19.x |
| [TypeScript](https://www.typescriptlang.org) | 5.x |
| [Tailwind CSS](https://tailwindcss.com) | 4.x |
| [Sass](https://sass-lang.com) | 1.x |
| [Recharts](https://recharts.org) | 3.x |

---

## Notlar

- Bu proje bir **UI / demo** panelidir; üretim için gerçek veritabanı ve güvenli şifre hash’i gerekir.
- `components` ve `tags` sayfaları şimdilik iskelet (placeholder) durumundadır.
- Build sırasında `BarChart.tsx` içinde Recharts tip uyarısı görülebilir; dashboard grafikleriyle ilgilidir.

---

## Lisans

Özel proje — Cordelio.
