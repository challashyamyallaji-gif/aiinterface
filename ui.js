/**
 * Main Application Interface Controller
 */
const UI = {
    elements: {
        splash: document.getElementById("splash-screen"),
        app: document.getElementById("app"),
        messages: document.getElementById("chat-messages"),
        input: document.getElementById("chat-input"),
        sendBtn: document.getElementById("btn-send"),
        clock: document.getElementById("clock"),
        date: document.getElementById("date"),
        cpu: document.getElementById("cpu-val"),
        ram: document.getElementById("ram-val"),
        ctxVal: document.getElementById("ctx-val"),
        historyList: document.getElementById("history-list"),
        modal: document.getElementById("settings-modal"),
        cmdGrid: document.getElementById("command-grid"),
        ctxInspector: document.getElementById("context-inspector")
    },

    init() {
        this.startClocks();
        this.simulateMetrics();
        this.renderCommandGrid();
        this.bindEvents();
        this.loadHistory();
        this.updateContextInspector();
    },

    startClocks() {
        const update = () => {
            const now = new Date();
            this.elements.clock.textContent = now.toLocaleTimeString();
            this.elements.date.textContent = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
        };
        update();
        setInterval(update, 1000);
    },

    simulateMetrics() {
        setInterval(() => {
            this.elements.cpu.textContent = `${String(Math.floor(Math.random() * 15 + 5)).padStart(2, '0')}%`;
            this.elements.ram.textContent = `${(Math.random() * 0.3 + 3.1).toFixed(1)} / 16 GB`;
        }, 3000);
    },

    renderCommandGrid() {
        this.elements.cmdGrid.innerHTML = CommandSystem.commands.map(c => `
            <div class="cmd-card glass-panel">
                <h4>${c.cmd}</h4>
                <p>${c.desc}</p>
            </div>
        `).join("");
    },

    bindEvents() {
        // Send Actions
        this.elements.sendBtn.addEventListener("click", () => this.handleSend());
        this.elements.input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // Navigation Tabs Switcher
        document.querySelectorAll(".nav-menu li").forEach(item => {
            item.addEventListener("click", () => {
                document.querySelectorAll(".nav-menu li").forEach(i => i.classList.remove("active"));
                document.querySelectorAll(".view-panel").forEach(v => v.classList.add("hidden"));
                
                item.classList.add("active");
                const viewTarget = item.dataset.view;
                document.getElementById(`view-${viewTarget}`).classList.remove("hidden");
                Memory.playSound("beep");
            });
        });

        // Settings Buttons & Toggles
        document.getElementById("settings-btn").addEventListener("click", () => {
            this.elements.modal.classList.remove("hidden");
            Memory.playSound("beep");
        });

        document.querySelector(".close-modal").addEventListener("click", () => {
            this.elements.modal.classList.add("hidden");
        });

        document.getElementById("theme-toggle").addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            const target = current === "light" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", target);
            Memory.setPref("theme", target);
            Memory.playSound("beep");
        });

        document.getElementById("audio-toggle").addEventListener("click", (e) => {
            const state = !Memory.getPref("soundEnabled");
            Memory.setPref("soundEnabled", state);
            e.currentTarget.classList.toggle("active", state);
            this.showToast(state ? "Audio Synthesizer Enabled" : "Audio Synthesizer Muted");
        });

        // Export Logs File Download Action
        document.getElementById("btn-export").addEventListener("click", () => this.exportLogs());

        // File Import Action Trigger
        document.getElementById("btn-import-trigger").addEventListener("click", () => {
            document.getElementById("file-import").click();
        });

        document.getElementById("file-import").addEventListener("change", (e) => this.importLogs(e));

        // Purge System Storage
        document.getElementById("btn-reset-memory").addEventListener("click", () => {
            if (confirm("Execute purge order on all stored session history?")) {
                Memory.clearLogs();
                this.clearConsole();
                this.elements.modal.classList.add("hidden");
                this.updateContextInspector();
                this.showToast("System Logs Wiped.");
            }
        });
    },

    handleSend() {
        const text = this.elements.input.value.trim();
        if (!text) return;

        this.appendMessage("user", text);
        this.elements.input.value = "";
        Memory.playSound("beep");

        setTimeout(() => {
            this.processQuery(text);
        }, 300);
    },

    processQuery(text) {
        let output = "";

        if (text.startsWith("/")) {
            output = CommandSystem.execute(text);
        } else {
            const context = Memory.getPref("context");
            const res = KnowledgeBase.query(text, context);

            if (res) {
                output = res.text;
                if (res.topic) Memory.setContext(res.topic);
            } else {
                const userName = Memory.getPref("userName");
                output = `No direct directive match in local knowledge index for your query, **${userName}**.\n\nType \`/help\` or ask about topics like \`HTML\`, \`CSS\`, \`JavaScript\`, \`AI\`, or \`Security\`.`;
            }
        }

        this.appendMessage("jarvis", output);
        Memory.playSound("response");
        this.updateContextInspector();
    },

    appendMessage(sender, text) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const wrapper = document.createElement("div");
        wrapper.className = `msg-wrapper ${sender}`;

        const icon = sender === "user" ? "fa-user-astronaut" : "fa-robot";
        const formattedText = text.replace(/```javascript([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>').replace(/\n/g, '<br>');

        wrapper.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid ${icon}"></i></div>
            <div class="msg-body">
                <div class="text-content">${formattedText}</div>
                <span class="msg-timestamp">${time}</span>
            </div>
        `;

        this.elements.messages.appendChild(wrapper);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;

        Memory.addLog(sender, text);
    },

    clearConsole() {
        this.elements.messages.innerHTML = "";
    },

    loadHistory() {
        const history = Memory.getPref("history");
        history.forEach(item => {
            const wrapper = document.createElement("div");
            wrapper.className = `msg-wrapper ${item.sender}`;
            const icon = item.sender === "user" ? "fa-user-astronaut" : "fa-robot";
            const formattedText = item.text.replace(/```javascript([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>').replace(/\n/g, '<br>');

            wrapper.innerHTML = `
                <div class="msg-avatar"><i class="fa-solid ${icon}"></i></div>
                <div class="msg-body">
                    <div class="text-content">${formattedText}</div>
                    <span class="msg-timestamp">${item.timestamp}</span>
                </div>
            `;
            this.elements.messages.appendChild(wrapper);
        });
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    },

    updateContextInspector() {
        const ctx = Memory.getPref("context");
        this.elements.ctxVal.textContent = ctx.lastTopic ? `TOPIC: ${ctx.lastTopic.toUpperCase()}` : "ACTIVE CORE";
        this.elements.ctxInspector.innerHTML = `
            <div class="ctx-row"><span>OPERATOR:</span><strong>${Memory.getPref("userName")}</strong></div>
            <div class="ctx-row"><span>LAST TOPIC THREAD:</span><strong>${ctx.lastTopic || "None"}</strong></div>
            <div class="ctx-row"><span>TOTAL EXECUTED QUERIES:</span><strong>${ctx.queryCount || 0}</strong></div>
        `;
    },

    exportLogs() {
        const logs = Memory.getPref("history");
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `JARVIS-Session-${Date.now()}.json`;
        a.click();
        this.showToast("Exported JSON Session Log.");
    },

    importLogs(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const logs = JSON.parse(evt.target.result);
                if (Array.isArray(logs)) {
                    Memory.setPref("history", logs);
                    this.clearConsole();
                    this.loadHistory();
                    this.showToast("Imported Session Log!");
                }
            } catch (err) {
                this.showToast("Invalid Log File Format.");
            }
        };
        reader.readAsText(file);
    },

    showToast(msg) {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};