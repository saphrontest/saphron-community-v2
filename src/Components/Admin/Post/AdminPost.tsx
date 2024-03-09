import { Fragment, useEffect, useState } from 'react'
import { usePost } from '../../../Hooks'
import { Community, IPost } from '../../../Interface'
import { PostItem } from '../../Posts'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { PlatformAdminContentLayout } from '../../../Layouts'

const AdminPost = () => {
    const { getPosts } = usePost()
    const [posts, setPosts] = useState<IPost[]>([])
    const [filteredPosts, setFilteredPosts] = useState<IPost[]>([])
    const [reloadPosts, setReloadPosts] = useState<boolean>(false)

    const { communities } = useSelector((state: RootState) => state.community)

    useEffect(() => {
        const getAllPosts = true
        getPosts(getAllPosts).then(result => {
            setPosts(result)
            setFilteredPosts(result)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const getAllPosts = true
        reloadPosts && getPosts(getAllPosts).then(result => {
            setPosts(result)
            setFilteredPosts(result)
        }).finally(() => setReloadPosts(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadPosts])


    const searchPosts = (searchWord: string) => {
        setFilteredPosts(() => {
            return posts.filter(post => {
                return post.title.toLowerCase().includes(searchWord) ||
                    post.userDisplayText.toLowerCase().includes(searchWord)
            })
        })
    }

    return (
        <PlatformAdminContentLayout onSearch={searchPosts}>
            {
                filteredPosts.map(post => (
                    <Fragment key={post.id}>
                        <PostItem
                            post={post}
                            setReloadPost={setReloadPosts}
                            communityName={communities?.filter((c: Community) => post.communityId === c.id)[0]?.name}
                            isDashboard={true}
                        />
                    </Fragment>
                ))
            }
        </PlatformAdminContentLayout>
    )
}

export default AdminPost
