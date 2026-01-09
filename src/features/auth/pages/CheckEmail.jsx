import { Link } from "react-router-dom";

export default function CheckEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* LEFT IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-gray-100">
          <img
            src="/images/check-email.png"
            alt="Check Email"
            className="w-80"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Check Your Email
          </h1>

          <p className="text-gray-500 text-sm mt-3">
            We sent a password reset link to your email address.
            Please check your inbox and follow the instructions.
          </p>

          <button
            disabled
            className="mt-6 w-full py-2 rounded-lg bg-blue-900 text-white opacity-80 cursor-not-allowed"
          >
            Open Gmail
          </button>

          <Link
            to="/login"
            className="mt-6 text-sm text-gray-600 hover:text-blue-700"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
