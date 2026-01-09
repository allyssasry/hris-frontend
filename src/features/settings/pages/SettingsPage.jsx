// import {
//   User,
//   Globe,
//   Sun,
// } from "lucide-react";
// import SettingsItem from "../components/SettingsItem";

// export default function SettingsPage() {
//   return (
//     <div className="p-6">
//       {/* Header */}
//       <h1 className="text-2xl font-semibold mb-6">Setting</h1>

//       {/* Card */}
//       <div className="bg-white rounded-2xl p-6 space-y-4 border">
//         <div>
//           <h2 className="font-semibold text-gray-900">
//             Pengaturan Umum
//           </h2>
//           <p className="text-sm text-gray-500">
//             Kelola preferensi akun dan aplikasi Anda
//           </p>
//         </div>

//         {/* Pengaturan Profil */}
//         <SettingsItem
//           icon={<User size={18} />}
//           title="Pengaturan Profil"
//           description="Ubah informasi profil, foto, dan data pribadi"
//           to="/profile/settings"
//         />

//         {/* Bahasa */}
//         <SettingsItem
//           icon={<Globe size={18} />}
//           title="Bahasa"
//           description="Pilih bahasa tampilan aplikasi"
//           rightElement={
//             <select className="border rounded-lg px-3 py-1 text-sm">
//               <option>Indonesia</option>
//               <option>English</option>
//             </select>
//           }
//         />

//         {/* Tema */}
//         <SettingsItem
//           icon={<Sun size={18} />}
//           title="Tema Tampilan"
//           description="Pilih tema terang atau gelap"
//           rightElement={
//             <select className="border rounded-lg px-3 py-1 text-sm">
//               <option>Light Mode</option>
//               <option>Dark Mode</option>
//             </select>
//           }
//         />
//       </div>

//       {/* Info Box */}
//       <div className="mt-6 bg-blue-900 text-white rounded-xl p-4 text-sm">
//         <p className="font-medium mb-1">Tentang Pengaturan</p>
//         <p className="opacity-90">
//           Perubahan bahasa dan tema akan diterapkan secara langsung.
//           Untuk mengubah informasi profil seperti nama, foto, dan data
//           pribadi lainnya, klik menu “Pengaturan Profil” di atas.
//         </p>
//       </div>
//     </div>
//   );
// }
