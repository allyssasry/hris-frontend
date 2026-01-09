// src/features/auth/SignUp.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "@/styles/tailwind.css";

import AuthLayout from "@/app/layouts/AuthLayout.jsx";
import { authService } from "@/services/authService";
import logo from "@/assets/branding/logo-hris-1.png";
import illustration from "@/assets/images/auth/signupcontoh.png";
import googleLogo from "@/assets/branding/google.webp";
import api from "@/services/api";

/* ---------- small ui helpers ---------- */
function Label({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 text-xs md:text-sm font-medium text-neutral-700"
    >
      {children}
    </label>
  );
}

function TextInput({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  rightIcon,
  onRightIconClick,
}) {
  const base =
    "w-full rounded-2xl bg-white px-4 py-3 text-sm md:text-base outline-none transition-all duration-150 placeholder:text-neutral-400";
  const ok =
    "border-2 border-neutral-900/70 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const err =
    "border-2 border-red-500 hover:border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20";
  const withIcon = rightIcon ? " pr-12" : "";

  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={base + withIcon + " " + (error ? err : ok)}
      />

      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className={`absolute inset-y-0 right-2 flex items-center justify-center p-2 rounded-md transition-colors ${
            error
              ? "text-red-400 hover:text-red-600"
              : "text-neutral-400 hover:text-blue-800"
          }`}
          aria-label="toggle password visibility"
        >
          {rightIcon}
        </button>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- page component ---------- */
export default function SignUp() {
  const navigate = useNavigate();

  // form state
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",          // ← WAJIB untuk backend kamu
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // dari backend (422)

  const onChange = (e) =>
    setValues((s) => ({ ...s, [e.target.name]: e.target.value }));
  const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  // validation rules (client-side)
  const errors = useMemo(() => {
    const errs = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.firstName.trim()) errs.firstName = "First name is required.";
    if (!values.lastName.trim()) errs.lastName = "Last name is required.";

    if (!values.email.trim()) errs.email = "Email is required.";
    else if (!emailRe.test(values.email))
      errs.email = "Please enter a valid email.";

    if (!values.username.trim()) errs.username = "Username is required.";
    else if (values.username.length < 3)
      errs.username = "Minimum 3 characters.";

    if (!values.password) errs.password = "Password is required.";
    else if (values.password.length < 8)
      errs.password = "Minimum 8 characters.";

    if (!values.confirmPassword)
      errs.confirmPassword = "Please confirm your password.";
    else if (values.confirmPassword !== values.password)
      errs.confirmPassword = "Passwords do not match.";

    if (!agree) errs.agree = "You must agree to the terms.";
    return errs;
  }, [values, agree]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      password: true,
      confirmPassword: true,
      submit: true,
    });
    setSubmitError("");
    setFieldErrors({});

    if (!isValid) return;

    try {
      setLoading(true);

      // payload harus cocok dengan backend
      const payload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        username: values.username.trim().toLowerCase(),
        password: values.password,
      };

    const res = await api.post("/auth/signup", payload);

console.log("SIGNUP RESPONSE:", res.data);

const userId = res.data?.data?.id;

if (!userId) {
  setSubmitError("Signup failed. Invalid server response.");
  return;
}

localStorage.setItem("signupUserId", String(userId));
navigate("/setup-company");

    } catch (err) {
      // jika backend mengembalikan detail validasi (422)
      const fe = err?.data?.errors || err?.data?.fieldErrors;
      if (fe && typeof fe === "object") setFieldErrors(fe);
      setSubmitError(err?.data?.message || err.message || "Failed to sign up.");
    } finally {
      setLoading(false);
    }
  };

  // helper untuk gabung error client + server
  const errOf = (key) =>
    (touched[key] && errors[key]) ||
    (fieldErrors?.[key] && fieldErrors[key][0]); // array dari backend zod.flatten()

  return (
    <AuthLayout>
      {/* MOBILE ILLUSTRATION (atas) */}
      <div className="md:hidden mb-8">
        <img
          src={illustration}
          alt="Sign up illustration"
          className="mx-auto h-auto w-72"
          loading="lazy"
        />
      </div>

      <div className="grid items-start gap-10 md:grid-cols-2">
        {/* DESKTOP ILLUSTRATION (kiri) */}
        <div className="hidden md:block">
          <img
            src={illustration}
            alt="Sign up illustration"
            className="mx-auto h-auto w-[88%] max-w-xl"
            loading="lazy"
          />
        </div>

        {/* FORM */}
        <div className="mx-auto w-full max-w-xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <img src={logo} alt="HRIS" className="h-10 w-auto" />
            <a
              href="#try"
              className="text-sm font-semibold text-brand-accent underline underline-offset-4"
            >
              Try for free!
            </a>
          </div>

          <h1 className="text-[44px] leading-[1.1] font-semibold text-brand">
            Sign Up
          </h1>
          <p className="mt-2 text-neutral-700 md:text-base text-sm">
            Create your account and streamline your employee management.
          </p>

          <form className="mt-4 space-y-4" noValidate onSubmit={handleSubmit}>
            {/* Names */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col">
                <Label htmlFor="firstName">First Name</Label>
                <TextInput
                  id="firstName"
                  placeholder="Enter Your First Name"
                  value={values.firstName}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={errOf("firstName")}
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="lastName">Last Name</Label>
                <TextInput
                  id="lastName"
                  placeholder="Enter Your Last Name"
                  value={values.lastName}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={errOf("lastName")}
                />
              </div>
            </div>

            {/* Username */}
            <div className="flex flex-col">
              <Label htmlFor="username">Username</Label>
              <TextInput
                id="username"
                placeholder="Create a username"
                value={values.username}
                onChange={onChange}
                onBlur={onBlur}
                error={errOf("username")}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                placeholder="Enter Your Email"
                value={values.email}
                onChange={onChange}
                onBlur={onBlur}
                error={errOf("email")}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                value={values.password}
                onChange={onChange}
                onBlur={onBlur}
                error={errOf("password")}
                rightIcon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                onRightIconClick={() => setShowPassword((v) => !v)}
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <TextInput
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Your Password"
                value={values.confirmPassword}
                onChange={onChange}
                onBlur={onBlur}
                error={errOf("confirmPassword")}
                rightIcon={showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                onRightIconClick={() => setShowConfirm((v) => !v)}
              />
            </div>

            {/* Terms */}
            <label className="mt-1 flex items-center gap-3 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-blue-950 bg-white transition-all duration-200 hover:border-blue-800 checked:border-blue-900 checked:bg-blue-950 relative before:content-[''] before:absolute before:inset-0 before:m-auto before:rounded-full before:scale-0 before:bg-white before:transition-transform before:duration-200 checked:before:scale-[0.5]"
                aria-invalid={!!(!agree && touched.submit)}
              />
              <span className="select-none">
                I agree with the terms of use of
                <span className="font-semibold text-blue-950 ml-1">HRIS</span>
              </span>
            </label>
            {!agree && touched.submit && (
              <p className="text-xs text-red-600">
                Please agree to the terms to continue.
              </p>
            )}

            {/* Primary CTA */}
            <button
              type="submit"
              onClick={() => setTouched((t) => ({ ...t, submit: true }))}
              disabled={!isValid || loading}
              className="group mt-2 w-full rounded-full border-2 border-transparent bg-blue-950 px-6 py-3.5 text-[13px] md:text-sm font-semibold tracking-wide text-white transition-all duration-200 ease-out enabled:hover:bg-white enabled:hover:text-blue-950 enabled:hover:border-blue-950 enabled:active:bg-white enabled:active:text-blue-950 enabled:focus:outline-none enabled:focus:ring-2 enabled:focus:ring-blue-950/30 enabled:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing up..." : "SIGN UP"}
            </button>

            {/* Error submit (server) */}
            {submitError && (
              <p className="text-xs text-red-600">{submitError}</p>
            )}

            {/* Google CTA (placeholder) */}
            <button
              type="button"
              className="group w-full rounded-full border border-neutral-400 bg-white px-6 py-3 text-sm md:text-base font-medium text-neutral-900 shadow-soft transition-all duration-200 ease-out hover:bg-blue-950 hover:text-white hover:border-blue-950 active:bg-blue-950 active:text-white focus:outline-none focus:ring-2 focus:ring-blue-950/30"
            >
              <span className="inline-flex items-center justify-center gap-3">
                <img src={googleLogo} alt="Google" className="h-5 w-5" />
                Continue With Google
              </span>
            </button>

            {/* Divider + Login link */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-neutral-500"></span>
              </div>
            </div>

            <div className="text-center text-xs md:text-sm text-neutral-600">
              Already have an account?{" "}
              <a
                href="/auth/sign-in"
                className="font-semibold text-blue-950 hover:underline hover:text-blue-900 transition-colors"
              >
                Sign in here
              </a>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
