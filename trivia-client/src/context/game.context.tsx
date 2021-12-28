import { atom } from "recoil";
import { DenormalizedGame } from "trivia-shared";

export const gameState = atom<DenormalizedGame | null>({
    key: 'gameState',
    default: null
});