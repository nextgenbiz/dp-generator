"use client";

import { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";

/* 🎨 BACKGROUND THEMES */
/* 🎨 BACKGROUND THEMES */
const BG_THEMES = {
  softBlue: "#0C7779", // Teal (corporate, calm)
  softGreen: "#C75D2C", // Burnt orange (energy, leadership)
  softGray: "#1E4976", // Deep steel blue (enterprise look)
};

/* 🏢 Branch → Ring Colors */
const BRANCH_CONFIG = {
  pune: {
    bg: "#E6F4F4",
    ring: "#0C7779", // Royal blue
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    name: "Pune Branch",
  },
  chennai: {
    bg: "#FBEDE6",
    ring: "#C75D2C", // Deep blue
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
    name: "Chennai Branch",
  },
  ahmedabad: {
    bg: "#E9EFF6",
    ring: "#1E4976", // Dark blue
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    name: "Ahmedabad Branch",
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

export default function DPGeneratorSVG() {
  const size = 512;
  const radius = size / 2;
  const OUTER_RING_R = size * 0.45;
  const INNER_RING_R = size * 0.36;
  const TEXT_INSIDE_R = (OUTER_RING_R + INNER_RING_R) / 2;
  const TEXT_RING_CENTER_R = (OUTER_RING_R + INNER_RING_R) / 2;

  /* -------- STATE -------- */
  const [branch, setBranch] = useState("pune");
  const [gender, setGender] = useState("male");
  const [name, setName] = useState("Parmar Vikas");
  const [designation, setDesignation] = useState("Full-Stack Developer");
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
        backgroundColor: "#f8fafc",
        skipFonts: true,
        cacheBust: true,
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `professional-profile-${branch}-${name
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Professional Profile Badge Generator
          </h1>
          <p className="text-gray-600">
            Create corporate-style circular profile badges with studio-quality
            photos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Control Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b">
                Customize Profile Badge
              </h2>

              <div className="space-y-6">
                {/* Branch Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Branch Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(BRANCH_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setBranch(key)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          branch === key
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className="w-8 h-8 rounded-full mb-2"
                            style={{ backgroundColor: config.ring }}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {config.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Avatar
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setGender("male");
                        setUploadedImage(null);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        gender === "male" && !isUploaded
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                        👨
                      </div>
                      <span className="font-medium text-gray-700">Male</span>
                    </button>
                    <button
                      onClick={() => {
                        setGender("female");
                        setUploadedImage(null);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        gender === "female" && !isUploaded
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center">
                        👩
                      </div>
                      <span className="font-medium text-gray-700">Female</span>
                    </button>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Professional Photo
                  </label>
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                          <span className="text-blue-600 text-xl">↑</span>
                        </div>
                        <span className="text-gray-700 font-medium">
                          Upload Studio Photo
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          PNG, JPG up to 5MB
                        </span>
                      </div>
                    </label>

                    {isUploaded && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleRemoveImage}
                          className="flex-1 py-2 px-4 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                        >
                          Remove Photo
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Designation Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                    placeholder="e.g., Leadership Coach | Tech Innovator"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will appear curved around the top of the badge
                  </p>
                </div>

                {/* Image Controls */}
                {isUploaded && (
                  <div className="pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Photo Controls
                    </label>
                    <div className="space-y-4">
                      {/* Photo Adjustments */}
                      <div className="space-y-4 mt-4">
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleResetPhoto}
                            className="flex-1 py-2 px-3 bg-gray-100 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            Reset Adjustments
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* WhatsApp Preview Toggle */}

                {/* Download Button */}
                <div className="pt-6">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg ${
                      isDownloading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isDownloading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
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
                        Generating...
                      </span>
                    ) : whatsappMode ? (
                      "Download for WhatsApp"
                    ) : (
                      "Download Professional Badge"
                    )}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Downloads as high-resolution PNG (1024x1024)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 w-full text-center">
                  Preview
                </h2>

                {/* WhatsApp Preview Container */}
                <div
                  className={`relative ${
                    whatsappMode ? "p-8 bg-[#0C1317] rounded-2xl" : ""
                  }`}
                >
                  {/* WhatsApp UI Mockup */}
                  {whatsappMode && (
                    <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
                      {/* WhatsApp Header */}
                      <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                            <span className="text-white text-lg">←</span>
                          </div>
                          <div>
                            <div className="w-32 h-4 bg-gray-700 rounded mb-1"></div>
                            <div className="w-24 h-3 bg-gray-600 rounded"></div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                          <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                        </div>
                      </div>

                      {/* WhatsApp Crop Guide */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px]">
                        <div className="absolute inset-0 border-2 border-dashed border-green-400/50 rounded-full"></div>
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-green-400 text-sm bg-[#0C1317] px-3 py-1 rounded-full">
                          WhatsApp crop area
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Main SVG */}
                  <svg
                    ref={svgRef}
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className={`rounded-full shadow-xl transition-transform relative z-0 ${
                      isDragging ? "cursor-grabbing" : "cursor-grab"
                    } ${whatsappMode ? "scale-90" : ""}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={stopDragging}
                    onMouseLeave={stopDragging}
                  >
                    <defs>
                      <clipPath id="photoClip">
                        <circle cx={size / 2} cy={size / 2} r={size * 0.35} />
                      </clipPath>

                      {whatsappMode && (
                        <clipPath id="whatsappClip">
                          <circle cx={size / 2} cy={size / 2} r={size * 0.4} />
                        </clipPath>
                      )}

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
                          stopColor={branchConfig.ring}
                          stopOpacity="0.9"
                        />
                      </linearGradient>

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
                    </defs>

                    <rect width={size} height={size} fill="#f8fafc" />

                    {/* Blue ring */}
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={size * 0.45}
                      fill="url(#ringGradient)"
                    />

                    {/* Inner white border */}
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={size * 0.36}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="4"
                    />

                    {/* Profile area */}
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={size * 0.35}
                      fill={branchConfig.bg}
                    />

                    {/* Profile photo */}
                    {isUploaded ? (
                      <image
                        href={uploadedImage}
                        x={offsetX + size * 0.15}
                        y={offsetY + size * 0.15}
                        width={imageSize.width * zoomScale * 0.7}
                        height={imageSize.height * zoomScale * 0.7}
                        preserveAspectRatio="xMidYMid slice"
                        clipPath={
                          whatsappMode
                            ? "url(#whatsappClip)"
                            : "url(#photoClip)"
                        }
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
                        height={size * 0.76}
                        preserveAspectRatio="xMidYMid slice"
                        clipPath={
                          whatsappMode
                            ? "url(#whatsappClip)"
                            : "url(#photoClip)"
                        }
                        style={{
                          filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                        }}
                      />
                    )}

                    {/* Designation - Curved at TOP */}
                    <text
                      fill="#ffffff"
                      fontSize="20"
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
                      fontSize="20"
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

                    {/* Professional Profile */}
                  </svg>

                  {/* WhatsApp Tips */}
                  {whatsappMode && (
                    <div className="mt-6 p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
                      <h4 className="font-medium text-green-400 mb-2">
                        WhatsApp Tips:
                      </h4>
                      <ul className="text-sm text-green-300 space-y-1">
                        <li>• WhatsApp crops profile pictures to a circle</li>
                        <li>
                          • We've adjusted text position to avoid cropping
                        </li>
                        <li>• Download will include proper circular mask</li>
                        <li>• Preview shows actual WhatsApp UI</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Preview Info */}
                <div className="mt-6 space-y-4 w-full">
                  <div className="p-4 bg-gray-50 rounded-lg">
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
                    </div>
                  </div>

                  {/* Company Portal Element */}
                  <div className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Dashboard Preview
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-700">
                          Company Portal
                        </h4>
                        <p className="text-sm text-gray-600">
                          Welcome back, {name}
                        </p>
                      </div>
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow">
                          <svg
                            width="48"
                            height="48"
                            viewBox={`0 0 ${size} ${size}`}
                          >
                            <defs>
                              <clipPath id="dashboardPhotoClip">
                                <circle
                                  cx={size / 2}
                                  cy={size / 2}
                                  r={size * 0.35}
                                />
                              </clipPath>
                            </defs>

                            {/* Blue ring */}
                            <circle
                              cx={size / 2}
                              cy={size / 2}
                              r={size * 0.45}
                              fill={branchConfig.ring}
                            />

                            {/* Inner white border */}
                            <circle
                              cx={size / 2}
                              cy={size / 2}
                              r={size * 0.36}
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="4"
                            />

                            {/* Profile photo container */}
                            <circle
                              cx={size / 2}
                              cy={size / 2}
                              r={size * 0.35}
                              fill="#f1f5f9"
                            />

                            {/* Profile photo */}
                            {isUploaded ? (
                              <image
                                href={uploadedImage}
                                x={offsetX + size * 0.15}
                                y={offsetY + size * 0.15}
                                width={imageSize.width * zoomScale * 0.7}
                                height={imageSize.height * zoomScale * 0.7}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath="url(#dashboardPhotoClip)"
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
                                height={size * 0.7}
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
                      This is how your professional badge will appear in the
                      company portal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Professional Profile Badge Generator • Drag to reposition photo •
            Scroll to zoom • Adjust brightness, contrast, and saturation for
            perfect results
          </p>
        </div>
      </div>
    </div>
  );
}
