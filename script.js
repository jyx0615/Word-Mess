// Import modules
// Note: In production, consider using ES6 modules or a bundler

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    const uiManager = new UIManager();
    const contentManager = new ContentManager(uiManager);
    const editorManager = new EditorManager(uiManager);

    contentManager.init();
    editorManager.init();
};

/**
 * Content Manager - Handles fetching and processing web content
 */
class ContentManager {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.corsProxy = 'https://corsproxy.io/?url=';
    }

    init() {
        const urlInput = document.getElementById('urlInput');
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.fetchAndDisplay();
        });
    }

    async fetchAndDisplay() {
        const urlInput = document.getElementById('urlInput');
        const url = urlInput.value.trim();

        if (!url) {
            this.uiManager.showError('Please enter a valid URL');
            return;
        }

        let fullUrl = url.startsWith('http') ? url : 'https://' + url;

        try {
            this.uiManager.showLoading(true);
            const html = await fetch(this.corsProxy + fullUrl).then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.text();
            });

            const content = this.extractContent(html);
            if (content.length === 0) {
                this.uiManager.showError('No content found');
                return;
            }

            const domain = new URL(fullUrl).hostname;
            this.uiManager.displayContent(content, domain);
        } catch (error) {
            this.uiManager.showError(`Failed: ${error.message}`);
        } finally {
            this.uiManager.showLoading(false);
        }
    }

    extractContent(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        Array.from(doc.querySelectorAll('script, style, noscript')).forEach(el => el.remove());

        const content = [];
        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) {
                    text.split(/\s+/).forEach(word => {
                        if (word) content.push({ type: 'word', value: word });
                    });
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.nodeName === 'IMG' && node.src?.startsWith('http')) {
                    content.push({ type: 'image', value: node.src });
                } else {
                    node.childNodes.forEach(child => processNode(child));
                }
            }
        };

        doc.body.childNodes.forEach(node => processNode(node));
        return content;
    }
}

/**
 * Editor Manager - Handles text formatting and document operations
 */
class EditorManager {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.fontSize = 18;
    }

    init() {
        this.setupToolbarButtons();
        this.setupFontControls();
        this.setupTabs();
    }

    setupToolbarButtons() {
        // Make content editable
        const wordContainer = document.getElementById('wordContainer');
        wordContainer.contentEditable = 'true';
        wordContainer.style.outline = 'none';

        const buttons = {
            boldBtn: { action: 'bold' },
            italicBtn: { action: 'italic' },
            underlineBtn: { action: 'underline' },
            strikethroughBtn: { action: 'strikeThrough' },
            highlightBtn: { action: () => this.applyHighlight() },
            resetBtn: { action: () => this.resetFormatting() },
            clearBtn: { action: () => this.clearDocument() },
            downloadBtn: { action: () => this.downloadDocument() },
            colorBtn: { action: () => this.changeColor() }
        };

        // Handle formatting buttons
        Object.entries(buttons).forEach(([id, config]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (typeof config.action === 'string') {
                        document.execCommand(config.action, false, null);
                        this.updateButtonStates();
                    } else {
                        config.action();
                    }
                });
            }
        });

        // Update button states on selection change
        wordContainer.addEventListener('mouseup', () => this.updateButtonStates());
        wordContainer.addEventListener('keyup', () => this.updateButtonStates());
    }

    updateButtonStates() {
        const buttons = ['bold', 'italic', 'underline', 'strikeThrough'];
        const buttonIds = ['boldBtn', 'italicBtn', 'underlineBtn', 'strikethroughBtn'];

        buttons.forEach((command, index) => {
            const btn = document.getElementById(buttonIds[index]);
            if (btn) {
                const isActive = document.queryCommandState(command);
                if (isActive) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });
    }

    applyHighlight() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const parent = range.commonAncestorContainer.parentElement;

        // Check if already highlighted
        const isHighlighted = parent && (
            parent.style.backgroundColor === 'rgb(255, 235, 59)' ||
            parent.style.backgroundColor === '#ffeb3b'
        );

        if (isHighlighted) {
            // Remove highlight
            document.execCommand('hiliteColor', false, 'transparent');
        } else {
            // Apply highlight
            document.execCommand('hiliteColor', false, '#ffeb3b');
        }
    }

    resetFormatting() {
        document.execCommand('removeFormat', false, null);
        this.updateButtonStates();
    }

    setupFontControls() {
        const fontSizeInput = document.getElementById('fontSizeInput');
        const fontFamily = document.getElementById('fontFamily');
        const wordContainer = document.getElementById('wordContainer');

        fontSizeInput?.addEventListener('input', (e) => {
            this.fontSize = parseInt(e.target.value) || 18;
            wordContainer.style.fontSize = this.fontSize + 'px';
        });

        fontFamily?.addEventListener('change', (e) => {
            wordContainer.style.fontFamily = e.target.value;
        });
    }

    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    clearDocument() {
        const wordContainer = document.getElementById('wordContainer');
        const sourceDiv = document.getElementById('source');
        wordContainer.innerHTML = '';
        sourceDiv.style.display = 'none';
        this.fontSize = 18;
        document.getElementById('fontSizeInput').value = 18;
        wordContainer.style.fontSize = '18px';
        document.querySelectorAll('.toolbar-btn.active').forEach(btn => btn.classList.remove('active'));
    }

    downloadDocument() {
        const text = document.getElementById('wordContainer').innerText;
        if (!text.trim()) return;

        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
        link.download = 'document.txt';
        link.click();
    }

    changeColor() {
        const color = prompt('Enter color (hex or name):');
        if (color) {
            document.execCommand('foreColor', false, color);
        }
    }
}

/**
 * UI Manager - Handles DOM updates and UI state
 */
class UIManager {
    displayContent(content, domain) {
        const wordContainer = document.getElementById('wordContainer');
        const sourceDiv = document.getElementById('source');

        wordContainer.innerHTML = '';
        sourceDiv.textContent = domain;
        sourceDiv.style.display = 'block';

        content.forEach(item => {
            if (item.type === 'word') {
                const span = document.createElement('span');
                span.className = 'word';
                span.textContent = item.value + ' ';
                wordContainer.appendChild(span);
            } else if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.value;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.margin = '15px 0';
                img.style.borderRadius = '4px';
                img.style.display = 'block';
                img.onerror = () => img.style.display = 'none';
                wordContainer.appendChild(img);
            }
        });
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }
}
