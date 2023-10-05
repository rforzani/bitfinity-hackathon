import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import { businessRoutes, loggedInRoutes } from "./config/routes";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";

export default function Routes({ pages } : { pages: any }) : any {
  const routes = useRoutes(pages);
  const { isLoggedIn, isBusiness } = useContext(AuthContext);
    const routeComponents = routes.map(({ path, component: Component }) => {
        if (businessRoutes.includes(path)) {
            if (isBusiness) {
                return (<Route key={path} path={path} element={<Component />} />);    
            } else {
                return (null);
            }
        } else if (loggedInRoutes.includes(path)) {
            if (isLoggedIn) {
                return (<Route key={path} path={path} element={<Component />} />);    
            } else {
                return (null);
            }
        } else {
            if (!isLoggedIn) {
                return (<Route key={path} path={path} element={<Component />} />);
            } else {
                return (null);
            }
        }
    });

  const NotFound = routes.find(({ path }) => path === "/notFound")?.component;

  return (
    <ReactRouterRoutes>
      {routeComponents}
    </ReactRouterRoutes>
  );
}

function useRoutes(pages : any) {
  const routes = Object.keys(pages)
    .map((key) => {
      let path = key
        .replace("./pages", "")
        .replace(/\.(t|j)sx?$/, "")
        /**
         * Replace /index with /
         */
        .replace(/\/index$/i, "/")
        /**
         * Only lowercase the first letter. This allows the developer to use camelCase
         * dynamic paths while ensuring their standard routes are normalized to lowercase.
         */
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
        /**
         * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
         */
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);

      if (path.endsWith("/") && path !== "/") {
        path = path.substring(0, path.length - 1);
      }

      if (!pages[key].default) {
        console.warn(`${key} doesn't export a default React component`);
      }

      return {
        path,
        component: pages[key].default,
      };
    })
    .filter((route) => route.component);

  return routes;
}
