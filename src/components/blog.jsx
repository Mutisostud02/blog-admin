import { useState } from "react"
import Dashboard from "./dashboard"
import Login from "./login"

export default function Blog() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("")

    function handleLogin(data) {
        setIsLoggedIn(true)
        setUsername(data.username)
    }

    if(!isLoggedIn) { 
        return <Login login={isLoggedIn} onLogin={handleLogin}/>
    }

    return <Dashboard username={username}/>
}