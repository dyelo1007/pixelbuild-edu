export const guideContent: Record<
  string,
  {
    description: string;
    subHeader1?: string;
    body1?: string;
    subHeader2?: string;
    body2?: string;
    subHeader3?: string;
    body3?: string;
    image?: string; // optional image url
    youtubeLink?: string;
  }
> = {
  // 🧠 PROCESSOR (CPU)
  "Components > Processor (CPU)": {
    description:
      "The processor (CPU) is the brain of your computer. It executes all computations and decisions that keep your system running smoothly.",
    subHeader1: "How It Works",
    body1:
      "The CPU performs billions of operations per second through the Fetch–Decode–Execute cycle. It retrieves instructions from memory, decodes them, performs calculations, and returns results.",
    subHeader2: "Choosing the right CPU",
    body2:
      "When selecting a CPU, ensure that its socket type matches your motherboard (for example, AM5 for AMD or LGA1700 for Intel). Consider your intended use: gamers benefit from higher clock speeds, while professionals handling multitasking or heavy workloads may prefer more cores. Always check that your cooler can handle the CPU’s TDP, as proper cooling is essential for stable and long-lasting performance.",
    image: "/images/guide/cpu.png",
    youtubeLink: "https://www.youtube.com/watch?v=folG9vGKw3c",
  },

 "Components > Processor (CPU) > CPU Tiers & Generations": {
  description:
    "Both AMD Ryzen and Intel Core CPUs are categorized into performance tiers — these help you understand which is best for gaming, productivity, or budget builds.",
  subHeader1: "AMD Ryzen Series",
  body1:
    "• **Ryzen 3** — Entry-level CPUs for everyday computing and light gaming.\n" +
    "• **Ryzen 5** — Mid-range chips that balance gaming and productivity.\n" +
    "• **Ryzen 7** — High-end processors for multitasking, gaming, and streaming.\n" +
    "• **Ryzen 9** — Top-tier performance for creators, professionals, and enthusiasts.\n\n" +
    "_Ryzen generations_ follow a number system (e.g., 3000, 5000, 7000), and each generation typically uses a different socket — AM4 for older models, AM5 for newer ones.",
  subHeader2: "Intel Core Series",
  body2:
    "• **Intel Core i3** — Budget CPUs ideal for office work and light gaming.\n" +
    "• **Intel Core i5** — Mid-range processors for gaming and productivity.\n" +
    "• **Intel Core i7** — High-performance CPUs for gaming, streaming, and editing.\n" +
    "• **Intel Core i9** — Premium CPUs for workstation-level performance.\n\n" +
    "_Intel generations_ are indicated by the first digits (e.g., 10th Gen = 10xxx, 13th Gen = 13xxx). Most recent chips use the **LGA1700 socket**.",
  subHeader3: "Quick Tip",
  body3:
    "When upgrading, check both the **generation** and **socket** of your motherboard — mixing an AM4 CPU with an AM5 board (or vice versa) won’t work.",
  image: "/images/guide/cpu-tiers.png",
  youtubeLink: "https://www.youtube.com/watch?v=8KkKuTCFvzI"
},

  

  // ⚙️ MOTHERBOARD
  "Components > Motherboard": {
    description:
      "The motherboard connects and powers all your computer components. It determines compatibility, upgrade potential, and system stability.",
    subHeader1: "Form Factors",
    body1:
      "Motherboards come in various sizes: ATX (standard), Micro-ATX, and Mini-ITX. Larger boards offer more expansion slots and features, while smaller ones are better for compact builds.",
    subHeader2: "Chipsets and Sockets",
    body2:
      "Each chipset defines supported CPUs, memory types, and connectivity features (e.g., PCIe lanes, USB ports). The socket must match your CPU — such as AM5 for AMD Ryzen or LGA1700 for Intel 12th/13th Gen processors.",
    subHeader3: "Choosing the Right Motherboard",
    body3:
      "When picking a motherboard, consider compatibility with your CPU, RAM, and case form factor. Also look for the number of ports, M.2 slots, and future upgrade options.",
    image: "/images/guide/motherboard.png",
    youtubeLink: "https://www.youtube.com/watch?v=qGh4jT2YypE",
  },
};
