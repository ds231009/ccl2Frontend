import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LoginPage from './components/LoginPage.jsx'
import HomePage from './components/HomePage.jsx'
import Articles from './components/DemoArticles.jsx'
import UsersPage from './components/UsersPage.jsx'
import UserDetailPage from './components/UserDetailPage.jsx'
import UserFormPage from './components/UserFormPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ArticleList from "./components/DemoArticles.jsx";


function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path={"/"} element={<HomePage /> }/>
                <Route path={"/articles"} element={<ArticleList /> }/>
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