import React from "react";

const AuthImagePattern = ({ title, text }) => {
  return (
    <div className="items-center justify-center text-white/70">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square bg-slate-600 rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{text}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
