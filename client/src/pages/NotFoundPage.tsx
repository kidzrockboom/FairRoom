import { NavLink } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
        <h1>404 - Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <NavLink to="/search">Go back to Search</NavLink>
    </div>
  )
}

export default NotFoundPage
