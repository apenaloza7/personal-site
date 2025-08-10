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
├── styles.css              # Main stylesheet
├── favicon.ico             # Site favicon
├── CNAME                   # Custom domain configuration
├── pages/                  # Secondary HTML pages
│   └── blog.html          # Blog post template page
├── js/                     # Modular JavaScript architecture
│   ├── main.js            # Main application coordination
│   ├── blog.js            # Blog-specific JavaScript
│   ├── utils/             # Shared utility functions
│   │   ├── contentful-client.js # Contentful CMS client setup
│   │   ├── contentful-utils.js  # Contentful API utilities
│   │   ├── dom-utils.js         # DOM manipulation utilities
│   │   └── ui-utils.js          # UI state management utilities
│   ├── panels/            # Content panel modules
│   │   ├── profile-panel.js    # Profile rendering logic
│   │   ├── portfolio-panel.js  # Portfolio/jobs rendering logic
│   │   ├── hobbies-panel.js    # Hobbies rendering logic
│   │   ├── news-panel.js       # News rendering logic
│   │   └── blog-panel.js       # Blog posts rendering logic
│   └── features/          # Interactive feature modules
│       ├── live-clock.js       # Real-time clock functionality
│       └── ticker-simulation.js # Stock ticker simulation
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
    A --> C[pages/blog.html?id=postId]
    
    B --> D[js/main.js]
    C --> E[js/blog.js]
    
    D --> F[js/utils/contentful-client.js]
    E --> F
    
    D --> F1[js/panels/profile-panel.js]
    D --> F2[js/panels/portfolio-panel.js]
    D --> F3[js/panels/blog-panel.js]
    D --> F4[js/panels/hobbies-panel.js]
    D --> F5[js/panels/news-panel.js]
    
    F1 --> G1[js/utils/contentful-utils.js]
    F2 --> G1
    F3 --> G1
    F4 --> G1
    F5 --> G1
    
    G1 --> G2[js/utils/ui-utils.js]
    G1 --> G3[js/utils/dom-utils.js]
    
    D --> H1[js/features/live-clock.js]
    D --> H2[js/features/ticker-simulation.js]
    
    F --> I[Contentful CMS]
    G1 --> I
    
    I --> J1[Profile Content]
    I --> J2[Portfolio/Jobs Data]
    I --> J3[Blog Posts]
    I --> J4[Roles Data]
    I --> J5[Hobbies Data]
    I --> J6[News Items]
    
    J1 --> K1[Panel 1: Engineer Profile]
    J2 --> K2[Panel 2: Portfolio]
    J4 --> K2
    J3 --> K3[Panel 3: Blog Preview]
    J5 --> K4[Panel 4: Personal Holdings]
    J6 --> K6[Panel 6: News & Insights]
    K5[Panel 5: MSG/Contact] --> B
    J3 --> L[Individual Blog Post Page]
    
    B --> M[styles.css]
    C --> M
    
    M --> N1[Terminal/Workstation Theme]
    M --> N2[Stock Market Ticker UI]
    M --> N3[Responsive Design]
    
    O[Developer Push] --> P[GitHub Actions Workflow]
    P --> Q[Replace Contentful Secrets]
    Q --> R[Deploy to gh-pages]
    R --> S[GitHub Pages]
    S --> A
    
    T1[IBM Plex Mono] --> M
    T2[Font Awesome] --> M
    T3[Inspectlet Analytics] --> B
    T4[Contentful SDK] --> F
    
    subgraph "Core Application"
        B
        C
        D
        E
        M
    end
    
    subgraph "Panel Components"
        F1
        F2
        F3
        F4
        F5
        K1
        K2
        K3
        K4
        K5
        K6
    end
    
    subgraph "Utility Modules"
        F
        G1
        G2
        G3
    end
    
    subgraph "Interactive Features"
        H1
        H2
    end
    
    subgraph "Content Management"
        I
        J1
        J2
        J3
        J4
        J5
        J6
    end
    
    subgraph "Deployment Pipeline"
        O
        P
        Q
        R
        S
    end
    
    subgraph "External Dependencies"
        T1
        T2
        T3
        T4
    end
    
    style A fill:#e1f5fe
    style I fill:#f3e5f5
    style P fill:#e8f5e8
    style B fill:#fff3e0
    style C fill:#fff3e0
    style D fill:#ffebcd
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
    - `hobby` - For personal interests and hobbies
    - `newsItem` - For news and insights content

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
