import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeClosed,
  Loader2,
  Lock,
  Mail,
  MessageCircleHeart,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const { signUp, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullname || !formData.email || !formData.password) {
      return toast.error("All fields are required!");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long!");
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Please enter a valid email address!");
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success) {
      signUp(formData);
      setFormData({
        fullname: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side*/}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:border-t-4 border-slate-800">
        <div className="w-full max-w-md space-y-8 bg-slate-400 rounded-xl lg:rounded-br-[5rem] lg:rounded-tl-[5rem] py-4 px-6 shadow-sm shadow-black">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="my-2 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageCircleHeart className="size-20 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="size-5 text-base-content/40" />
                  ) : (
                    <EyeClosed className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link
                to="/login"
                className="link link-primary no-underline font-bold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className="hidden lg:flex flex-col justify-center items-center p-6 sm:p-12  bg-slate-800">
        <AuthImagePattern
          title="Join our community"
          text="Connect with friends, share moments, and stay in touch with your loved ones."
        />
      </div>
    </div>
  );
};

export default SignUp;
