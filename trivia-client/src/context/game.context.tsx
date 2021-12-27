import { createContext } from "react";
import { DenormalizedGame, Game } from "trivia-shared";

export type IGameContext = DenormalizedGame;

export const GameContext = createContext<IGameContext | null>(null);