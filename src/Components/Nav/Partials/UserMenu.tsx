import { Menu, MenuButton, MenuList } from '@chakra-ui/react'
import { setModal } from '../../../redux/slices/modalSlice'
import { useDispatch } from 'react-redux'
import { signOut } from "firebase/auth";
import { FC } from 'react'
import { auth } from '../../../firebaseClient'
import { useNavigate } from 'react-router-dom'
import { UserInterface } from '../../../Interface/UserInterface'
import { logoutUser } from '../../../redux/slices/userSlice'
import { resetCommunities } from '../../../redux/slices/communitySlice'
import { resetPosts } from '../../../redux/slices/postSlice'
import { LoginButton, MenuButtonInner, UserMenuInner } from './Menu';
import { useConst } from '@chakra-ui/react'


const UserMenu: FC<{ user: UserInterface }> = ({ user }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userRole = useConst(() => user.role ? user.role : "user")

    const logout = async () => {
        await signOut(auth);
        dispatch(logoutUser())
        dispatch(resetCommunities())
        dispatch(resetPosts())
        navigate("/community")
    }

    return (
        <Menu>
            <MenuButton
                minH="34px"
                cursor="pointer"
                padding="0px 6px"
                borderRadius="4px"
                outline={"1px solid"}
                outlineColor={"gray.100"}
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
            >
                <MenuButtonInner user={user} />
            </MenuButton>
            <MenuList>
                {
                    user.id ?
                        <UserMenuInner logout={logout} userRole={userRole} /> :
                        <LoginButton onClick={() => dispatch(setModal({ isOpen: true, view: 'login' }))} />
                }
            </MenuList>
        </Menu>
    )
}

export default UserMenu