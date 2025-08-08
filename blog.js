document.addEventListener('DOMContentLoaded', () => {
    initializeContentfulClient();

    function getRichTextRenderer() {
        // Handle different UMD/global export shapes from the rich-text HTML renderer
        if (typeof window.documentToHtmlString === 'function') return window.documentToHtmlString;
        if (window.richTextHtmlRenderer && typeof window.richTextHtmlRenderer.documentToHtmlString === 'function') {
            return window.richTextHtmlRenderer.documentToHtmlString;
        }
        if (window.exports && typeof window.exports.documentToHtmlString === 'function') {
            return window.exports.documentToHtmlString;
        }
        return null;
    }

    // Minimal, safe DOM renderer for a subset of Contentful Rich Text
    function renderRichTextNode(node) {
        const nodeType = node.nodeType;
        switch (nodeType) {
            case 'document': {
                const fragment = document.createDocumentFragment();
                for (const child of node.content || []) {
                    const childEl = renderRichTextNode(child);
                    if (childEl) fragment.appendChild(childEl);
                }
                return fragment;
            }
            case 'paragraph': {
                const p = document.createElement('p');
                for (const child of node.content || []) {
                    const childEl = renderRichTextNode(child);
                    if (childEl) p.appendChild(childEl);
                }
                return p;
            }
            case 'heading-1':
            case 'heading-2':
            case 'heading-3':
            case 'heading-4':
            case 'heading-5':
            case 'heading-6': {
                const level = parseInt(nodeType.split('-')[1], 10);
                const h = document.createElement(`h${Math.min(Math.max(level, 1), 6)}`);
                for (const child of node.content || []) {
                    const childEl = renderRichTextNode(child);
                    if (childEl) h.appendChild(childEl);
                }
                return h;
            }
            case 'unordered-list': {
                const ul = document.createElement('ul');
                for (const child of node.content || []) {
                    const li = renderRichTextNode(child);
                    if (li) ul.appendChild(li);
                }
                return ul;
            }
            case 'ordered-list': {
                const ol = document.createElement('ol');
                for (const child of node.content || []) {
                    const li = renderRichTextNode(child);
                    if (li) ol.appendChild(li);
                }
                return ol;
            }
            case 'list-item': {
                const li = document.createElement('li');
                for (const child of node.content || []) {
                    const childEl = renderRichTextNode(child);
                    if (childEl) li.appendChild(childEl);
                }
                return li;
            }
            case 'blockquote': {
                const bq = document.createElement('blockquote');
                for (const child of node.content || []) {
                    const childEl = renderRichTextNode(child);
                    if (childEl) bq.appendChild(childEl);
                }
                return bq;
            }
            case 'hr': {
                return document.createElement('hr');
            }
            case 'hyperlink': {
                const a = document.createElement('a');
                const href = typeof node.data?.uri === 'string' ? node.data.uri : '';
                a.setAttribute('href', href);
                for (const child of node.content || []) {
                    const childEl = renderRichTextNode(child);
                    if (childEl) a.appendChild(childEl);
                }
                return a;
            }
            case 'text': {
                const value = typeof node.value === 'string' ? node.value : '';
                const marks = Array.isArray(node.marks) ? node.marks : [];

                const hasCode = marks.some((m) => m.type === 'code');
                if (hasCode) {
                    // For multiline code, render as <pre><code>
                    if (value.includes('\n')) {
                        const pre = document.createElement('pre');
                        const code = document.createElement('code');
                        code.textContent = value;
                        pre.appendChild(code);
                        return pre;
                    }
                    const code = document.createElement('code');
                    code.textContent = value;
                    return code;
                }

                // Build text node(s) with <br> for hard line breaks
                let contentNode;
                if (value.includes('\n')) {
                    const frag = document.createDocumentFragment();
                    const parts = value.split('\n');
                    parts.forEach((part, idx) => {
                        frag.appendChild(document.createTextNode(part));
                        if (idx < parts.length - 1) frag.appendChild(document.createElement('br'));
                    });
                    contentNode = frag;
                } else {
                    contentNode = document.createTextNode(value);
                }

                // Apply non-code marks as wrappers
                let current = contentNode;
                for (const mark of marks) {
                    if (mark.type === 'code') continue;
                    let wrapper = null;
                    switch (mark.type) {
                        case 'bold':
                            wrapper = document.createElement('strong');
                            break;
                        case 'italic':
                            wrapper = document.createElement('em');
                            break;
                        case 'underline':
                            wrapper = document.createElement('u');
                            break;
                        default:
                            wrapper = null;
                    }
                    if (wrapper) {
                        wrapper.appendChild(current);
                        current = wrapper;
                    }
                }
                return current;
            }
            default:
                // Unsupported node types are ignored to avoid breaking rendering
                return document.createDocumentFragment();
        }
    }

    function renderRichTextToContainer(richTextDocument, container) {
        const rendered = renderRichTextNode(richTextDocument);
        container.appendChild(rendered);
    }

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
                const documentToHtml = getRichTextRenderer();

                // Build the post shell
                postContent.innerHTML = `
                    <h1 class="post-full-title">${post.title || 'Untitled Post'}</h1>
                    <p class="post-full-meta">Published on ${publishDate}</p>
                    <div class="post-full-body"></div>
                `;

                const bodyContainer = postContent.querySelector('.post-full-body');
                if (!post.postBody) {
                    bodyContainer.innerHTML = '<p>This post has no content.</p>';
                } else if (documentToHtml) {
                    // Prefer official HTML renderer if available
                    bodyContainer.innerHTML = documentToHtml(post.postBody);
                } else {
                    // Fallback: safe DOM rendering
                    renderRichTextToContainer(post.postBody, bodyContainer);
                }
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
