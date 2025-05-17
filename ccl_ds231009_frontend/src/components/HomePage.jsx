import './HomePage.css';
import {Link} from "react-router-dom"

function HomePage() {
    return (
        <div className="home-container">
            <h1>Welcome</h1>
            <p>This is the FWoC semester project of Julian Pecho (ds231009). Please login to access the workbench.</p>
            <Link to="/login" className="link-button">Go to Login</Link>
        </div>
    )
}


export default HomePage