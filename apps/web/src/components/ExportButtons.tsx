"use client";
import { exportToCSV, exportToPDF } from "@/lib/export";

interface Props {
  title:   string;
  headers: string[];
  rows:    (string | number)[][];
}

export function ExportButtons({ title, headers, rows }: Props) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportToPDF(title, headers, rows)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 transition">
        📄 PDF İndir
      </button>
      <button
        onClick={() => exportToCSV(title, headers, rows)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 border border-green-200 text-xs font-semibold hover:bg-green-100 transition">
        📊 Excel İndir
      </button>
    </div>
  );
}
