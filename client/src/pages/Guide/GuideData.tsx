import {
  FaMicrochip,
  FaMemory,
  FaQuestionCircle,
  FaPuzzlePiece,
  FaBookOpen,
} from "react-icons/fa";
import { BsMotherboardFill, BsGpuCard } from "react-icons/bs";
import { GiComputerFan, GiPowerGenerator } from "react-icons/gi";
import React from "react";

export interface GuideArticle {
  title: string;
  icon: React.ReactElement;
  description: string;
  image: string;
  content: {
    subHeader: string;
    body: string;
  }[];
  youtubeLink?: string;
}

export interface GuideCategory {
  category: string;
  articles: Record<string, GuideArticle>;
}

export const guideData: GuideCategory[] = [
  {
    category: "Core Components",
    articles: {
      "Processor (CPU)": {
        title: "Processor (CPU)",
        icon: <FaMicrochip />,
        description:
          "The CPU is the brain of your computer, executing commands and running applications.",
        image: "/images/guide/cpu.png",
        content: [
          {
            subHeader: "What It Does",
            body: "The Central Processing Unit (CPU) performs all the calculations that allow your computer to function. Its speed (clock speed) and the number of its cores determine how well it can handle tasks.",
          },
          {
            subHeader: "Key Considerations",
            body: "The most critical factor is socket compatibility with your motherboard (e.g., AM5 for modern AMD, LGA1700 for modern Intel). Gamers often prioritize higher clock speeds, while content creators benefit from more cores for multitasking.",
          },
          {
            subHeader: "Understanding Tiers & Generations",
            body: "Both AMD (Ryzen 3, 5, 7, 9) and Intel (Core i3, i5, i7, i9) use a tier system. Higher numbers generally mean better performance. Generations (e.g., Ryzen 7000 series, Intel 13th Gen) indicate how new the technology is. Always ensure the CPU generation is compatible with your motherboard's chipset.",
          },
        ],
        youtubeLink: "https://www.youtube.com/watch?v=folG9vGKw3c",
      },
      Motherboard: {
        title: "Motherboard",
        icon: <BsMotherboardFill />,
        description:
          "The motherboard is the central hub that connects all your components together.",
        image: "/images/guide/motherboard.png",
        content: [
          {
            subHeader: "The Foundation of Your Build",
            body: "The motherboard acts as the nervous system of your PC. Its form factor (ATX, Micro-ATX, Mini-ITX) determines the size of your PC and the number of expansion slots.",
          },
          {
            subHeader: "Compatibility is Key",
            body: "Ensure your motherboard's chipset and CPU socket match your chosen processor. It also dictates the type of RAM (DDR4 or DDR5) and the number of storage drives you can install.",
          },
        ],
        youtubeLink: "https://www.youtube.com/watch?v=qGh4jT2YypE",
      },
      "Graphics Card (GPU)": {
        title: "Graphics Card (GPU)",
        icon: <BsGpuCard />,
        description:
          "The GPU renders images, video, and animations for display.",
        image: "/images/guide/gpu.png",
        content: [
          {
            subHeader: "The Visual Powerhouse",
            body: "The Graphics Processing Unit (GPU) is essential for gaming, video editing, and any visually intensive task. Its performance is determined by its core clock speed, VRAM, and architecture.",
          },
          {
            subHeader: "Choosing the Right GPU",
            body: "For gaming, the GPU is often the most important component. Consider the resolution you play at (1080p, 1440p, or 4K) and the types of games you enjoy. Ensure your Power Supply (PSU) can provide enough wattage and has the correct PCIe power connectors for your chosen card.",
          },
        ],
        youtubeLink: "https://www.youtube.com/watch?v=c3B_t-VTTfg",
      },
      "Memory (RAM)": {
        title: "Memory (RAM)",
        icon: <FaMemory />,
        description:
          "RAM provides fast, temporary storage for active applications.",
        image: "/images/guide/ram.png",
        content: [
          {
            subHeader: "Speed and Multitasking",
            body: "Random Access Memory (RAM) is your PC's short-term memory. The more RAM you have, the more applications you can run smoothly at once. RAM speed also impacts performance, especially in gaming.",
          },
          {
            subHeader: "DDR4 vs. DDR5",
            body: "Check your motherboard's specifications to see whether it supports DDR4 or DDR5 RAM—they are not interchangeable. For most modern systems, 16GB is a good starting point for gaming, while 32GB is recommended for heavy multitasking.",
          },
        ],
        youtubeLink: "https://www.youtube.com/watch?v=w_P-2_g-5dM",
      },
      "Power Supply (PSU)": {
        title: "Power Supply (PSU)",
        icon: <GiPowerGenerator />,
        description:
          "The PSU converts power from the wall outlet to usable power for your components.",
        image: "/images/guide/psu.png",
        content: [
          {
            subHeader: "The Heart of the System",
            body: "The Power Supply Unit (PSU) is a critical component for system stability. Its wattage rating determines how much power it can deliver. It's crucial to choose a PSU with enough wattage to power all your components, especially the CPU and GPU.",
          },
          {
            subHeader: "Efficiency Ratings",
            body: "PSUs come with efficiency ratings like 80+ Bronze, Gold, or Platinum. A higher rating means less energy is wasted as heat, leading to a cooler and more efficient system. Always choose a PSU from a reputable brand to ensure reliability and safety.",
          },
        ],
        youtubeLink: "https://www.youtube.com/watch?v=UZpG1FvI-p4",
      },
      Case: {
        title: "Case",
        icon: <GiComputerFan />,
        description: "The case houses and protects all your PC components.",
        image: "/images/guide/case.png",
        content: [
          {
            subHeader: "Structure and Airflow",
            body: "The PC case not only protects your components but also plays a vital role in cooling. Cases with mesh fronts and multiple fan mounts generally provide better airflow, which is essential for high-performance builds.",
          },
          {
            subHeader: "Size and Compatibility",
            body: "Cases come in different sizes (Full Tower, Mid Tower, Mini-ITX) that correspond to motherboard form factors. Ensure your case is large enough to fit your motherboard, GPU, and any large CPU coolers you plan to use.",
          },
        ],
        youtubeLink: "https://www.youtube.com/watch?v=J3s7-oD3YEc",
      },
    },
  },
  {
    category: "Learning Modes",
    articles: {
      "Free Build": {
        title: "Free Build",
        icon: <FaMicrochip />,
        description:
          "A sandbox environment to experiment with components and save your builds.",
        image: "/images/guide/free-build.png",
        content: [
          {
            subHeader: "Your Creative Sandbox",
            body: "Free Build mode is a zero-pressure environment where you can experiment with any components from our library. Drag and drop parts to create your dream PC, and get instant feedback on compatibility.",
          },
          {
            subHeader: "Save and Compare",
            body: "Once you've created a build you're proud of, you can save it to your account. This allows you to create multiple versions, compare different setups, and access your builds from anywhere.",
          },
        ],
      },
      "Quiz Mode": {
        title: "Quiz Mode",
        icon: <FaQuestionCircle />,
        description:
          "Test your hardware knowledge with a variety of interactive quizzes.",
        image: "/images/guide/quiz-mode.png",
        content: [
          {
            subHeader: "Reinforce Your Learning",
            body: "Quiz Mode is designed to help you solidify your understanding of PC components and concepts. Quizzes are created by instructors to cover specific topics, from basic definitions to advanced compatibility questions.",
          },
          {
            subHeader: "Track Your Progress",
            body: "After each quiz, you'll receive a score and a summary of your answers, helping you identify areas where you excel and topics you may need to review. This is a great way to prepare for the hands-on challenges.",
          },
        ],
      },
      "Challenge Mode": {
        title: "Challenge Mode",
        icon: <FaPuzzlePiece />,
        description:
          "Apply your knowledge by solving real-world compatibility puzzles.",
        image: "/images/guide/challenge-mode.png",
        content: [
          {
            subHeader: "Hands-On Problem Solving",
            body: "Challenge Mode takes you beyond theory. You'll be presented with a sequence of puzzles where you must select the correct components to complete a functional build. This is where you put your compatibility knowledge to the test.",
          },
          {
            subHeader: "Scoring and Progression",
            body: "Each puzzle is a one-shot attempt. You'll drag and drop parts, lock in your answer, and receive immediate feedback. Your score accumulates through the challenge, and upon completion, you'll see a final summary of your performance.",
          },
        ],
      },
      "Review Mode": {
        title: "Review Mode",
        icon: <FaBookOpen />,
        description: "Create and practice your own custom flashcard sets.",
        image: "/images/guide/review-mode.png",
        content: [
          {
            subHeader: "Personalized Learning",
            body: "Review Mode empowers you to take control of your studies. You can create unlimited sets of flashcards, each with a 'question' (front) and an 'answer' (back). This is perfect for memorizing key terms, specs, or concepts.",
          },
          {
            subHeader: "Two Ways to Practice",
            body: "Once you've created a set, you can study it in two ways: as traditional, flippable flashcards or as an auto-generated multiple-choice quiz. This flexibility allows you to learn and test yourself in the way that works best for you.",
          },
        ],
      },
    },
  },
];
