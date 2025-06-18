import {BrowserRouter as Router, Routes, Route,} from 'react-router-dom'
//import LoginPage from './components/LoginPage.jsx'
import HomePage from './components/HomePage.jsx'
import Articles from "./components/Articles.jsx";
import Article from "./components/Article.jsx";
import Login from "./components/LoginPage.jsx";
import Profile from "./components/ProfilePage.jsx";
import CreateArticle from "./components/CreateArticle.jsx";
import ErrorPage from "./components/Error.jsx";


import AdminUsersPage from "./components/AdminUsersPage.jsx";
import AdminReferencesPage from "./components/AdminReferencesPage.jsx";
import AdminArticlesPage from "./components/AdminArticlesPage.jsx";

import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import JournalistRoute from "./components/JournalistRoute";


function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path={"*"} element={<ErrorPage /> }/>
                <Route path={"/error"} element={<ErrorPage /> }/>
                <Route path={"/"} element={<HomePage /> }/>
                <Route path={"/login"} element={<Login /> }/>
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                <Route path="/articles" element={
                    <ProtectedRoute>
                        <Articles />
                    </ProtectedRoute>
                } />
                <Route path="/articles/:id" element={
                    <ProtectedRoute>
                        <Article />
                    </ProtectedRoute>
                } />
                <Route path="/writeArticle" element={
                    <JournalistRoute>
                        <CreateArticle />
                    </JournalistRoute>
                } />
                <Route path="/users" element={
                    <AdminRoute>
                        <AdminUsersPage />
                    </AdminRoute>
                } />
                <Route path="/references" element={
                    <AdminRoute>
                        <AdminReferencesPage />
                    </AdminRoute>
                } />
                <Route path="/admin-articles" element={
                    <AdminRoute>
                        <AdminArticlesPage />
                    </AdminRoute>
                } />
            </Routes>
        </Router>
    )
}
export default App