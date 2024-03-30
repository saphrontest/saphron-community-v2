import Router from './Router';
import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { setCommunitySelectOpen, setUserMenuOpen } from './redux/slices/globalSlice';

function App() {

  const dispatch = useDispatch()
  const {userMenuOpen, communitySelectOpen} = useSelector((state: RootState) => state.global)

  // useEffect(() => {

  //TODO: work on this
    
  //   const handleClickOutside = () => {
  //     userMenuOpen && dispatch(setUserMenuOpen(false))
  //     communitySelectOpen && dispatch(setCommunitySelectOpen(false))
  //   }

  //   // Add event listener when the menu is open
  //   if (userMenuOpen || communitySelectOpen) {
  //     document.addEventListener('click', handleClickOutside);
  //   } else {
  //     // Remove event listener when the menu is closed
  //     document.removeEventListener('click', handleClickOutside);
  //   }

  //   // Cleanup function to remove event listener
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, [communitySelectOpen, userMenuOpen]);

  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
