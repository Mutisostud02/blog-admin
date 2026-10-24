import { useState } from "react";
import CreatePost from "./createPost";
import Posts from "./myPosts";
import Users from "./users";

export default function Dashboard({ username, onLogOut }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const [showUsers, setShowUsers] = useState(false);
  const [showPosts, setShowPosts] = useState(true);
  async function createPost(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("You must be logged in");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.log(result.msg);
        return;
      }

      console.log("Post created", result);

      setPosts((currentPosts) => [...currentPosts, result]);

      setTitle("");
      setContent("");
      setImage(null);
    } catch (err) {
      console.error("Could not connect to server", err);
    }
  }

  async function getUsers() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Only Admin User Allowed");
      return false;
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          onLogOut();
          return;
        }

        console.log(result.msg);
        return false;
      }

      setUsers(result);
    } catch (err) {
      console.error("Could not connect to server", err);
    }
  }

  async function deleteUser(userId) {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Only admin user allowed");
      return false;
    }

    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        console.log(result.msg);
        return false;
      }

      setUsers((currentUser) =>
        currentUser.filter((user) => user.id !== userId),
      );

      console.log("User deleted successfully");

      return true;
    } catch (err) {
      console.error("Server error", err);
    }
  }
  return (
    <div className="dashboard">
      <div className="dashboard-main">
        <h3 style={{ opacity: 0.5 }}>Logged in as admin user: {username}</h3>
        <button
          onClick={() => {
            setShowPosts(false);
            setShowUsers(true);
            getUsers();
          }}
        >
          Users
        </button>
        <button
          onClick={() => {
            setShowPosts(true);
            setShowUsers(false);
          }}
        >
          Posts
        </button>
        {showPosts && (
          <Posts posts={posts} setPosts={setPosts} onLogOut={onLogOut} />
        )}
        {showUsers && <Users users={users} deleteUser={deleteUser} />}
      </div>

      <div className="dashboard-sidebar">
        <CreatePost
          CreatePost={createPost}
          setTitle={setTitle}
          setContent={setContent}
          setImage={setImage}
          title={title}
          content={content}
        />
      </div>
    </div>
  );
}
