import { useParams } from "react-router-dom"
import { MyProfile, Nav, UserProfile } from "../Components"
import { useEffect, useState } from "react"
import { usePost } from "../Hooks"
import { IPost, IUser } from "../Interface"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"

const Profile = () => {
  const params = useParams()
  const {getSavedPostsByUser} = usePost()
  
  const user: IUser = useSelector((state: RootState) => state.user)

  const [savedPosts, setSavedPosts] = useState<IPost[]>([])

  useEffect(() => {
    if(user.id) {
      getSavedPostsByUser(user.id)
          .then(result => setSavedPosts(result))
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