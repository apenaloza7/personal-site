# Personal Portfolio Website

A minimal, mobile-first personal portfolio built with vanilla HTML, CSS, and JavaScript. Content is managed in Contentful and deployed to GitHub Pages.

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES modules)
- **CMS:** Contentful
- **Analytics:** Inspectlet
- **Deployment:** GitHub Pages via GitHub Actions
- **Typography:** Space Grotesk + JetBrains Mono (Google Fonts)

## Project Structure

```
personal-site/
├── index.html              # Homepage
├── styles.css              # Pena Minimal design system
├── pages/
│   └── blog.html           # Individual blog post template
├── js/
    ├── main.js             # App bootstrap
    ├── blog.js             # Blog post page logic
    ├── utils/              # CMS client, DOM helpers, rich-text renderer
    ├── panels/             # Section renderers (hero, work, projects, etc.)
    └── features/           # Ticker band, command-input easter egg
```

## Content Types (Contentful)

| Section  | Content type     | Key fields |
| -------- | ---------------- | ---------- |
| Hero     | `profile`        | `name`, `description`, `location` |
| Work     | `job`            | `companyName`, `employmentDateRange`, linked `roles` |
| Projects | `project`        | `name`, `url`, `blurb`, `tag` |
| Writing  | `blog`           | `title`, `publishDate`, `postBody`, `category`, `readTime` |
| Reading  | `book`           | `title`, `shortTitle`, `status` |
| Ticker   | `marqueeMessage` | `message`, `isActive` |

## Local Development

Serve the repo root with any static file server (e.g. `python -m http.server`). Contentful credentials in `js/utils/contentful-client.js` are replaced by GitHub Actions secrets at deploy time.

## Archive

The previous terminal-themed site lives in [`archive/`]. Unviewable for now. 
