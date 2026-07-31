import { useEffect, useState } from "react";
import Comments from "./comments";

export default function Posts({posts, setPosts}) {

    async function getPosts() {
        const token = localStorage.getItem("token");

        if(!token) {
            console.log("You must be logged in as admin")
            return false;
        }

        try {
            const response = await fetch("http://localhost:3000/posts/admin", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`               
                }

            })

            const result = await response.json()
            console.log("Posts from API:", result.allPosts);

            if(!response.ok) {
                console.log(result.msg)
                return;
            }

            setPosts(result.allPosts)

        } catch(err) {
            console.error("Could not connect to the server", err)
        }
    } 
    useEffect(() => {
        getPosts()
    }, [])

    //DELETE POST
    async function deletePost(postId) {
        const token = localStorage.getItem("token")

        if(!token) {
            console.log("You must be logged in as admin")
            return false;
        }

        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if(!response.ok) {
                const result = await response.json();
                console.log(result.msg)
                return;
            }

            setPosts((currentPosts) => 
                currentPosts.filter(post => post.id !== postId)
            )

            console.log("Post deleted")
            
        } catch (err) {
            console.error("Could not connect to server", err)            
        }
    }

    //PUBLISH/UNPUBLISH POST
    async function publishPost(postId) {
        const token = localStorage.getItem("token");

        if(!token) {
            console.log("You must be logged in as admin")
            return false;
        }

        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}/published`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            const result = await response.json();

            if(!response.ok) {
                console.log(result.msg)
                return;
            }

            setPosts(currentPosts => 
                currentPosts.map(post => 
                    post.id === postId ? {
                        ...post,
                        published: result.published
                    } : post
                )
            )

            console.log("Post status updated")

    } catch(err) {
        console.log("Could not connect to server", err)
    }
}

    //UPDATE POST
    async function updatePost(postId, data) {
        const token = localStorage.getItem("token")

        if(!token) {
            console.log("You must be logged in as admin")
            return false;
        }

        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if(!response.ok) {
                console.log(result.msg)
                return false;
            }


            setPosts(currentPosts => 
                currentPosts.map(post => post.id === postId 
                    ? result : post
                )
            )
            return true;
        } catch (err) {
            console.log("Could not connect to server", err) 
            return false;           
        }
    }


    return (
        <div>
            <h2 style={{marginLeft:"2rem"}}>My Posts</h2>
            <ul>
            {
                posts.map(post => (
                    <li style={{display: "flex", flexDirection: "column", gap: "5px"}} key={post.id}>
                        <ListItems
                         post={post}
                         onDelete={deletePost}
                         onTogglePublish={publishPost}
                         onUpdate={updatePost}
                         />
                    </li>
                ))
            }
            </ul>            
        </div>
    )
}


function ListItems({post, onDelete, onTogglePublish, onUpdate}) {
    const [isEditing, setIsEditing] = useState(false)
    const [showPostDetails, setShowPostDetails] = useState(false)

    const [title, setTitle] = useState(post.title)
    const [content, setContent] = useState(post.content)

    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState(false)

    async function getComments(postId) {
        if(Number.isNaN(postId)) {
            return false;
        }

        const token = localStorage.getItem("token")

        if(!token) {
            console.log('User must be an Admin!')
            return false
        }

        const response = await fetch(`http://localhost:3000/posts/${postId}/comments/admin`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })

        const result = await response.json()

        if(!response.ok) {
            console.log(result.msg)
            return false;
        }

        setComments(result.comments)
    }


    const font={
        fontWeight : "bold"
    }

    

    async function handleUpdate(e) {
        e.preventDefault()

        const success = await onUpdate(post.id, {
            title, 
            content,
        })

        if(success) {
            setIsEditing(false)
        }
    }
    
    if(isEditing) {
        return (
            <form onSubmit={handleUpdate}>
                <div>
                    <label htmlFor={`title-${post.id}`}>
                        <span style={font}>Title:</span>
                    </label>
                    <br/>
                    <input
                        id={`title-${post.id}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor={`content-${post.id}`}>
                        <span style={font}>Content:</span>
                    </label>
                    <br/>

                    <textarea
                        id={`content-${post.id}`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>        

                <button type="submit">Save</button> 
                <button 
                type="button"
                onClick={() => {
                    setIsEditing(false)
                    setContent(post.content)
                    setTitle(post.title)
                }}
                >Cancel</button> 
    
            </form>
        )
    }

    function handleOnClick() {
        setShowPostDetails(!showPostDetails)
    }

    return (
        <div>
        <h3><a style={{cursor:"pointer", color:"blue"}} onClick={handleOnClick}>{post.title}</a></h3>
        {showPostDetails && 
        <>
        <p>{post.content}</p>
        <p style={{marginBottom:"5px"}}>Status:{" "}
            <span style={{color: "white", padding: "1px", borderRadius: "3px", backgroundColor: post.published ? "#228B22" : "red"}}>{post.published ? "Published" : "Unpublished"}</span>
        </p>
        <div className="adm-buttons" style={{display: "flex", justifyContent:"space-between"}}>
            <div>
            <button onClick={() => {
                setIsEditing(true)
            }}>
                Edit
            </button>
            <button 
            onClick={() => onTogglePublish(post.id)}>
                {post.published ? "Unpublish" : "publish"}
            </button>
            <button onClick={() => {
                onDelete(post.id)
            }}>Delete</button>
            </div>
            <button 
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px"
            }} 
            onClick={() => {
                setShowComments(current => !current)

                if (!showComments) {
                    getComments(post.id)
                }
            }}>Comments{post._count?.comments > 0 && <span className="comment-count">{post._count.comments}</span>}</button>
        </div>
            {showComments && <Comments setComments={setComments} comments={comments}/>}
        </>
        }
        </div>
    )
}