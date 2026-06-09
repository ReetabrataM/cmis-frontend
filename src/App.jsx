import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/dashboard/AdminDashboard";

import StudentList from "./pages/students/StudentList";

import AddStudent from "./pages/students/AddStudent";
import AddFee from "./pages/fees/AddFee";
import EditStudent from "./pages/students/EditStudent";
import FeesPage from "./pages/fees/FeesPage";
import StudentDetails from "./pages/students/StudentDetails";
import FacultyList from "./pages/faculty/FacultyList";
import AttendancePage
from "./pages/attendance/AttendancePage";
import AddFaculty from "./pages/faculty/AddFaculty";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CourseList from "./pages/courses/CourseList";
import AddCourse from "./pages/courses/AddCourse";
import MarkAttendance
from "./pages/attendance/MarkAttendance";
import MarksList from "./pages/marks/MarksList";
import AddMarks from "./pages/marks/AddMarks";
import EditCourse from "./pages/courses/EditCourse";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            <AdminDashboard />
          }
        />
        <Route
  path="/fees/add"
  element={<AddFee />}
/>

        {/* STUDENTS */}
       
        <Route
  path="/attendance"
  element={
    <AttendancePage />
  }
/>
<Route
  path="/attendance/add"
  element={
    <MarkAttendance />
  }
/>

        <Route
          path="/students/add"
          element={<AddStudent />}
        />
        <Route
  path="/fees"
  element={<FeesPage />}
/>

        <Route
          path="/students/:id"
          element={
            <StudentDetails />
          }
        />

        <Route
          path="/students/edit/:id"
          element={
            <EditStudent />
          }
        />
        <Route
  path="/faculties"
  element={<FacultyList />}
/>
<Route
  path="/students"
  element={
    <ProtectedRoute>
      <StudentList />
    </ProtectedRoute>
  }
/>

<Route
  path="/faculties/add"
  element={<AddFaculty />}
/>
<Route
  path="/courses"
  element={<CourseList />}
/>
<Route
  path="/courses/add"
  element={<AddCourse />}
/>
<Route
  path="/marks"
  element={
    <ProtectedRoute>
      <MarksList />
    </ProtectedRoute>
  }
/>

<Route
  path="/marks/add"
  element={
    <ProtectedRoute>
      <AddMarks />
    </ProtectedRoute>
  }
/>
<Route
  path="/courses/edit/:id"
  element={<EditCourse />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;