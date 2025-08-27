export const guideContent: Record<
  string,
  {
    description: string;
    subHeader1?: string;
    body1?: string;
    subHeader2?: string;
    body2?: string;
    image?: string; // optional image url
    youtubeLink?: string;
  }
> = {
  "Components > Processor (CPU)": {
    description:
      "The processor (CPU) is the brain of your PC. It handles all core computations and affects overall system performance.",
    subHeader1: "How it Works",
    body1:
      "The CPU executes instructions from programs by performing basic arithmetic, logic, control, and input/output operations.",
    subHeader2: "Choosing the Right CPU",
    body2:
      "When selecting a CPU, consider factors such as core count, clock speed, compatibility with the motherboard, and intended use case (gaming, productivity, etc).",
    image: "/images/guide/cpu.png", // <-- placeholder
    youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  "Components > Motherboard": {
    description:
      "The motherboard connects all components together. It determines compatibility and expansion options.",
    subHeader1: "Form Factors",
    body1:
      "Motherboards come in different sizes such as ATX, Micro-ATX, and Mini-ITX. The form factor affects case size and expansion slots.",
    subHeader2: "Chipsets",
    body2:
      "Chipsets define the features of the motherboard, such as supported CPUs, overclocking, and connectivity options.",
    image: "/images/guide/motherboard.png",
    youtubeLink: "",
  },
};
