export interface User {
    id: number;
    username: string;
    email: string;
    created_on: string;
    updated_at: string;
}

export interface Question {
    id: number;
    text: string;
    hint?: string;
    index: number;
}

export interface Answer {
    id: number;
    text: string;
    index: number;
    correct: boolean;
}

export interface Game {
    id: number;
    ownerId: number;
    name: string;
    created_on: string;
    updated_at: string;
}

export interface DenormalizedAnswer extends Answer {

}

export interface DenormalizedQuestion extends Question {
    answers: DenormalizedAnswer[];
}

export interface DenormalizedGame extends Game {
    questions: DenormalizedQuestion[];
}