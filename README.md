# 💼 HRIS CMLABS — Human Resource Information System

![React](https://img.shields.io/badge/Frontend-React-61DBFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Style-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-Internal-blue)
![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)

---

Selamat datang di repository *HRIS CMLABS* ✨  
Proyek ini merupakan sistem informasi sumber daya manusia (Human Resource Information System) berbasis *React + Vite*, yang dirancang untuk membantu pengelolaan data karyawan, absensi, payroll, serta aktivitas internal perusahaan.

🎯 *Tujuan utama proyek ini* adalah menciptakan aplikasi HR modern yang *efisien, cepat, dan mudah digunakan*, sekaligus menjadi acuan desain dan arsitektur frontend untuk sistem HR digital.

---

## 🧠 Filosofi Desain

🟦 *Color Palette:*  
Terinspirasi dari identitas visual *CMLABS* — profesional, bersih, dan modern.  
Kombinasi warna biru, abu-abu, dan putih mencerminkan nilai *kepercayaan (trust)* dan *stabilitas (stability)* di lingkungan kerja.

🔤 *Typography:*  
Font utama menggunakan *Inter* untuk menjaga tampilan yang modern, minimalis, dan mudah dibaca di seluruh komponen UI.

🎨 *Wireframe & High-Fidelity Design:*  
Desain dikembangkan berdasarkan High-Fidelity Design di Figma dengan prinsip *consistency, **clarity, dan **minimalism* agar pengalaman pengguna tetap efisien dan nyaman digunakan.

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| 🧩 Frontend | [React](https://react.dev) + [Vite](https://vitejs.dev) |
| 🎨 Styling | [Tailwind CSS](https://tailwindcss.com) + Custom Design System |
| 🔐 Auth | React Hook Form + Yup Validation |
| 🧭 Routing | React Router DOM |
| 🧱 State Management | Context API / Zustand |
| 🧰 Linting & Quality | ESLint + Prettier |
| 🧪 Testing | Jest / React Testing Library (optional) |

---

## 📂 Project Structure
src/
├── app/ # Entry point configuration
├── assets/ # Static assets (images, icons, fonts)
├── components/ # Reusable UI components
├── features/
│ ├── auth/ # Authentication modules
│ │ ├── pages/ # Sign In / Sign Up pages
│ │ ├── components/ # Auth-related components
│ │ └── logic/ # Form & validation logic
├── main.jsx # App entry file
├── App.jsx # Main layout and routing setup
└── ...


## 🚀 Getting Started

### 1️⃣ Install dependencies
pnpm install
atau
npm install

### 2️⃣ Run development server
pnpm run dev
atau
npm run dev

Maka Nantinya Aplikasi akan berjalan di:
👉 http://localhost:5173

## 🧩 Features (Planned & In Progress)

✅ Dashboard karyawan & admin
✅ Modul autentikasi (Sign In, Sign Up)
🔄 Manajemen data karyawan (CRUD)
📅 Modul absensi & cuti
💰 Sistem payroll & slip gaji
📊 Laporan & analitik HR
🔔 Notifikasi aktivitas karyawan

💡 Catatan: beberapa fitur masih dalam tahap pengembangan (prototype).

## 🤝 Kontribusi

Kontribusi sangat terbuka!
Jika kamu ingin menambahkan fitur baru, silakan fork repository ini dan ajukan Pull Request.

🍴 Fork repository ini
🌱 Buat branch baru: git checkout -b feature/nama-fitur
💬 Commit perubahan: git commit -m "Add new feature"
🚀 Push branch ke repo kamu
🔁 Buka Pull Request ke branch utama
🧾 Lisensi

Proyek ini dikembangkan untuk keperluan magang dan pembelajaran internal di CMLABS.
Tidak untuk digunakan secara komersial tanpa izin tertulis dari pengembang.
