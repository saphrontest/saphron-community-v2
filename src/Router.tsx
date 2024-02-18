import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  Home,
  Submit,
  Profile,
  AdminPage,
  AboutPage,
  SearchPage,
  PostDetail,
  SavedPosts,
  SupportGroups,
  WorkshopsPage,
  MyWorkshopsPage,
  MySupportGroups,
  CommunityDetail,
  SupportGroupDetailPage
} from './Pages'

const base = "community"

const RoutesArray = [
  { path: "/", component: Home },
  { path: "community", component: Home },
  { path: "about", component: AboutPage },
  { path: `${base}/submit`, component: Submit },
  { path: `${base}/submit/:communityId`, component: Submit },
  { path: `${base}/community-detail/:id`, component: CommunityDetail },
  { path: `${base}/post/:slug`, component: PostDetail },
  { path: `${base}/saved-posts`, component: SavedPosts },
  { path: `${base}/profile`, component: Profile },
  { path: `${base}/search`, component: SearchPage },
  { path: "workshops", component: WorkshopsPage },
  { path: "workshops/:slug", component: WorkshopsPage },
  { path: "my-workshops", component: MyWorkshopsPage },
  { path: "manager-dashboard", component: AdminPage },
  { path: "support-groups", component: SupportGroups },
  { path: "support-groups/:slug", component: SupportGroupDetailPage },
  { path: "my-support-groups", component: MySupportGroups },
]

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {RoutesArray.map(({ path, component }, index) => <Route path={path} Component={component} key={index} />)}
      </Routes>
    </BrowserRouter>
  )
}

export default Router