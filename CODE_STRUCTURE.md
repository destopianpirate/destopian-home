# Destopian Home Codebase & Graph Structure

This document outlines the file structure, architecture graph, and file responsibilities for the **Destopian Home** project. By modularizing the project assets (specifically decomposing the 1600+ line stylesheet into targeted files), we've made development more structured and reduced context window/token usage.

---

## 📂 Directory Structure

Below is the directory structure for the `destopian-home` project:

```text
destopian-home/
├── README.md               # Quick overview of the landing page
├── CODE_STRUCTURE.md       # [This File] Code hierarchy and architecture documentation
└── docs/                   # Public static site directory (served locally and via GitHub Pages)
    ├── index.html          # Main HTML structure containing page sections
    ├── script.js           # Interactive JS controller, navigation state, and animations
    ├── style.css           # Main CSS entry point (imports all modular sheets)
    ├── assets/             # Images, sigils, logos, and static media
    └── css/                # Modular stylesheets (optimized for minimal token/credit usage)
        ├── variables.css   # Color palettes, typography variables, resets, and element defaults
        ├── animations.css  # Conic radar spin, matrix rain effects, pulses, and scanlines
        ├── layout.css      # Core grid alignments, containers, page frames, and landing hero layout
        ├── navigation.css  # Headers, command-bar menus, channel button styling
        ├── components.css  # General reuse classes: buttons, cards, stat counters, and gauges
        ├── pages.css       # Page-specific content overrides (Arsenal, Manifesto, About)
        ├── footer.css      # Global footer grid, copyrights, and regulatory notes
        └── responsive.css  # Media queries handling tablet and mobile formatting
```

---

## 📊 Import & Dependency Graph

The following graph maps how files reference, import, and depend on each other:

```mermaid
graph TD
    %% Base entry points
    Browser[Web Browser] --> index.html

    %% HTML dependencies
    index.html -->|Loads script| script.js
    index.html -->|Loads styles| style.css
    index.html -->|Loads assets| assets[assets/ logo, sigil, etc.]

    %% CSS Module imports
    style.css -->|@import| variables.css[css/variables.css]
    style.css -->|@import| animations.css[css/animations.css]
    style.css -->|@import| layout.css[css/layout.css]
    style.css -->|@import| navigation.css[css/navigation.css]
    style.css -->|@import| components.css[css/components.css]
    style.css -->|@import| pages.css[css/pages.css]
    style.css -->|@import| footer.css[css/footer.css]
    style.css -->|@import| responsive.css[css/responsive.css]

    %% CSS imports fonts
    variables.css -->|@import| GoogleFonts[Google Sans, Space Grotesk, JetBrains Mono]

    %% Style nodes styling HTML
    variables.css -.->|Styles| index.html
    animations.css -.->|Styles| index.html
    layout.css -.->|Styles| index.html
    navigation.css -.->|Styles| index.html
    components.css -.->|Styles| index.html
    pages.css -.->|Styles| index.html
    footer.css -.->|Styles| index.html
    responsive.css -.->|Styles| index.html

    %% JS nodes manipulating HTML
    script.js -.->|Interactions & Routing| index.html

    %% Styling classes
    classDef main fill:#e8530e,stroke:#1e2230,color:#fff;
    classDef module fill:#161a24,stroke:#1e2230,color:#e2ddd5;
    classDef external fill:#0c0e14,stroke:#1e2230,color:#8e8a82;

    class index.html,style.css,script.js main;
    class variables.css,animations.css,layout.css,navigation.css,components.css,pages.css,footer.css,responsive.css module;
    class GoogleFonts,Browser,assets external;
```

---

## 🛠 File Responsibilities

| File Path | Purpose / Description |
| :--- | :--- |
| **`index.html`** | Structure layer. Contains standard HTML5 header metadata (title, SEO, descriptors) and anchors for all page channels (Home, Arsenal, Manifesto, Intel, About, Dead Drop). |
| **`script.js`** | Behavioral layer. Handles logic for the canvas matrix rain background, tabs/routing page navigation, interactive FAQ expansion, scroll animations, and loading counter meters. |
| **`style.css`** | Style gateway. Imports modular CSS files. Allows caching of individual components and makes editing specific styles extremely fast. |
| **`css/variables.css`** | The core design tokens. Sets HSL variables, root fonts, default box-sizing resets, and basic elements like custom browser scrollbars. |
| **`css/animations.css`** | All visual animation systems (e.g. radar grid scans, active node blinks, matrix weather drop drops, pulse dots). |
| **`css/layout.css`** | Global grid systems, structural margins/paddings, page transitions (`.page-view`), and hero content. |
| **`css/navigation.css`** | Top sticky command navigation strip, mobile hamburger menus, channel tags, and server availability stats. |
| **`css/components.css`** | Modular class styling for general pieces (primary/secondary buttons, pillar lists, news rows, interactive FAQ toggles, gauge scales, callout boxes). |
| **`css/pages.css`** | Styles targeted to specific page sections (such as the Manifesto blockquote structure, extension cards, Dead Drop form cards, and sidebar metadata). |
| **`css/footer.css`** | Site-footer links, legal tags, and social references. |
| **`css/responsive.css`** | Breakpoint adaptations for screens under `1024px` and `768px`. |

---

## ⚡ Token & Credit Optimization Strategy

Decomposing single large assets into modular chunks is a best practice when using AI coding assistants. Here's why this setup saves token and credit usage:

1. **Focused Context Reads**: When you want the AI assistant to edit or examine button styles, it only needs to read `css/components.css` (~340 lines) rather than the massive legacy stylesheet (~1700 lines). This avoids processing unrelated layout and keyframe logic.
2. **Narrower Edits**: When editing styles (e.g., adding responsiveness for mobile menus), the AI only changes a single small file (`css/responsive.css`) instead of rewriting lines inside a huge unified stylesheet. This prevents payload bloat.
3. **Better Caching**: Browsers cache individual stylesheet modules. Only files that actually change will get requested again, speeding up local page refreshes.
