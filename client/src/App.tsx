import { Suspense } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import UserList from './pages/UserList';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import UnAuthorized from './pages/UnAuthorized';
import SignIn from './pages/SignIn';
import { Toaster } from './components/ui/toaster';
import ItemList from './pages/ItemList';
import Project from './pages/Project';
import Receiving from './pages/Receiving';
import Issuing from './pages/Issuing';
import Options from './pages/Options';
import ItemAdminList from './pages/ItemAdminList';

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Suspense fallback={<div>Loading....</div>}>
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  {/* <Route path="/dashboard/:projectId" element={<Dashboard />} /> */}
                  <Route path="/items/:projectId" element={<ItemList />} />
                  <Route path="/receiving/:projectId" element={<Receiving />} />
                  <Route path="/issuing/:projectId" element={<Issuing />} />

                  {/* Admin-only routes */}
                  <Route element={<PrivateRoute adminOnly={true} />}>
                    <Route path="/admin/items" element={<ItemAdminList />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/options/:projectId" element={<Options />} />
                    <Route path="/projects" element={<Project />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
                <Route path="/unauthorized" element={<UnAuthorized />} />
              </Route>
            </Routes>
          </Suspense>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
