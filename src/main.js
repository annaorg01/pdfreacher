// Main JavaScript for hacking simulation
class HackingSimulation {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.hackingUI = document.getElementById('hacking-ui');
        this.landing = document.getElementById('landing');
        this.waBar = document.getElementById('wa-bar');
        this.waProgressText = document.getElementById('wa-progress');
        this.emailBar = document.getElementById('email-bar');
        this.emailProgressText = document.getElementById('email-progress');
        this.phoneBar = document.getElementById('phone-bar');
        this.phoneProgressText = document.getElementById('phone-progress');
        this.speedIndicator = document.getElementById('speed-indicator');
        this.overlay = document.getElementById('critical-overlay');
        this.startBtn = document.getElementById('start-btn');
        this.closeBtn = document.getElementById('close-btn');

        this.intervalTime = 25; // 4x faster (initial was 100ms)
        this.chaosLevel = 0;
        this.running = false;
        this.animationFrame = null;
        this.fakeAlerts = [];

        this.hebrewNames = ["יוסי לוי", "נועה כהן", "דניאל מזרחי", "עדי פרץ", "איתי אברהם", "שירה דהן", "רון ביטון", "מאיה שפירא"];
        this.hebrewMessages = [
            "איפה אתה? אני מחכה",
            "שלחתי לך את הקוד של הבנק",
            "תזכיר לי מה הסיסמה למייל?",
            "המסמכים הסודיים מצורפים",
            "אני בדרך הביתה",
            "תמונות מהטיול בחו''ל",
            "אל תספר לאף אחד על זה",
            "חשבון החשמל שולם"
        ];

        this.init();
    }

    init() {
        this.startBtn.addEventListener('click', () => this.startInfection());
        this.closeBtn.addEventListener('click', () => this.increaseChaos());

        // Warning message on exit attempt
        window.addEventListener('beforeunload', (e) => {
            e.preventDefault();
            e.returnValue = "WARNING: Leaving this page will lead to permanent data corruption.";
            return e.returnValue;
        });

        // Prevent context menu
        document.addEventListener('contextmenu', (e) => e.preventDefault());

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.running) {
                this.increaseChaos();
            }
        });
    }

    startInfection() {
        this.landing.style.display = 'none';
        this.hackingUI.classList.remove('hidden');
        this.running = true;
        
        // Request fullscreen with better error handling
        this.requestFullscreen();
        
        // Start the main loop
        this.runLoop();
    }

    requestFullscreen() {
        try {
            const element = document.documentElement;
            if (element.requestFullscreen) {
                const fsPromise = element.requestFullscreen();
                if (fsPromise && fsPromise.catch) {
                    fsPromise.catch(error => {
                        console.warn("Fullscreen request denied:", error.message);
                    });
                }
            }
        } catch (error) {
            console.warn("Fullscreen API not available or blocked:", error.message);
        }
    }

    generateHackerLine() {
        const type = Math.floor(Math.random() * 5);
        const timestamp = new Date().toLocaleTimeString();
        
        switch (type) {
            case 0: {
                const name = this.hebrewNames[Math.floor(Math.random() * this.hebrewNames.length)];
                const msg = this.hebrewMessages[Math.floor(Math.random() * this.hebrewMessages.length)];
                return `<span class="text-blue-400">[WHATSAPP_DATA]</span> <span class="text-gray-500">${timestamp}</span> | Captured: ${name} -> "${msg}"`;
            }
            case 1: {
                const email = `user_${Math.floor(Math.random() * 1000)}@mail.com`;
                const subs = ["חשבונית מס", "Bank Alert", "Password Reset", "Secret Docs"];
                const sub = subs[Math.floor(Math.random() * subs.length)];
                return `<span class="text-yellow-400">[EMAIL_SYPHON]</span> <span class="text-gray-500">${timestamp}</span> | Subject: ${sub} | From: ${email}`;
            }
            case 2: {
                const phone = `05${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10000000)}`;
                return `<span class="text-red-400">[PHONE_EXTRACT]</span> <span class="text-gray-500">${timestamp}</span> | Extracted Phone Number: ${phone}`;
            }
            case 3: {
                const codes = ["OVERRIDE_AUTH", "SOCKET_FLOOD", "SHELL_EXEC", "KERNEL_DUMP", "HEX_READ"];
                const code = codes[Math.floor(Math.random() * codes.length)];
                return `<span class="text-green-600">[SERVER_CMD]</span> Running ${code} at 0x${Math.random().toString(16).substr(2, 8)}...`;
            }
            default:
                return `<span class="text-white opacity-40">0x${Math.random().toString(16).substr(2, 32)}</span>`;
        }
    }

    runLoop() {
        if (!this.running) return;

        // Generate lines based on chaos level
        for (let i = 0; i < (this.chaosLevel + 1); i++) {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = this.generateHackerLine();
            this.terminal.appendChild(line);
        }

        // Limit terminal lines for performance
        if (this.terminal.children.length > 50) {
            this.terminal.removeChild(this.terminal.firstChild);
        }

        // Auto-scroll to bottom
        this.terminal.scrollTop = this.terminal.scrollHeight;

        this.updateBars();
        
        // Schedule next frame
        this.animationFrame = setTimeout(() => this.runLoop(), this.intervalTime);
    }

    updateBars() {
        const increment = (this.chaosLevel + 1) * 0.8;
        
        let waVal = parseFloat(this.waBar.style.width) + (Math.random() * increment);
        let mailVal = parseFloat(this.emailBar.style.width) + (Math.random() * increment);
        let phoneVal = parseFloat(this.phoneBar.style.width) + (Math.random() * increment);

        // Clamp values to 100%
        waVal = Math.min(100, waVal);
        mailVal = Math.min(100, mailVal);
        phoneVal = Math.min(100, phoneVal);

        // Update progress bars
        this.waBar.style.width = `${waVal}%`;
        this.waProgressText.textContent = `${Math.floor(waVal)}%`;
        
        this.emailBar.style.width = `${mailVal}%`;
        this.emailProgressText.textContent = `${Math.floor(mailVal)}%`;
        
        this.phoneBar.style.width = `${phoneVal}%`;
        this.phoneProgressText.textContent = `${Math.floor(phoneVal)}%`;
    }

    increaseChaos() {
        this.chaosLevel++;
        this.intervalTime = Math.max(1, this.intervalTime - 5);
        
        // Update speed indicator
        const exclamationMarks = "!".repeat(this.chaosLevel);
        this.speedIndicator.textContent = `TRANSFER SPEED: ${exclamationMarks} MAXIMUM ${exclamationMarks}`;
        this.speedIndicator.style.color = "#ff0000";
        
        // Add glitch effect and overlay at higher chaos levels
        if (this.chaosLevel > 1) {
            this.overlay.classList.remove('hidden');
            document.body.classList.add('glitch');
        }

        // Spawn fake alert
        this.spawnFakeAlert();
    }

    spawnFakeAlert() {
        const alert = document.createElement('div');
        alert.className = 'fixed bg-red-700 text-white p-4 border-2 border-white font-bold z-50 text-center shadow-2xl pointer-events-none uppercase';
        alert.style.top = `${Math.random() * 70}%`;
        alert.style.left = `${Math.random() * 70}%`;
        alert.innerHTML = `FATAL ERROR!<br>CLOSE ATTEMPT BLOCKED<br>ENCRYPTION IN PROGRESS`;
        
        document.body.appendChild(alert);
        this.fakeAlerts.push(alert);
        
        // Animate the alert
        const interval = setInterval(() => {
            if (!document.body.contains(alert)) {
                clearInterval(interval);
                return;
            }
            
            const currentTop = parseFloat(alert.style.top);
            const currentLeft = parseFloat(alert.style.left);
            
            alert.style.top = `${currentTop + (Math.random() * 6 - 3)}%`;
            alert.style.left = `${currentLeft + (Math.random() * 6 - 3)}%`;
        }, 30);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(alert)) {
                document.body.removeChild(alert);
            }
            const index = this.fakeAlerts.indexOf(alert);
            if (index > -1) {
                this.fakeAlerts.splice(index, 1);
            }
        }, 5000);
    }

    // Cleanup method
    destroy() {
        this.running = false;
        if (this.animationFrame) {
            clearTimeout(this.animationFrame);
        }
        
        // Remove all fake alerts
        this.fakeAlerts.forEach(alert => {
            if (document.body.contains(alert)) {
                document.body.removeChild(alert);
            }
        });
        this.fakeAlerts = [];
    }
}

// Initialize the simulation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hackingSim = new HackingSimulation();
});

// Export for module usage
export default HackingSimulation;
