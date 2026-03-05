
import { SheetSchema } from "../../core/types/sheetos";

export class AnalyzePanel {
    render(schema?: SheetSchema): string {
        if (!schema) return `<div class="panel-skeleton">
            <div class="sk-heading sk-shimmer"></div>
            <div class="sk-row"><div class="sk-block sk-shimmer"></div><div class="sk-block sk-shimmer"></div></div>
            <div class="sk-bar w85 sk-shimmer"></div>
            <div class="sk-bar w70 sk-shimmer"></div>
            <div class="sk-bar w50 sk-shimmer"></div>
        </div>`;

        return `
            <div class="panel-content">
                <div class="panel-header">
                    <h2>Sheet Ecosystem Analysis</h2>
                    <span class="badge badge-blue">Deterministic Extraction</span>
                </div>

                <div class="info-grid">
                    <div class="card">
                        <label>Active Range</label>
                        <div class="value">${schema.usedRange}</div>
                    </div>
                    <div class="card">
                        <label>Payload Size</label>
                        <div class="value">${schema.rowCount} rows × ${schema.columnCount} columns</div>
                    </div>
                </div>

                <div class="card">
                    <label>Detected Headers</label>
                    <div class="chip-group">
                        ${schema.headers.map(h => `<span class="chip">${h}</span>`).join('')}
                    </div>
                </div>

                <div class="card">
                    <label>Integrity Report</label>
                    <ul class="analysis-list">
                        <li class="${schema.mergedCells.length > 0 ? 'warn' : 'check'}">
                            ${schema.mergedCells.length > 0 ? 'Merged cells detected' : 'No merged cells (Ideal)'}
                        </li>
                        <li class="${schema.frozenRows > 0 ? 'info' : 'check'}">
                            ${schema.frozenRows > 0 ? `Frozen Rows: ${schema.frozenRows}` : 'Standard row layout'}
                        </li>
                        <li class="${schema.tables.length > 0 ? 'check' : 'info'}">
                            ${schema.tables.length > 0 ? `${schema.tables.length} Tables found` : 'Flat data structure'}
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }
}
