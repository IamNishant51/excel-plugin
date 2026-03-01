
import { TaskpaneState, UIPhase } from "./types";

export class UIStateManager {
    private state: TaskpaneState = {
        phase: "ANALYZE",
        history: [],
        currentLog: []
    };

    private subscribers: ((state: TaskpaneState) => void)[] = [];

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

    subscribe(callback: (state: TaskpaneState) => void) {
        this.subscribers.push(callback);
    }

    private notify() {
        this.subscribers.forEach(cb => cb(this.state));
    }
}

export const Store = new UIStateManager();
