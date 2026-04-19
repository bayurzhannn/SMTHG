"use client";

import { useState } from "react";
import LessonForm from "@/components/LessonForm";
import LessonResult from "@/components/LessonResult";
import type { LessonFormData, LessonContent } from "@/types";

interface LessonData {
  form: LessonFormData;
  content: LessonContent;
}

export default function GeneratePage() {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Создать урок</h1>
        <p className="text-gray-500 mt-1">
          Укажите параметры урока — ИИ создаст полный план по ФГОС за несколько секунд
        </p>
      </div>

      <div className="space-y-8">
        <LessonForm onResult={setLessonData} />

        {lessonData ? (
          <LessonResult form={lessonData.form} content={lessonData.content} />
        ) : (
          <div className="card p-12 text-center text-gray-400">
            <div className="text-5xl mb-4">📝</div>
            <p className="font-medium text-gray-500">Здесь появится ваш план урока</p>
            <p className="text-sm mt-1">Заполните форму и нажмите «Создать урок»</p>
          </div>
        )}
      </div>
    </div>
  );
}
