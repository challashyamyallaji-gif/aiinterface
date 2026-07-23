/**
 * LocalStorage State & Audio Synthesizer Engine
 */
class SystemMemory {
    constructor() {
        this.STORAGE_KEY = "JARVIS_PRO_STATE";
        this.state = this.loadState();
        this.audioCtx = null;
    }

    loadState() {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        return raw ? JSON.parse(raw) : {
            userName: "Operator",
            theme: "dark",
            accentColor: "#00f3ff",
            typingSpeed: 20,
            soundEnabled: true,
            history: [],
            context: { lastTopic: null, queryCount: 0 }
        };
    }

    saveState() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    }

    addLog(sender, text) {
        this.state.history.push({
            sender,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        this.state.context.queryCount++;
        this.saveState();
    }

    setContext(topic) {
        if (topic) this.state.context.lastTopic = topic;
        this.saveState();
    }

    clearLogs() {
        this.state.history = [];
        this.state.context = { lastTopic: null, queryCount: 0 };
        this.saveState();
    }

    setPref(key, val) {
        this.state[key] = val;
        this.saveState();
    }

    getPref(key) {
        return this.state[key];
    }

    /**
     * Offline Web Audio Sound Synthesizer Engine
     */
    playSound(type = "beep") {
        if (!this.state.soundEnabled) return;
        try {
            if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            if (type === "beep") {
                osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
                gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);
                osc.start();
                osc.stop(this.audioCtx.currentTime + 0.1);
            } else if (type === "response") {
                osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);
                osc.start();
                osc.stop(this.audioCtx.currentTime + 0.15);
            }
        } catch (e) {
            // Audio context fallback
        }
    }
}

const Memory = new SystemMemory();