import { createBrowserRouter } from "react-router-dom";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Calendar } from "./components/Calendar";
import { TimeManagement } from "./components/TimeManagement";
import { TaskOrganization } from "./components/TaskOrganization";
import { Progress } from "./components/Progress";
import { Collaboration } from "./components/Collaboration";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/calendar",
    Component: Calendar,
  },
  {
    path: "/time-management",
    Component: TimeManagement,
  },
  {
    path: "/tasks",
    Component: TaskOrganization,
  },
  {
    path: "/progress",
    Component: Progress,
  },
  {
    path: "/collaboration",
    Component: Collaboration,
  },
]);