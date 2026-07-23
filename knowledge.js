/**
 * Offline Intelligent Knowledge & Context Expansion Engine
 */
const KnowledgeBase = {
    topics: {
        html: {
            title: "HTML5 Markup Standard",
            desc: "HTML (HyperText Markup Language) structures web content using semantic elements like `<header>`, `<main>`, `<article>`, and `<footer>`.",
            code: "<!-- Example Semantic HTML5 -->\n<article class='card'>\n  <h2>J.A.R.V.I.S Core</h2>\n</article>"
        },
        css: {
            title: "CSS3 Cascading Style Sheets",
            desc: "CSS3 handles visual layout, glassmorphism filters, flexbox/grid alignments, responsive media queries, and keyframe animations.",
            code: ".glass {\n  backdrop-filter: blur(16px);\n  background: rgba(15, 23, 42, 0.7);\n}"
        },
        javascript: {
            title: "Modern Vanilla JavaScript (ES6+)",
            desc: "JavaScript delivers interactive logic, asynchronous event handling, DOM manipulation, classes, and Web APIs offline without backend libraries.",
            code: "class JarvisCore {\n  constructor() {\n    this.status = 'ACTIVE';\n  }\n}"
        },
        python: {
            title: "Python Language",
            desc: "Python is an interpreted high-level language popular for AI, data analytics, automation scripts, and Django/FastAPI web services."
        },
        java: {
            title: "Java Platform",
            desc: "Java is an object-oriented language running on the JVM, widely utilized in enterprise backend systems and Android mobile engineering."
        },
        git: {
            title: "Git Distributed Version Control",
            desc: "Git manages version branches, code merges, and commit histories globally across developer teams."
        },
        ai: {
            title: "Artificial Intelligence Core",
            desc: "AI covers computational methodologies including Machine Learning, Neural Networks, Computer Vision, and Offline Pattern Recognition Logic."
        },
        security: {
            title: "Cybersecurity & Defenses",
            desc: "Encompasses encryption protocols, vulnerability assessments, auth standards (OAuth/JWT), and zero-trust security postures."
        },
        sql: {
            title: "SQL Relational Databases",
            desc: "Structured Query Language handles relational database management across systems like PostgreSQL, MySQL, and SQLite."
        }
    },

    jokes: [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "There are 10 types of people in the world: Those who understand binary, and those who don't.",
        "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
        "An optimist sees the glass as half full. A pessimist sees it as half empty. A programmer sees it as twice as large as necessary."
    ],

    quotes: [
        "“The best way to predict the future is to invent it.” – Alan Kay",
        "“Simplicity is prerequisite for reliability.” – Edsger W. Dijkstra",
        "“Code is like humor. When you have to explain it, it’s bad.” – Cory House",
        "“Fix the cause, not the symptom.” – Steve Maguire"
    ],

    /**
     * Advanced Keyword Matching NLP Engine
     */
    query(text, activeContext = {}) {
        const clean = text.toLowerCase().trim();

        // 1. Context Continuity Check
        if ((clean.includes("more") || clean.includes("explain code") || clean.includes("example")) && activeContext.lastTopic) {
            const topic = this.topics[activeContext.lastTopic];
            if (topic && topic.code) {
                return {
                    text: `Here is a code example for **${topic.title}**:\n\n\`\`\`javascript\n${topic.code}\n\`\`\``,
                    topic: activeContext.lastTopic
                };
            }
        }

        // 2. Intent Identification
        if (/\b(hi|hello|hey|greetings|start|online)\b/.test(clean)) {
            return { text: "Greetings. JARVIS systems fully operational. How may I assist your workflow?" };
        }

        if (clean.includes("joke") || clean.includes("funny")) {
            return { text: this.getRandom(this.jokes) };
        }

        if (clean.includes("quote") || clean.includes("motivate") || clean.includes("inspiration")) {
            return { text: this.getRandom(this.quotes) };
        }

        // 3. Smart Keyword Scanner
        for (const [key, data] of Object.entries(this.topics)) {
            if (clean.includes(key)) {
                let response = `**[${data.title}]**\n\n${data.desc}`;
                if (data.code) {
                    response += `\n\n*(Type "example" or "show code" to view code snippets for ${key.toUpperCase()})*`;
                }
                return { text: response, topic: key };
            }
        }

        return null;
    },

    getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
};