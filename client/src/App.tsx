import { Suspense } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import UserList from "./pages/UserList";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";
import UnAuthorized from "./pages/UnAuthorized";
import SignIn from "./pages/SignIn";
import { Toaster } from "./components/ui/toaster";
import ItemList from "./pages/ItemList";
import Project from "./pages/Project";
import Receiving from "./pages/Receiving";
import Issuing from "./pages/Issuing";
import Options from "./pages/Options";
import ItemAdminList from "./pages/ItemAdminList";
import LoadingPage from "./components/user/LoadingPage";

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
                  <Route path="/items/:projectId" element={<ItemList />} />
                  <Route path="/receiving/:projectId" element={<Receiving />} />
                  <Route path="/issuing/:projectId" element={<Issuing />} />

                  {/* Admin and Head routes */}
                  <Route
                    element={
                      <PrivateRoute
                        adminOnly
                        exclude={["/options", "/projects"]}
                      />
                    }
                  >
                    <Route
                      path="/admin/items/:projectId"
                      element={<ItemAdminList />}
                    />
                    <Route path="/users" element={<UserList />} />
                  </Route>

                  {/* Admin-only routes */}
                  <Route element={<PrivateRoute adminOnly />}>
                    <Route path="/options/:projectId" element={<Options />} />
                    <Route path="/projects" element={<Project />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
                <Route path="/loading" element={<LoadingPage />} />
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
