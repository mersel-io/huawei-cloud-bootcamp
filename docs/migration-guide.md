# Portfolify - Migration Rehberi

## Gereksinimler

- .NET 9 SDK
- PostgreSQL sunucusu çalışır durumda
- `dotnet ef` CLI aracı yüklü olmalı:

```bash
dotnet tool install --global dotnet-ef
```

## Veritabanı Bağlantısı

`backend/src/Portfolify.API/appsettings.json` dosyasındaki bağlantı string'ini kendi PostgreSQL kurulumunuza göre düzenleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=portfolify;Username=postgres;Password=postgres"
  }
}
```

## Yeni Migration Oluşturma

Domain entity'lerinde veya EF Core configuration'larında bir değişiklik yaptığınızda yeni bir migration oluşturun:

```bash
# Proje kök dizininden (hwc-bootcamp/)
dotnet ef migrations add <MigrationAdi> \
  --project backend/src/Portfolify.Persistence \
  --startup-project backend/src/Portfolify.API \
  --output-dir Migrations
```

**Örnek:**

```bash
dotnet ef migrations add AddUserPhoneNumber \
  --project backend/src/Portfolify.Persistence \
  --startup-project backend/src/Portfolify.API \
  --output-dir Migrations
```

## Migration'ı Veritabanına Uygulama

```bash
dotnet ef database update \
  --project backend/src/Portfolify.Persistence \
  --startup-project backend/src/Portfolify.API
```

Belirli bir migration'a kadar uygulamak için:

```bash
dotnet ef database update <MigrationAdi> \
  --project backend/src/Portfolify.Persistence \
  --startup-project backend/src/Portfolify.API
```

## Migration Geri Alma

Son migration'ı geri almak (migration dosyasını siler, değişiklikleri veritabanına uygular):

```bash
dotnet ef migrations remove \
  --project backend/src/Portfolify.Persistence \
  --startup-project backend/src/Portfolify.API \
  --force
```

## Mevcut Migration'ları Listeleme

```bash
dotnet ef migrations list \
  --project backend/src/Portfolify.Persistence \
  --startup-project backend/src/Portfolify.API
```

## Migration SQL'i Önizleme

Migration'ı uygulamadan önce oluşturulacak SQL'i görüntüleme:

```bash
dotnet ef migrations script \
  --project backend/src/Portfolify.Persistence \
  --startup-project backend/src/Portfolify.API
```

Belirli bir aralığı görmek için:

```bash
dotnet ef migrations script <FromMigration> <ToMigration> \
  --project backend/src/Portfolify.Persistence \
  --startup-project backend/src/Portfolify.API
```

## Mevcut Migration'lar

| Migration | Açıklama |
|-----------|----------|
| `InitialCreate` | Tüm tabloların ve ilişkilerin oluşturulduğu ilk migration |

### InitialCreate ile Oluşturulan Tablolar

| Tablo | Açıklama |
|-------|----------|
| `tenants` | Multi-tenant organizasyonlar |
| `users` | Platform kullanıcıları (soft-delete destekli) |
| `profiles` | Kullanıcı dijital kartvizitleri |
| `profile_links` | Profile bağlı dış bağlantılar |
| `projects` | Sergilenen projeler |
| `skills` | Kullanıcı yetkinlikleri |
| `experiences` | İş deneyimi geçmişi |
| `educations` | Eğitim geçmişi |
| `tags` | Etiketler |
| `project_tags` | Proje-etiket ilişkileri |
| `contact_messages` | İletişim mesajları |

### Tablo İlişkileri

```
tenants ──┬── users ──── profiles ──┬── profile_links
          │                   ├── projects ──── project_tags ── tags
          │                   ├── skills
          │                   ├── experiences
          │                   ├── educations
          │                   └── contact_messages
```

## Dikkat Edilmesi Gerekenler

- Migration oluşturmadan önce projenin **build edildiğinden** emin olun
- `DesignTimeDbContextFactory` sınıfı, migration araçlarının DbContext'i oluşturabilmesi için `Portfolify.Persistence` projesinde bulunur
- Tüm tablo ve kolon isimleri `EFCore.NamingConventions` paketi ile otomatik olarak **snake_case** formatında oluşturulur
- Production'da migration uygulamadan önce mutlaka SQL script önizlemesini kontrol edin
