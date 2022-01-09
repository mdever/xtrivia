import { atom, selector } from "recoil";
import { DenormalizedGame } from "trivia-shared";

export const gameState = atom<DenormalizedGame | null>({
    key: 'gameState',
    default: null
});

export const ticket = atom<string | null>({
    key: 'ticket',
    default: null
});

export const chosenQuestionId = atom<number | null>({
    key: 'chosenQuestionId',
    default: null
});

export const chosenAnswerId = atom<number | null>({
    key: 'chosenAnswerId',
    default: null
});

export const chosenQuestion = selector({
    key: 'chosenQuestion',
    get: ({ get }) => {
        const game = get(gameState);
        const questionId = get(chosenQuestionId);
        return game?.questions.find(q => q.id === questionId);
    }
});

export const chosenAnswer = selector({
    key: 'chosenAnswer',
    get: ({ get }) => {
        const game = get(gameState);
        const question = get(chosenQuestion);
        const answerId = get(chosenAnswerId);

        return question?.answers.find(a => a.id === answerId);
    }
});

export const questionsForChosenGame = selector({
    key: 'questionsForChosenGame',
    get: ({ get }) => {
        const game = get(gameState);
        return game?.questions;
    }
});

export const answersForChosenQuestion = selector({
    key: 'answersForChosenQuestion',
    get: ({ get }) => {
        const question = get(chosenQuestion);
        return question?.answers;
    }
});