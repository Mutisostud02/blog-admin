
export default function CreatePost({CreatePost, setContent, setTitle, setImage, title, content}) {
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

            <label htmlFor="image">Upload Image</label>
            <input 
            id="image" 
            name="image" 
            type="file" 
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}                        
            ></input>


            <button type="submit">Create Post</button>
        </form>
    )
    }
