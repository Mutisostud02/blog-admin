import { useState } from "react"

export default function Comments({comments, setComments}) {

    async function patchCommentVisibility(commentId) {
        const token = localStorage.getItem("token");

        if(!token) {
            console.log("You must be logged in as Admin")
            return false;
        }

        try {
            const response = await fetch(`http://localhost:3000/comments/${commentId}/visible`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            const result = await response.json()

            if(!response.ok) {
                console.log(result.msg)
                return false;
            }

            setComments(current => 
                current.map(comment =>
                    comment.id === commentId ?
                    {...comment, visible : result.visible}
                    : comment
                )
            )

            console.log("Status visibility updated")

        } catch(err) {
            console.error('Could not connect to server!',err)
        }
    }

    return (
        <div className="comments">
            <ul>
            {comments.map(comment =>
            <>
                <li className="comment-content" key={comment.id}>
                    <div className="content-header">
                        <h5>Posted By:{" "}{comment.author.username}</h5>
                        <small style={{color: "blue", fontWeight:"300"}}>{
                            new Date(comment.created_at).toLocaleString(
                                "en-US",
                                {
                                    dateStyle: "medium",
                                    timeStyle: "short"
                                }
                            )}
                        </small>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <p style={{color:"black"}} className="content">{comment.content}</p>
                        <div>
                            <button style={{color:"blue"}} onClick={() => patchCommentVisibility(comment.id)}>Visibility</button>
                            <span 
                            style={{
                                backgroundColor: comment.visible ? "green" : "red", 
                                color: "white", 
                                padding:"3.5px", 
                                borderRadius:"4px"
                            }}>{comment.visible ? "Public" : "Flagged"}
                            </span>
                        </div>
                    </div>
                        <br/>
                </li>
            </>
            )}
            </ul>

        </div>
    )
}

