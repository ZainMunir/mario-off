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
      loader={competitionsLoader}
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

