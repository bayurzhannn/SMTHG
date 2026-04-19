"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import type { Lesson } from "@/types";
import { formatDate } from "@/lib/utils";
import LessonResult from "@/components/LessonResult";
import { ChevronLeft } from "lucide-react";

export default function HistoryPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lesson | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseClient();
      const { data } = await supabase
        .from("lessons")
        .select("*")
        .order("created_at", { ascending: false });
      setLessons(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  if (selected) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          К списку
        </button>
        <LessonResult
          form={{
            subject: selected.subject,
            grade: selected.grade,
            topic: selected.topic,
            lesson_type: selected.lesson_type,
            duration: 45,
          }}
          content={selected.content}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">История уроков</h1>
        <p className="text-gray-500 mt-1">Все ваши сохранённые планы уроков</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <div className="text-5xl mb-4">📚</div>
          <p className="font-medium text-gray-500">Сохранённых уроков пока нет</p>
          <p className="text-sm mt-1">
            Создайте урок и нажмите «Сохранить», чтобы он появился здесь
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setSelected(lesson)}
              className="card p-5 w-full text-left hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{lesson.topic}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {lesson.subject} · {lesson.grade} класс · {lesson.lesson_type}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDate(lesson.created_at)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
