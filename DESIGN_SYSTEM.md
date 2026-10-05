# Design System — Adipra

> Arahan visual resmi untuk website portfolio Adipra.
> Bahasa: Indonesia · Stack: Astro + Tailwind CSS v4 · Font: Plus Jakarta Sans

---

## 1. Filosofi & Konsep

**"Comfort-first" — modern & clean.**

Desain ini berpusat pada **kenyamanan**: tidak ada elemen yang menekan mata, tidak ada
kontras yang menyakiti, tidak ada detail yang mengganggu. Setiap keputusan visual
diarahkan untuk membuat pengguna merasa tenang, lalu fokus pada konten.

Karakter utama:

- **Lembut (soft)** — bayangan lembut, transisi halus, warna tidak menyilaukan.
- **Bersih (clean)** — ruang kosong yang cukup, elemen hanya yang diperlukan.
- **Bernafas (airy)** — spacing lega, tipografi renggang, hierarki jelas.
- **Tumpul & ramah (blunt)** — radius besar membuat antarmuka terasa hangat dan mudah didekati.

---

## 2. Prinsip Desain

| # | Prinsip | Aturan |
|---|---------|--------|
| 1 | **Soft shadow, selalu** | Semua bayangan lembut (blur besar, opacity rendah, tint biru). Dilarang shadow keras/tegas. |
| 2 | **Radius tumpul** | Permukaan inti minimal `32px`. Elemen kecil (tombol, badge) berbentuk pill. |
| 3 | **Shadow > Border** | Kartu & permukaan inti TIDAK memakai border. Border hanya untuk input, divider, dan tag outline. |
| 4 | **Spacing kelipatan 8px** | Semua jarak mengikuti skala 8px (4px hanya untuk kasus sangat sempit, tidak dianjurkan). |
| 5 | **Modern & clean** | Tanpa dekorasi berlebih, tanpa gradasi mencolok, konten adalah bintang. |

---

## 3. Warna

Palet berbasis **`#2563EB`** (primary) yang dipadukan dengan **putih modern** (warna
permukaan bersih, dingin, terang) — bukan putih murni yang "kosong".

### Token Semantik — Light

| Token | Nilai | Catatan |
|-------|-------|---------|
| `--background` | `oklch(1 0 0)` / `#FFFFFF` | Latar utama |
| `--foreground` | `oklch(0.18 0.02 264)` | Teks utama — cool dark, bukan hitam pekat |
| `--card` | `oklch(1 0 0)` | Kartu (tanpa border, hanya shadow) |
| `--muted` | `oklch(0.96 0.006 260)` | Area redup (latar pill, progress track) |
| `--muted-foreground` | `oklch(0.52 0.02 260)` | Teks sekunder |
| `--primary` | `#2563EB` | Aksen utama — hanya untuk aksi & penekanan |
| `--primary-foreground` | `#FFFFFF` | Teks di atas primary |
| `--border` | `oklch(0.92 0.008 260)` | Divider & tag outline |
| `--input` | `oklch(0.90 0.008 260)` | Border field input |

### Token Semantik — Dark

| Token | Nilai |
|-------|-------|
| `--background` | `oklch(0.16 0.015 264)` |
| `--foreground` | `oklch(0.985 0 0)` |
| `--card` | `oklch(0.20 0.015 264)` |
| `--muted` | `oklch(0.27 0.015 264)` |
| `--muted-foreground` | `oklch(0.72 0.01 260)` |
| `--primary` | `#60A5FA` |
| `--primary-foreground` | `oklch(0.205 0 0)` |
| `--border` | `oklch(0.28 0.015 264)` |
| `--input` | `oklch(0.28 0.015 264)` |

### Aturan penggunaan

- **Primary** untuk 1 aksi utama per layar + teks penekanan & status aktif. Jangan mencolok di mana-mana.
- Penggunaan primary sebagai **latar penuh** hanya untuk tombol aksi utama.
- Warna dilarang digunakan di luar primary (kecuali status semantik seperti sukses/error).
- Teks utama harus kontras kuat; teks sekunder hanya `--muted-foreground`.

---

## 4. Tipografi

**Plus Jakarta Sans** — geometris, modern, dan tetap hangat. Tanpa font kedua; hierarki
dibangun dari ukuran, weight, dan tracking.

### Type Scale

| Level | Ukuran | Weight | Line-height | Tracking |
|-------|--------|--------|-------------|----------|
| Display (hero) | `clamp(3rem, 8vw, 4.5rem)` | 800 | 1.1 | `-0.03em` |
| H1 | `clamp(2.5rem, 5vw, 3.5rem)` | 700 | 1.15 | `-0.025em` |
| H2 | `clamp(2rem, 4vw, 2.5rem)` | 700 | 1.2 | `-0.02em` |
| H3 | `1.5rem` | 600 | 1.3 | `-0.015em` |
| Body-LG | `1.125rem` | 400 | 1.7 | normal |
| Body | `1rem` | 400 | 1.7 | normal |
| Body-SM | `0.875rem` | 400 | 1.6 | normal |
| Caption / meta | `0.75rem` | 500 | 1.5 | `0.01em` |

### Aturan

- Body ideal `max-width: 70ch` agar nyaman dibaca.
- Heading memakai `font-display` dan `tracking-tight`.
- TIDAK memakai label mikro uppercase ber-tracking lebar (gaya eyebrow) — lihat
  **Section Heading** (bagian 9).
- Nominal & statistik boleh memakai weight 800 untuk kesan kuat.

---

## 5. Spacing

Skala **kelipatan 8px**. Jarak mengambang (6px, 10px, 14px, dll.) dilarang.

| Token | Nilai |
|-------|-------|
| `--space-1` | `0.5rem` (8px) |
| `--space-2` | `1rem` (16px) |
| `--space-3` | `1.5rem` (24px) |
| `--space-4` | `2rem` (32px) |
| `--space-5` | `3rem` (48px) |
| `--space-6` | `4rem` (64px) |
| `--space-7` | `6rem` (96px) |
| `--space-8` | `8rem` (128px) |

### Panduan umum

- **Antar elemen dalam kartu:** 16–24px.
- **Padding kartu:** 24px (kecil) / 32px (standar).
- **Antar section:** 96–128px (`py-24`/`py-28` di mobile).
- **Grid & gap:** 24–32px.
- **Sisi kiri-kanan halaman:** 24px (mobile) → 32px+ (desktop), konten `max-w-6xl`.

---

## 6. Radius

Prinsip: **tumpul dan ramah**. Semakin besar permukaan, semakin tumpul sudutnya.

| Elemen | Radius |
|--------|--------|
| Kartu / permukaan inti | **`32px`** (`--radius-card`) |
| Tombol | `999px` (pill) |
| Badge / chip / tag | `999px` (pill) |
| Input & textarea | `16px` (`--radius-input`) |
| Gambar di dalam kartu | `24px` |

> Radius kecil (`8px`-`12px`) hanya boleh pada elemen utilitas dalam, bukan permukaan utama.

---

## 7. Shadow

Semua bayangan **soft**: blur besar, opacity rendah, warna tint biru (`#2563EB`).
Dilarang shadow keras (`0 4px 6px rgba(0,0,0,.1)`).

| Token | Nilai |
|-------|-------|
| `--shadow-soft-sm` | `0 2px 8px rgba(37, 99, 235, 0.06)` |
| `--shadow-soft-md` | `0 8px 24px rgba(37, 99, 235, 0.08), 0 2px 8px rgba(37, 99, 235, 0.04)` |
| `--shadow-soft-lg` | `0 16px 40px rgba(37, 99, 235, 0.12), 0 4px 16px rgba(37, 99, 235, 0.06)` |
| `--shadow-soft-xl` | `0 24px 64px rgba(37, 99, 235, 0.16), 0 8px 24px rgba(37, 99, 235, 0.08)` |

### Aturan

- Kartu idle: `--shadow-soft-md`. Hover: `--shadow-soft-lg` + naik `-4px`.
- Tombol primary: `--shadow-soft-lg` (bukan glow keras).
- Di mode gelap, redupkan opacity shadow (bagi ~2).

---

## 8. Border

**Kebijakan: shadow menggantikan border pada permukaan inti.**

- Kartu / permukaan inti: **tanpa border** — batas visual dari shadow.
- Input / textarea: **boleh & disarankan border** (`--input`) agar field terbaca jelas.
- Divider antar section: garis tipis `1px` `--border` (boleh).
- Tag / chip outline: border `--border` (boleh).
- Area redup (pill tab aktif, badge): `bg-primary/10` tanpa border, atau pill solid.

---

## 9. Section Heading (gaya baru)

Menggantikan eyebrow lama (label angka + teks uppercase kecil + garis pembatas).

Ciri khas:

- **Judul besar** `font-display`, bold, `tracking-tight`, kontras tinggi — langsung
  berbicara tanpa mikro-label.
- **Aksen modern** pada satu kata kunci: *gradient text* atau kata berwarna
  `text-primary` untuk memberi identitas visual yang khas.
- **Tanpa garis** pembatas dan tanpa label kecil. Ruang kosong di bawah heading
  adalah "garis" yang sesungguhnya.

Contoh pola:

```html
<h2 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
  Karya <span class="text-primary">Pilihan</span>
</h2>
```

Varian aksen (dipakai konsisten di seluruh situs):

1. **Kata berwarna** — `text-primary` pada kata kunci.
2. **Gradient text** — gradasi biru lembut → putih, khusus heading besar (hero).

---

## 10. Motion & Interaksi

Gerakan harus terasa **halus dan wajar**, bukan pamer.

| Properti | Nilai |
|----------|-------|
| Micro-interaction | `150ms` |
| Interaksi standar (hover) | `250–300ms` |
| Entrance / reveal | `600–700ms` |
| Easing utama | `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out eksponensial) |
| Hover kartu | `translateY(-4px)` + shadow naik |
| Reveal on scroll | IntersectionObserver, `translateY(28px)` → `0` + fade |

### Aturan

- Semua elemen interaktif punya **hover**, **focus**, dan **active** state.
- Scroll smooth menggunakan Lenis.
- **`prefers-reduced-motion: reduce`** — matikan semua animasi & reveal, tampil langsung.
- Dilarang animasi berulang (loop) di luar kebutuhan dekorasi minimal.

---

## 11. Layout & Responsive

- Container: `max-w-6xl`, padding horizontal `24px` (mobile) → `32px` (desktop).
- Grid dasar: 1 kolom (mobile) → 2 (sm) → 3 (lg). Gap `24–32px`.
- **Showcase proyek memakai Bento grid** — kartu berukuran variatif (besar/kecil)
  untuk ritme visual modern. Kunci: kartu besar menampung visual utama, kartu kecil
  untuk konteks pendukung; spacing tetap kelipatan 8px.
- Breakpoint: `sm 640 · md 768 · lg 1024 · xl 1280`.
- Hero: teks besar center (mobile) → bisa rata kiri (desktop), cukup whitespace di bawah.

---

## 12. Aksesibilitas

- Kontras teks utama ≥ WCAG AA (4.5:1); teks besar ≥ 3:1.
- `--primary` untuk teks kecil wajib dipakai hati-hati — pastikan kontras cukup.
- Target sentuh minimal `44×44px`.
- Fokus terlihat: ring lembut biru (`ring`), bukan hanya perubahan warna.
- Label form terhubung (`htmlFor`), placeholder bukan pengganti label.
- Alt text bermakna untuk semua gambar.

---

## 13. Token Implementasi (CSS)

Siap ditempatkan pada `src/styles/global.css` (Tailwind v4).

```css
@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
  --color-card: var(--card);
  --font-display: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;

  --radius-card: 2rem;        /* 32px */
  --radius-input: 1rem;       /* 16px */
  --radius-full: 9999px;

  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --space-5: 3rem;
  --space-6: 4rem;
  --space-7: 6rem;
  --space-8: 8rem;

  --shadow-soft-sm: 0 2px 8px rgba(37, 99, 235, 0.06);
  --shadow-soft-md: 0 8px 24px rgba(37, 99, 235, 0.08), 0 2px 8px rgba(37, 99, 235, 0.04);
  --shadow-soft-lg: 0 16px 40px rgba(37, 99, 235, 0.12), 0 4px 16px rgba(37, 99, 235, 0.06);
  --shadow-soft-xl: 0 24px 64px rgba(37, 99, 235, 0.16), 0 8px 24px rgba(37, 99, 235, 0.08);
}
```

---

*Prinsip kami: kenyamanan. Jika ragu antara "lebih banyak" dan "lebih tenang", pilih yang lebih tenang.*