import { IPart } from "../models/Parts";
import { ISavedBuild } from "../models/SavedBuild";

type FlashcardData = {
  question: string;
  answer: string;
};

const createCard = (question: string, answer: string): FlashcardData => ({
  question,
  answer,
});
/**
 * Generates a list of flashcards based on a populated PC build.
 * @param build A fully populated ISavedBuild document.
 * @returns An array of IFlashcard objects.
 */
export const generateReviewForBuild = async (
  build: ISavedBuild
): Promise<FlashcardData[]> => {
  const cards: FlashcardData[] = [];

  const { processor, motherboard, ram, gpu, psu } = build.parts as {
    [key: string]: IPart;
  };

  // CPU Questions
  if (processor) {
    cards.push(createCard(`What is the CPU in this build?`, processor.name));
    if (processor.specs?.socket) {
      cards.push(
        createCard(
          `What socket type does the "${processor.name}" use?`,
          processor.specs.socket
        )
      );
    }
    if (processor.specs?.tdp) {
      cards.push(
        createCard(
          `What is the TDP of the "${processor.name}"?`,
          `${processor.specs.tdp}W`
        )
      );
    }
  }

  //  Motherboard Questions
  if (motherboard) {
    cards.push(
      createCard(
        `What is the motherboard's form factor?`,
        motherboard.specs?.form_factor || "Not specified"
      )
    );
    if (motherboard.specs?.ddr && motherboard.specs?.ddr_speed) {
      cards.push(
        createCard(
          `What RAM standard does the motherboard support?`,
          `DDR${motherboard.specs.ddr} at ${motherboard.specs.ddr_speed}MHz`
        )
      );
    }
  }

  //  GPU & PSU Questions
  if (gpu && gpu.specs?.required_psu) {
    cards.push(
      createCard(
        `What is the minimum recommended PSU for the "${gpu.name}"?`,
        `${gpu.specs.required_psu}W`
      )
    );
  }
  if (psu) {
    cards.push(
      createCard(
        `What is the wattage of the Power Supply Unit (PSU)?`,
        `${psu.specs?.wattage}W`
      )
    );
  }

  //  Compatibility Questions
  if (processor?.specs?.socket && motherboard?.specs?.socket) {
    if (processor.specs.socket === motherboard.specs.socket) {
      cards.push(
        createCard(
          `Why are the CPU and motherboard compatible?`,
          `Both components support the ${processor.specs.socket} socket type.`
        )
      );
    } else {
      cards.push(
        createCard(
          `Identify the main compatibility issue between the CPU and motherboard.`,
          `The CPU's socket (${processor.specs.socket}) does not match the motherboard's socket (${motherboard.specs.socket}).`
        )
      );
    }
  }

  return cards;
};
