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
const WORKSHOPS_BASE = "/workshops"
const SUPPORT_GROUPS_BASE = "/workshops"
const ADMIN_BASE = "/manager-dashboard"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>

      <Route path='/' element={<Home />} index />
      <Route path='about' element={<AboutPage />} />
      <Route path='my-workshops' element={<MyWorkshopsPage />} />
      <Route path='my-support-groups' element={<MySupportGroups />} />
      <Route path='privacy-policy' element={<Policies />} />
      <Route path='terms-conditions' element={<Policies />} />

      <Route path={BASE}>

        <Route path='/' element={<Home />} index/>
        <Route path='saved-posts' element={<SavedPosts />} />
        <Route path='profile' element={<Profile />} />
        <Route path='search' element={<SearchPage />} />

        <Route path='submit'>
          <Route path='/' element={<Submit />} index />
          <Route path=':communityId' element={<Submit />} />
        </Route>

        <Route path='community-detail/'>
          <Route index path=':communityId' element={<CommunityDetail />} loader={async ({ params: { communityId } }) => await getCommunityDetails(communityId as string)} />
        </Route>

        <Route path='post/'>
          <Route path=':slugId' element={<PostDetail />} loader={async ({ params: { slugId } }) => await getPostDetail(slugId as string)} />
          <Route index path=':slugId/:slug' element={<PostDetail />} loader={async ({ params: { slugId } }) => await getPostDetail(slugId as string)} />
        </Route>
      </Route>

      <Route path={WORKSHOPS_BASE}>
        <Route index path='/' element={<WorkshopsPage />} />
        <Route path=':slug' element={<WorkshopsPage />} />
      </Route>

      <Route path={ADMIN_BASE}>

        <Route path='/' element={<AdminPage />} index/>
        <Route path='posts' element={<AdminPostsPage />} />
        <Route path='users' element={<AdminUsersPage />} />
        <Route path='workshops' element={<AdminWorkshopsPage />} />
        <Route path='support-groups' element={<AdminSupportGroupsPage />} />
      </Route>

      <Route path={SUPPORT_GROUPS_BASE}>
        <Route path='/' element={<SupportGroups />} />
        <Route path=':slug' element={<SupportGroupDetailPage />} />
      </Route>


    </Route>
  )
)

// const RoutesArray = createBrowserRouter([
//   { path: "/", element: <Home />, index: true},
//   { path: "/profile", element: <Profile /> },
//   { path: "/search", element: <SearchPage /> },
//   { path: "/about", element: <AboutPage /> },
//   { path: "/submit", element: <Submit /> },
//   { path: "/my-support-groups", element: <MySupportGroups /> },
//   { path: "/privacy-policy", element: <Policies /> },
//   { path: "/terms-conditions", element: <Policies /> },
//   { path: "/my-workshops", element: <MyWorkshopsPage /> },
//   {
//     path: BASE,
//     element: <Home />,
//     children: [
//       {
//         path: `/`,
//         element: <Home />,
//         index: true
//       },
//       {
//         path: `/submit`,
//         element: <Submit />,
//       },
//       {
//         path: `/submit/:communityId`,
//         element: <Submit />
//       },
//       {
//         path: `/community-detail/:communityId`,
//         element: <CommunityDetail />,
//         loader: async ({ params: { communityId } }) => await getCommunityDetails(communityId as string)
//       },
//       {
//         path: `/post/:slugId/:slug`,
//         element: <PostDetail />,
//         loader: async ({ params: { slugId } }) => await getPostDetail(slugId as string)
//       },
//       {
//         path: `/saved-posts`,
//         element: <SavedPosts />
//       }
//     ]
//   },
//   {
//     path: WORKSHOPS_BASE,
//     element: <WorkshopsPage />,
//     children: [
//       {
//         path: `/`,
//         element: <WorkshopsPage />,
//         index: true
//       },
//       { path: "/:slug", element: <WorkshopsPage /> },
//     ]
//   },
//   {
//     path: SUPPORT_GROUPS_BASE,
//     element: <SupportGroups />,
//     children: [
//       {
//         path: `/`,
//         element: <SupportGroupDetailPage />,
//         index: true
//       },
//       { path: "/support-groups/:slug", element: <SupportGroupDetailPage /> },
//     ]
//   },
//   {
//     path: ADMIN_BASE,
//     element: <AdminPage />,
//     children: [
//       {
//         path: `/`,
//         element: <AdminPage />,
//       },
//       { path: `/posts`, element: <AdminPostsPage /> },
//       { path: `/users`, element: <AdminUsersPage /> },
//       { path: `/workshops`, element: <AdminWorkshopsPage /> },
//       { path: `/support-groups`, element: <AdminSupportGroupsPage /> },

//     ]
//   },
// ])

const Router = () => (
  <RouterProvider router={router} />
)

export default Router