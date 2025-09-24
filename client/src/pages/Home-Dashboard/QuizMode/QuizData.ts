export interface QuizQuestion {
  moduleId: number;
  question: string;
  options: string[];
  answer: string;
}

export const quizData: QuizQuestion[] = [
  {
    moduleId: 1,
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Performance Utility",
      "Control Processing User",
    ],
    answer: "Central Processing Unit",
  },
  {
    moduleId: 1,
    question: "Which part of the computer is considered the brain?",
    options: ["RAM", "CPU", "GPU", "Motherboard"],
    answer: "CPU",
  },
  {
    moduleId: 2,
    question: "What does RAM stand for?",
    options: [
      "Random Access Memory",
      "Read Access Memory",
      "Rapid Action Module",
      "Random Action Memory",
    ],
    answer: "Random Access Memory",
  },
  {
    moduleId: 3,
    question: "What does RAM stand for?",
    options: [
      "Random Access Memory",
      "Read Access Memory",
      "Rapid Action Module",
      "Random Action Memory",
    ],
    answer: "Random Access Memory",
  },
];
