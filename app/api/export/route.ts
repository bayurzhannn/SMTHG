import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import type { LessonFormData, LessonContent } from "@/types";

function heading(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_2): Paragraph {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 240, after: 120 },
  });
}

function para(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 24 })],
    spacing: { after: 80 },
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 24 })],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { form, content }: { form: LessonFormData; content: LessonContent } = await req.json();

    const noBorder = {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    };

    const planTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Этап", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Мин", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Деятельность", bold: true })] })] }),
          ],
        }),
        ...content.plan.map(
          (stage) =>
            new TableRow({
              children: [
                new TableCell({ children: [para(stage.stage)] }),
                new TableCell({ children: [para(String(stage.duration))] }),
                new TableCell({ children: [para(stage.activity)] }),
              ],
            })
        ),
      ],
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: "ПЛАН УРОКА", bold: true, size: 32 })],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${form.subject} · ${form.grade} класс · ${form.lesson_type} · ${form.duration} мин`,
                  size: 24,
                  color: "666666",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 360 },
            }),

            new Paragraph({
              children: [new TextRun({ text: `Тема: ${form.topic}`, bold: true, size: 28 })],
              spacing: { after: 240 },
            }),

            heading("1. Цели урока"),
            ...content.objectives.map(bullet),

            heading("2. План урока"),
            planTable,

            heading("3. Задания"),
            new Paragraph({ children: [new TextRun({ text: "Базовый уровень", bold: true, size: 24 })], spacing: { before: 160, after: 60 } }),
            para(content.tasks.easy),
            new Paragraph({ children: [new TextRun({ text: "Средний уровень", bold: true, size: 24 })], spacing: { before: 160, after: 60 } }),
            para(content.tasks.medium),
            new Paragraph({ children: [new TextRun({ text: "Высокий уровень", bold: true, size: 24 })], spacing: { before: 160, after: 60 } }),
            para(content.tasks.hard),

            heading("4. Домашнее задание"),
            para(content.homework),

            heading("5. Критерии оценки"),
            para(content.assessment),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="lesson.docx"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Ошибка экспорта" }, { status: 500 });
  }
}
