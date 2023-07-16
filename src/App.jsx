import React from 'react'
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom'
import Layout, { loader as layoutLoader } from './components/Layout'
import Home from './pages/Home'
import NotFound from './components/NotFound'
import Login, { loader as loginLoader, action as loginAction } from './pages/Login'
import Competitions, { loader as competitionsLoader } from './pages/Competitions'
import Error from "./components/Error"
import CompDetails, { loader as compDetailsLoader } from './pages/CompDetails'
import CompCreation, { loader as compCreationLoader } from './pages/CompCreation'

const router = createBrowserRouter(createRoutesFromElements(
  <Route
    path='/mario-off'
    element={<Layout />}
    loader={layoutLoader}
  >
    <Route index element={<Home />} />
    <Route
      path='login'
      element={<Login />}
      loader={loginLoader}
      action={loginAction}
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
    />
    <Route
      path="competition-creation"
      element={<CompCreation />}
      errorElement={<Error />}
      loader={compCreationLoader}
    />
    <Route
      path="*"
      element={<NotFound />}
    />
  </Route>
))

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App

