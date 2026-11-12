import { toast } from "sonner";

export interface CertificatePdfData {
  name: string;
  course: string;
  year: string;
  certId: string;
}

export function downloadStyledCertificatePdf(data: CertificatePdfData) {
  // High-resolution A4 Landscape Canvas (1754 x 1240 px @ 150 DPI)
  const width = 1754;
  const height = 1240;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    toast.error("Unable to initialize certificate renderer.");
    return;
  }

  // 1. Cream / Ivory Parchment Background + Subtle Radial Glow
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 120, width / 2, height / 2, 1050);
  bgGrad.addColorStop(0, "#fffdf8");
  bgGrad.addColorStop(1, "#f4efe4");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle Engineering Blueprint Grid Watermark
  ctx.strokeStyle = "rgba(15, 23, 42, 0.035)";
  ctx.lineWidth = 1;
  for (let x = 60; x < width - 60; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 60);
    ctx.lineTo(x, height - 60);
    ctx.stroke();
  }
  for (let y = 60; y < height - 60; y += 40) {
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(width - 60, y);
    ctx.stroke();
  }

  // 2. Outer Deep Navy Frame + Inner Metallic Gold Frame
  ctx.strokeStyle = "#0b1528";
  ctx.lineWidth = 18;
  ctx.strokeRect(42, 42, width - 84, height - 84);

  ctx.strokeStyle = "#c8962e";
  ctx.lineWidth = 4;
  ctx.strokeRect(68, 68, width - 136, height - 136);

  ctx.strokeStyle = "rgba(200, 150, 46, 0.45)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(80, 80, width - 160, height - 160);

  // Corner Gold Ornaments
  const corners = [
    [68, 68, 1, 1],
    [width - 68, 68, -1, 1],
    [68, height - 68, 1, -1],
    [width - 68, height - 68, -1, -1],
  ] as const;
  ctx.fillStyle = "#0b1528";
  for (const [cx, cy, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 58 * dx, cy);
    ctx.lineTo(cx, cy + 58 * dy);
    ctx.closePath();
    ctx.fill();
  }

  // 3. Top Dark Navy Ribbon Banner
  ctx.fillStyle = "#0b1528";
  ctx.fillRect(110, 105, width - 220, 125);

  ctx.strokeStyle = "#d4a438";
  ctx.lineWidth = 2;
  ctx.strokeRect(116, 111, width - 232, 113);

  // Brand Title inside Top Banner
  ctx.fillStyle = "#f5c542";
  ctx.font = "bold 42px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("R2G LEARN CAD", width / 2, 162);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "600 17px Arial, sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("INSTITUTE OF INDUSTRIAL DESIGN, CAD/CAM & 3D PROTOTYPING", width / 2, 194);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "500 14px Arial, sans-serif";
  ctx.fillText("ISO 9001:2015 CERTIFIED · SECTOR 35, FARIDABAD, HARYANA", width / 2, 216);

  // 4. Certificate Heading
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 56px Georgia, serif";
  ctx.fillText("CERTIFICATE OF COMPLETION", width / 2, 325);

  // Gold Decorative Divider Line
  ctx.strokeStyle = "#c8962e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 220, 350);
  ctx.lineTo(width / 2 + 220, 350);
  ctx.stroke();

  ctx.fillStyle = "#c8962e";
  ctx.beginPath();
  ctx.arc(width / 2, 350, 6, 0, Math.PI * 2);
  ctx.fill();

  // 5. Presentation Copy
  ctx.fillStyle = "#475569";
  ctx.font = "italic 25px Georgia, serif";
  ctx.fillText("This prestigious credential is proudly awarded to", width / 2, 415);

  // 6. Candidate Name (Large Highlighted Gold/Navy)
  ctx.fillStyle = "#0b1528";
  ctx.font = "bold 74px Georgia, serif";
  ctx.fillText(data.name.toUpperCase(), width / 2, 505);

  // Name Underline
  const nameWidth = Math.min(820, Math.max(420, ctx.measureText(data.name.toUpperCase()).width + 90));
  ctx.strokeStyle = "#c8962e";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - nameWidth / 2, 526);
  ctx.lineTo(width / 2 + nameWidth / 2, 526);
  ctx.stroke();

  // 7. Course Completion Description
  ctx.fillStyle = "#334155";
  ctx.font = "24px Georgia, serif";
  ctx.fillText(
    "for successfully completing the hands-on industrial engineering training program in",
    width / 2,
    585
  );

  // Course Pill Box
  ctx.fillStyle = "rgba(11, 21, 40, 0.06)";
  ctx.strokeStyle = "#c8962e";
  ctx.lineWidth = 2;
  const boxW = 920;
  const boxH = 68;
  ctx.fillRect(width / 2 - boxW / 2, 615, boxW, boxH);
  ctx.strokeRect(width / 2 - boxW / 2, 615, boxW, boxH);

  ctx.fillStyle = "#9a6b12";
  ctx.font = "bold 34px Georgia, serif";
  ctx.fillText(data.course, width / 2, 660);

  ctx.fillStyle = "#475569";
  ctx.font = "20px Arial, sans-serif";
  ctx.fillText(
    "Demonstrating proficiency in Parametric 3D Modeling, Engineering Drawing Standards (GD&T), & Capstone Prototyping.",
    width / 2,
    730
  );

  // 8. Bottom Left: Date & Credential ID + Verification QR Grid
  const leftX = 210;
  const bottomY = 960;

  // Mini QR Matrix Box
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#0b1528";
  ctx.lineWidth = 2;
  ctx.fillRect(140, 860, 110, 110);
  ctx.strokeRect(140, 860, 110, 110);

  ctx.fillStyle = "#0b1528";
  const seed = data.certId.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if ((r * 7 + c + seed) % 2 === 0 || (r < 2 && c < 2) || (r > 4 && c > 4)) {
        ctx.fillRect(152 + c * 12, 872 + r * 12, 9, 9);
      }
    }
  }

  ctx.textAlign = "left";
  ctx.fillStyle = "#64748b";
  ctx.font = "bold 15px Arial, sans-serif";
  ctx.fillText("CREDENTIAL ID", 275, 885);
  ctx.fillStyle = "#0b1528";
  ctx.font = "bold 22px Courier New, monospace";
  ctx.fillText(data.certId.toUpperCase(), 275, 913);

  ctx.fillStyle = "#64748b";
  ctx.font = "bold 15px Arial, sans-serif";
  ctx.fillText("ISSUED DATE", 275, 945);
  ctx.fillStyle = "#0b1528";
  ctx.font = "bold 20px Arial, sans-serif";
  ctx.fillText(data.year, 275, 970);

  // 9. Bottom Center: Official Circular Gold & Navy Seal
  const sealX = width / 2;
  const sealY = 935;

  // Outer Starburst / Scalloped Gold Circle
  ctx.beginPath();
  const spikes = 36;
  for (let i = 0; i < spikes * 2; i++) {
    const rad = i % 2 === 0 ? 96 : 87;
    const ang = (i * Math.PI) / spikes;
    const sx = sealX + Math.cos(ang) * rad;
    const sy = sealY + Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fillStyle = "#d4a438";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(sealX, sealY, 74, 0, Math.PI * 2);
  ctx.fillStyle = "#0b1528";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(sealX, sealY, 66, 0, Math.PI * 2);
  ctx.strokeStyle = "#f5c542";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#f5c542";
  ctx.font = "bold 14px Arial, sans-serif";
  ctx.fillText("ISO 9001:2015", sealX, sealY - 22);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 19px Georgia, serif";
  ctx.fillText("R2G VERIFIED", sealX, sealY + 5);
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 12px Arial, sans-serif";
  ctx.fillText("FARIDABAD LAB", sealX, sealY + 28);

  // 10. Bottom Right: Director Signature
  const sigX = width - 330;
  ctx.fillStyle = "#0b1528";
  ctx.font = "italic 36px Georgia, serif";
  ctx.fillText("Rajeev Sharma", sigX, 915);

  ctx.strokeStyle = "#0b1528";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sigX - 150, 932);
  ctx.lineTo(sigX + 150, 932);
  ctx.stroke();

  ctx.fillStyle = "#0b1528";
  ctx.font = "bold 17px Arial, sans-serif";
  ctx.fillText("Er. Rajeev Sharma", sigX, 958);
  ctx.fillStyle = "#64748b";
  ctx.font = "14px Arial, sans-serif";
  ctx.fillText("Principal Director · R2G Learn CAD", sigX, 980);

  // Bottom Verification URL Footer
  ctx.fillStyle = "#64748b";
  ctx.font = "14px Arial, sans-serif";
  ctx.fillText(
    `Verify authenticity online at r2glearncad.com/verify using ID: ${data.certId.toUpperCase()}`,
    width / 2,
    1125
  );

  // Convert High-Res Canvas JPEG into Valid A4 Landscape PDF Binary
  const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
  const base64 = jpegDataUrl.split(",")[1] ?? "";
  const binaryStr = atob(base64);
  const imgBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    imgBytes[i] = binaryStr.charCodeAt(i);
  }

  const pdfBytes = buildImagePdf(imgBytes, width, height);
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `R2G-Certificate-${data.name.replaceAll(/\s+/g, "-")}-${data.certId}.pdf`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  toast.success(`Official designer certificate downloaded for ${data.name}!`);
}

// Pure TypeScript A4 Landscape PDF Wrapper for Embedded JPEG Image
function buildImagePdf(jpegBytes: Uint8Array, imgW: number, imgH: number): Uint8Array {
  // A4 Landscape in PDF points (842 x 595)
  const pageW = 842;
  const pageH = 595;
  const encoder = new TextEncoder();

  const obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const obj2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im0 4 0 R >> >> /MediaBox [0 0 ${pageW} ${pageH}] /Contents 5 0 R >>\nendobj\n`;
  const obj4Header = `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
  const obj4Footer = "\nendstream\nendobj\n";
  const contentStream = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
  const obj5 = `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`;

  const header = "%PDF-1.4\n";
  const parts: Uint8Array[] = [
    encoder.encode(header),
    encoder.encode(obj1),
    encoder.encode(obj2),
    encoder.encode(obj3),
    encoder.encode(obj4Header),
    jpegBytes,
    encoder.encode(obj4Footer),
    encoder.encode(obj5),
  ];

  // Calculate byte offsets for xref
  let offset = 0;
  const offsets: number[] = [0];
  offset += parts[0]!.length; // header
  offsets.push(offset); // obj 1
  offset += parts[1]!.length;
  offsets.push(offset); // obj 2
  offset += parts[2]!.length;
  offsets.push(offset); // obj 3
  offset += parts[3]!.length;
  offsets.push(offset); // obj 4
  offset += parts[4]!.length + parts[5]!.length + parts[6]!.length;
  offsets.push(offset); // obj 5
  offset += parts[7]!.length;

  const xrefStart = offset;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  parts.push(encoder.encode(xref), encoder.encode(trailer));

  const totalLen = parts.reduce((sum, p) => sum + p.length, 0);
  const out = new Uint8Array(totalLen);
  let pos = 0;
  for (const p of parts) {
    out.set(p, pos);
    pos += p.length;
  }
  return out;
}