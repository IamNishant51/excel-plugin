import { EngineState, UIEvents } from "../types/ui-types";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { EngineStatusCard } from "./EngineStatusCard";
import { SchemaSnapshot } from "./SchemaSnapshot";
import { ActionGraphTree } from "./ActionGraphTree";
import { ImpactMeter } from "./ImpactMeter";
import { RiskPanel } from "./RiskPanel";
import { ConsolePanel } from "./ConsolePanel";

export class MainContainer {
  private header = new Header();
  private sidebar = new Sidebar();
  private engineCard = new EngineStatusCard();
  private schema = new SchemaSnapshot();
  private graph = new ActionGraphTree();
  private impact = new ImpactMeter();
  private risk = new RiskPanel();
  private console = new ConsolePanel();

  render(state: EngineState, events?: UIEvents): string {
    return `
      <div class="main-root">
        ${this.header.render(state.status)}
        <div class="main-body">
          ${this.sidebar.render(state)}

          <div class="main-panel">
            <div class="command-row">
              <input id="user-prompt" class="prompt-input" placeholder="Enter command (compact)" />
              <button id="run-engine" class="btn sm primary">Analyze</button>
            </div>

            <div class="cards-grid">
              ${this.engineCard.render(state)}
              ${this.schema.render(state)}
              ${this.graph.render(state.actionGraph || [])}
              ${this.impact.render(state.execution)}
              ${this.risk.render(state.risk)}
            </div>

            <div class="confirm-row">
              ${state.stage === 'PREVIEW' ? '<button id="confirm-action" class="btn primary">Confirm Execution</button>' : ''}
            </div>

            ${this.console.render(state.execution)}
          </div>
        </div>
      </div>
    `;
  }
}
