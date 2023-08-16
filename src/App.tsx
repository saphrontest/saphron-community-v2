import { RouterProvider } from 'react-router-dom';
import './App.css';
import {Nav} from './Components';
import { router } from './Root';
function App() {
  return (
    <div className="App">
      <Nav />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
