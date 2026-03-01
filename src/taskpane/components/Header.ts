
export class Header {
    render(status: string = 'READY'): string {
        return `
            <header class="main-header">
                <div class="logo-area">
                    <img src="./assets/logo-filled.png" alt="SheetOS AI Logo" class="app-logo">
                    <div class="brand-text">
                        <span class="brand-name">SheetOS AI</span>
                        <span class="app-mode">Engine v2.0.0</span>
                    </div>
                </div>
                <div class="header-actions">
                    <div id="engine-status" class="status-badge ${status.toLowerCase()}">${status}</div>
                    <button id="refresh-context" title="Refresh Sheet Analysis" class="icon-btn">↻</button>
                    <button id="view-settings" title="Settings" class="icon-btn">⚙</button>
                </div>
            </header>
        `;
    }
}

// Add CSS to theme.css later or a component style file
