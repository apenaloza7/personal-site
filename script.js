document.addEventListener('DOMContentLoaded', () => {
	initializeContentfulClient()

	// --- Utility Functions --- //

	/**
	 * Sets loading state for a panel
	 * @function setLoadingState
	 * @param {Element} panel - The panel element
	 * @param {string} message - Loading message
	 */
	const setLoadingState = (panel, message = 'Loading...') => {
		if (panel) panel.innerHTML = `<em>${message}</em>`
	}

	/**
	 * Sets error state for a panel
	 * @function setErrorState
	 * @param {Element} panel - The panel element
	 * @param {string} message - Error message
	 * @param {Error} error - The error object for logging
	 */
	const setErrorState = (panel, message, error) => {
		if (panel) panel.innerHTML = `<em>${message}</em>`
		if (error) console.error(error)
	}

	/**
	 * Creates a DOM element with specified tag, className, and content
	 * @function createElement
	 * @param {string} tag - HTML tag name
	 * @param {string} className - CSS class name
	 * @param {string} innerHTML - Inner HTML content
	 * @returns {Element} The created element
	 */
	const createElement = (tag, className = '', innerHTML = '') => {
		const element = document.createElement(tag)
		if (className) element.className = className
		if (innerHTML) element.innerHTML = innerHTML
		return element
	}

	/**
	 * Safely gets Contentful entries with error handling
	 * @async
	 * @function getContentfulEntries
	 * @param {Object} query - Query parameters for Contentful
	 * @returns {Promise<Array>} Array of entries or empty array on error
	 */
	const getContentfulEntries = async (query) => {
		try {
			const entries = await window.contentfulClient.getEntries(query)
			return entries.items
		} catch (error) {
			console.error('Error fetching Contentful entries:', error)
			return []
		}
	}

	// --- Fetch and Render Functions --- //

	/**
	 * Renders the profile section with data from Contentful
	 * @async
	 * @function renderProfile
	 */
	async function renderProfile() {
		const panel = document.querySelector('#panel-profile .panel-content')
		if (!panel) return

		setLoadingState(panel)
		const entries = await getContentfulEntries({ content_type: 'profile', limit: 1 })

		if (entries.length === 0) {
			setErrorState(panel, 'No profile data available.')
			return
		}

		const profile = entries[0].fields
		panel.innerHTML = `
			<h1 class="name">${profile.name || ''}</h1>
			<h2 class="title">${profile.title || ''}</h2>
			<h3 class="location">${profile.location || ''}</h3>
			<p class="description">${profile.description || ''}</p>
		`
	}

	/**
	 * Creates role HTML for a job
	 * @function createRoleHtml
	 * @param {Array} roles - Array of role objects
	 * @returns {string} HTML string for roles
	 */
	const createRoleHtml = (roles = []) => {
		return roles
			.filter(role => role && role.fields)
			.map(role => `
				<div class="asset-sub">
					<span class="asset-details">${role.fields.jobTitle || ''}</span>
					<span class="asset-status-sub">${role.fields.dateRange || ''}</span>
				</div>
			`)
			.join('')
	}

	/**
	 * Creates a job asset group element
	 * @function createJobAssetGroup
	 * @param {Object} job - Job fields object
	 * @returns {Element} The asset group element
	 */
	const createJobAssetGroup = (job) => {
		const rolesHtml = createRoleHtml(job.roles)
		return createElement('div', 'asset-group', `
			<div class="asset-main">
				<span class="asset-ticker">[${job.companyName || 'N/A'}]</span>
				<span class="asset-status">${job.employmentDateRange || ''}</span>
			</div>
			${rolesHtml}
		`)
	}

	/**
	 * Renders the portfolio section with job data from Contentful
	 * @async
	 * @function renderPortfolio
	 */
	async function renderPortfolio() {
		const panel = document.querySelector('#panel-portfolio .panel-content')
		if (!panel) return

		setLoadingState(panel)
		const entries = await getContentfulEntries({
			content_type: 'job',
			include: 2 // Include linked roles
		})

		if (entries.length === 0) {
			setErrorState(panel, 'No portfolio data available.')
			return
		}

		panel.innerHTML = '' // Clear loading state
		entries
			.map(entry => createJobAssetGroup(entry.fields))
			.forEach(assetGroup => panel.appendChild(assetGroup))
	}

	/**
	 * Creates a hobby asset element
	 * @function createHobbyAsset
	 * @param {Object} hobby - Hobby fields object
	 * @returns {Element} The hobby asset element
	 */
	const createHobbyAsset = (hobby) => {
		const performanceClass = hobby.performance ? hobby.performance.toLowerCase().split(' ')[0] : ''
		return createElement('div', 'hobby-asset', `
			<span class="asset-ticker">[${hobby.ticker || ''}]</span>
			<span class="asset-name">${hobby.name || ''}</span>
			<span class="asset-performance ${performanceClass}">${hobby.performance || ''}</span>
		`)
	}

	/**
	 * Renders the hobbies section with hobby data from Contentful
	 * @async
	 * @function renderHobbies
	 */
	async function renderHobbies() {
		const panel = document.querySelector('#panel-hobbies .panel-content')
		if (!panel) return

		setLoadingState(panel)
		const entries = await getContentfulEntries({ content_type: 'hobby', order: 'fields.name' })

		if (entries.length === 0) {
			setErrorState(panel, 'No hobbies data available.')
			return
		}

		panel.innerHTML = '' // Clear loading state
		entries
			.map(item => createHobbyAsset(item.fields))
			.forEach(hobbyAsset => panel.appendChild(hobbyAsset))
	}

	/**
	 * Creates a news item element
	 * @function createNewsItem
	 * @param {Object} news - News fields object
	 * @returns {Element} The news item element
	 */
	const createNewsItem = (news) => {
		const tagClass = news.tag ? news.tag.toLowerCase() : ''
		return createElement('div', 'news-item', `
			<span class="news-time">${news.time || ''}</span>
			<span class="news-tag ${tagClass}">${news.tag || ''}</span>
			<span class="news-headline">${news.headline || ''}</span>
		`)
	}

	/**
	 * Renders the news section with news items from Contentful
	 * @async
	 * @function renderNews
	 */
	async function renderNews() {
		const panel = document.querySelector('#panel-news .panel-content')
		if (!panel) return

		setLoadingState(panel)
		const entries = await getContentfulEntries({ content_type: 'newsItem', order: '-sys.createdAt' })

		if (entries.length === 0) {
			setErrorState(panel, 'No news available.')
			return
		}

		panel.innerHTML = ''
		entries
			.map(item => createNewsItem(item.fields))
			.forEach(newsItem => panel.appendChild(newsItem))
	}

	/**
	 * Creates a blog post list item
	 * @function createBlogPostItem
	 * @param {Object} item - Blog post item with sys and fields
	 * @returns {Element} The list item element
	 */
	const createBlogPostItem = (item) => {
		const link = createElement('a')
		link.href = `blog.html?id=${item.sys.id}`
		link.textContent = item.fields.title || 'Untitled Post'

		const listItem = createElement('li')
		listItem.appendChild(link)
		return listItem
	}

	/**
	 * Renders the blog posts section with blog data from Contentful
	 * @async
	 * @function renderBlogPosts
	 */
	async function renderBlogPosts() {
		const panel = document.querySelector('#panel-blog .panel-content')
		if (!panel) return

		setLoadingState(panel)
		const entries = await getContentfulEntries({
			content_type: 'blog',
			order: '-fields.publishDate' // Order by publish date, most recent first
		})

		if (entries.length === 0) {
			panel.innerHTML = '<em>No blog posts yet.</em>'
			return
		}

		panel.innerHTML = '' // Clear loading
		const postList = createElement('ul', 'blog-post-list')

		entries
			.map(createBlogPostItem)
			.forEach(listItem => postList.appendChild(listItem))

		panel.appendChild(postList)
	}

	/**
	 * Loads all content sections in parallel
	 * @function loadAllContent
	 */
	function loadAllContent() {
		renderProfile()
		renderPortfolio()
		renderHobbies()
		renderNews()
		renderBlogPosts()
	}

	// --- Live Clock Functionality --- //
	const timeElement = document.getElementById('local-time')

	/**
	 * Updates the time display element
	 * @function updateTime
	 */
	function updateTime() {
		if (timeElement) {
			const now = new Date()
			const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
			timeElement.textContent = timeString
		}
	}

	// --- Ticker Simulation --- //
	const priceElement = document.querySelector('.price')
	const changeElement = document.querySelector('.change')
	const slidingTickers = document.querySelectorAll('.sliding-ticker-content .ticker-item')

	let currentPrice = 1998.05
	const basePrice = currentPrice

	/**
	 * Simulates ticker price changes and updates display
	 * @function simulateTicker
	 */
	function simulateTicker() {
		if (!priceElement || !changeElement) return

		const priceChange = (Math.random() - 0.5) * 5
		currentPrice += priceChange

		const changeValue = currentPrice - basePrice
		const changePercent = (changeValue / basePrice) * 100

		priceElement.textContent = currentPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
		changeElement.textContent = `${changeValue.toFixed(2)} (${changePercent.toFixed(2)}%)`

		changeElement.classList.remove('bullish', 'bearish', 'neutral')
		if (changeValue > 0) {
			changeElement.classList.add('bullish')
			changeElement.textContent = `+${changeElement.textContent}`
		} else if (changeValue < 0) {
			changeElement.classList.add('bearish')
		} else {
			changeElement.classList.add('neutral')
		}

		slidingTickers.forEach(item => {
			const changeSpan = item.querySelector('.ticker-change')
			if (!changeSpan) return

			const currentChangeText = changeSpan.textContent
			const currentChangeMatch = currentChangeText.match(/([+-]?[\d.]+)/)
			if (!currentChangeMatch) return

			let currentChange = parseFloat(currentChangeMatch[0])
			const movement = (Math.random() - 0.48) * 0.5
			let newChange = currentChange + movement

			changeSpan.classList.remove('bullish', 'bearish', 'neutral')

			let arrow = '▶'
			if (newChange > 0.1) {
				changeSpan.classList.add('bullish')
				arrow = '▲'
			} else if (newChange < -0.1) {
				changeSpan.classList.add('bearish')
				arrow = '▼'
			} else {
				changeSpan.classList.add('neutral')
			}

			const sign = newChange > 0 ? '+' : ''
			changeSpan.textContent = `${sign}${newChange.toFixed(2)}% ${arrow}`
		})
	}

	// --- Initial and interval calls --- //
	loadAllContent()
	updateTime()
	setInterval(updateTime, 1000)
	setInterval(simulateTicker, 2000)
})
