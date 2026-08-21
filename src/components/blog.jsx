import { useState } from "react"
import Dashboard from "./dashboard"
import Login from "./login"

export default function Blog() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );
    const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
    );

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        setUsername("");
    }
    function handleLogin(data) {
        setIsLoggedIn(true)
        setUsername(data.username)
    }

    if(!isLoggedIn) { 
        return <Login login={isLoggedIn} onLogin={handleLogin}/>
    }

    return <Dashboard username={username} onLogOut={handleLogout}/>
}