import React from "react";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex lg:grid lg:grid-cols-2 bg-white">
      {/* Left Side: Hero Section (Visible on Desktop) */}
      <div className="hidden lg:flex bg-zinc-950 p-16 flex-col justify-between relative overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="z-10">
          <div className="flex items-center gap-3 mb-20">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-zinc-950" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Smart LMS
            </span>
          </div>

          <h1 className="text-6xl font-bold text-white leading-[1.1] mb-6">
            Elevate your <br />
            <span className="text-zinc-500">learning journey.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
            Join a global community of learners and master new skills with our
            industry-leading platform.
          </p>
        </div>

        {/* Bottom Stats or Copyright */}
        <div className="z-10 flex gap-12">
          <div>
            <p className="text-2xl font-bold text-white">10k+</p>
            <p className="text-zinc-500 text-sm">Students</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">500+</p>
            <p className="text-zinc-500 text-sm">Courses</p>
          </div>
          <p className="text-zinc-600 text-xs mt-auto ml-auto">
            © 2026 Smart LMS. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side: Content Section */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </div>
    </div>
  );
}
