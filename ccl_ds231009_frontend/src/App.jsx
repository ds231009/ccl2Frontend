import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LoginPage from './components/LoginPage'
import HomePage from './components/HomePage'
import UsersPage from './components/UsersPage'
import UserDetailPage from './components/UserDetailPage'
import UserFormPage from './components/UserFormPage'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path={"/"} element={<HomePage /> }/>
                <Route path={"/login"} element={<LoginPage /> }/>

                {/* Protected routes */}
                <Route path="/users" element={
                    <ProtectedRoute>
                        <UsersPage />
                    </ProtectedRoute>
                } />
                <Route path="/users/new" element={
                    <ProtectedRoute>
                        <UserFormPage type="new" />
                    </ProtectedRoute>
                } />
                <Route path="/users/:id/edit" element={
                    <ProtectedRoute>
                        <UserFormPage type="edit" />
                    </ProtectedRoute>
                } />
                <Route path="/users/:id" element={
                    <ProtectedRoute>
                        <UserDetailPage />
                    </ProtectedRoute>
                } />


            </Routes>
        </Router>
    )
}
export default App