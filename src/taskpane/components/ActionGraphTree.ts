import { ActionGraphNode } from "../types/ui-types";

function renderNode(n: ActionGraphNode): string {
  const children = (n.children || []).map(c => renderNode(c)).join('');
  return `<li class="agt-node"><div class="agt-label"><span class="agt-type">${n.type}</span> ${n.label}</div>${children ? `<ul>${children}</ul>` : ''}</li>`;
}

export class ActionGraphTree {
  render(nodes: ActionGraphNode[] = []): string {
    return `
      <section class="card action-graph">
        <h3>Action Graph</h3>
        <div class="agt-container">
          <ul class="agt-root">
            ${nodes.map(n => renderNode(n)).join('')}
          </ul>
        </div>
      </section>
    `;
  }
}
