# Portfolify - Proje Dokümantasyonu

## Proje Hakkında

**Portfolify**, yazılımcıların ve teknoloji öğrencilerinin dijital dünyadaki tüm varlıklarını (GitHub projelerini, LinkedIn profillerini, kişisel bloglarını ve sosyal medya hesaplarını) tek bir şık ve mobil uyumlu sayfada toplamalarını sağlayan, çoklu kullanıcı (multi-tenant) destekli bir **Kişisel Dijital Kartvizit** platformudur.

Proje ileride yazılımcıların birbirini takip ettiği ve yeteneklerini onayladığı (LinkedIn tarzı) bir sosyal ağa dönüşecek şekilde tasarlanmıştır.

---

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| **Backend Framework** | .NET 9 (ASP.NET Core) |
| **Veritabanı** | PostgreSQL |
| **ORM** | Entity Framework Core 9 |
| **CQRS** | MediatR |
| **Validation** | FluentValidation |
| **Mapping** | AutoMapper |
| **Logging** | Serilog |
| **API Dokümantasyonu** | Swagger (Swashbuckle) |
| **Health Checks** | ASP.NET Core Health Checks + Npgsql |
| **Frontend** | (İleride eklenecek) |
| **Test** | xUnit |

---

## Mimari Yapı (Clean Architecture)

```
backend/
├── Portfolify.sln
├── src/
│   ├── Portfolify.Domain/          # İş kuralları, entity'ler, value object'ler, domain event'ler
│   ├── Portfolify.Application/     # Use case'ler, CQRS (commands/queries), DTO'lar, validation
│   ├── Portfolify.Infrastructure/  # Harici servis implementasyonları, domain event dispatching
│   ├── Portfolify.Persistence/     # EF Core, veritabanı konfigürasyonları, repository implementasyonları
│   └── Portfolify.API/             # REST API endpoint'leri, middleware'ler, DI konfigürasyonu
└── tests/
    ├── Portfolify.Domain.Tests/
    ├── Portfolify.Application.Tests/
    ├── Portfolify.Infrastructure.Tests/
    └── Portfolify.API.Tests/
```

### Katman Bağımlılıkları

```
API → Application → Domain
API → Infrastructure → Application → Domain
API → Persistence → Application → Domain
```

**Domain** hiçbir katmana bağımlı değildir. **Application** sadece Domain'e bağımlıdır. **Infrastructure** ve **Persistence** Application'a bağımlıdır. **API** tüm katmanlara bağımlıdır (composition root).

---

## Domain Katmanı

### Entity'ler

| Entity | Açıklama |
|--------|----------|
| **Tenant** | Multi-tenant yapısının temel birimi. Her organizasyon/kullanıcı grubu bir tenant'tır. |
| **User** | Platform kullanıcısı. Developer, Student veya Admin rolüne sahip olabilir. |
| **Profile** | Kullanıcının dijital kartviziti. Slug, başlık, biyografi ve görünürlük ayarları içerir. |
| **ProfileLink** | Profile bağlı dış bağlantılar (GitHub, LinkedIn, blog vb.) |
| **Project** | Kullanıcının sergilediği projeler. Repository URL, canlı demo URL bilgileriyle. |
| **Skill** | Kullanıcının yetkinlikleri ve seviyeleri. |
| **Experience** | İş deneyimi geçmişi. |
| **Education** | Eğitim geçmişi. |
| **Tag** | Projelere atanabilen etiketler. |
| **ProjectTag** | Proje-Etiket çoktan çoka ilişkisi. |
| **ContactMessage** | Kullanıcılara gönderilen iletişim mesajları. |

### Value Object'ler

| Value Object | Açıklama |
|--------------|----------|
| **Email** | E-posta validasyonu ile birlikte. |
| **Url** | HTTP/HTTPS URL validasyonu. |
| **Slug** | URL-dostu tanımlayıcı. |
| **SocialLink** | Sosyal medya platformu + URL çifti. |
| **ContactInfo** | Telefon, konum, web sitesi bilgileri. |

### Domain Event'ler

- `UserCreatedEvent` - Yeni kullanıcı oluşturulduğunda fırlatılır.
- `TenantCreatedEvent` - Yeni tenant oluşturulduğunda fırlatılır.
- `ProfileCreatedEvent` - Yeni profil oluşturulduğunda fırlatılır.
- `ProfilePublishedEvent` - Profil yayınlandığında fırlatılır.
- `ContactMessageReceivedEvent` - Yeni iletişim mesajı alındığında fırlatılır.

### Enum'lar

- `UserRole` (Developer, Student, Admin)
- `ProfileVisibility` (Public, Private, Unlisted)
- `SocialPlatform` (GitHub, LinkedIn, Twitter, Blog, YouTube, Discord, StackOverflow, DevTo, Medium, Custom)
- `SkillLevel` (Beginner, Intermediate, Advanced, Expert)
- `ProjectStatus` (Active, Archived, Draft)
- `LinkType` (GitHub, LiveDemo, Documentation, Package, Other)
- `ContactStatus` (New, Read, Replied, Archived)

---

## Application Katmanı (CQRS)

### Commands (Yazma İşlemleri)

**Users:**
- `CreateUserCommand` → Yeni kullanıcı oluşturma
- `UpdateUserCommand` → Kullanıcı güncelleme
- `DeleteUserCommand` → Kullanıcı silme

**Profiles:**
- `CreateProfileCommand` → Yeni profil oluşturma
- `UpdateProfileCommand` → Profil güncelleme
- `DeleteProfileCommand` → Profil silme

### Queries (Okuma İşlemleri)

**Users:**
- `GetUserByIdQuery` → ID ile kullanıcı getirme
- `GetUserByEmailQuery` → E-posta ile kullanıcı getirme
- `GetUsersByTenantQuery` → Tenant altındaki kullanıcıları listeleme (sayfalı)

**Profiles:**
- `GetProfileByIdQuery` → ID ile profil getirme
- `GetProfileBySlugQuery` → Slug ile profil getirme
- `GetProfilesByUserIdQuery` → Kullanıcının profillerini listeleme (sayfalı)

### Pipeline Behaviors

| Behavior | Açıklama |
|----------|----------|
| **ValidationBehavior** | FluentValidation ile otomatik validasyon |
| **LoggingBehavior** | MediatR pipeline'ında otomatik request/response logging |

### DTO'lar

Her entity için `Response<T>` ve `PagedResponse<T>` wrapper'ları kullanılır. Standart yanıtlar:

```json
{
  "data": { ... },
  "isSuccess": true,
  "errorMessage": null
}
```

Sayfalı yanıtlar:

```json
{
  "items": [ ... ],
  "totalCount": 50,
  "pageNumber": 1,
  "pageSize": 20,
  "totalPages": 3,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

---

## Persistence Katmanı

### EF Core Konfigürasyonu

Her entity için ayrı `IEntityTypeConfiguration<T>` sınıfı mevcuttur:

- `UserConfiguration` - E-posta owned type, unique index, soft delete
- `TenantConfiguration` - Slug ve Domain unique index
- `ProfileConfiguration` - Slug unique index, cascade link silme
- `ProfileLinkConfiguration`
- `ProjectConfiguration`
- `SkillConfiguration`
- `ExperienceConfiguration`
- `EducationConfiguration`
- `TagConfiguration` - Tenant + Name composite unique index
- `ProjectTagConfiguration` - Project + Tag composite unique index
- `ContactMessageConfiguration`

### Interceptor'lar

- **AuditableEntityInterceptor** - `CreatedAtUtc` ve `UpdatedAtUtc` alanlarını otomatik yönetir, soft delete uygular.

### Repository Implementasyonları

- `Repository<T>` (Generic)
- `UserRepository` - E-posta, GitHub username ve tenant bazlı sorgular
- `ProfileRepository` - Slug, userId, public profile ve primary profile sorguları
- `TenantRepository` - Slug ve domain bazlı sorgular
- `ProjectRepository` - ProfileId ve published status bazlı sorgular

---

## API Katmanı

### Endpoint'ler

| Method | Route | Açıklama |
|--------|-------|----------|
| GET | `/api/users/{id}` | Kullanıcı detayı |
| GET | `/api/users/by-email/{email}` | E-posta ile kullanıcı |
| GET | `/api/users/tenant/{tenantId}` | Tenant kullanıcıları |
| POST | `/api/users` | Yeni kullanıcı |
| PUT | `/api/users/{id}` | Kullanıcı güncelle |
| DELETE | `/api/users/{id}` | Kullanıcı sil |
| GET | `/api/profiles/{id}` | Profil detayı |
| GET | `/api/profiles/slug/{slug}` | Slug ile profil |
| GET | `/api/profiles/user/{userId}` | Kullanıcı profilleri |
| POST | `/api/profiles` | Yeni profil |
| PUT | `/api/profiles/{id}` | Profil güncelle |
| DELETE | `/api/profiles/{id}` | Profil sil |
| GET | `/health` | Health check |

### Middleware'ler

- **GlobalExceptionHandlerMiddleware** - Tüm exception'ları yakalayıp standart JSON hata yanıtları döner.

---

## Multi-Tenant Yapı

Her `ITenantEntity` implementasyonu `TenantId` taşır. Tenant izolasyonu:
- Veritabanı seviyesinde `TenantId` kolonu ile
- Repository sorgularında tenant filtreleme ile
- İleride: Request bazlı tenant resolution middleware ile

---

## SOLID Prensipleri

| Prensip | Uygulama |
|---------|----------|
| **S**ingle Responsibility | Her handler sadece bir use case'den sorumlu |
| **O**pen/Closed | Yeni feature eklemek mevcut kodu değiştirmez |
| **L**iskov Substitution | Repository interface'leri ile |
| **I**nterface Segregation | Özel repository interface'leri (IUserRepository vb.) |
| **D**ependency Inversion | Domain ve Application katmanları soyutlamalara bağımlı |

---

## Çalıştırma

```bash
# Backend'i çalıştır
cd backend/src/Portfolify.API
dotnet run

# Swagger UI
https://localhost:5001/swagger

# Health Check
https://localhost:5001/health

# Migration oluşturma
cd backend/src/Portfolify.API
dotnet ef migrations add InitialCreate --project ../Portfolify.Persistence --startup-project .
dotnet ef database update --project ../Portfolify.Persistence --startup-project .
```

---

## Gelecek Planları

- [ ] JWT Authentication & Authorization
- [ ] Takip sistemi (LinkedIn tarzı sosyal ağ)
- [ ] Yetenek onaylama (endorsement)
- [ ] Frontend uygulaması
- [ ] Rate limiting
- [ ] Caching (Redis)
- [ ] Background jobs (mesaj gönderimi vb.)
- [ ] File upload (avatar, proje görselleri)
- [ ] GitHub API entegrasyonu
- [ ] Analytics dashboard
