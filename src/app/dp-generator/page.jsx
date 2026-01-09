"use client";

import { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";

/* 🏢 NEXT GEN COMPANY CONFIG */
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

/* 🎨 BACKGROUND THEMES - Updated with company colors */
const BG_THEMES = {
  softBlue: "#0C7779", // Teal (corporate, calm) - Keep original
  softGreen: "#C75D2C", // Burnt orange (energy, leadership) - Keep original
  softGray: "#1E4976", // Deep steel blue (enterprise look) - Keep original
};

/* 🏢 Branch → Ring Colors - Keep original colors, update gradients only */
const BRANCH_CONFIG = {
  pune: {
    bg: "#E6F4F4", // Keep original
    ring: "#0C7779", // Royal blue - Keep original
    gradient: "linear-gradient(135deg, #0C7779 0%, #0A5F60 100%)", // Updated using ring color
    name: "Pune Branch",
    address: "Next Gen Tech Park, Pune",
  },
  chennai: {
    bg: "#FBEDE6", // Keep original
    ring: "#C75D2C", // Deep blue - Keep original
    gradient: "linear-gradient(135deg, #C75D2C 0%, #A64B24 100%)", // Updated using ring color
    name: "Chennai Branch",
    address: "Next Gen Innovation Center, Chennai",
  },
  ahmedabad: {
    bg: "#E9EFF6", // Keep original
    ring: "#1E4976", // Dark blue - Keep original
    gradient: "linear-gradient(135deg, #1E4976 0%, #153458 100%)", // Updated using ring color
    name: "Ahmedabad Branch",
    address: "Next Gen Development Hub, Ahmedabad",
  },
};
/* 🔠 Auto font size for long text */
function getAutoFontSize(text, max = 18, min = 12) {
  if (!text) return max;
  const len = text.length;
  if (len <= 18) return max;
  if (len >= 32) return min;

  const scale = (len - 18) / (32 - 18);
  return Math.round(max - scale * (max - min));
}

export default function NextGenProfileGenerator() {
  // Text sizing (easy to tweak)

  const size = 512;
  const radius = size / 2;

  const DESIGNATION_FONT_SIZE = size * 0.048; // try 0.036 → 0.042
  const NAME_FONT_SIZE = size * 0.048; // try 0.040 → 0.048

  const WATERMARK_TEXT = COMPANY_CONFIG.name; // "NEXT GEN"
  const WATERMARK_FONT_SIZE = size * 0.03; // tweak 0.020–0.026
  const WATERMARK_OPACITY = "rgba(255, 255, 255, 0.3)";

  //const PROFILE_R = size * 0.4; // updated profile circle radius
  // const PROFILE_X = radius - PROFILE_R;
  // const PROFILE_Y = radius - PROFILE_R;
  const RING_OUTER_R = size * 0.5;
  const RING_THICKNESS = size * 0.11; // ⬅ increase this value
  const RING_INNER_R = RING_OUTER_R - RING_THICKNESS;

  // Text (always centered in ring)
  const TEXT_RING_CENTER_R = (RING_OUTER_R + RING_INNER_R) / 2;

  const PROFILE_GAP = size * 0.01;
  const PROFILE_R = RING_INNER_R - PROFILE_GAP;

  // Image positioning
  const PROFILE_X = radius - PROFILE_R;
  const PROFILE_Y = radius - PROFILE_R;
  /* -------- STATE -------- */
  const [branch, setBranch] = useState("pune");
  const [gender, setGender] = useState("male");
  const [name, setName] = useState("Parmar Vikas");
  const [designation, setDesignation] = useState("Full-Stack Developer");
  const [department, setDepartment] = useState("Technology");
  const [employeeId, setEmployeeId] = useState("NGT-2024-001");
  const [uploadedImage, setUploadedImage] = useState(null);
  const isUploaded = Boolean(uploadedImage);
  const [imageSize, setImageSize] = useState({ width: size, height: size });
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [zoomOffset, setZoomOffset] = useState(0);
  const zoomScale = 1 + zoomOffset / 160;
  const [fitMode, setFitMode] = useState("fit");
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [whatsappMode, setWhatsappMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(105);
  const [saturation, setSaturation] = useState(110);
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [useCompanyTheme, setUseCompanyTheme] = useState(true);

  const svgRef = useRef(null);
  const fileInputRef = useRef(null);

  const branchConfig = BRANCH_CONFIG[branch];

  const avatarSrc = uploadedImage
    ? uploadedImage
    : gender === "male"
    ? "/male.png"
    : "/female.png";

  /* -------- IMAGE UPLOAD -------- */
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setImageSize({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        setUploadedImage(reader.result);
        setOffsetX(0);
        setOffsetY(0);
        setZoomOffset(0);
        setFitMode("fit");
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* -------- DRAG -------- */
  const handleMouseDown = (e) => {
    if (!isUploaded) return;
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isUploaded) return;

    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;

    setOffsetX((prev) => prev + dx);
    setOffsetY((prev) => prev + dy);

    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const stopDragging = () => setIsDragging(false);

  /* -------- SCROLL ZOOM -------- */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const wheelHandler = (e) => {
      if (!isUploaded) return;

      e.preventDefault();
      setZoomOffset((prev) => {
        const next = prev + (e.deltaY < 0 ? 2 : -2);
        return Math.max(-100, Math.min(100, next));
      });
    };

    svg.addEventListener("wheel", wheelHandler, { passive: false });
    return () => {
      svg.removeEventListener("wheel", wheelHandler);
    };
  }, [isUploaded]);

  /* -------- PRELOAD IMAGES -------- */
  useEffect(() => {
    // Preload default images
    const preloadImages = () => {
      const maleImg = new Image();
      maleImg.src = "/male.png";

      const femaleImg = new Image();
      femaleImg.src = "/female.png";

      // Preload company logo if available
      if (COMPANY_CONFIG.logo) {
        const logoImg = new Image();
        logoImg.src = COMPANY_CONFIG.logo;
      }
    };

    preloadImages();
  }, []);

  /* -------- DOWNLOAD FUNCTION -------- */
  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const svg = svgRef.current;

      const dataUrl = await toPng(svg, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: COMPANY_CONFIG.colors.light,
        skipFonts: true,
        cacheBust: true,
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `nextgen-profile-${branch}-${name
        .toLowerCase()
        .replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert(
        "Failed to generate image. Please make sure all images are loaded and try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  /* -------- RESET PHOTO -------- */
  const handleResetPhoto = () => {
    setOffsetX(0);
    setOffsetY(0);
    setZoomOffset(0);
    setBrightness(100);
    setContrast(105);
    setSaturation(110);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Company Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              {/* Company Logo */}
              <div className="w-30 h-14  flex items-center justify-center">
                <img
                  src="/whiteLogo.png"
                  alt="Next Gen"
                  className="w-30 h-10"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold"> Profile Studio</h1>
                <p className="text-blue-100">{COMPANY_CONFIG.tagline}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-sm font-medium">Internal Tool v1.1</p>
                <p className="text-xs opacity-90">For Next Gen Employees</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Control Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  Profile Configuration
                </h2>
                <span className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  NEXT GEN
                </span>
              </div>

              <div className="space-y-6">
                {/* Branch Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-lg">🏢</span> Branch Location
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(BRANCH_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setBranch(key)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          branch === key
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-300 hover:shadow"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className="w-10 h-10 rounded-full mb-2 flex items-center justify-center"
                            style={{ backgroundColor: config.ring }}
                          >
                            <span className="text-white text-xs font-bold">
                              NG
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            {config.name.split(" ")[0]}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">📸</span> Professional Photo
                  </h3>

                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />

                    {!isUploaded ? (
                      <label
                        htmlFor="image-upload"
                        className="block w-full p-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer text-center bg-white"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center mb-3">
                            <span className="text-white text-2xl">↑</span>
                          </div>
                          <span className="text-gray-800 font-semibold text-lg">
                            Upload Professional Photo
                          </span>
                          <span className="text-sm text-gray-600 mt-2">
                            Recommended: 512×512 PNG, Studio Quality
                          </span>
                          <div className="mt-3 flex gap-2">
                            <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                              Corporate
                            </span>
                            <span className="text-xs px-3 py-1 bg-teal-100 text-teal-700 rounded-full">
                              Professional
                            </span>
                            <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                              HD Required
                            </span>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-4 bg-white rounded-lg border flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
                              <img
                                src={uploadedImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                Photo Uploaded
                              </p>
                              <p className="text-sm text-gray-600">
                                Ready for editing
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveImage}
                            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            Change
                          </button>
                        </div>

                        {/* Image Controls */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Brightness
                              </label>
                              <input
                                type="range"
                                min="50"
                                max="150"
                                value={brightness}
                                onChange={(e) => setBrightness(e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Contrast
                              </label>
                              <input
                                type="range"
                                min="50"
                                max="150"
                                value={contrast}
                                onChange={(e) => setContrast(e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Saturation
                              </label>
                              <input
                                type="range"
                                min="50"
                                max="150"
                                value={saturation}
                                onChange={(e) => setSaturation(e.target.value)}
                                className="w-full"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={handleResetPhoto}
                              className="flex-1 py-2 px-3 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                              Reset Adjustments
                            </button>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="flex-1 py-2 px-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-sm font-medium"
                            >
                              Upload New
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & Designation */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 bg-white"
                      placeholder="Employee Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 bg-white"
                      placeholder="e.g., Senior Developer"
                    />
                  </div>
                </div>

                {/* Company Settings */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">⚙️</span> Company Settings
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-700">
                        Include Next Gen Watermark
                      </span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={includeWatermark}
                          onChange={(e) =>
                            setIncludeWatermark(e.target.checked)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`block w-12 h-6 rounded-full transition-colors ${
                            includeWatermark ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            includeWatermark ? "transform translate-x-6" : ""
                          }`}
                        ></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-700">
                        Use Company Color Theme
                      </span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={useCompanyTheme}
                          onChange={(e) => setUseCompanyTheme(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`block w-12 h-6 rounded-full transition-colors ${
                            useCompanyTheme ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            useCompanyTheme ? "transform translate-x-6" : ""
                          }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Download Section */}
                <div className="pt-4 border-t">
                  <div className="space-y-4">
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className={`w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                        isDownloading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isDownloading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin h-6 w-6 mr-3 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Generating Next Gen Profile...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center text-lg">
                          <span className="mr-2">🚀</span>
                          Download Professional Badge
                          <span className="ml-2">↓</span>
                        </span>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>High-resolution 1024×1024 PNG</span>
                      <span>•</span>
                      <span>Next Gen Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full border border-gray-200">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex items-center justify-between w-full mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Live Preview
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-3 py-1 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full">
                      REAL-TIME
                    </span>
                    <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {branch.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Main Preview Container */}
                <div className="relative mb-8">
                  {/* Company Badge */}

                  <svg
                    ref={svgRef}
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className={`rounded-full shadow-2xl transition-transform relative z-0 ${
                      isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={stopDragging}
                    onMouseLeave={stopDragging}
                  >
                    <defs>
                      <clipPath id="photoClip">
                        <circle cx={radius} cy={radius} r={PROFILE_R} />{" "}
                      </clipPath>

                      <linearGradient
                        id="ringGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor={branchConfig.ring} />
                        <stop
                          offset="100%"
                          stopColor={
                            useCompanyTheme
                              ? COMPANY_CONFIG.colors.secondary
                              : branchConfig.ring
                          }
                          stopOpacity="0.9"
                        />
                      </linearGradient>

                      {/* Add company pattern if enabled */}
                      {useCompanyTheme && (
                        <pattern
                          id="companyPattern"
                          patternUnits="userSpaceOnUse"
                          width="20"
                          height="20"
                          patternTransform="rotate(45)"
                        >
                          <rect
                            width="10"
                            height="10"
                            fill="white"
                            fillOpacity="0.1"
                          />
                          <rect
                            x="10"
                            y="10"
                            width="10"
                            height="10"
                            fill="white"
                            fillOpacity="0.1"
                          />
                        </pattern>
                      )}

                      <path
                        id="textPathTopInside"
                        d={`
    M ${radius - TEXT_RING_CENTER_R} ${radius}
    A ${TEXT_RING_CENTER_R} ${TEXT_RING_CENTER_R} 0 0 1
      ${radius + TEXT_RING_CENTER_R} ${radius}
  `}
                        fill="none"
                      />

                      <path
                        id="textPathBottomInside"
                        d={`
    M ${radius - TEXT_RING_CENTER_R} ${radius}
    A ${TEXT_RING_CENTER_R} ${TEXT_RING_CENTER_R} 0 0 0
      ${radius + TEXT_RING_CENTER_R} ${radius}
  `}
                        fill="none"
                      />

                      <path
                        id="textPathLeftInside"
                        d={`
    M ${radius} ${radius + TEXT_RING_CENTER_R}
    A ${TEXT_RING_CENTER_R} ${TEXT_RING_CENTER_R} 0 0 1
      ${radius} ${radius - TEXT_RING_CENTER_R}
  `}
                        fill="none"
                      />

                      <path
                        id="textPathRightInside"
                        d={`
    M ${radius} ${radius - TEXT_RING_CENTER_R}
    A ${TEXT_RING_CENTER_R} ${TEXT_RING_CENTER_R} 0 0 1
      ${radius} ${radius + TEXT_RING_CENTER_R}
  `}
                        fill="none"
                      />
                    </defs>

                    <rect
                      width={size}
                      height={size}
                      fill={COMPANY_CONFIG.colors.light}
                    />

                    {/* Company pattern overlay */}
                    {useCompanyTheme && (
                      <rect
                        width={size}
                        height={size}
                        fill="url(#companyPattern)"
                      />
                    )}

                    {/* Main ring with company gradient */}
                    {/* Main ring */}
                    <circle
                      cx={radius}
                      cy={radius}
                      r={RING_OUTER_R}
                      fill="url(#ringGradient)"
                    />

                    {/* Inner white border */}
                    <circle
                      cx={radius}
                      cy={radius}
                      r={RING_INNER_R}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="4"
                    />

                    {/* Profile background */}
                    <circle
                      cx={radius}
                      cy={radius}
                      r={PROFILE_R}
                      fill={branchConfig.bg}
                    />

                    {/* Profile photo */}
                    {isUploaded ? (
                      <image
                        href={uploadedImage}
                        x={PROFILE_X + offsetX}
                        y={PROFILE_Y + offsetY}
                        width={imageSize.width * zoomScale}
                        height={imageSize.height * zoomScale}
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="url(#photoClip)"
                        style={{
                          filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                        }}
                      />
                    ) : (
                      <image
                        href={avatarSrc}
                        x={size * 0.15}
                        y={size * 0.15}
                        width={size * 0.7}
                        height={size * 0.81}
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="url(#photoClip)"
                        style={{
                          filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                        }}
                      />
                    )}

                    {/* Designation - Curved at TOP */}
                    <text
                      fill="#ffffff"
                      fontSize={DESIGNATION_FONT_SIZE}
                      fontFamily="Arial, sans-serif"
                      fontWeight="700"
                      letterSpacing="1px"
                      dominantBaseline="middle"
                    >
                      <textPath
                        href="#textPathTopInside"
                        startOffset="50%"
                        textAnchor="middle"
                        dy="1"
                      >
                        {designation.toUpperCase()}
                      </textPath>
                    </text>

                    {/* Name - Curved at BOTTOM */}
                    <text
                      fill="#ffffff"
                      fontSize={NAME_FONT_SIZE}
                      fontFamily="Arial, sans-serif"
                      fontWeight="700"
                      letterSpacing="1.5px"
                      dominantBaseline="middle"
                    >
                      <textPath
                        href="#textPathBottomInside"
                        startOffset="50%"
                        textAnchor="middle"
                        dy="1"
                      >
                        {name.toUpperCase()}
                      </textPath>
                    </text>

                    {/* Company Watermark */}
                    {includeWatermark && (
                      <text
                        fill={WATERMARK_OPACITY}
                        fontSize={WATERMARK_FONT_SIZE}
                        fontFamily="Arial, sans-serif"
                        fontWeight="700"
                        letterSpacing="3px"
                        dominantBaseline="middle"
                      >
                        <textPath
                          href="#textPathLeftInside"
                          startOffset="50%"
                          textAnchor="middle"
                        >
                          {COMPANY_CONFIG.name.toUpperCase()}
                        </textPath>
                      </text>
                    )}

                    {includeWatermark && (
                      <text
                        fill={WATERMARK_OPACITY}
                        fontSize={WATERMARK_FONT_SIZE}
                        fontFamily="Arial, sans-serif"
                        fontWeight="700"
                        letterSpacing="3px"
                        dominantBaseline="middle"
                      >
                        <textPath
                          href="#textPathRightInside"
                          startOffset="50%"
                          textAnchor="middle"
                        >
                          {COMPANY_CONFIG.name.toUpperCase()}
                        </textPath>
                      </text>
                    )}
                  </svg>

                  {/* Interactive Controls Hint */}
                  {isUploaded && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-center gap-4 text-sm text-blue-700">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🖱️</span>
                          <span>Drag to reposition</span>
                        </div>
                        <div className="h-4 w-px bg-blue-300"></div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎯</span>
                          <span>Scroll to zoom</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Info Dashboard */}
                <div className="w-full space-y-4">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Branch Style:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ background: branchConfig.ring }}
                          />
                          <span className="font-medium text-gray-700">
                            {branchConfig.name}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Photo:</span>
                        <p className="font-medium mt-1 text-gray-700">
                          {isUploaded ? "Custom Upload" : `Default (${gender})`}
                        </p>
                      </div>
                    </div>{" "}
                  </div>

                  {/* Company Portal Preview */}
                  <div className="border rounded-xl p-4 bg-white shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-blue-600">🏢</span>
                      Next Gen Company Portal
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          Welcome, {name}
                        </h4>
                        <p className="text-sm text-gray-600">{designation}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded">
                            {branchConfig.name.split(" ")[0]}
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                          <svg
                            width="64"
                            height="64"
                            viewBox={`0 0 ${size} ${size}`}
                          >
                            <defs>
                              <clipPath id="dashboardPhotoClip">
                                <circle cx={radius} cy={radius} r={PROFILE_R} />
                              </clipPath>
                            </defs>

                            <circle
                              cx={size / 2}
                              cy={size / 2}
                              r={size * 0.45}
                              fill={branchConfig.ring}
                            />

                            <circle
                              cx={size / 2}
                              cy={size / 2}
                              r={size * 0.36}
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="4"
                            />

                            <circle
                              cx={size / 2}
                              cy={size / 2}
                              r={size * 0.35}
                              fill="#f1f5f9"
                            />

                            {isUploaded ? (
                              <image
                                href={uploadedImage}
                                x={PROFILE_X + offsetX}
                                y={PROFILE_Y + offsetY}
                                width={imageSize.width * zoomScale}
                                height={imageSize.height * zoomScale}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#photoClip)"
                                style={{
                                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                                }}
                              />
                            ) : (
                              <image
                                href={avatarSrc}
                                x={size * 0.15}
                                y={size * 0.15}
                                width={size * 0.7}
                                height={size * 0.81}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#dashboardPhotoClip)"
                                style={{
                                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                                }}
                              />
                            )}
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Your profile appears across all Next Gen platforms
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Footer */}
        {/* Company Footer */}
        {/* Company Footer */}
        {/* Company Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            {/* LEFT */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NG</span>
              </div>
              <div>
                <p className="font-bold text-gray-800">Next Gen Business</p>
                <p className="text-sm text-gray-600">
                  {COMPANY_CONFIG.tagline}
                </p>
              </div>
            </div>

            {/* CENTER */}
            <div className="text-center">
              <p className="text-xs text-gray-400 italic leading-snug">
                Developed with{" "}
                <span className="not-italic text-blue-500">🩵</span> by Digital
                Team
                <br className="hidden sm:block" />
                at NextGen Business Consultancy Private Limited
              </p>
            </div>

            {/* RIGHT */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">
                {COMPANY_CONFIG.copyright}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Profile Generator v1.1 • For internal company use only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
