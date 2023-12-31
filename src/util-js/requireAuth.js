import { redirect } from "react-router-dom";
import { isLoggedIn } from "./api";

export async function requireAuth(request) {
  const url = new URL(request.url);
  const redirectTo = url.pathname + url.search;
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    throw redirect(
      `/login?message=You must log in first.&redirectTo=${redirectTo}`
    );
  }
  return null;
}
