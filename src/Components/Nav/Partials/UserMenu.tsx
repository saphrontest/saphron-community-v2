import { Menu, MenuButton, MenuDivider, MenuList, useConst } from '@chakra-ui/react'
import { setModal } from '../../../redux/slices/modalSlice'
import { useDispatch } from 'react-redux'
import { signOut } from "firebase/auth";
import { FC } from 'react'
import { auth } from '../../../firebaseClient'
import { useLocation, useNavigate } from 'react-router-dom'
import { IUser } from '../../../Interface'
import { logoutUser } from '../../../redux/slices/userSlice'
import { resetMyCommunities } from '../../../redux/slices/communitySlice'
import { LoginButton, MenuButtonInner, UserMenuInner } from './Menu';
import NavigationMenu from './Menu/NavigationMenu';


const UserMenu: FC<{ user: IUser }> = ({ user }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const userRole = useConst(() => user.role ? user.role : "user")

    const logout = async () => {
        await signOut(auth);
        dispatch(logoutUser())
        dispatch(resetMyCommunities())
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
                <MenuButtonInner user={user}/>
            </MenuButton>
            <MenuList>
                {
                    user.id ?
                        <UserMenuInner logout={logout} userRole={userRole} activePath={location.pathname}/> :
                        (
                            <>
                                <NavigationMenu userRole={userRole} activePath={location.pathname}/>
                                <MenuDivider />
                                <LoginButton onClick={() => dispatch(setModal({ isOpen: true, view: 'login' }))} />
                            </>
                        )
                }
            </MenuList>
        </Menu>
    )
}

export default UserMenu