/**
 * Master Application Boot Initializer
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Fire Particle Render Engine Canvas
    const particles = new ParticleEngine();
    particles.render();

    // 2. Simulated Arc Reactor Diagnostic Boot Steps
    const bootLogs = [
        "INITIALIZING CORE SYSTEM MODULES...",
        "LOADING NLP KNOWLEDGE DATABASE...",
        "CONFIGURING WEB AUDIO SYNTHESIZER...",
        "VERIFYING OFFLINE PERSISTENCE MEMORY...",
        "J.A.R.V.I.S. MARK V ONLINE."
    ];

    let step = 0;
    const logElem = document.getElementById("boot-log");
    const progressFill = document.querySelector(".loading-fill");

    const bootTimer = setInterval(() => {
        step++;
        const percent = Math.min(step * 20, 100);
        progressFill.style.width = `${percent}%`;

        if (step < bootLogs.length) {
            logElem.textContent = bootLogs[step];
        } else {
            clearInterval(bootTimer);

            // Hide Diagnostic Splash & Display App UI
            setTimeout(() => {
                const splash = document.getElementById("splash-screen");
                const app = document.getElementById("app");

                splash.style.opacity = "0";
                splash.style.visibility = "hidden";
                app.classList.remove("hidden");

                // Initialize UI Logic
                UI.init();

                // Initial Greeting Log
                if (Memory.getPref("history").length === 0) {
                    const name = Memory.getPref("userName");
                    UI.appendMessage("jarvis", `J.A.R.V.I.S. OS operational. Welcome, **${name}**. How can I assist your workflow today?`);
                }
            }, 400);
        }
    }, 120);
});