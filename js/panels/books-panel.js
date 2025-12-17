/**
 * Bookshelf panel rendering logic
 */

import { getContentfulEntries } from '../utils/contentful-utils.js'
import { setLoadingState, setErrorState } from '../utils/ui-utils.js'
import { createElement } from '../utils/dom-utils.js'

/**
 * Creates a book item element
 * @function createBookItem
 * @param {Object} book - Book fields object
 * @returns {Element} The book item element
 */
const createBookItem = (book) => {
    // Determine status class
    let statusClass = ''
    let statusLabel = ''
    
    if (book.status) {
        const status = book.status.toLowerCase()
        if (status.includes('reading')) {
            statusClass = 'reading'
            statusLabel = 'READING'
        } else if (status.includes('read')) {
            statusClass = 'read'
            statusLabel = 'READ'
        } else if (status.includes('unread')) {
            statusClass = 'unread'
            statusLabel = 'NOT READ'
        }
    }

    // Handle image
    const imageUrl = book.coverImage?.fields?.file?.url 
        ? `https:${book.coverImage.fields.file.url}` 
        : 'assets/placeholder_book.png' // Fallback if needed

    // Create container
    const container = createElement('div', 'book-item')
    
    container.innerHTML = `
        <div class="book-cover-container">
            <img src="${imageUrl}" alt="Cover of ${book.title}" class="book-cover" loading="lazy">
            <span class="book-status-badge ${statusClass}">${statusLabel}</span>
        </div>
        <div class="book-info">
            <div class="book-title">${book.title || 'Untitled'}</div>
            <div class="book-author">${book.author || 'Unknown Author'}</div>
            ${book.rating ? `<div class="book-rating">${'★'.repeat(book.rating)}</div>` : ''}
        </div>
    `
    
    return container
}

/**
 * Renders the bookshelf section with books from Contentful
 * @async
 * @function renderBooks
 */
export async function renderBooks() {
    const panel = document.querySelector('#panel-books .panel-content')
    if (!panel) return

    setLoadingState(panel)

    // Fetch books, ordered by status then title
    // Note: 'sys.createdAt' is a safe default sort if custom fields aren't indexed yet
    const entries = await getContentfulEntries({ 
        content_type: 'book', 
        order: '-sys.createdAt' 
    })

    if (entries.length === 0) {
        // If no books found, we can show a placeholder or empty state
        // For now, let's keep it clean or show a message
        setErrorState(panel, 'Library offline.')
        return
    }

    panel.innerHTML = '<div class="books-grid"></div>'
    const grid = panel.querySelector('.books-grid')

    entries
        .map(item => createBookItem(item.fields))
        .forEach(bookItem => grid.appendChild(bookItem))
}

