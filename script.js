document.addEventListener('DOMContentLoaded', () => {
    initializeContentfulClient();

    // --- Fetch and Render Functions --- //

    async function renderProfile() {
        const panel = document.querySelector('#panel-profile .panel-content');
        if (!panel) return;
        panel.innerHTML = '<em>Loading...</em>'; // Loading state
        try {
            const entries = await window.contentfulClient.getEntries({ content_type: 'profile', limit: 1 });
            if (entries.items.length > 0) {
                const profile = entries.items[0].fields;
                panel.innerHTML = `
                    <h1 class="name">${profile.name || ''}</h1>
                    <h2 class="title">${profile.title || ''}</h2>
                    <h3 class="location">${profile.location || ''}</h3>
                    <p class="description">${profile.description || ''}</p>
                `;
            }
        } catch (error) {
            panel.innerHTML = '<em>Error loading profile data.</em>';
            console.error(error);
        }
    }

    async function renderPortfolio() {
        const panel = document.querySelector('#panel-portfolio .panel-content');
        if (!panel) return;
        panel.innerHTML = '<em>Loading...</em>'; // Loading state
        try {
            const entries = await window.contentfulClient.getEntries({
                content_type: 'job',
                include: 2 // Include linked roles
            });

            panel.innerHTML = ''; // Clear loading state
            entries.items.forEach(entry => {
                const job = entry.fields;
                const assetGroup = document.createElement('div');
                assetGroup.className = 'asset-group';

                let rolesHtml = '';
                if (job.roles) {
                    job.roles.forEach(role => {
                        if (role && role.fields) {
                            rolesHtml += `
                            <div class="asset-sub">
                                <span class="asset-details">${role.fields.jobTitle || ''}</span>
                                <span class="asset-status-sub">${role.fields.dateRange || ''}</span>
                            </div>
                        `;
                        }
                    });
                }

                assetGroup.innerHTML = `
                    <div class="asset-main">
                        <span class="asset-ticker">[${job.companyName || 'N/A'}]</span>
                        <span class="asset-status">${job.employmentDateRange || ''}</span>
                    </div>
                    ${rolesHtml}
                `;
                panel.appendChild(assetGroup);
            });
        } catch (error) {
            panel.innerHTML = '<em>Error loading portfolio data.</em>';
            console.error(error);
        }
    }

    async function renderHobbies() {
        const panel = document.querySelector('#panel-hobbies .panel-content');
        if (!panel) return;
        panel.innerHTML = '<em>Loading...</em>'; // Loading state
        try {
            const entries = await window.contentfulClient.getEntries({ content_type: 'hobby', order: 'fields.name' });
            panel.innerHTML = ''; // Clear loading state
            entries.items.forEach(item => {
                const hobby = item.fields;
                const hobbyAsset = document.createElement('div');
                hobbyAsset.className = 'hobby-asset';
                hobbyAsset.innerHTML = `
                    <span class="asset-ticker">[${hobby.ticker || ''}]</span>
                    <span class="asset-name">${hobby.name || ''}</span>
                    <span class="asset-performance ${hobby.performance ? hobby.performance.toLowerCase().split(' ')[0] : ''}">${hobby.performance || ''}</span>
                `;
                panel.appendChild(hobbyAsset);
            });
        } catch (error) {
            panel.innerHTML = '<em>Error loading hobbies.</em>';
            console.error(error);
        }
    }

    async function renderNews() {
        const panel = document.querySelector('#panel-news .panel-content');
        if (!panel) return;
        panel.innerHTML = '<em>Loading...</em>';
        try {
            const entries = await window.contentfulClient.getEntries({ content_type: 'newsItem', order: '-sys.createdAt' });
            panel.innerHTML = '';
            entries.items.forEach(item => {
                const news = item.fields;
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <span class="news-time">${news.time || ''}</span>
                    <span class="news-tag ${news.tag ? news.tag.toLowerCase() : ''}">${news.tag || ''}</span>
                    <span class="news-headline">${news.headline || ''}</span>
                `;
                panel.appendChild(newsItem);
            });
        } catch (error) {
            panel.innerHTML = '<em>Error loading news.</em>';
            console.error(error);
        }
    }

    async function renderBlogPosts() {
        const panel = document.querySelector('#panel-blog .panel-content');
        if (!panel) return;
        panel.innerHTML = '<em>Loading...</em>';
        try {
            const entries = await window.contentfulClient.getEntries({
                content_type: 'blog'
            });

            if (entries.items.length > 0) {
                panel.innerHTML = ''; // Clear loading
                const postList = document.createElement('ul');
                postList.className = 'blog-post-list';

                entries.items.forEach(item => {
                    const post = item.fields;
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<a href="blog.html?id=${item.sys.id}">${post.title || 'Untitled Post'}</a>`;
                    postList.appendChild(listItem);
                });

                panel.appendChild(postList);
            } else {
                panel.innerHTML = '<em>No blog posts yet.</em>';
            }
        } catch (error) {
            panel.innerHTML = '<em>Error loading blog posts.</em>';
            console.error(error);
        }
    }

    function loadAllContent() {
        renderProfile();
        renderPortfolio();
        renderHobbies();
        renderNews();
        renderBlogPosts();
    }

    // --- Live Clock Functionality --- //
    const timeElement = document.getElementById('local-time');

    function updateTime() {
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            timeElement.textContent = timeString;
        }
    }

    // --- Ticker Simulation --- //
    const priceElement = document.querySelector('.price');
    const changeElement = document.querySelector('.change');
    const slidingTickers = document.querySelectorAll('.sliding-ticker-content .ticker-item');

    let currentPrice = 1998.05;
    const basePrice = currentPrice;

    function simulateTicker() {
        if (!priceElement || !changeElement) return;

        const priceChange = (Math.random() - 0.5) * 5;
        currentPrice += priceChange;

        const changeValue = currentPrice - basePrice;
        const changePercent = (changeValue / basePrice) * 100;

        priceElement.textContent = currentPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        changeElement.textContent = `${changeValue.toFixed(2)} (${changePercent.toFixed(2)}%)`;

        changeElement.classList.remove('bullish', 'bearish', 'neutral');
        if (changeValue > 0) {
            changeElement.classList.add('bullish');
            changeElement.textContent = `+${changeElement.textContent}`;
        } else if (changeValue < 0) {
            changeElement.classList.add('bearish');
        } else {
            changeElement.classList.add('neutral');
        }

        slidingTickers.forEach(item => {
            const changeSpan = item.querySelector('.ticker-change');
            if (!changeSpan) return;
            
            const currentChangeText = changeSpan.textContent;
            const currentChangeMatch = currentChangeText.match(/([+-]?[\d.]+)/);
            if (!currentChangeMatch) return;

            let currentChange = parseFloat(currentChangeMatch[0]);
            const movement = (Math.random() - 0.48) * 0.5;
            let newChange = currentChange + movement;

            changeSpan.classList.remove('bullish', 'bearish', 'neutral');
            
            let arrow = '▶';
            if (newChange > 0.1) {
                changeSpan.classList.add('bullish');
                arrow = '▲';
            } else if (newChange < -0.1) {
                changeSpan.classList.add('bearish');
                arrow = '▼';
            } else {
                changeSpan.classList.add('neutral');
            }

            const sign = newChange > 0 ? '+' : '';
            changeSpan.textContent = `${sign}${newChange.toFixed(2)}% ${arrow}`;
        });
    }

    // --- Initial and interval calls --- //
    loadAllContent();
    updateTime();
    setInterval(updateTime, 1000);
    setInterval(simulateTicker, 2000);
});
