import { AuthContext } from "../context/authContext";
import { useEffect, useState } from "react";
import { cloudPath } from "../config/config";
import axios from "axios";

export function AuthProvider({ children } : { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isBusiness, setIsBusiness] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({} as any);

    useEffect(() => {
        async function fetchAuthData() {
            try {
                let res = await axios.get(`${cloudPath}/loginInformation`, { withCredentials: true });
                setIsLoggedIn(res.data.isLoggedIn);
                setIsBusiness(res.data.isBusiness);
                setUser(res.data.user);
            } catch (err) {}
            setLoading(false);
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
      <AuthContext.Provider value={{ isLoggedIn, isBusiness, login, logout, loading, user }}>
        {children}
      </AuthContext.Provider>
    );
  }