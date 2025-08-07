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
                // Use the rich text renderer with fallback
                let bodyHtml = '<p>This post has no content.</p>';
                
                if (post.postBody) {
                    try {
                        // Try different ways the rich text renderer might be exposed
                        if (window.richTextHtmlRenderer?.documentToHtmlString) {
                            bodyHtml = window.richTextHtmlRenderer.documentToHtmlString(post.postBody);
                        } else if (window.documentToHtmlString) {
                            bodyHtml = window.documentToHtmlString(post.postBody);
                        } else if (window.contentfulRichTextHtmlRenderer?.documentToHtmlString) {
                            bodyHtml = window.contentfulRichTextHtmlRenderer.documentToHtmlString(post.postBody);
                        } else {
                            // Fallback: just display the raw rich text structure
                            console.warn('Rich text renderer not found, using fallback');
                            bodyHtml = '<p>Rich text content (renderer not available)</p>';
                        }
                    } catch (error) {
                        console.error('Error rendering rich text:', error);
                        bodyHtml = '<p>Error rendering content</p>';
                    }
                }

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
