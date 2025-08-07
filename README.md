# Personal Portfolio Website

🚀 Welcome to the codebase for my personal portfolio website! 🚀

A terminal/workstation-themed personal website featuring a unique stock market ticker design that showcases my professional experience, projects, and blog posts. Built with vanilla JavaScript and integrated with Contentful CMS for dynamic content management.

## ✨ Features

### 🖥️ Terminal/Workstation Theme
- **Stock market ticker interface** - Financial market-inspired design with live status indicators
- **Interactive panels** - Six main sections: Profile, Portfolio, Blog, Personal Holdings, Contact, and News & Insights
- **Dynamic time display** - Real-time local time in the header
- **Animated tickers** - Sliding animations showcasing skills and interests

### 📝 Content Management
- **Contentful CMS integration** - Dynamic content loading for portfolio and blog
- **Blog system** - Individual blog post pages with rich text rendering
- **Portfolio showcase** - Job experience and roles dynamically loaded from CMS

### 🎨 Design & UX
- **Monospace typography** - IBM Plex Mono font for authentic terminal feel
- **Responsive design** - Mobile and desktop optimized
- **CSS animations** - Smooth transitions and engaging visual effects
- **Font Awesome icons** - Professional iconography

### 🔧 Development & Deployment
- **GitHub Actions CI/CD** - Automated deployment to GitHub Pages
- **Custom domain** - Deployed at penaloza.dev

## 🛠️ Tech Stack

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Fonts:** IBM Plex Mono (Google Fonts)
*   **Icons:** Font Awesome 6
*   **CMS:** Contentful Headless CMS
*   **Analytics:** Inspectlet
*   **Deployment:** GitHub Pages with GitHub Actions
*   **Domain:** Custom domain with CNAME

## 📁 Project Structure

```
personal-site/
├── index.html              # Main landing page
├── blog.html               # Blog post template page
├── styles.css              # Main stylesheet
├── script.js               # Main JavaScript functionality
├── blog.js                 # Blog-specific JavaScript
├── contentful-client.js    # Contentful CMS client setup
├── favicon.ico             # Site favicon
├── CNAME                   # Custom domain configuration
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment workflow
└── README.md               # This file
```

## 🏗️ Architecture & Data Flow

The following diagram illustrates how the website components interact and how content flows from Contentful CMS to the user interface:

```mermaid
graph TD
    A[User visits penaloza.dev] --> B[index.html]
    A --> C[blog.html?id=postId]
    
    B --> D[script.js]
    C --> E[blog.js]
    
    D --> F[contentful-client.js]
    E --> F
    
    F --> G[Contentful CMS]
    
    G --> H[Profile Content]
    G --> I[Portfolio/Jobs]
    G --> J[Blog Posts]
    G --> K[Roles Data]
    
    H --> L[Panel 1: Engineer Profile]
    I --> M[Panel 2: Portfolio]
    J --> N[Panel 3: Blog Preview]
    K --> M
    J --> O[Individual Blog Post]
    
    B --> P[styles.css]
    C --> P
    
    P --> Q[Terminal/Workstation Theme]
    P --> R[Stock Market Ticker UI]
    P --> S[Responsive Design]
    
    T[Developer Push] --> U[GitHub Actions]
    U --> V[Replace Contentful Secrets]
    V --> W[Deploy to gh-pages]
    W --> X[GitHub Pages]
    X --> A
    
    Y[IBM Plex Mono] --> P
    Z[Font Awesome] --> P
    AA[Inspectlet Analytics] --> B
    
    subgraph "Frontend Files"
        B
        C
        D
        E
        F
        P
    end
    
    subgraph "Content Management"
        G
        H
        I
        J
        K
    end
    
    subgraph "UI Components"
        L
        M
        N
        O
        Q
        R
        S
    end
    
    subgraph "Deployment Pipeline"
        T
        U
        V
        W
        X
    end
    
    subgraph "External Services"
        Y
        Z
        AA
    end
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
    style U fill:#e8f5e8
    style B fill:#fff3e0
    style C fill:#fff3e0
```

## 🏃‍♂️ Running Locally

### Quick Start
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/apenaloza7/personal-site.git
    cd personal-site
    ```

2.  **Open `index.html`:**
    Simply open the `index.html` file directly in your web browser.
    
    > **Note:** The site will work without Contentful setup, but dynamic content (portfolio, blog) won't load.

### Full Setup with Contentful
To enable dynamic content loading:

1.  **Set up Contentful account** at [contentful.com](https://www.contentful.com/)

2.  **Update Contentful credentials** in `contentful-client.js`:
    ```javascript
    const CONTENTFUL_SPACE_ID = 'your_actual_space_id';
    const CONTENTFUL_ACCESS_TOKEN = 'your_actual_access_token';
    ```

3.  **Create content types** in Contentful:
    - `profile` - For personal information
    - `job` - For work experience  
    - `role` - For specific job roles
    - `blogPost` - For blog entries

## 🚀 Deployment

This site uses GitHub Actions for automated deployment:

1. **Push to main branch** triggers automatic deployment
2. **Contentful credentials** are injected via GitHub Secrets during build
3. **Deployed to GitHub Pages** on the `gh-pages` branch
4. **Custom domain** configured via CNAME file

### GitHub Secrets Required:
- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ACCESS_TOKEN`

## 🔗 Links

*   **🌐 Live Site:** [penaloza.dev](https://penaloza.dev)
*   **💼 LinkedIn:** [Alejandro Penaloza](https://www.linkedin.com/in/penalozaalejandro/)
*   **🐙 GitHub:** [apenaloza7](https://github.com/apenaloza7)
*   **📺 YouTube:** [@penapoppin](https://www.youtube.com/@penapoppin)

---

Built with ❤️ and [Cursor](https://www.cursor.com/) by Alejandro Penaloza 💻
