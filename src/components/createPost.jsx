
export default function CreatePost({CreatePost, setContent, setTitle, title, content}) {
    return (
        <form onSubmit={CreatePost}>
            <h2>Create Post</h2>

            <label htmlFor="title">Title</label>
            <br/>
            <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required/>

            <br/>

            <label htmlFor="content">Content</label>
            <br/>
            <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            />
            <br/>

            <button type="submit">Create Post</button>
        </form>
    )
    }
