// src/app/layouts/AuthLayout.jsx
import PropTypes from "prop-types";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {children}
      </div>
    </div>
  );
}
AuthLayout.propTypes = { children: PropTypes.node };
