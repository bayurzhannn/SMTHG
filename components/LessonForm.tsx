"use client";

import { useState } from "react";
import { SUBJECTS, GRADES, LESSON_TYPES, DURATIONS } from "@/types";
import type { LessonFormData, LessonContent } from "@/types";
import { Sparkles } from "lucide-react";

interface LessonFormProps {
  onResult: (data: { form: LessonFormData; content: LessonContent }) => void;
}

export default function LessonForm({ onResult }: LessonFormProps) {
  const [form, setForm] = useState<LessonFormData>({
    subject: SUBJECTS[0],
    grade: 5,
    topic: "",
    lesson_type: LESSON_TYPES[0],
    duration: 45,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) {
      setError("Введите тему урока.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Ошибка генерации урока.");
      }

      const content: LessonContent = await res.json();
      onResult({ form, content });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Параметры урока</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Предмет
          </label>
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="input-base"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Класс
          </label>
          <select
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}
            className="input-base"
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>{g} класс</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тип урока
          </label>
          <select
            value={form.lesson_type}
            onChange={(e) => setForm({ ...form, lesson_type: e.target.value })}
            className="input-base"
          >
            {LESSON_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Продолжительность
          </label>
          <select
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            className="input-base"
          >
            {DURATIONS.map((d) => (
              <option key={d} value={d}>{d} мин</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Тема урока
        </label>
        <input
          type="text"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          className="input-base"
          placeholder="Квадратные уравнения"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Создаю урок...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Создать урок
          </>
        )}
      </button>
    </form>
  );
}
