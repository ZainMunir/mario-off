import React from "react";
import {
  RouterProvider,
  createRoutesFromElements,
  Route,
  createHashRouter,
} from "react-router-dom";
import NotFound from "./components/NotFound";
import Error from "./components/Error";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login, { loader as loginLoader } from "./pages/Login";
import EmailSignup from "./pages/EmailSignup";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Competitions, {
  loader as competitionsLoader,
} from "./pages/Competitions";
import CompCreation from "./pages/CompCreation";
import CompDetails from "./pages/CompDetails";
import CompInfo from "./pages/CompInfo";
import CompRules from "./pages/CompRules";
import CompRounds from "./pages/CompRounds";
import { requireAuth } from "./util-js/requireAuth";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} loader={loginLoader} />
      <Route path="signup" element={<EmailSignup />} errorElement={<Error />} />
      <Route
        path="profile"
        element={<Profile />}
        errorElement={<Error />}
        loader={async ({ request }) => await requireAuth(request)}
      />
      <Route
        path="friends"
        element={<Friends />}
        errorElement={<Error />}
        loader={async ({ request }) => await requireAuth(request)}
      />
      <Route
        path="competitions"
        element={<Competitions />}
        errorElement={<Error />}
        loader={competitionsLoader}
      />
      <Route
        path="competitions/:id"
        element={<CompDetails />}
        errorElement={<Error />}
      >
        <Route index element={<CompInfo />} errorElement={<Error />} />
        <Route path="rules" element={<CompRules />} errorElement={<Error />} />
        <Route
          path="rounds"
          element={<CompRounds />}
          errorElement={<Error />}
        />
      </Route>
      <Route
        path="competition-creation"
        element={<CompCreation />}
        errorElement={<Error />}
        loader={async ({ request }) => await requireAuth(request)}
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
