"use client";

export default function Footer({ tagline, copyright }) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center md:text-left">
        {/* LEFT */}
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">NG</span>
          </div>
          <div>
            <p className="font-bold text-gray-800">Next Gen Business</p>
            <p className="text-sm text-gray-600">{tagline}</p>
          </div>
        </div>

        {/* CENTER */}
        <div className="text-center">
          <p className="text-xs text-gray-400 italic leading-snug">
            Developed with <span className="not-italic text-blue-500">🩵</span>{" "}
            by Digital Team
            <br className="hidden sm:block" />
            at NextGen Business Consultancy Private Limited
          </p>
        </div>

        {/* RIGHT */}
        <div className="text-center md:text-right">
          <p className="text-sm text-gray-500">{copyright}</p>
          <p className="text-xs text-gray-400 mt-1">
            Profile Generator v1.1 • For internal company use only
          </p>
        </div>
      </div>
    </div>
  );
}
