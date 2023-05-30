import { useState, useEffect } from "react";
import { EVENTS } from "../utils/consts";
import { match } from "path-to-regexp";

export const Router = ({
  routes = [],
  defaultComponent: DefaultComponent = () => <h1>404</h1>,
}) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener(EVENTS.PUSH_STATE, onLocationChange);
    window.addEventListener(EVENTS.POP_STATE, onLocationChange);

    return () => {
      window.removeEventListener(EVENTS.PUSH_STATE, onLocationChange);
      window.removeEventListener(EVENTS.POP_STATE, onLocationChange);
    };
  }, []);

  let routeParams = {};

  const Page = routes.find((route) => {
    if (route.path === currentPath) return true;

    const matcherUrl = match(route.path, { encode: encodeURI });
    const matched = matcherUrl(currentPath);
    if (!matched) return false;

    routeParams = matched.params;

    return true;
  })?.Component;

  return Page ? (
    <Page routeParams={routeParams} />
  ) : (
    <DefaultComponent routeParams={routeParams} />
  );
};