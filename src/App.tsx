import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/Error/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { useState, useEffect } from "react";
import Spinner from "./components/ui/loading/Spinner";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./routes/ProtectedRoute";
import Roles from "./pages/Roles/Index";
import RolesCreate from "./pages/Roles/Create";
import RolesUpdate from "./pages/Roles/Update";
// import Trash from "./pages/Trash/Index";
import Divisions from "./pages/Division/Index";
import DivisionsTrash from "./pages/Trash/Pages/DivisionTrash";
import Maintenance from "./pages/Error/Maintenance";
import ServerError from "./pages/Error/ServerError";
import Forbidden from "./pages/Error/Forbidden";
import PermissionRoute from "./routes/PermissionRoute";
import { buildPermission, PERMISSIONS } from "./constants/Permissions";
import { RESOURCES } from "./constants/Resource";
import Allowances from "./pages/Allowances/Index";
import AllowancesTrash from "./pages/Trash/Pages/AllowanceTrash";
import Positions from "./pages/Positions/Index";
import PositionsTrash from "./pages/Trash/Pages/PositionTrash";
import Setting from "./pages/Settings/Setting";
import Users from "./pages/User/Index";
import UsersCreate from "./pages/User/Create";
import UsersUpdate from "./pages/User/Update";
import FaceScanner from "./pages/Attendance/Face";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Spinner />}

      <Router>
        <ScrollToTop />
        <Toaster position="top-right" containerStyle={{ zIndex: 999999 }} />
        <Routes>
          {/* 🔒 Protected Area */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {/* ===== PUBLIC AFTER LOGIN (tanpa permission khusus) ===== */}
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.ROLE,
                      PERMISSIONS.BASE.INDEX,
                    )}
                  />
                }
              >
                <Route path="/roles" element={<Roles />} />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.ROLE,
                      PERMISSIONS.BASE.CREATE,
                    )}
                  />
                }
              >
                <Route path="/roles/create" element={<RolesCreate />} />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.ROLE,
                      PERMISSIONS.BASE.EDIT,
                    )}
                  />
                }
              >
                <Route path="/roles/:id/edit" element={<RolesUpdate />} />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.USER,
                      PERMISSIONS.BASE.INDEX,
                    )}
                  />
                }
              >
                <Route path="/users" element={<Users />} />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.USER,
                      PERMISSIONS.BASE.CREATE,
                    )}
                  />
                }
              >
                <Route path="/users/create" element={<UsersCreate />} />
              </Route>

              {/* <Route element={<PermissionRoute permission={buildPermission(RESOURCES.USER, PERMISSIONS.BASE.SHOW)} />}>
              <Route path="/users/:uuid/show" element={<UsersUpdate />} />
            </Route> */}

              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.USER,
                      PERMISSIONS.BASE.EDIT,
                    )}
                  />
                }
              >
                <Route path="/users/:uuid/edit" element={<UsersUpdate />} />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.DIVISION,
                      PERMISSIONS.BASE.INDEX,
                    )}
                  />
                }
              >
                <Route path="/divisions" element={<Divisions />} />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.ALLOWANCE,
                      PERMISSIONS.BASE.INDEX,
                    )}
                  />
                }
              >
                <Route path="/allowances" element={<Allowances />} />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.POSITION,
                      PERMISSIONS.BASE.INDEX,
                    )}
                  />
                }
              >
                <Route path="/positions" element={<Positions />} />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.SETTING,
                      PERMISSIONS.BASE.INDEX,
                    )}
                  />
                }
              >
                <Route path="/settings" element={<Setting />} />
              </Route>

              {/* ===== TRASH ===== */}

              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.DIVISION,
                      PERMISSIONS.BASE.RESTORE,
                    )}
                  />
                }
              >
                <Route path="/trash/divisions" element={<DivisionsTrash />} />
              </Route>
              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.ALLOWANCE,
                      PERMISSIONS.BASE.RESTORE,
                    )}
                  />
                }
              >
                <Route path="/trash/allowances" element={<AllowancesTrash />} />
              </Route>
              <Route
                element={
                  <PermissionRoute
                    permission={buildPermission(
                      RESOURCES.POSITION,
                      PERMISSIONS.BASE.RESTORE,
                    )}
                  />
                }
              >
                <Route path="/trash/positions" element={<PositionsTrash />} />
              </Route>

              {/* <Route path="/trash" element={<Trash />} /> */}

              {/* ===== UI DEMO PAGES (optional protect or not) ===== */}
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>
          
            <Route path="/attendance" element={<FaceScanner />} />

          {/* 🔓 Public Routes */}
          <Route path="/login" element={<SignIn />} />

          <Route path="/403" element={<Forbidden />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="/503" element={<Maintenance />} />

          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </>
  );
}
