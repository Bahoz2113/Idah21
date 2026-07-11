/**
 * PDF ve Excel export yardımcıları
 * PDF: window.print() ile tarayıcı yazdırma (tablo formatı)
 * Excel: CSV olarak indir (Excel'de açılır)
 */

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const BOM = "\uFEFF"; // Türkçe karakter desteği
  const csvContent = [
    headers.join(";"),
    ...rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";")),
  ].join("\n");

  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToPDF(title: string, headers: string[], rows: (string | number)[][]) {
  const tableRows = rows.map(r =>
    `<tr>${r.map(c => `<td style="padding:6px 10px;border:1px solid #ddd;font-size:12px">${c ?? ""}</td>`).join("")}</tr>`
  ).join("");

  const html = `
    <!DOCTYPE html><html><head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; color: #1a1a2e; }
      h1 { font-size: 18px; margin-bottom: 4px; }
      .meta { font-size: 11px; color: #666; margin-bottom: 16px; }
      table { border-collapse: collapse; width: 100%; }
      th { background: #1a1a2e; color: white; padding: 8px 10px; text-align: left; font-size: 12px; }
      tr:nth-child(even) { background: #f5f5f5; }
      @media print { button { display: none; } }
    </style>
    </head><body>
    <h1>${title}</h1>
    <div class="meta">CEZERİ ROBOTECH — ${new Date().toLocaleDateString("tr-TR", {day:"numeric",month:"long",year:"numeric"})}</div>
    <table>
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
    </body></html>
  `;

  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
}
