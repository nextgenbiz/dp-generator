"use client";

import { toPng } from "html-to-image";
import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import Header from "@/componenet/Header";
import Footer from "@/componenet/Footer";

/* DATA - Initial state */

const COMPANY_CONFIG = {
  tagline: "Innovating Tomorrow, Today",
  copyright: `© ${new Date().getFullYear()} Next Gen Business. All rights reserved.`,
};

const initialData = {
  name: "PARMAR VIKAS",
  designation: "Full-Stack Developer",
  phone: "9898346774",
  email: "vikas@nextgenbusiness.co.in",
  branch: "Ahemedabad",
};

// const BRANCH_ADDRESS = {
//   Ahemedabad:
//     "2ND FLOOR, PRESIDENT PLAZA, SG HIGHWAY, THALTEJ, AHMEDABAD 380054",
//   Chennai:
//     "46, Fanepet 1st Street, Subbu Towers, 3rd Floor, Nandanam, Chennai - 600035",
//   Pune: "B - 102, Trade Centre, Ahura Builders, N Main Rd, Liberty Phase 2, Ragvilas Society, Koregaon Park, Pune, Maharashtra 411001",
// };

const BRANCH_ADDRESS = {
  Ahemedabad: [
    "2nd Floor, President Plaza, SG Highway",
    "Thaltej Ahmedabad 380054",
  ],

  Chennai: [
    "46, Fanepet 1st Street, Subbu Towers ",
    "3rd Floor, Nandanam",
    "Chennai 600035",
  ],

  Pune: [
    "B - 102, Trade Centre, Ahura Builders, N Main Rd",
    " Liberty Phase 2, Ragvilas Society, Koregaon ",
    " Park, Pune, Maharashtra 411001",
  ],
};

// Icons remain the same
const PhoneIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
    <path d="M6.6 10.8c1.5 3 3.9 5.4 6.9 6.9l2.3-2.3c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C10.3 22 2 13.7 2 3c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
  </svg>
);
const EmailIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
    <path d="M3 2l8.5 19 2.2-7.1 7.1-2.2L3 2z" />
  </svg>
);
const LocationIcon = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
    <path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
  </svg>
);

export default function BusinessCard() {
  const [formData, setFormData] = useState(initialData);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialData);
  };

  const formatAddress = (address) => {
    if (!address) return [];

    // split by comma and rebalance
    const parts = address.split(",").map((p) => p.trim());

    if (parts.length <= 3) return parts;

    return [
      parts.slice(0, 2).join(", "),
      parts.slice(2, 4).join(", "),
      parts.slice(4).join(", "),
    ];
  };

  const downloadPDF = async () => {
    if (!frontRef.current || !backRef.current) return;

    const frontPNG = await toPng(frontRef.current, {
      pixelRatio: 3,
      cacheBust: true,
      skipFonts: true,
      backgroundColor: "#1C4268",
    });

    const backPNG = await toPng(backRef.current, {
      pixelRatio: 3,
      cacheBust: true,
      skipFonts: true,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const cardWidth = 160;
    const cardHeight = 93;
    const x = (210 - cardWidth) / 2;
    const yFront = 40;
    const yBack = yFront + cardHeight + 10;

    pdf.addImage(frontPNG, "PNG", x, yFront, cardWidth, cardHeight);
    pdf.addImage(backPNG, "PNG", x, yBack, cardWidth, cardHeight);

    pdf.save(
      `business-card-${formData.name.replace(/\s+/g, "-").toLowerCase()}.pdf`,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header tagline={COMPANY_CONFIG.tagline} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                Enter Your Details
              </h2>

              <div className="space-y-7">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter your designation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                  >
                    <option value="Ahemedabad">Ahemedabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium shadow-md"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                Live Preview
              </h2>

              <div className="flex flex-col items-center justify-center space-y-8">
                {/* Front Side */}
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Front Side
                  </h3>
                  <div className="w-full flex justify-center">
                    <div className="origin-top scale-[0.8] sm:scale-[0.9] md:scale-100">
                      <div
                        ref={frontRef}
                        className="relative w-[360px] h-[210px] bg-[#1C4268] shadow-2xl overflow-hidden font-sans"
                      >
                        <div className="absolute left-0 top-0 h-full w-[14px] bg-[#c9a24d]" />

                        <div className="h-full flex flex-col items-center justify-center">
                          <img
                            src="/LOGO.png"
                            alt="Logo"
                            width={120}
                            height={120}
                            style={{ objectFit: "contain" }}
                            className="select-none"
                          />

                          <div className="mt-[4px] text-[8px] tracking-[2px] text-white uppercase text-center leading-[9px]">
                            <span className="block">
                              NEXT-GEN BUSINESS CONSULTANCY PVT. LTD.
                            </span>
                            {/* <span className="block">BUSINESS CONSULTANCY</span>
                            <span className="block">PRIVATE LIMITED</span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Back Side
                  </h3>
                  <div className="w-full flex justify-center">
                    <div className="origin-top scale-[0.8] sm:scale-[0.9] md:scale-100">
                      <div
                        ref={backRef}
                        className="relative w-[360px] h-[210px] overflow-hidden shadow-2xl font-sans bg-white"
                      >
                        {/* SVG BACKGROUND */}
                        <svg
                          viewBox="0 0 360 210"
                          className="absolute inset-0 w-full h-full"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient
                              id="blueGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#1C4268" />
                              <stop offset="100%" stopColor="#2a5285" />
                            </linearGradient>

                            <pattern
                              id="diagonalLines"
                              x="0"
                              y="0"
                              width="10"
                              height="10"
                              patternUnits="userSpaceOnUse"
                              patternTransform="rotate(45)"
                            >
                              <line
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="10"
                                stroke="#c9a24d"
                                strokeWidth="0.3"
                              />
                            </pattern>
                          </defs>

                          <rect width="360" height="210" fill="#f2f7ff" />
                          <polygon
                            points="0,0 180,0 0,222 0,210"
                            fill="url(#blueGradient)"
                          />
                          <polygon
                            points="0,0 170,0 0,210 0,210"
                            fill="url(#diagonalLines)"
                            opacity="0.15"
                          />
                          <line
                            x1="170"
                            y1="0"
                            x2="0"
                            y2="210"
                            stroke="#c9a24d"
                            strokeWidth="1.5"
                          />
                        </svg>

                        {/* LEFT */}
                        <div className="absolute left-0 top-0 w-[145px] h-full mt-4 px-4">
                          <QRCodeCanvas
                            value="https://www.nextgenbusiness.co.in"
                            size={68}
                            bgColor="transparent"
                            fgColor="#ffffff"
                            level="H"
                            className="select-none"
                          />
                        </div>

                        {/* RIGHT */}
                        <div className="absolute right-0 top-0 w-[270px] h-full px-[14px] flex flex-col justify-center text-[#1C4268]">
                          <div className="text-right mb-[14px]">
                            <h2 className="text-[15px] font-semibold tracking-[0.6px] leading-[15px]">
                              {formData.name}
                            </h2>
                            <p className="mt-[4px] text-[11px] leading-[13px]">
                              {formData.designation}
                            </p>
                          </div>

                          <div className="space-y-[6px] mb-[14px]">
                            <div className="flex justify-end items-center gap-[10px]">
                              <span className="text-[10px]">
                                +91 {formData.phone}
                              </span>
                              <div className="w-[16px] h-[16px] bg-[#1C4268] rounded flex items-center justify-center">
                                <PhoneIcon />
                              </div>
                            </div>

                            <div className="flex justify-end items-center gap-[10px]">
                              <span className="text-[10px]">
                                {formData.email}
                              </span>

                              <div className="w-[16px] h-[16px] bg-[#1C4268] rounded flex items-center justify-center shrink-0">
                                <EmailIcon />
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-[#1C4268]/30 mb-[14px]" />

                          <div className="space-y-[6px]">
                            <div className="flex justify-end items-center gap-[10px]">
                              <span className="text-[10px]">
                                www.nextgenbusiness.co.in
                              </span>
                              <div className="w-[16px] h-[16px] bg-[#1C4268] rounded flex items-center justify-center">
                                <GlobeIcon />
                              </div>
                            </div>

                            <div className="flex justify-end gap-[10px] items-start">
                              <span
                                className="flex-1 text-[8.5px] text-right block pt-1 "
                                style={{
                                  lineHeight: "12px",
                                  height: `${BRANCH_ADDRESS[formData.branch].length * 12}px`,
                                }}
                              >
                                {BRANCH_ADDRESS[formData.branch].map(
                                  (line, index) => (
                                    <span key={index} className="block">
                                      {line}
                                    </span>
                                  ),
                                )}
                              </span>

                              <div className="w-[16px] h-[16px] bg-[#1C4268] rounded flex items-center justify-center shrink-0 mt-[2px]">
                                <LocationIcon />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer
          tagline={COMPANY_CONFIG.tagline}
          copyright={COMPANY_CONFIG.copyright}
        />
      </div>
    </div>
  );
}
