import {BrowserRouter as Router, Routes, Route,} from 'react-router-dom'
//import LoginPage from './components/LoginPage.jsx'
import HomePage from './components/HomePage.jsx'
import Articles from "./components/Articles.jsx";
import Article from "./components/Article.jsx";
import Login from "./components/LoginPage.jsx";
import Admin from "./components/AdminPage.jsx";
import ProtectedRoute from './components/ProtectedRoute'


function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path={"/"} element={<HomePage /> }/>
                <Route path={"/login"} element={<Login /> }/>
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
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    )
}
export default App