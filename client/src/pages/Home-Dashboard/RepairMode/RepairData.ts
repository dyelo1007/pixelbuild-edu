export type ComponentSet = {
  CPU: string;
  Motherboard: string;
  RAM: string;
  GPU: string;
  Storage: string;
  PSU: string;
};

export type RepairScenario = {
  title: string;
  description: string;
  components: ComponentSet;
  replacementParts: string[];
  correctPart: {
    slot: keyof ComponentSet; // "Motherboard"
    value: string; // "Intel Z690"
  };
  explanation: string;
};

export const repairScenarios: RepairScenario[] = [
  {
    //1
    title: "PC Fails to Boot",
    description:
      "This PC doesn’t turn on. The motherboard’s socket type doesn’t match the CPU. Find the incompatible motherboard and replace it.",
    components: {
      CPU: "Intel Core i9",
      Motherboard: "AMD B550",
      RAM: "16GB DDR4",
      GPU: "RTX 3070",
      Storage: "1TB NVMe SSD",
      PSU: "750W Gold",
    },
    replacementParts: ["Intel Z690", "AMD Ryzen 5", "650W Bronze"],
    correctPart: { slot: "Motherboard", value: "Intel Z690" },
    explanation:
      "The AMD B550 motherboard isn’t compatible with Intel Core i9. Replacing it with an Intel Z690 ensures socket compatibility.",
  },

  {
    title: "Frequent System Crashes",
    description:
      "The system randomly crashes when under load. The issue points to insufficient power delivery.",
    components: {
      CPU: "AMD Ryzen 7",
      Motherboard: "MSI X570",
      RAM: "32GB DDR4",
      GPU: "RTX 3080",
      Storage: "1TB NVMe SSD",
      PSU: "450W Bronze",
    },
    replacementParts: ["750W Gold", "16GB DDR4", "Intel i5"],
    correctPart: { slot: "PSU", value: "750W Gold" },
    explanation:
      "The RTX 3080 requires a much stronger PSU. Upgrading to a 750W Gold prevents crashes caused by power shortages.",
  },

  {
    title: "No Display on Boot",
    description:
      "The PC powers on but there’s no display. The graphics card is incompatible with the motherboard slot type.",
    components: {
      CPU: "Intel i7",
      Motherboard: "ASUS H410",
      RAM: "16GB DDR4",
      GPU: "RTX 4090",
      Storage: "512GB SSD",
      PSU: "650W Gold",
    },
    replacementParts: ["RTX 2060", "AMD B550", "500W Bronze"],
    correctPart: { slot: "GPU", value: "RTX 2060" },
    explanation:
      "The ASUS H410 motherboard doesn’t fully support the RTX 4090. A mid-range card like RTX 2060 ensures proper compatibility.",
  },

  {
    title: "Storage Not Detected",
    description:
      "The PC boots but the storage drive is not recognized. The issue lies in using the wrong storage type.",
    components: {
      CPU: "Intel i5",
      Motherboard: "Gigabyte B460",
      RAM: "8GB DDR4",
      GPU: "GTX 1660",
      Storage: "SATA HDD 1TB",
      PSU: "500W Bronze",
    },
    replacementParts: ["1TB NVMe SSD", "RTX 3060", "16GB DDR4"],
    correctPart: { slot: "Storage", value: "1TB NVMe SSD" },
    explanation:
      "The old SATA HDD is outdated and may not be supported well. Replacing it with an NVMe SSD ensures fast and reliable storage.",
  },
];
