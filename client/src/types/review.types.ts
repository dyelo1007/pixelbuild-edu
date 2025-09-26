export interface IFlashcard {
  _id?: string;
  question: string;
  answer: string;
}

export interface IReviewSet {
  _id: string;
  title: string;
  studentId: string;
  cards: IFlashcard[];
  createdAt: string;
  updatedAt: string;
}
