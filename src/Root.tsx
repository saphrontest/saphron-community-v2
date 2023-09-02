import React from 'react'
import {createBrowserRouter} from 'react-router-dom'
import {CommunityDetail, Home, PostDetail, Submit} from './Pages'

const rootsArray = [
  {
    path: "/",
    element: <Home />, 
  },
  {
    path: "submit",
    element: <Submit />, 
  },
  {
    path: "submit/:communityId",
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
]

const routerOptions = {
  
}


export default createBrowserRouter(rootsArray, routerOptions)