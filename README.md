# Personal Portfolio Website

This codebase contains the source for a personal portfolio website designed with a financial workstation theme. The application features a real-time stock ticker interface, interactive panels for professional experience and projects, and a dynamic blog system. It is built using vanilla JavaScript and integrates with Contentful as a headless CMS for content management.

## System Architecture

The following diagram illustrates the high-level architecture of the system, showing the relationships between the user, the hosting infrastructure (GitHub Pages), and the data source (Contentful).

```mermaid
graph TD
    User((User)) -->|HTTPS| CDN[GitHub Pages]
    CDN -->|Serves Static Assets| Browser[Web Browser]
    Browser -->|API Requests| CMS[Contentful CMS]
    Dev[Developer] -->|Push| Repo[GitHub Repository]
    Repo -->|Action| CI[GitHub Actions]
    CI -->|Deploy| CDN
```

## Technical Overview

### Tech Stack

-   **Frontend:** HTML5, CSS3, Vanilla JavaScript
-   **CMS:** Contentful (Headless CMS)
-   **Analytics:** Inspectlet
-   **Deployment:** GitHub Pages via GitHub Actions
-   **Typography:** IBM Plex Mono (Google Fonts)

### Project Structure

The project maintains a modular structure to separate concerns between styling, logic, and content handling.

```
personal-site/
├── index.html              # Main application entry point
├── styles.css              # Core styling definitions
├── js/
│   ├── main.js            # Application bootstrapper
│   ├── utils/             # Shared utilities (CMS client, DOM helpers)
│   ├── panels/            # UI component logic (Profile, Portfolio, Blog)
│   └── features/          # Interactive elements (Clock, Ticker)
└── pages/
    └── blog.html          # Individual blog post template
```

## Application Logic

### Initialization Sequence

Upon loading, the application initializes interactive features (like the clock and ticker) and content panels concurrently. This ensures a responsive user experience while data is being fetched.

```mermaid
sequenceDiagram
    participant DOM as DOM Content Loaded
    participant Main as main.js
    participant Feat as Features (Clock/Ticker)
    participant Client as Contentful Client
    participant Panels as Content Panels
    
    DOM->>Main: Trigger initializeApp()
    Main->>Feat: Initialize Interactive Features
    Main->>Client: Setup Contentful Client
    Main->>Panels: loadAllContent()
    par Load Panels
        Panels->>Panels: Render Profile
        Panels->>Panels: Render Portfolio
        Panels->>Panels: Render Blog
    end
```

### Data Pipeline

Data flows from the CMS to the user interface through a standardized pipeline of fetching, normalization, and rendering.

```mermaid
flowchart LR
    Init[Panel Initialization] --> Fetch[Fetch Contentful Entries]
    Fetch -->|JSON| Map[Map/Transform Data]
    Map -->|Model| DOM[Generate HTML Elements]
    DOM -->|Insert| UI[Update User Interface]
```