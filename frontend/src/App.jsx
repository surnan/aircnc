//frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import ViewAllSpots from "./components/ViewAllSpots";
import SpotForm from './components/SpotForm';


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element:
          <>
            <ViewAllSpots />
          </>
      },
      {
        path: "/spots/new",
        element: <SpotForm />,
      },
      {
        path: "*",
        element: <p>Page Not Found</p>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;