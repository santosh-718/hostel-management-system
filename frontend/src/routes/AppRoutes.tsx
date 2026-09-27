import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Rooms from '../pages/Rooms/Rooms';
import Bookings from '../pages/Bookings/Bookings';
import Guests from '../pages/Guests/Guests';
import Complaints from '../pages/Complaints/Complaints';
import Housekeeping from '../pages/Housekeeping/Housekeeping';

import AdminRoute from './AdminRoute';
import UserRoute from './UserRoute';
import Register from '../pages/Register/Register';
import MyRegistration from '../pages/MyRegistration/MyRegistration';
import MyBooking from '../pages/MyBooking/MyBooking';
import GuestRegistration from '../pages/GuestRegistration/GuestRegistration';
import UserDashboard from '../pages/UserDashboard/UserDashboard';
import Payments from '../pages/Payments/Payments';
import MyPayments from '../pages/MyPayments/MyPayments';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* User Route */}

        <Route
          path="/user-dashboard"
          element={
            <UserRoute>
              <UserDashboard />
            </UserRoute>
          }
        />

        <Route
          path="/guest-registration"
          element={
            <UserRoute>
              <GuestRegistration />
            </UserRoute>
          }
        />

        {/* Admin Routes */}

        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <AdminRoute>
              <Rooms />
            </AdminRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <AdminRoute>
              <Bookings />
            </AdminRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <AdminRoute>
              <Payments />
            </AdminRoute>
          }
        />

        <Route
          path="/guests"
          element={
            <AdminRoute>
              <Guests />
            </AdminRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <AdminRoute>
              <Complaints />
            </AdminRoute>
          }
        />

        <Route
          path="/housekeeping"
          element={
            <AdminRoute>
              <Housekeeping />
            </AdminRoute>
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/my-registration"
          element={
            <UserRoute>
              <MyRegistration />
            </UserRoute>
          }
        />

        <Route
          path="/my-booking"
          element={
            <UserRoute>
              <MyBooking />
            </UserRoute>
          }
        />

        <Route
          path="/my-payments"
          element={
            <UserRoute>
              <MyPayments />
            </UserRoute>
          }
        />

        {/* Invalid URLs */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}