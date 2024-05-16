import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation/Navigation';
import Spots from './components/Spots/Spots';
import LandingPage from './components/LandingPage/LandingPage';
import SpotsDetails from './components/SpotsDetails/SpotsDetails';
import CreateSpot from './components/CreateSpot/CreateSpot';
import ManageSpots from './components/ManageSpots/ManageSpots';
import EditSpot from './components/EditSpot/EditSpot';

const Layout = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/spots" element={<Spots />} />
      <Route path="/spots/:spotId" element={<SpotsDetails />} />
      <Route path="/spots/new" element={<CreateSpot />} />
      <Route path="/spots/current" element={<ManageSpots />} />
      <Route path="/spots/:spotId/edit" element={<EditSpot />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
