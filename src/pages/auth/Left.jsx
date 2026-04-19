import React from "react";

function Left() {
  return (
    <div className="hidden md:flex w-full bg-[#0d0f14] text-white flex-col justify-between p-10">
      <div className="flex items-center gap-2">
        <div className="bg-white text-black p-2 rounded-lg">🎓</div>
        <h1 className="text-xl font-semibold">Smart LMS</h1>
      </div>

      <div>
        <h2 className="text-4xl font-bold leading-tight mb-4">
          Learn at your own pace with personalized courses
        </h2>

        <p className="text-gray-400">
          Join thousands of students and instructors on our intelligent learning
          platform
        </p>

        <div className="flex gap-16 mt-10">
          <div>
            <h3 className="text-2xl font-bold">10k+</h3>
            <p className="text-gray-400 text-sm">Students</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">500+</h3>
            <p className="text-gray-400 text-sm">Courses</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">95%</h3>
            <p className="text-gray-400 text-sm">Satisfaction</p>
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-sm">
        © 2026 Smart LMS. All rights reserved.
      </p>
    </div>
  );
}

export default Left;
