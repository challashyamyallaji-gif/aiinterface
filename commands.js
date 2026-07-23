/**
 * Advanced Command Directive Processor Engine
 */
const CommandSystem = {
    commands: [
        { cmd: "/help", desc: "List all executable system directives." },
        { cmd: "/clear", desc: "Flush the active screen message buffer." },
        { cmd: "/time", desc: "Fetch local timestamp parameters." },
        { cmd: "/date", desc: "Output modern localized date." },
        { cmd: "/name [val]", desc: "Re-assign operator profile title." },
        { cmd: "/export", desc: "Download full chat logs as a formatted file." },
        { cmd: "/about", desc: "Inspect current architecture properties." }
    ],

    execute(raw) {
        const parts = raw.trim().split(" ");
        const directive = parts[0].toLowerCase();
        const arg = parts.slice(1).join(" ");

        Memory.playSound("beep");

        switch (directive) {
            case "/help":
                return `**[JARVIS Directive Manual]**\n` + 
                    this.commands.map(c => `• \`${c.cmd}\` - ${c.desc}`).join("\n");

            case "/clear":
                UI.clearConsole();
                return "__Console Buffer Cleared Successfully.__";

            case "/time":
                return `**System Clock:** ${new Date().toLocaleTimeString()}`;

            case "/date":
                return `**Calendar Date:** ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;

            case "/name":
                if (arg) {
                    Memory.setPref("userName", arg);
                    return `Operator identity saved: Welcome, **${arg}**.`;
                }
                return `Current profile handle: **${Memory.getPref("userName")}**`;

            case "/export":
                UI.exportLogs();
                return "__Exporting chat logs to local file...__";

            case "/about":
                return `**J.A.R.V.I.S. OS v5.0 Pro**\nArchitecture: Modular Client Script Engine\nStatus: 100% Offline Functional`;

            default:
                return `Unknown command directive \`${directive}\`. Type \`/help\` for active directives.`;
        }
    }
};