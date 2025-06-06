# KKN Budget Nexus

Sistem manajemen keuangan dan kegiatan untuk program Kuliah Kerja Nyata (KKN). Aplikasi web modern yang dibangun dengan React, TypeScript, dan Tailwind CSS untuk membantu koordinator KKN mengelola anggaran, peserta, kegiatan, dan laporan dengan mudah.

## 🌟 Fitur Utama

### 💰 Manajemen Keuangan

- **Pemasukan**: Pencatatan sumber dana dan pemasukan
- **Pengeluaran**: Tracking pengeluaran dengan kategori
- **Laporan Keuangan**: Dashboard analitik real-time
- **Export Data**: Export ke Excel/PDF untuk pelaporan

### 👥 Manajemen Peserta

- **Data Mahasiswa**: Profil lengkap peserta KKN
- **Kelompok**: Pembagian kelompok dan koordinator
- **Presensi**: Tracking kehadiran kegiatan
- **Evaluasi**: Penilaian kinerja peserta

### 📅 Manajemen Kegiatan

- **Jadwal**: Kalender kegiatan dan timeline
- **Program Kerja**: Perencanaan dan monitoring progress
- **Dokumentasi**: Upload foto dan dokumentasi kegiatan
- **Laporan**: Generate laporan kegiatan otomatis

### ⚙️ Pengaturan & Lokasi

- **Manajemen Lokasi**: Daftar tempat kegiatan KKN (terintegrasi di Settings)
- **Konfigurasi**: Settings aplikasi dan preferences
- **User Management**: Kelola akses koordinator dan admin
- **Backup**: Export/import data untuk backup

### 📱 Fitur Tambahan

- **PWA Ready**: Install sebagai aplikasi mobile
- **Offline Mode**: Akses terbatas saat offline
- **Responsive**: Optimal di desktop, tablet, dan mobile
- **Real-time**: Update data secara real-time
- **Security**: Autentikasi dan validasi data

## 🛠️ Teknologi

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Radix UI + Tailwind CSS
- **State Management**: React Context API + React Query
- **Icons**: Lucide React (1000+ icons)
- **Charts**: Recharts untuk visualisasi data
- **PWA**: Workbox untuk Progressive Web App
- **Build**: Vite dengan optimasi production
- **Mobile**: Capacitor untuk deployment mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm atau yarn
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd kkn-budget-nexus

# Install dependencies
npm install

# Start development server
npm run dev

# Buka browser di http://localhost:8080
```

### Build Production

```bash
# Build untuk production
npm run build

# Preview build
npm run preview
```

## 📱 Mobile App (PWA)

### Install sebagai PWA

1. Buka aplikasi di browser mobile
2. Tap menu browser → "Add to Home Screen"
3. Aplikasi akan ter-install seperti native app

### Features PWA

- ✅ Install di home screen
- ✅ Splash screen saat loading
- ✅ Offline fallback
- ✅ Background sync
- ✅ Push notifications (planned)

## 🎨 Kustomisasi

### 1. Branding & Configuration

Edit file `/src/config/app.config.ts`:

```typescript
export const APP_CONFIG = {
  app: {
    name: "KKN Budget Nexus",
    description: "Sistem Manajemen KKN",
    version: "1.0.0",
    logo: "/logo.png",
  },

  // Aktifkan/nonaktifkan fitur
  features: {
    showStudentManagement: true,
    showActivityManagement: true,
    showLocationManagement: false, // Terintegrasi di Settings
    showExpenseManagement: true,
    showIncomeManagement: true,
    showProgramManagement: true,
    showReports: true,
  },

  // Kustomisasi text dan label
  labels: {
    dashboardTitle: "Dashboard KKN",
    incomeTitle: "Pemasukan",
    expensesTitle: "Pengeluaran",
    // ... dll
  },
};
```

### 2. Tema dan Styling

Edit `/src/index.css` untuk mengubah warna tema:

```css
:root {
  /* Primary colors */
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;

  /* Custom theme */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}
```

## 📂 Struktur Project

```
src/
├── components/          # Komponen React
│   ├── Dashboard.tsx   # Dashboard utama
│   ├── Settings.tsx    # Settings + Location Management
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── ExpenseManagement.tsx
│   ├── IncomeManagement.tsx
│   ├── StudentManagement.tsx
│   ├── ActivityManagement.tsx
│   ├── ProgramManagement.tsx
│   ├── Reports.tsx
│   └── ui/             # shadcn/ui components
├── config/
│   └── app.config.ts   # Konfigurasi aplikasi
├── contexts/           # React Context
├── hooks/              # Custom hooks
├── lib/                # Utilities
└── utils/              # Helper functions
```

## 📊 Fitur Dashboard

### Analytics Real-time

- **Total Anggaran**: Overview budget keseluruhan
- **Pengeluaran**: Tracking spending dengan kategori
- **Peserta Aktif**: Jumlah mahasiswa yang berpartisipasi
- **Kegiatan**: Progress program kerja
- **Charts**: Visualisasi data dengan Recharts

### Quick Actions

- ⚡ Tambah pemasukan/pengeluaran cepat
- 📝 Catat kegiatan baru
- 👥 Daftarkan peserta baru
- 📍 Tambah lokasi kegiatan
- 📊 Generate laporan instant

## 🔐 Security & Data

### Authentication

- Login dengan username/password
- Session management
- Protected routes
- Role-based access (Admin/Koordinator)

### Data Management

- Local storage untuk data offline
- Data validation dan sanitization
- Export/Import untuk backup
- Encryption untuk data sensitif

### Privacy

- No external tracking
- Data tersimpan local
- GDPR compliance ready
- Configurable data retention

## 🚀 Deployment

### Option 1: Static Hosting

```bash
# Build production
npm run build

# Upload folder dist/ ke:
# - Netlify
# - Vercel
# - GitHub Pages
# - Firebase Hosting
```

### Option 2: Mobile App

```bash
# Install Capacitor CLI
npm install -g @capacitor/cli

# Build web app
npm run build

# Add platform
npx cap add android
npx cap add ios

# Sync dan build
npx cap sync
npx cap open android  # Buka Android Studio
npx cap open ios      # Buka Xcode
```

## 📱 Testing

### Development Testing

```bash
# Run development server
npm run dev

# Test PWA di localhost:8080
# Test responsive design di DevTools
# Test offline mode (disconnect network)
```

### Production Testing

```bash
# Build dan preview
npm run build
npm run preview

# Test PWA features
# Test performance dengan Lighthouse
# Test di multiple devices
```

## 🐛 Troubleshooting

### Common Issues

**1. Module tidak ditemukan**

```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Build error**

```bash
# Check TypeScript errors
npm run build

# Fix dengan:
npx tsc --noEmit
```

**3. PWA tidak ter-install**

- Check HTTPS (required untuk PWA)
- Check manifest.json
- Clear browser cache

### Performance Optimization

**1. Bundle Size**

```bash
# Analyze bundle
npm run build
npx vite-bundle-analyzer dist
```

**2. Lazy Loading**

```typescript
// Implementasi code splitting
const LazyComponent = lazy(() => import("./Component"));
```

## 📞 Support & Kontribusi

### Getting Help

- 📖 Baca dokumentasi lengkap
- 🐛 Report bugs via Issues
- 💡 Request features
- 💬 Diskusi di GitHub Discussions

### Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

### Development Guidelines

- Use TypeScript untuk type safety
- Follow ESLint rules
- Write descriptive commit messages
- Test di multiple browsers
- Maintain responsive design

## 📄 License

MIT License - bebas digunakan untuk project komersial maupun non-komersial.

## 🙏 Credits

- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

**Dibuat dengan ❤️ untuk memudahkan koordinator KKN mengelola program dengan lebih efisien.**
