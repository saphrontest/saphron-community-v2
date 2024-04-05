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
  SupportGroupDetailPage,
  Policies,
  AdminPostsPage,
  AdminUsersPage,
  AdminSupportGroupsPage,
  AdminWorkshopsPage,
  MarketPlace,
  RewardsPage,
  TaskTrackerPage,
  AdminTaskPage,
  MyTasks
} from './Pages'
import AdminRewardsPage from './Pages/Admin/Rewards'

const base = "community"
const adminBase = "manager-dashboard"

const RoutesArray = [
  { path: "/", component: Home },
  { path: "community", component: Home },
  { path: "about", component: AboutPage },
  { path: 'submit', component: Submit },
  { path: `${base}/submit`, component: Submit },
  { path: `${base}/submit/:communityId`, component: Submit },
  { path: `${base}/community-detail/:id`, component: CommunityDetail },
  { path: `${base}/post/:slugId/:slug`, component: PostDetail },
  { path: `${base}/saved-posts`, component: SavedPosts },
  { path: `${base}/profile`, component: Profile },
  { path: `${base}/profile/:userId`, component: Profile },
  { path: `${base}/search`, component: SearchPage },
  { path: "workshops", component: WorkshopsPage },
  { path: "workshops/:slug", component: WorkshopsPage },
  { path: "my-workshops", component: MyWorkshopsPage },
  { path: `${adminBase}`, component: AdminPage },
  { path: `/${adminBase}/posts`, component: AdminPostsPage },
  { path: `/${adminBase}/users`, component: AdminUsersPage },
  { path: `/${adminBase}/workshops`, component: AdminWorkshopsPage },
  { path: `/${adminBase}/support-groups`, component: AdminSupportGroupsPage },
  { path: `/${adminBase}/rewards`, component: AdminRewardsPage },
  { path: `/${adminBase}/task-tracker`, component: AdminTaskPage },
  { path: "support-groups", component: SupportGroups },
  { path: "support-groups/:slug", component: SupportGroupDetailPage },
  { path: "my-support-groups", component: MySupportGroups },
  { path: "privacy-policy", component: Policies },
  { path: "terms-conditions", component: Policies },
  { path: "rewards", component: RewardsPage },
  { path: "marketplace", component: MarketPlace },
  { path: "task-tracker", component: TaskTrackerPage },
  { path: "my-tasks", component: MyTasks },
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