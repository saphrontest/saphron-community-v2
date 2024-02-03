import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CommunityDetail, Home, PostDetail, SavedPosts, Submit, Profile, SearchPage, WorkshopsPage, MyWorkshopsPage, AdminWorkshops } from './Pages'

const RoutesArray = [
  { path: "/", component: Home },
  { path: "submit", component: Submit },
  { path: "submit/:communityId", component: Submit },
  { path: "community-detail/:id", component: CommunityDetail },
  { path: "post/:slug", component: PostDetail },
  { path: "saved-posts", component: SavedPosts },
  { path: "profile", component: Profile },
  { path: "search", component: SearchPage },
  { path: "workshops", component: WorkshopsPage },
  { path: "workshops/:slug", component: WorkshopsPage },
  { path: "my-workshops", component: MyWorkshopsPage },
  { path: "workshops/admin", component: AdminWorkshops },

]

const Router = () => {
  return (
    <BrowserRouter basename="/community">
      <Routes>
        {RoutesArray.map(({ path, component }, index) => <Route path={path} Component={component} key={index} />)}
      </Routes>
    </BrowserRouter>
  )
}

export default Router