export default function Login({onLogin}) {
    async function handleSubmit(e) {
        e.preventDefault()

        const formData = new FormData(e.target);

        const data = {
            username: formData.get("username"),
            password: formData.get("password"),
        }
        console.log(data)

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if(!response.ok) {
                console.log(result.msg)
                return;
            }

            localStorage.setItem("token", result.token)
            localStorage.setItem("username", data.username)

            onLogin(data)


            console.log("Log-in Successful")
        } catch(err) {
            console.error("Could not connect to the server", err)
        }
    }
        return (
            <>
                <form onSubmit={handleSubmit}>
                    <h2>Log-in</h2>
                    <label htmlFor="username">username</label>
                    <br/>
                    <input id="username" type="text" name="username" required/>
                    <br/>
                    <label htmlFor="password">password</label>
                    <br/>
                    <input id="password" type="password" name="password" required/>
                    <br/>
                    <button type="submit">Log in</button>
                </form>
            </>
        )
}