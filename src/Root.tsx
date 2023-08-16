import React from 'react'
import { createBrowserRouter} from 'react-router-dom'
import {CommunityDetail, Home, PostDetail, Submit} from './Pages'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, 
  },
  {
    path: "submit",
    element: <Submit />, 
  },
  {
    path: "community/:id",
    element: <CommunityDetail />, 
  },
  {
    path: "post/:id",
    element: <PostDetail />, 
  },
])

export default router