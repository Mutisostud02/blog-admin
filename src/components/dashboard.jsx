import { useState } from "react"
import CreatePost from "./createPost"
import Posts from "./myPosts"

export default function Dashboard({username}) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const [posts, setPosts] = useState([])
        async function createPost(e) {
        e.preventDefault();

        const token = localStorage.getItem("token")

        if(!token) {
            console.log("You must be logged in")
            return;
        }

        const data  = {
            title,
            content
        }

        try {
            const response = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if(!response.ok) {
                console.log(result.msg)
                return;
            }

            console.log("Post created", result);
            
            setPosts(currentPosts => [...currentPosts, data])

            setTitle("");
            setContent("")
        } catch(err) {
            console.error("Could not connect to server", err)
        }
    }
    return (
        <div className="dashboard">
            <div className="dashboard-main">
                <h3 style={{opacity:0.5}}>Logged in as admin user: {username}</h3>
                <Posts posts={posts} setPosts={setPosts} />
            </div>

            <div className="dashboard-sidebar">
                <CreatePost 
                CreatePost={createPost} 
                setTitle={setTitle} 
                setContent={setContent} 
                title={title} 
                content={content} 
                />
            </div>
        </div>
    )    
}