"use client";

import { useState, useEffect, useRef } from "react";
import { toPng, toJpeg } from "html-to-image";

/* 🎨 BACKGROUND THEMES */
const BG_THEMES = {
  softBlue: "#0C7779",
  softGreen: "#C75D2C",
  softGray: "#1E4976",
};

/* 🏢 Branch → Background + Badge */
const BRANCH_CONFIG = {
  pune: {
    bg: "softBlue",
    badge: "rgba(12,119,121,0.82)",
    name: "Pune Branch",
  },
  chennai: {
    bg: "softGreen",
    badge: "rgba(199, 93, 44,0.82)",
    name: "Chennai Branch",
  },
  ahmedabad: {
    bg: "softGray",
    badge: "rgba(30, 73, 118,0.82)",
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

  /* -------- STATE -------- */
  const [branch, setBranch] = useState("pune");
  const [gender, setGender] = useState("male");
  const [name, setName] = useState("Vikas  Parmar");
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
  const svgRef = useRef(null);
  const fileInputRef = useRef(null);

  const branchConfig = BRANCH_CONFIG[branch];

  const avatarSrc = uploadedImage
    ? uploadedImage
    : gender === "male"
    ? "male.png"
    : "female.png";

  /* -------- BADGE -------- */
  const badgeWidth = 430;
  const badgeHeight = 65;
  const badgeX = (size - badgeWidth) / 2;
  const badgeY = size - badgeHeight - 20;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Profile Picture Generator
          </h1>
          <p className="text-gray-600">
            Create professional display pictures with customizable backgrounds
            and badges
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Control Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b">
                Customize Profile
              </h2>

              <div className="space-y-6">
                {/* Branch Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Branch
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
                            style={{ backgroundColor: config.badge }}
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
                    Upload Custom Image
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
                          Click to upload image
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          PNG, JPG, WEBP up to 5MB
                        </span>
                      </div>
                    </label>

                    {isUploaded && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleRemoveImage}
                          className="flex-1 py-2 px-4 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                        >
                          Remove Image
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Designation Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800"
                    placeholder="Enter designation"
                  />
                </div>

                {/* Image Controls */}
                {isUploaded && (
                  <div className="pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Image Controls
                    </label>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setFitMode("fit")}
                          className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                            fitMode === "fit"
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          Fit
                        </button>
                        <button
                          onClick={() => setFitMode("fill")}
                          className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                            fitMode === "fill"
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          Fill
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Zoom</span>
                          <span>{Math.round(zoomScale * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={zoomOffset}
                          onChange={(e) =>
                            setZoomOffset(parseInt(e.target.value))
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                        />
                      </div>

                      <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium mb-1">Tips:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Drag image to reposition</li>
                          <li>Use mouse wheel to zoom</li>
                          <li>Use slider for precise zoom</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Column - Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 w-full text-center">
                  Preview
                </h2>

                <div className="relative">
                  <svg
                    ref={svgRef}
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className={`rounded-full shadow-xl transition-transform ${
                      isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={stopDragging}
                    onMouseLeave={stopDragging}
                  >
                    <defs>
                      <clipPath id="avatarClip">
                        <circle cx={radius} cy={radius} r={radius} />
                      </clipPath>
                    </defs>

                    <circle
                      cx={radius}
                      cy={radius}
                      r={radius}
                      fill={BG_THEMES[branchConfig.bg]}
                    />

                    {isUploaded && (
                      <image
                        href={uploadedImage}
                        x={offsetX}
                        y={offsetY}
                        width={imageSize.width * zoomScale}
                        height={imageSize.height * zoomScale}
                        preserveAspectRatio={
                          fitMode === "fit" ? "xMidYMid meet" : "xMidYMid slice"
                        }
                        clipPath="url(#avatarClip)"
                      />
                    )}

                    {!isUploaded && (
                      <image
                        href={avatarSrc}
                        x="0"
                        y="35"
                        width={size}
                        height={size}
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="url(#avatarClip)"
                      />
                    )}

                    <rect
                      x={badgeX}
                      y={badgeY}
                      width={badgeWidth}
                      height={badgeHeight}
                      fill={branchConfig.badge}
                    />

                    <text
                      x={size / 2}
                      y={badgeY + 28}
                      textAnchor="middle"
                      fontSize={getAutoFontSize(name, 22, 14)}
                      fill="#FFFFFF"
                      fontWeight="600"
                      letterSpacing="0.4px"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.7)" }}
                    >
                      {name}
                    </text>

                    <text
                      x={size / 2}
                      y={badgeY + 48}
                      textAnchor="middle"
                      fontSize={getAutoFontSize(designation, 16, 11)}
                      fill="#F1F5F9"
                      letterSpacing="0.3px"
                      style={{ textShadow: "0 1px 1px rgba(0,0,0,0.6)" }}
                    >
                      {designation}
                    </text>
                  </svg>

                  {/* Preview Info */}
                  {/* Preview Info */}
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Branch:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: branchConfig.badge }}
                            />
                            <span className="font-medium text-gray-700">
                              {branchConfig.name}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Image:</span>
                          <p className="font-medium mt-1 text-gray-700">
                            {isUploaded
                              ? "Custom Upload"
                              : `Default (${gender})`}
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
                              viewBox={`0 0 ${size} ${size}`} // Same viewBox as main preview!
                            >
                              <defs>
                                <clipPath id="dashboardAvatarClip">
                                  <circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={size / 2}
                                  />
                                </clipPath>
                              </defs>

                              {/* Background - same as main */}
                              <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={size / 2}
                                fill={BG_THEMES[branchConfig.bg]}
                              />

                              {/* Image - EXACT SAME PARAMETERS as main preview */}
                              {isUploaded && (
                                <image
                                  href={uploadedImage}
                                  x={offsetX}
                                  y={offsetY}
                                  width={imageSize.width * zoomScale}
                                  height={imageSize.height * zoomScale}
                                  preserveAspectRatio={
                                    fitMode === "fit"
                                      ? "xMidYMid meet"
                                      : "xMidYMid slice"
                                  }
                                  clipPath="url(#dashboardAvatarClip)"
                                />
                              )}

                              {!isUploaded && (
                                <image
                                  href={avatarSrc}
                                  x="0"
                                  y="35"
                                  width={size}
                                  height={size}
                                  preserveAspectRatio="xMidYMid slice"
                                  clipPath="url(#dashboardAvatarClip)"
                                />
                              )}
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        This is how your profile will appear in the company
                        portal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="pt-6">
          <button
            onClick={async () => {
              try {
                const svg = svgRef.current;

                // Convert SVG to PNG with high quality
                const dataUrl = await toPng(svg, {
                  quality: 1.0, // Maximum quality
                  pixelRatio: 2, // 2x resolution for crisp image
                  backgroundColor: BG_THEMES[branchConfig.bg], // Fallback background
                  skipFonts: true, // Don't try to load fonts
                  cacheBust: true, // Bust cache for images
                  includeQueryParams: true, // Include query params for images
                });

                // Trigger download
                const a = document.createElement("a");
                a.href = dataUrl;
                a.download = `profile-${branch}-${name
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
              }
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            {whatsappMode ? "Download PNG for WhatsApp" : "Download PNG"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Drag to reposition image • Scroll to zoom • Upload your own photo or
            use default avatars
          </p>
        </div>
      </div>
    </div>
  );
}
