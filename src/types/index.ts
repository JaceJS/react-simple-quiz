export interface Question {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export interface QuizState {
    questions: Question[];
    currentQuestionIndex: number;
    answers: string[];
    timeLeft: number;
}
