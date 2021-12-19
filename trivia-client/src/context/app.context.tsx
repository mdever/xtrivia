import { createContext } from 'react';

export type TAppContext = {
    token: null | string;
    username : null | string;
}

export const AppContext = createContext<TAppContext>({
    token: null,
    username: null
});