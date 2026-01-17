/**
 * Weather display functionality using wttr.in API
 */

const WEATHER_CACHE_KEY = 'weather_cache'
const WEATHER_CACHE_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds
const CITY = 'Charlotte'
const STATE = 'NC'

/**
 * Maps wttr.in weather codes to emojis
 * @param {string} weatherCode - The weather code from wttr.in
 * @returns {string} - The corresponding emoji
 */
function getWeatherEmoji(weatherCode) {
	const code = parseInt(weatherCode, 10)
	
	// Weather codes from wttr.in (WWO codes)
	// https://www.worldweatheronline.com/developer/api/docs/weather-icons.aspx
	const emojiMap = {
		// Clear/Sunny
		113: '☀️',
		// Partly cloudy
		116: '⛅',
		// Cloudy
		119: '☁️',
		// Overcast
		122: '☁️',
		// Mist
		143: '🌫️',
		// Patchy rain possible
		176: '🌧️',
		// Patchy snow possible
		179: '❄️',
		// Patchy sleet possible
		182: '🌨️',
		// Patchy freezing drizzle possible
		185: '🌨️',
		// Thundery outbreaks possible
		200: '⛈️',
		// Blowing snow
		227: '❄️',
		// Blizzard
		230: '❄️',
		// Fog
		248: '🌫️',
		// Freezing fog
		260: '🌫️',
		// Patchy light drizzle
		263: '🌧️',
		// Light drizzle
		266: '🌧️',
		// Freezing drizzle
		281: '🌧️',
		// Heavy freezing drizzle
		284: '🌧️',
		// Patchy light rain
		293: '🌧️',
		// Light rain
		296: '🌧️',
		// Moderate rain at times
		299: '🌧️',
		// Moderate rain
		302: '🌧️',
		// Heavy rain at times
		305: '🌧️',
		// Heavy rain
		308: '🌧️',
		// Light freezing rain
		311: '🌧️',
		// Moderate or heavy freezing rain
		314: '🌧️',
		// Light sleet
		317: '🌨️',
		// Moderate or heavy sleet
		320: '🌨️',
		// Patchy light snow
		323: '❄️',
		// Light snow
		326: '❄️',
		// Patchy moderate snow
		329: '❄️',
		// Moderate snow
		332: '❄️',
		// Patchy heavy snow
		335: '❄️',
		// Heavy snow
		338: '❄️',
		// Ice pellets
		350: '🌨️',
		// Light rain shower
		353: '🌧️',
		// Moderate or heavy rain shower
		356: '🌧️',
		// Torrential rain shower
		359: '🌧️',
		// Light sleet showers
		362: '🌨️',
		// Moderate or heavy sleet showers
		365: '🌨️',
		// Light snow showers
		368: '❄️',
		// Moderate or heavy snow showers
		371: '❄️',
		// Light showers of ice pellets
		374: '🌨️',
		// Moderate or heavy showers of ice pellets
		377: '🌨️',
		// Patchy light rain with thunder
		386: '⛈️',
		// Moderate or heavy rain with thunder
		389: '⛈️',
		// Patchy light snow with thunder
		392: '⛈️',
		// Moderate or heavy snow with thunder
		395: '⛈️',
	}
	
	return emojiMap[code] || '🌡️'
}

/**
 * Fetches weather data from wttr.in
 * @returns {Promise<Object|null>} - Weather data or null on error
 */
async function fetchWeather() {
	try {
		const response = await fetch(`https://wttr.in/${CITY}?format=j1`)
		if (!response.ok) {
			throw new Error(`Weather API returned ${response.status}`)
		}
		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching weather:', error)
		return null
	}
}

/**
 * Gets cached weather data or fetches fresh data
 * @returns {Promise<Object|null>} - Weather data or null
 */
async function getWeatherData() {
	// Check cache first
	const cached = sessionStorage.getItem(WEATHER_CACHE_KEY)
	if (cached) {
		const { data, timestamp } = JSON.parse(cached)
		if (Date.now() - timestamp < WEATHER_CACHE_DURATION) {
			return data
		}
	}
	
	// Fetch fresh data
	const data = await fetchWeather()
	if (data) {
		sessionStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
			data,
			timestamp: Date.now()
		}))
	}
	return data
}

/**
 * Updates the weather display element
 * @function updateWeatherDisplay
 */
async function updateWeatherDisplay() {
	const weatherElement = document.getElementById('weather-display')
	if (!weatherElement) return
	
	const data = await getWeatherData()
	
	if (!data || !data.current_condition || !data.current_condition[0]) {
		weatherElement.textContent = '🌡️ Weather unavailable'
		return
	}
	
	const current = data.current_condition[0]
	const tempF = current.temp_F
	const condition = current.weatherDesc[0].value
	const weatherCode = current.weatherCode
	const emoji = getWeatherEmoji(weatherCode)
	
	weatherElement.innerHTML = `<span class="weather-emoji">${emoji}</span> ${CITY}, ${STATE}: ${tempF}°F, ${condition}`
}

/**
 * Initializes the weather display with automatic updates
 * @function initializeWeather
 */
export function initializeWeather() {
	// Initial update
	updateWeatherDisplay()
	
	// Refresh every 30 minutes
	setInterval(updateWeatherDisplay, WEATHER_CACHE_DURATION)
}
