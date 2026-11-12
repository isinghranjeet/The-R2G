export function isValidMobile(value: string): boolean {
  return /^\d{10}$/.test(value);
}

export function isValidDemoOtp(value: string): boolean {
  return value === "1234";
}

export function buildPlainTextPdf(lines: string[]): string {
  const escape = (text: string) =>
    text.replace(/[^\x20-\x7e]/g, " ").replace(/([\\()])/g, "\\$1");
  const commands = ["BT", "/F1 16 Tf", "48 790 Td", `(${escape(lines[0] ?? "R2G LEARN CAD")}) Tj`];
  lines.slice(1).forEach((line) => commands.push("0 -24 Td", `/F1 11 Tf`, `(${escape(line)}) Tj`));
  commands.push("ET");
  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let document = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(document.length);
    document += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = document.length;
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    document += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  return `${document}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
}