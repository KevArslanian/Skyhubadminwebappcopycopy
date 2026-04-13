import { createBrowserRouter, Navigate } from "react-router";
import { Shell } from "./components/shell";
import { Dashboard } from "./components/dashboard";
import { ShipmentLedger } from "./components/shipment-ledger";
import { AWBTracking } from "./components/awb-tracking";
import { FlightBoard } from "./components/flight-board";
import { ActivityLog } from "./components/activity-log";
import { Settings } from "./components/settings";
import { Login } from "./components/login";
import { NotFound } from "./components/not-found";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <Shell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "shipment-ledger", element: <ShipmentLedger /> },
      { path: "awb-tracking", element: <AWBTracking /> },
      { path: "flight-board", element: <FlightBoard /> },
      { path: "activity-log", element: <ActivityLog /> },
      { path: "settings", element: <Settings /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
