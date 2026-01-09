// import { ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function SettingsItem({
//   icon,
//   title,
//   description,
//   to,
//   rightElement,
// }) {
//   const Wrapper = to ? Link : "div";

//   return (
//     <Wrapper
//       to={to}
//       className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 transition"
//     >
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
//           {icon}
//         </div>

//         <div>
//           <p className="font-medium text-gray-900">{title}</p>
//           <p className="text-sm text-gray-500">{description}</p>
//         </div>
//       </div>

//       {rightElement ? rightElement : to && <ChevronRight size={18} />}
//     </Wrapper>
//   );
// }
