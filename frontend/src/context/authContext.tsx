import { createContext } from "react";

export interface AuthState {
    isLoggedIn: boolean;
    isBusiness: boolean;
    login: (isBusiness: boolean) => void;
    logout: () => void;
}


const AuthContext = createContext({} as AuthState);

export { AuthContext };