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
import Profile from "./pages/Profile";
import Competitions, {
  loader as competitionsLoader,
} from "./pages/Competitions";
import CompDetails, { loader as compDetailsLoader } from "./pages/CompDetails";
import CompInfo from "./pages/CompInfo";
import CompRules from "./pages/CompRules";
import CompRounds from "./pages/CompRounds";
import CompCreation from "./pages/CompCreation";
import Friends from "./pages/Friends";
import { requireAuth } from "./util-js/requireAuth";
import EmailSignup from "./pages/EmailSignup";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} loader={loginLoader} />
      <Route
        path="profile"
        element={<Profile />}
        errorElement={<Error />}
        loader={async ({ request }) => await requireAuth(request)}
      />
      <Route path="signup" element={<EmailSignup />} errorElement={<Error />} />
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
        loader={compDetailsLoader}
      >
        <Route
          index
          element={<CompInfo />}
          errorElement={<Error />}
          loader={async ({ request }) => await requireAuth(request)}
        />
        <Route
          path="rules"
          element={<CompRules />}
          errorElement={<Error />}
          loader={async ({ request }) => await requireAuth(request)}
        />
        <Route
          path="rounds"
          element={<CompRounds />}
          errorElement={<Error />}
          loader={async ({ request }) => await requireAuth(request)}
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

/*
Ideas for functionality of the app
- Use game api to have a dropdown list of games for the "name" field, and if something is chosen from the dropdown, get the associated cover that way
- Figure out storing images in the firestore database (if possible), and then either use the database image or the link depending on which it is
- Can also show local preview of all information before creating the item (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#examples)
- If image storing is possible, allow users to upload profile pics (default to first letter of username?). See if linked accounts allow for using of profile pics from the linked account itself
- Similar to friend-codes for nintendo for adding other users to competition? Or just usernames, if that's possible. Then there would be a link between userid and username or something. Database security hard.
- Make styling screensize dependent (last thing probably, because it'd be an entire overhaul of the tailwind css)

Tangentially related ideas
- Auto compile with gh-pages (`npm run deploy`) on github whenever there's a push to main
- Make source code public once done, and add it to my main github.io home page (potentially spruce that up too now)
- Android / iOS? React native is a thing apparently
*/
