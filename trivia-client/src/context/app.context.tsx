import { createContext } from 'react';

export type TAppContext = {
    token: null | string;
    username : null | string;
    setToken: (token: string) => void,
    setUsername: (username: string) => void
}

export const AppContext = createContext<TAppContext>({
    token: null,
    username: null,
    setToken: (token: string) => {},
    setUsername: (username: string) => {}
});