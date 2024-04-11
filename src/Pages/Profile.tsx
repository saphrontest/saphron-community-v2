import { useParams } from "react-router-dom"
import { MyProfile, Nav, UserProfile } from "../Components"
import { useEffect, useState } from "react"
import { useCommunity, usePost } from "../Hooks"
import { Community, IPost, IUser } from "../Interface"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { setCommunities } from "../redux/slices/communitySlice"

const Profile = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const {getSavedPostsByUser} = usePost()
  const {getCommunities} = useCommunity()
  
  const user: IUser = useSelector((state: RootState) => state.user)

  const [savedPosts, setSavedPosts] = useState<IPost[]>([])

  useEffect(() => {
  if(user.id) {

    getSavedPostsByUser(user.id)
      .then(result => setSavedPosts(result))

  } else {

    //? if user is not logged in, the `CommunitySelect` will not be rendered,
    //? this is why we need to re-fetch communities

    getCommunities()
      .then(res => dispatch(setCommunities(res as Community[])))
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <>
      <Nav />
        {
          params.userId ?
            <UserProfile userId={params.userId} savedPosts={savedPosts} /> :
            <MyProfile savedPosts={savedPosts} /> 
        }
    </>
  )
}

export default Profile