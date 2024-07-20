//frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import Splash  from './components/Splash';
import SpotOneDetails from './components/SpotOneDetails'
import SpotForm from './components/SpotForm';
import SpotsOwned from './components/SpotsOwned';
import SpotFormUpdater from './components/SpotFormUpdater'
import ReviewsOwned from './components/ReviewsOwned'


SpotsOwned

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
      {path: "/", element: <Splash />},
      {path: "/spots/new",element: <SpotForm />},
      {path: '/spots/:spotId', element: <SpotOneDetails />},
      {path: "/spots/:spotId/edit",element: <SpotFormUpdater />},
      {path: "/spots/current",element: <SpotsOwned />,},
      {path: "/reviews/current",element: <ReviewsOwned />,},



      {path: "*",element: <p>Page Not Found</p>}
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;