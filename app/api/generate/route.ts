import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { getFgosContext } from "@/lib/fgos";
import type { LessonFormData, LessonContent } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: LessonFormData = await req.json();
    const { subject, grade, topic, lesson_type, duration } = body;

    if (!subject || !grade || !topic || !lesson_type || !duration) {
      return NextResponse.json({ error: "Заполните все поля." }, { status: 400 });
    }

    const fgosContext = getFgosContext(subject, grade);

    const prompt = `Ты опытный методист российской школы. Ты создаёшь учебные материалы строго по ФГОС.
Предмет: ${subject}, Класс: ${grade}, УМК: стандартный российский учебник.
Требования ФГОС для данного предмета и класса: ${fgosContext}
Отвечай только на русском языке.

Создай подробный план урока по следующим параметрам:
- Предмет: ${subject}
- Класс: ${grade}
- Тема: ${topic}
- Тип урока: ${lesson_type}
- Продолжительность: ${duration} минут

Верни ТОЛЬКО валидный JSON без markdown-обёртки и без пояснений:
{
  "objectives": ["цель 1", "цель 2", "цель 3"],
  "plan": [
    {"stage": "Название этапа", "duration": 5, "activity": "Описание деятельности учителя и учеников"}
  ],
  "tasks": {
    "easy": "Задание базового уровня (подробно)",
    "medium": "Задание среднего уровня (подробно)",
    "hard": "Задание высокого уровня (подробно)"
  },
  "homework": "Текст домашнего задания",
  "assessment": "Критерии оценки работы учеников на уроке"
}

Требования:
- objectives: минимум 3 цели (предметные, метапредметные, личностные по ФГОС)
- plan: все этапы урока с хронометражем, сумма duration = ${duration} минут
- tasks: задания трёх уровней сложности по теме урока
- homework: конкретное д/з с номерами задач или описанием
- assessment: чёткие критерии по ФГОС`;

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    let content: LessonContent;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON not found");
      content = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Не удалось разобрать ответ от ИИ. Попробуйте ещё раз." },
        { status: 500 }
      );
    }

    return NextResponse.json(content);
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера. Попробуйте позже." },
      { status: 500 }
    );
  }
}
