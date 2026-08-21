export default function Users({users, deleteUser}) {

    return (
        <div>
            <h2 style={{marginLeft:"2rem"}}>Users</h2>
                <ul>
                    {users.map(user => (
                            <li style={{
                                display: "flex", 
                                flexDirection: "column", 
                                gap: "5px",
                                backgroundColor: "lightblue",
                                padding: "1rem",
                                margin: "1rem",
                                borderRadius: "5px",
                                maxWidth: "30dvw"
                            }} 
                            key={user.id}
                            >
                                <UserList user={user} deleteUser={deleteUser}/>
                            </li>
                        ))
                    }
                </ul>    
        </div>
    )
}


function UserList({user, deleteUser}) {
    return (
        <>
            <h3 style={{color: "blue"}}>{user.username}</h3>
            <p>{user.email}</p>
            <p>Comments: {" "}<span>{user._count?.comments ?? 0}</span></p>
            <hr style={{ border: "1px solid black", margin: "1rem 0" }} />
            <button 
            style={{maxWidth: "4rem"}} 
            disabled={user.isAdmin}
            onClick={() => deleteUser(user.id)}>
                {user.isAdmin ? "Admin" : "Delete"}
            </button>
        </>
    )
}