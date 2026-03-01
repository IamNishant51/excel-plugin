import { ExecutionSummary } from "../types/ui-types";

export class ConsolePanel {
  render(execution?: ExecutionSummary): string {
    return `
      <section class="console-panel">
        <div class="console-header">
          <span>Execution Console</span>
          <button id="toggle-console" class="icon-btn">▲</button>
        </div>
        <div class="console-body monospace small">
          <div><strong>Validation:</strong> ${execution?.validation?.isValid ? 'OK' : 'FAILED'}</div>
          <div><strong>Errors:</strong> ${(execution?.validation?.errors || []).join(', ')}</div>
          <div><strong>Warnings:</strong> ${(execution?.validation?.warnings || []).join(', ')}</div>
          <div><strong>Dry-run safe:</strong> ${execution?.dryRunSafe ? 'Yes' : 'No'}</div>
          <div><strong>Cells affected:</strong> ${execution?.cellsAffected ?? '-'}</div>
          <div><strong>Duration:</strong> ${execution?.durationMs ?? '-'}ms</div>
        </div>
      </section>
    `;
  }
}
