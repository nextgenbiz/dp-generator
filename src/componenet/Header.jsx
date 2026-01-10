"use client";
const COMPANY_CONFIG = {
  name: "NEXT GEN",
  tagline: "Innovating Tomorrow, Today",
  logo: "/nextgen-logo.svg", // Add your company logo
  colors: {
    primary: "#0066FF", // Next Gen Blue
    secondary: "#00D4AA", // Next Gen Teal
    accent: "#FF6B35", // Next Gen Orange
    dark: "#1A1A2E",
    light: "#F8FAFF",
  },
  website: "https://www.nextgenbusiness.co.in/",
  copyright: `© ${new Date().getFullYear()} Next Gen Business. All rights reserved.`,
};
export default function Header() {
  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden mb-4 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl p-3 text-white shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <img src="/whiteLogo.png" alt="Next Gen" className="h-8 w-auto" />
          <h1 className="text-lg font-semibold">Profile Studio</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/whiteLogo.png" alt="Next Gen" className="h-10" />
              <div>
                <h1 className="text-3xl font-bold">Profile Studio</h1>
                <p className="text-blue-100">{COMPANY_CONFIG.tagline}</p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-right">
              <p className="text-sm font-medium">Internal Tool v1.1</p>
              <p className="text-xs opacity-90">For Next Gen Employees</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
