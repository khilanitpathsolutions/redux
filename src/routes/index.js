import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../utils/protectedRoutes";
import PublicRoutes from "../utils/publicRoutes";
import ErrorPage from "../container/error";
import useRoutes from "../hooks/useRoutes";

const Routing = () => {
  const { privateRoutes, publicRoutes, authRoutes } = useRoutes();

  return (
    <BrowserRouter>
      <Routes>
        {authRoutes(true).map((route) => (
          <Route key={route.id} path={route.path} element={<PublicRoutes />}>
            <Route index element={route.element} />
          </Route>
        ))}

        {privateRoutes(true).map((route) => (
          <Route key={route.id} path={route.path} element={<ProtectedRoute />}>
            <Route index element={route.element} />
          </Route>
        ))}

        {publicRoutes(true).map((route) => (
          <Route key={route.id} path={route.path} element={route.element} />
        ))}

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
