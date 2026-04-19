"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { SUBJECTS, GRADES } from "@/types";
import type { Profile } from "@/types";
import { CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data ?? { id: user.id });
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Войдите в аккаунт."); setSaving(false); return; }

    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({ ...profile, id: user.id });

    if (upsertError) {
      setError("Ошибка сохранения. Попробуйте ещё раз.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="card p-8 animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-500 mt-1">Профиль учителя и параметры по умолчанию</p>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
          <input
            type="text"
            value={profile.name ?? ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="input-base"
            placeholder="Иванова Мария Петровна"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Школа</label>
          <input
            type="text"
            value={profile.school ?? ""}
            onChange={(e) => setProfile({ ...profile, school: e.target.value })}
            className="input-base"
            placeholder="МБОУ «Школа №1»"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Город</label>
          <input
            type="text"
            value={profile.city ?? ""}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            className="input-base"
            placeholder="Москва"
          />
        </div>

        <hr className="border-gray-200" />
        <p className="text-sm font-medium text-gray-600">Параметры по умолчанию</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Предмет</label>
            <select
              value={profile.default_subject ?? ""}
              onChange={(e) => setProfile({ ...profile, default_subject: e.target.value })}
              className="input-base"
            >
              <option value="">Не выбран</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Класс</label>
            <select
              value={profile.default_grade ?? ""}
              onChange={(e) => setProfile({ ...profile, default_grade: Number(e.target.value) || undefined })}
              className="input-base"
            >
              <option value="">Не выбран</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>{g} класс</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saved ? (
            <><CheckCircle className="w-4 h-4" /> Сохранено</>
          ) : saving ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
