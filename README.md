# Word Mess - Web Content Fetcher & Display

A Microsoft Word-style interface for fetching and displaying website content in a clean, formatted view.

**[🌐 Live Demo](https://jyx0615.github.io/Word-Mess/)**


## Overview

Word Mess is a web application that allows you to fetch content from any website and display it in a beautiful, Word-like interface. It extracts text and images while preserving their original positions and provides formatting controls similar to Microsoft Word.

## Features

✨ **Core Features**
- 🔗 **Web Content Fetcher**: Fetch and display content from any website URL
- 📄 **Word-like Interface**: Familiar toolbar with tabs and formatting options
- 🖼️ **Image Preservation**: Images display inline in their original positions
- 🎨 **Text Formatting**: Bold, Italic, Underline, Font size, Font family
- 📋 **Style Presets**: Normal, No Spacing, Heading 1, Heading 2
- 💾 **Download**: Export document as plain text (.txt)
- 📱 **Responsive Design**: Works flawlessly on desktop and mobile devices
- 🔐 **CORS Handling**: Automatic bypass of cross-origin restrictions

## Quick Start

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Enter a website URL and press Enter
4. View extracted content with images in Word-like interface

## Project Structure

```
messAround/
├── index.html          # HTML structure and layout
├── styles.css          # CSS styling
├── script.js           # Modular JavaScript
├── logo.png            # Favicon for browser tab
└── README.md           # This file
```

## File Details

### index.html
Complete HTML structure with:
- **Toolbar Header**: Logo favicon, Quick access buttons (Home, Save, Undo, Redo, Print), Search box, Source display
- **Tabs**: Home, Insert, Design, Layout, References, Review, View
- **Toolbar Sections** (3 columns):
  - Column 1: Clipboard group (Paste, Cut, Copy, Brush) + Font controls
  - Column 2: Formatting icons (Bold, Italic, Underline, Color, Highlight, Alignment, Lists, Indent, etc.)
  - Column 3: Style presets (Normal, No Spacing, Heading 1, Heading 2)
- **Content Area**: Document display container with loading and error states

### styles.css (713 lines)
Organized stylesheet with:
- **Base styles**: Global reset and body styling
- **Toolbar**: Header, tabs, sections, buttons, and groups
- **Clipboard group**: Large paste button with stacked clipboard operations
- **Font controls**: Font family dropdown and size input
- **Formatting styles**: Icon styling, hover states, active states
- **Content area**: Word container, image styling, error/loading states

**Key features:**
- Blue toolbar (#2b579a) matching Word aesthetic
- Smooth transitions and hover effects

### script.js (Modular OOP)

Three main classes handle all functionality:

#### **UIManager**
Manages DOM updates and visual state
```javascript
displayContent(content, domain)  // Render words and images
showError(message)               // Display error messages  
showLoading(show)                // Toggle loading spinner
```

#### **ContentManager**
Handles web fetching and content extraction
```javascript
init()                           // Setup event listeners
fetchAndDisplay()                // Async fetch from URL
extractContent(html)             // Parse and extract text/images
```

Key features:
- CORS proxy: `https://corsproxy.io/?url=`
- Recursive DOM traversal for nested content
- Automatic protocol addition (http/https)
- Sanitization of script/style/noscript tags

#### **EditorManager**
Handles formatting and document operations
```javascript
init()                           // Initialize listeners
setupToolbarButtons()            // Format button handlers
setupFontControls()              // Font size/family listeners
setupTabs()                      // Tab switching
clearDocument()                  // Reset to initial state
downloadDocument()               // Export as .txt
changeColor()                    // Color picker
```

## Usage Guide

### Fetching Content
1. **Enter URL**: Type any website URL in the search box
   - Examples: `https://en.wikipedia.org/wiki/Microsoft_Word`, `https://www.channelnewsasia.com/`
2. **Press Enter**: Content loads automatically
3. **View Content**: Text and images display in the document area

### Text Formatting
- **Bold/Italic/Underline**: Click buttons to toggle active state
- **Font Size**: Use slider (10-48px)
- **Font Family**: Select from dropdown (Arial, Georgia, etc.)

## Technical Details

### Content Processing Pipeline

```
1. URL Input → https:// + domain auto-complete
2. Fetch → CORS Proxy → HTML response
3. Parse → DOMParser.parseFromString()
4. Sanitize → Remove script/style/noscript
5. Extract → Recursive traversal
   - Text nodes → words
   - IMG tags → image URLs
6. Display → Create DOM elements
   - <span class="word"> for text
   - <img style="block"> for images
```

## Known Limitations

The following UI elements are decorative:
- Quick access buttons (Home, Save, Undo, Redo)
- Tab switching (visual only)
- Formatting buttons (show active state but don't apply styles)
- Color picker (accepts input but doesn't apply)

These are intentional as the focus is on content fetching and display.

## Troubleshooting

### Content not loading?
- Check that the website URL is correct
- Verify the website is publicly accessible
- Try a different website to test

### Images not showing?
- Some websites block image access
- CORS restrictions may prevent certain images
- Images must start with http/https

## Privacy & Security

- ✅ No data storage on servers
- ✅ No tracking or analytics
- ✅ All processing happens in browser
- ✅ URLs are not logged or saved
- ✅ No login required

## License

Free to use, modify, and distribute. No attribution required.
