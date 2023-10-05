import { AuthContext } from "../context/authContext";
import { useEffect, useState } from "react";
import { cloudPath } from "../config/config";
import axios from "axios";

export function AuthProvider({ children } : { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isBusiness, setIsBusiness] = useState(false);

    useEffect(() => {
        async function fetchAuthData() {
            let res = await axios.get(`${cloudPath}/loginInformation`, { withCredentials: true });
            setIsLoggedIn(res.data.isLoggedIn);
            setIsBusiness(res.data.isBusiness);
        }
        fetchAuthData();
    }, []);
  
    const login = (isBusiness : boolean) => {
        setIsLoggedIn(true);
        setIsBusiness(isBusiness);
    };
  
    const logout = () => {
        setIsLoggedIn(false);
        setIsBusiness(false);
    };
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, isBusiness, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }