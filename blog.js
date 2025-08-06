document.addEventListener('DOMContentLoaded', () => {
    initializeContentfulClient();

    async function fetchAndRenderPost() {
        const postContent = document.getElementById('blog-post-content');
        if (!postContent) return;

        postContent.innerHTML = '<em>Loading post...</em>';

        try {
            const postId = new URLSearchParams(window.location.search).get('id');

            if (!postId) {
                postContent.innerHTML = '<em>No post ID provided. <a href="/">Go back home</a>.</em>';
                return;
            }

            const entry = await window.contentfulClient.getEntry(postId);

            if (entry) {
                const post = entry.fields;
                document.title = post.title || 'Blog Post'; 

                const publishDate = post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Date not available';
                const bodyHtml = post.postBody ? documentToHtmlString(post.postBody) : '<p>This post has no content.</p>';

                postContent.innerHTML = `
                    <h1 class="post-full-title">${post.title || 'Untitled Post'}</h1>
                    <p class="post-full-meta">Published on ${publishDate}</p>
                    <div class="post-full-body">${bodyHtml}</div>
                `;
            } else {
                postContent.innerHTML = '<em>Post not found. <a href="/">Go back home</a>.</em>';
            }
        } catch (error) {
            postContent.innerHTML = '<em>Error loading the post. <a href="/">Go back home</a>.</em>';
            console.error(error);
        }
    }

    fetchAndRenderPost();
});
