"use client";

import { useState } from "react";
import Header from "@/componenet/Header";
import Footer from "@/componenet/Footer";

const COMPANY_CONFIG = {
  tagline: "Innovating Tomorrow, Today",
  copyright: `© ${new Date().getFullYear()} Next Gen Business. All rights reserved.`,
};

const COMPANY = {
  name: "Next-Gen Business Consultancy PVT. LTD",
  logoUrl: "Final-logo.png",
  website: "www.nextgenbusiness.co.in",
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61574060610065",
    youtube: "https://youtube.com/@nextgenbusiness",
    linkedin: "https://www.linkedin.com/company/106884094/admin/dashboard/",
    instagram: "https://www.instagram.com/nextgengroup_in/",
  },
  branches: [
    {
      city: "Ahmedabad",
      address:
        "2nd Floor, President Plaza, SG Highway Thaltej Ahmedabad 380054",
    },
    {
      city: "Pune",
      address:
        "B - 102, Trade Centre, Ahura Builders, N Main Rd, Liberty Phase 2, Ragvilas Society, Koregaon Park, Pune, Maharashtra 411001",
    },
    {
      city: "Chennai",
      address:
        "46, Fanepet 1st Street, Subbu Towers, 3rd Floor, Nandanam, Chennai - 600035",
    },
  ],
  disclaimer:
    "We are a professional start-up consulting firm based in India, specializing in guiding and supporting emerging enterprises with their unique requirements. Please note that we operate solely as an independent consultancy service provider. We are not affiliated, associated, or in collaboration with any Government, Non-Government agency, institution, organization, or department.",
};

// ─── SIGNATURE HTML GENERATOR ─────────────────────────────────────────────
function generateSignatureHTML({ name, designation, phone, email, branch }) {
  const { facebook, youtube, linkedin, instagram } = COMPANY.socials;

  const branchRow = branch
    ? `<tr>
        <td style="font-size:11.5px;padding:2px 0;vertical-align:top;padding-right:8px;white-space:nowrap;">
          <span style="font-weight:700;color:#1155cc;">${branch.city}:</span>
        </td>
        <td style="font-size:11.5px;padding:2px 0;color:#333333;line-height:1.5;">${branch.address}</td>
      </tr>`
    : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#222222;width:560px;max-width:100%;">
  <tr><td style="padding-bottom:4px;color:#666666;font-size:12px;">--</td></tr>
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="vertical-align:middle;">
            <p style="margin:0 0 2px 0;font-size:21px;font-weight:700;color:#1155cc;line-height:1.2;">${name || "Your Name"}</p>
            <p style="margin:0;font-size:12.5px;color:#444444;">${designation || "Designation"} &nbsp;|&nbsp; <span style="color:#1155cc;font-weight:600;">${COMPANY.name}</span></p>
          </td>
          <td style="text-align:right;vertical-align:middle;padding-left:16px;">
            <img src="${COMPANY.logoUrl}" alt="${COMPANY.name}" width="120" height="auto" style="display:block;max-width:120px;"/>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr><td style="padding:7px 0 6px;"><hr style="border:none;border-top:1.5px solid #1155cc;margin:0;"/></td></tr>
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" border="0">
        ${phone ? `<tr><td style="font-size:12.5px;padding:2px 0;"><span style="font-weight:700;">Phone:</span>&nbsp; ${phone}</td></tr>` : ""}
        ${email ? `<tr><td style="font-size:12.5px;padding:2px 0;"><span style="font-weight:700;">Email:</span>&nbsp; <a href="mailto:${email}" style="color:#1155cc;text-decoration:none;">${email}</a></td></tr>` : ""}
      </table>
    </td>
  </tr>
  ${
    branch
      ? `
  <tr>
    <td style="padding-top:8px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td colspan="2" style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888888;padding-bottom:4px;">Branch</td>
        </tr>
        ${branchRow}
      </table>
    </td>
  </tr>`
      : ""
  }
  <tr>
<td style="padding-top:9px; padding-bottom:5px;">      
<table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="vertical-align:middle;">
            <a href="https://${COMPANY.website}" style="color:#1155cc;font-size:12.5px;font-weight:700;text-decoration:none;">${COMPANY.website}</a>
          </td>
          <td style="text-align:right;vertical-align:middle;white-space:nowrap;">
            <a href="${facebook}" style="text-decoration:none;margin-left:8px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" width="20" height="20" alt="Facebook" style="display:inline;vertical-align:middle;"/></a>
            <a href="${linkedin}" style="text-decoration:none;margin-left:8px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733561.png"   width="20" height="20" alt="LinkedIn"  style="display:inline;vertical-align:middle;"/></a>
            <a href="${instagram}"style="text-decoration:none;margin-left:8px;"><img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" width="20" height="20" alt="Instagram" style="display:inline;vertical-align:middle;"/></a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top:10px;font-size:10px;color:#666666;line-height:1.6;border-top:1px solid #eeeeee;">
      <strong>Disclaimer:</strong> ${COMPANY.disclaimer}
    </td>
  </tr>
</table>`;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────
export default function EmailSignatureGenerator() {
  const [form, setForm] = useState({
    name: "Vikas Parmar",
    designation: "Full-Stack Developer",
    phone: "9898787856",
    email: "vikasparmar@nextgenconsultancy.in",
    branchCity: "Ahmedabad",
  });
  const [copied, setCopied] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const selectedBranch =
    COMPANY.branches.find((b) => b.city === form.branchCity) || null;
  const signatureHTML = generateSignatureHTML({
    ...form,
    branch: selectedBranch,
  });

  const handleCopy = async () => {
    try {
      const blob = new Blob([signatureHTML], { type: "text/html" });
      await navigator.clipboard.write([
        new ClipboardItem({ "text/html": blob }),
      ]);
    } catch {
      await navigator.clipboard.writeText(signatureHTML);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const fields = [
    {
      name: "name",
      label: "Full Name",
      placeholder: "Vatsal Solanki",
      type: "text",
    },
    {
      name: "designation",
      label: "Designation",
      placeholder: "IT Head",
      type: "text",
    },
    {
      name: "phone",
      label: "Phone Number",
      placeholder: "+91 63576 65915",
      type: "tel",
    },
    {
      name: "email",
      label: "Email Address",
      placeholder: "vatsal@nextgenbusiness.co.in",
      type: "email",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page heading */}
        <Header tagline={COMPANY_CONFIG.tagline} />

        <div className="grid grid-cols-1 lg:grid-cols-[300px_600px] gap-28 items-start justify-center">
          {/* ── FORM ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <p className="text-[10px] font-bold tracking-[2px] uppercase text-blue-600 border-b border-slate-100 pb-2 mb-5">
              Your Details
            </p>

            {fields.map((f) => (
              <div key={f.name} className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {f.label} <span className="text-red-400">*</span>
                </label>
                <input
                  name={f.name}
                  type={f.type}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                />
              </div>
            ))}

            {/* Branch Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Branch <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="branchCity"
                  value={form.branchCity}
                  onChange={handleChange}
                  className="w-full appearance-none px-3 py-2.5 pr-8 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer"
                  style={{ color: form.branchCity ? "#1e293b" : "#94a3b8" }}
                >
                  <option value="" disabled>
                    Select branch city…
                  </option>
                  {COMPANY.branches.map((b) => (
                    <option key={b.city} value={b.city}>
                      {b.city}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M6 8L1 3h10z" />
                </svg>
              </div>

              {selectedBranch && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-blue-600">
                    📍 {selectedBranch.city}
                  </span>
                  <br />
                  {selectedBranch.address}
                </div>
              )}
            </div>
          </div>

          {/* ── PREVIEW + ACTIONS ── */}
          <div className="flex flex-col gap-4">
            {/* Gmail preview card */}
            <div className=" bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Gmail chrome */}
              <div className="bg-[#3c3c3c] px-4 py-2 flex justify-between items-center">
                <span className="text-white text-sm font-medium">
                  New Message
                </span>
                <div className="flex gap-3">
                  {["–", "⤢", "✕"].map((s) => (
                    <span
                      key={s}
                      className="text-slate-400 text-xs cursor-pointer hover:text-white transition-colors"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {["To", "Subject"].map((f) => (
                <div
                  key={f}
                  className="px-4 py-2.5 border-b border-slate-100 text-sm text-slate-300"
                >
                  {f}
                </div>
              ))}

              {/* Live signature */}
              <div className="px-5 py-5 overflow-x-auto">
                <div dangerouslySetInnerHTML={{ __html: signatureHTML }} />
              </div>

              {/* Gmail toolbar */}
              <div className="border-t border-slate-100 px-4 py-2.5 flex items-center gap-3 bg-slate-50">
                <span className="bg-[#1a73e8] text-white text-sm font-bold px-5 py-1.5 rounded">
                  Send
                </span>
                <span className="text-slate-400 text-lg leading-none font-serif">
                  A
                </span>
                {["🔗", "📎", "🖼", "😊"].map((i) => (
                  <span key={i} className="text-slate-400 text-sm">
                    {i}
                  </span>
                ))}
              </div>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`w-full py-3.5 rounded-xl text-white text-sm font-bold tracking-wide transition-all duration-300 shadow-sm ${
                copied
                  ? "bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-[0.99]"
              }`}
            >
              {copied
                ? "✅  Copied! Paste directly into Gmail / Outlook"
                : "📋  Copy HTML Signature to Clipboard"}
            </button>

            {/* Instructions */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
              <strong>Gmail:</strong> Settings ⚙ → See all settings → Signature
              → New → paste with{" "}
              <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-[11px]">
                Ctrl+V
              </code>
              <br />
              <strong>Outlook:</strong> File → Options → Mail → Signatures → New
              → paste in the editor
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
