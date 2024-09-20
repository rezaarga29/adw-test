import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import UserLayout from "./components/UserLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UserDetailComponent from "./pages/UserDetail";
import Profile from "./pages/Profile";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";

const router = createBrowserRouter([
  {
    element: <UserLayout />,
    loader: () => {
      if (!localStorage.token) {
        return redirect("/login");
      }
      return null;
    },
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/add-user",
        element: <AddUser />,
      },
      {
        path: "/edit-profile/:id",
        element: <EditUser />,
      },
      {
        path: "/user/:id",
        element: <UserDetailComponent />,
      },
      {
        path: "*",
        element: <div>404 Not Found</div>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    loader: () => {
      if (localStorage.token) {
        return redirect("/");
      }
      return null;
    },
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
