function initializeContentfulClient() {
    // --- Contentful Setup --- //
    const CONTENTFUL_SPACE_ID = 'YOUR_SPACE_ID_PLACEHOLDER';
    const CONTENTFUL_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_PLACEHOLDER';

    const client = contentful.createClient({
        space: CONTENTFUL_SPACE_ID,
        accessToken: CONTENTFUL_ACCESS_TOKEN,
    });

    // Expose the client to the global window object so all scripts can use it
    window.contentfulClient = client;
}
