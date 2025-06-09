import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
//import LoginPage from './components/LoginPage.jsx'
import HomePage from './components/HomePage.jsx'
import Articles from "./components/Articles.jsx";
import Article from "./components/Article.jsx";
import Login from "./components/LoginPage.jsx";


function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path={"/"} element={<HomePage /> }/>
                <Route path={"/articles"} element={<Articles /> }/>
                <Route path={"/articles/:id"} element={<Article /> }/>
                <Route path={"/login"} element={<Login /> }/>

            </Routes>
        </Router>
    )
}
export default App