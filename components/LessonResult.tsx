"use client";

import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import type { LessonFormData, LessonContent } from "@/types";
import ExportButton from "./ExportButton";
import { createSupabaseClient } from "@/lib/supabase";

interface LessonResultProps {
  form: LessonFormData;
  content: LessonContent;
}

export default function LessonResult({ form, content }: LessonResultProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");

    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setSaveError("Войдите в аккаунт, чтобы сохранить урок.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("lessons").insert({
      user_id: user.id,
      subject: form.subject,
      grade: form.grade,
      topic: form.topic,
      lesson_type: form.lesson_type,
      content,
    });

    if (error) {
      setSaveError("Ошибка сохранения. Попробуйте ещё раз.");
    } else {
      setSaved(true);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {form.topic}
          </h2>
          <p className="text-sm text-gray-500">
            {form.subject} · {form.grade} класс · {form.lesson_type} · {form.duration} мин
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton form={form} content={content} />
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="flex items-center gap-2 btn-primary"
          >
            {saved ? (
              <><CheckCircle className="w-4 h-4" /> Сохранено</>
            ) : (
              <><Save className="w-4 h-4" />{saving ? "Сохранение..." : "Сохранить"}</>
            )}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {saveError}
        </div>
      )}

      {/* Цели урока */}
      <Section title="Цели урока">
        <ul className="space-y-2">
          {content.objectives.map((obj, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-primary-600 font-semibold mt-0.5">{i + 1}.</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* План урока */}
      <Section title="План урока (по этапам)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-500 font-medium">Этап</th>
                <th className="text-left py-2 pr-4 text-gray-500 font-medium w-20">Мин</th>
                <th className="text-left py-2 text-gray-500 font-medium">Деятельность</th>
              </tr>
            </thead>
            <tbody>
              {content.plan.map((stage, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-gray-800 align-top whitespace-nowrap">
                    {stage.stage}
                  </td>
                  <td className="py-2.5 pr-4 text-primary-600 font-semibold align-top">
                    {stage.duration}′
                  </td>
                  <td className="py-2.5 text-gray-600 align-top">
                    {stage.activity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Задания */}
      <Section title="Задания (3 уровня сложности)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskCard level="Базовый" color="green" text={content.tasks.easy} />
          <TaskCard level="Средний" color="yellow" text={content.tasks.medium} />
          <TaskCard level="Высокий" color="red" text={content.tasks.hard} />
        </div>
      </Section>

      {/* Домашнее задание */}
      <Section title="Домашнее задание">
        <p className="text-sm text-gray-700 whitespace-pre-line">{content.homework}</p>
      </Section>

      {/* Критерии оценки */}
      <Section title="Критерии оценки">
        <p className="text-sm text-gray-700 whitespace-pre-line">{content.assessment}</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function TaskCard({
  level,
  color,
  text,
}: {
  level: string;
  color: "green" | "yellow" | "red";
  text: string;
}) {
  const colors = {
    green: "bg-green-50 border-green-200 text-green-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[color]}`}>
      <div className="font-semibold text-xs uppercase tracking-wide mb-2">{level}</div>
      <p className="text-sm text-gray-700 whitespace-pre-line">{text}</p>
    </div>
  );
}
