"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { LessonFormData, LessonContent } from "@/types";

interface ExportButtonProps {
  form: LessonFormData;
  content: LessonContent;
}

export default function ExportButton({ form, content }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, content }),
      });

      if (!res.ok) throw new Error("Ошибка экспорта");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Урок_${form.subject}_${form.grade}кл_${form.topic}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Не удалось экспортировать файл. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      {loading ? "Экспорт..." : "Скачать DOCX"}
    </button>
  );
}
