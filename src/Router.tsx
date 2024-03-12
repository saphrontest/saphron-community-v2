import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
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
  AdminWorkshopsPage
} from './Pages'
import { getCommunityDetails, getPostDetail } from './Helpers'

const BASE = "community"
const WORKSHOPS_BASE = "workshops"
const SUPPORT_GROUPS_BASE = "workshops"
const ADMIN_BASE = "manager-dashboard"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>

      <Route element={<Home />} index />
      <Route path='about' element={<AboutPage />} />
      <Route path='my-workshops' element={<MyWorkshopsPage />} />
      <Route path='my-support-groups' element={<MySupportGroups />} />
      <Route path='privacy-policy' element={<Policies />} />
      <Route path='terms-conditions' element={<Policies />} />

      <Route path={BASE} element={<Home />}>

        <Route path='saved-posts' element={<SavedPosts />} />
        <Route path='profile' element={<Profile />} />
        <Route path='search' element={<SearchPage />} />

        <Route path='submit'>
          <Route element={<Submit />} index />
          <Route path=':communityId' element={<Submit />} />
        </Route>

        <Route path='community-detail'>
          <Route
          path=':communityId'
          element={<CommunityDetail />}
          loader={async ({ params: { communityId } }) => {
            return await getCommunityDetails(communityId as string)
          }}
          />
        </Route>

        <Route path='post'>
          <Route
          path=':slugId' 
          element={<PostDetail />}
          loader={async ({ params: { slugId } }) => {
            return await getPostDetail(slugId as string)
          }}
          />
          <Route
          path=':slugId/:slug'
          element={<PostDetail />}
          loader={async ({ params: { slugId } }) => {
            return await getPostDetail(slugId as string)
          }}
          />
        </Route>
      </Route>

      <Route path={WORKSHOPS_BASE} element={<WorkshopsPage />}>
        <Route path=':slug' element={<WorkshopsPage />} />
      </Route>
      
      <Route path={ADMIN_BASE} element={<AdminPage />}>
        <Route path='posts' element={<AdminPostsPage />} />
        <Route path='users' element={<AdminUsersPage />} />
        <Route path='workshops' element={<AdminWorkshopsPage />} />
        <Route path='support-groups' element={<AdminSupportGroupsPage />} />
      </Route>
      
      <Route path={SUPPORT_GROUPS_BASE} element={<SupportGroups />}>
        <Route path=':slug' element={<SupportGroupDetailPage />} />
      </Route>


    </Route>
  )
)

const Router = () => (
  <RouterProvider router={router} />
)

export default Router