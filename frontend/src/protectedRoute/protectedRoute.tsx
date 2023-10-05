import { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export function ProtectedRoute({ element, key, path } : {element: any, key: any, path: any}) {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? (
    <Route key={key} path={path} element={element} />
  ) : (
    <Navigate to="/login" replace={true} />
  );
}