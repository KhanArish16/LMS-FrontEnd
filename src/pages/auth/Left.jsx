import { GraduationCap, Sparkles, Users, BookOpen, Star } from "lucide-react";

const stats = [
  { value: "10k+", label: "Students" },
  { value: "500+", label: "Courses" },
  { value: "95%", label: "Satisfaction" },
];

const features = [
  { icon: BookOpen, text: "Structured learning paths" },
  { icon: Star, text: "Expert instructors" },
  { icon: Users, text: "Collaborative community" },
];

export default function Left() {
  return (
    <div className="hidden md:flex w-full bg-[#0a0c12] text-white flex-col justify-between p-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="flex items-center gap-2.5 relative z-10">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
          <GraduationCap size={18} className="text-white" />
        </div>
        <span className="text-[15px] font-bold tracking-tight">
          Smart<span className="text-blue-400">LMS</span>
        </span>
      </div>

      <div className="relative z-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            <Sparkles size={11} className="text-blue-400" />
            <span className="text-[11px] font-semibold text-blue-400 tracking-wide">
              INTELLIGENT LEARNING
            </span>
          </div>
          <h2 className="text-4xl font-bold leading-tight text-white">
            Learn at your own
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
              pace and style
            </span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mt-4 max-w-xs">
            Join thousands of students and instructors on our intelligent
            learning platform built for the modern age.
          </p>
        </div>

        <div className="space-y-3">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Icon size={13} className="text-blue-400" />
              </div>
              <span className="text-sm text-gray-300">{text}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-8 pt-2">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-600 text-xs relative z-10">
        © 2026 Smart LMS. All rights reserved.
      </p>
    </div>
  );
}
