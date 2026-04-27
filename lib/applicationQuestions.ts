export type ApplicationQuestionType =
  | "yes_no"
  | "text"
  | "single_choice";

export type ApplicationQuestion = {
  id: string;
  label: string;
  type: ApplicationQuestionType;
  required: boolean;
  options?: string[];
};

export type ApplicationAnswer = {
  questionId: string;
  question: string;
  answer: string;
};

export const PRESET_APPLICATION_QUESTIONS: ApplicationQuestion[] = [
  {
    id: "shift_3",
    label: "Tudsz 3 műszakot vállalni?",
    type: "yes_no",
    required: true,
    options: ["Igen", "Nem"],
  },
  {
    id: "experience",
    label: "Rendelkezel hasonló munkakörben szerzett tapasztalattal?",
    type: "single_choice",
    required: true,
    options: ["Nincs tapasztalatom", "Kevesebb mint 1 év", "1-2 év", "3+ év"],
  },
  {
    id: "start_date",
    label: "Mikor tudnál kezdeni?",
    type: "text",
    required: true,
  },
  {
    id: "own_car",
    label: "Van saját autód a munkába járáshoz?",
    type: "yes_no",
    required: false,
    options: ["Igen", "Nem"],
  },
  {
    id: "overtime",
    label: "Tudsz túlórát vállalni?",
    type: "yes_no",
    required: false,
    options: ["Igen", "Nem"],
  },
];

export function safeParseApplicationQuestions(value: unknown): ApplicationQuestion[] {
  if (!value || typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => {
        return (
          item &&
          typeof item.id === "string" &&
          typeof item.label === "string" &&
          typeof item.type === "string"
        );
      })
      .map((item) => ({
        id: item.id,
        label: item.label,
        type: item.type,
        required: Boolean(item.required),
        options: Array.isArray(item.options) ? item.options : undefined,
      }));
  } catch {
    return [];
  }
}

export function stringifyApplicationQuestions(
  questions: ApplicationQuestion[]
): string {
  return JSON.stringify(questions ?? []);
}

export function validateApplicationAnswers(
  questions: ApplicationQuestion[],
  answers: ApplicationAnswer[]
): string | null {
  const answerMap = new Map(
    answers.map((answer) => [answer.questionId, String(answer.answer || "").trim()])
  );

  for (const question of questions) {
    if (!question.required) continue;

    const answer = answerMap.get(question.id);

    if (!answer) {
      return `Kötelező kérdés hiányzik: ${question.label}`;
    }
  }

  return null;
}