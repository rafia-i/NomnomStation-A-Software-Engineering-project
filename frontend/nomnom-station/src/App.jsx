import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/landingpage'
import Register from './pages/register';   
import Login from './pages/login';
import Queries from './pages/queries'
import Home from './pages/home'
import Upload from './pages/upload'
import Dashboard from './pages/dashboard'
import Myrecipe from './pages/myrecipe'
import Filtered from './pages/filtered'
import Fullrecipe from './pages/fullrecipe'
import Criteria from './pages/criteria'
import Adminhome from './pages/adminhome'
import Allrecipes from './pages/allrecipes'


const router=createBrowserRouter([
  {path:"/",element:<LandingPage/>},
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/queries', element: <Queries /> },
  { path: '/home', element: <Home /> },
  { path: '/upload', element: <Upload /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/myrecipe', element: <Myrecipe /> },
  { path: '/filtered', element: <Filtered /> },
  { path: '/fullrecipe/:id', element: <Fullrecipe /> },
  { path: '/criteria', element: <Criteria /> },
  { path: '/adminhome', element: <Adminhome /> },
  { path: '/allrecipes', element: <Allrecipes /> },
])
export default function App() {
 return (
    <>
    <RouterProvider router={router}></RouterProvider>
    </>
  )
}
