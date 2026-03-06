
import { TaskpaneState, UIPhase } from "./types";

export class UIStateManager {
    private state: TaskpaneState = {
        phase: "ANALYZE",
        history: [],
        currentLog: []
    };

    private subscribers: Set<(state: TaskpaneState) => void> = new Set();

    getState(): TaskpaneState {
        return this.state;
    }

    setState(updates: Partial<TaskpaneState>) {
        this.state = { ...this.state, ...updates };
        this.notify();
    }

    setPhase(phase: UIPhase) {
        this.state.phase = phase;
        this.notify();
    }

    addLog(message: string) {
        this.state.currentLog.push(`[${new Date().toLocaleTimeString()}] ${message}`);
        this.notify();
    }

    /**
     * Subscribe to state changes. Returns an unsubscribe function.
     */
    subscribe(callback: (state: TaskpaneState) => void): () => void {
        this.subscribers.add(callback);
        return () => { this.subscribers.delete(callback); };
    }

    private notify() {
        this.subscribers.forEach(cb => cb(this.state));
    }
}

export const Store = new UIStateManager();
