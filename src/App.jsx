import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
//import LoginPage from './components/LoginPage.jsx'
import HomePage from './components/HomePage.jsx'
import ArticlesList from "./components/Articles.jsx";
import   ArticleList from "./components/Article.jsx";


function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path={"/"} element={<HomePage /> }/>
                <Route path={"/articles"} element={<ArticlesList /> }/>
                <Route path={"/articles/:id"} element={<ArticleList /> }/>

            </Routes>
        </Router>
    )
}
export default App