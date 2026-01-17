/**
 * Simple view page initialization
 * Renders focused content in Terminal Noir style
 */

import { getContentfulEntries } from './utils/contentful-utils.js'

/**
 * Sets loading state for a section
 * @param {Element} element - The element to set loading state on
 */
function setLoading(element) {
    element.innerHTML = '<span class="loading">Loading...</span>'
}

/**
 * Sets error state for a section
 * @param {Element} element - The element to set error state on
 * @param {string} message - Error message to display
 */
function setError(element, message) {
    element.innerHTML = `<span class="error">${message}</span>`
}

/**
 * Renders the profile section
 * @async
 */
async function renderProfile() {
    const container = document.getElementById('simple-profile')
    if (!container) return

    setLoading(container)

    try {
        const entries = await getContentfulEntries({ content_type: 'profile', limit: 1 })

        if (entries.length === 0) {
            setError(container, 'No profile data available.')
            return
        }

        const profile = entries[0].fields
        container.innerHTML = `
            <div class="profile-name">${profile.name || 'Name Not Available'}</div>
            <div class="profile-title">${profile.title || ''}</div>
            <div class="profile-location">${profile.location || ''}</div>
            <div class="profile-description">${profile.description || ''}</div>
        `
    } catch (error) {
        console.error('Error loading profile:', error)
        setError(container, 'Error loading profile data.')
    }
}

/**
 * Renders the experience/portfolio section
 * @async
 */
async function renderExperience() {
    const container = document.getElementById('simple-experience')
    if (!container) return

    setLoading(container)

    try {
        const entries = await getContentfulEntries({
            content_type: 'job',
            include: 2 // Include linked roles
        })

        if (entries.length === 0) {
            setError(container, 'No experience data available.')
            return
        }

        const experienceHtml = entries.map(entry => {
            const job = entry.fields
            const rolesHtml = (job.roles || [])
                .filter(role => role && role.fields)
                .map(role => `
                    <div class="role-item">
                        <span class="role-title">${role.fields.jobTitle || ''}</span>
                        <span class="role-date">${role.fields.dateRange || ''}</span>
                    </div>
                `)
                .join('')

            return `
                <div class="experience-item">
                    <div class="experience-header">
                        <span class="company-name">[${job.companyName || 'N/A'}]</span>
                        <span class="date-range">${job.employmentDateRange || ''}</span>
                    </div>
                    ${rolesHtml}
                </div>
            `
        }).join('')

        container.innerHTML = experienceHtml
    } catch (error) {
        console.error('Error loading experience:', error)
        setError(container, 'Error loading experience data.')
    }
}

/**
 * Renders the projects section
 * @async
 */
async function renderProjects() {
    const container = document.getElementById('simple-projects')
    if (!container) return

    setLoading(container)

    try {
        const entries = await getContentfulEntries({
            content_type: 'project',
            order: 'fields.name'
        })

        if (entries.length === 0) {
            setError(container, 'No projects data available.')
            return
        }

        const projectsHtml = entries.map(entry => {
            const project = entry.fields
            const hasUrl = project.url && project.url.trim() !== ''
            
            if (hasUrl) {
                return `
                    <div class="project-item">
                        <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link">${project.name || 'Untitled Project'}</a>
                    </div>
                `
            } else {
                return `
                    <div class="project-item">
                        <span class="project-name">${project.name || 'Untitled Project'}</span>
                    </div>
                `
            }
        }).join('')

        container.innerHTML = projectsHtml
    } catch (error) {
        console.error('Error loading projects:', error)
        setError(container, 'Error loading projects data.')
    }
}

/**
 * Initialize the simple view page
 */
function initializeSimplePage() {
    // Initialize Contentful client
    try {
        initializeContentfulClient()
    } catch (error) {
        console.error('Error initializing Contentful client:', error)
    }

    // Load all sections in parallel
    renderProfile()
    renderExperience()
    renderProjects()
    // Contact section is static HTML, no JS needed
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', initializeSimplePage)
