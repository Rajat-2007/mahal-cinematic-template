/* ==========================================================================
   THE MAHAL — 10D Drone Experience & Interactive Hotspot Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. LENIS SMOOTH SCROLL INITIALIZATION
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // 2. PRELOADER & CURTAIN REVEAL
    let progress = 0;
    const progressEl = document.getElementById("loader-progress");
    const textEl = document.getElementById("loader-text");
    const preloader = document.getElementById("preloader");

    const timer = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 6;
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.8,
                delay: 0.2,
                onComplete: () => {
                    preloader.style.display = "none";
                    init8StageDroneEngine();
                }
            });
        }
        if (progressEl && textEl) {
            progressEl.style.width = progress + "%";
            textEl.innerText = progress + "%";
        }
    }, 35);

    // 3. 8-STAGE PINNED DRONE CANVAS & SCROLLTRIGGER ENGINE
    function init8StageDroneEngine() {
        const canvas = document.getElementById("hero-canvas");
        const ctx = canvas.getContext("2d");

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderCanvasScene(currentZoom, currentX, currentY);
        }

        const palaceImg = new Image();
        palaceImg.crossOrigin = "anonymous";
        palaceImg.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop";

        let currentZoom = 1;
        let currentX = 0;
        let currentY = 0;

        palaceImg.onload = () => {
            window.addEventListener("resize", resizeCanvas);
            resizeCanvas();
            setup8StageScrollTrigger();
        };

        function renderCanvasScene(scale, offsetX, offsetY) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const imgWidth = canvas.width * scale;
            const imgHeight = canvas.height * scale;
            const x = (canvas.width - imgWidth) / 2 + offsetX;
            const y = (canvas.height - imgHeight) / 2 + offsetY;
            ctx.drawImage(palaceImg, x, y, imgWidth, imgHeight);
        }

        const captions = document.querySelectorAll(".cinematic-caption");
        const hudCounter = document.getElementById("hud-slide-counter");
        const hudFill = document.getElementById("hud-progress-fill");

        function switchCaption(index) {
            captions.forEach((cap, i) => {
                if (i === index) {
                    cap.classList.add("active");
                } else {
                    cap.classList.remove("active");
                }
            });
            if (hudCounter) hudCounter.innerText = `SLIDE 0${index + 1} / 08`;
        }

        function setup8StageScrollTrigger() {
            // Pin for 7500px scroll distance (8 FULL DRONE STAGES)
            ScrollTrigger.create({
                trigger: ".pinned-cinematic-section",
                start: "top top",
                end: "+=7500",
                pin: true,
                scrub: 1,
                onUpdate: (self) => {
                    const p = self.progress;

                    // Update HUD Progress Fill
                    if (hudFill) hudFill.style.width = `${Math.min(100, (p * 100) + 12.5)}%`;

                    // Continuous 3D Zoom & Pan sequence calculations
                    currentZoom = 1 + (p * 1.85); // Smooth zoom from 1.0x to 2.85x
                    currentY = -(p * 220); // Drone altitude camera ascent/descent

                    renderCanvasScene(currentZoom, currentX, currentY);

                    // 8 Chapter thresholds
                    const stage = Math.min(7, Math.floor(p * 8));
                    switchCaption(stage);
                }
            });
        }

        // 3D MOUSE GYRO TILT EFFECT
        window.addEventListener("mousemove", (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 40;

            gsap.to(canvas, {
                rotateY: -xAxis,
                rotateX: yAxis,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    }

    // 4. NAVBAR SCROLL CLASS
    window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".navbar");
        if (window.scrollY > 100) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 5. AMBIENT AUDIO SYNTHESIZER
    const soundBtn = document.getElementById("soundBtn");
    let isPlaying = false;
    let audioCtx = null;
    let oscillator = null;

    if (soundBtn) {
        soundBtn.addEventListener("click", () => {
            if (!isPlaying) {
                if (!audioCtx) {
                    audioCtx = new(window.AudioContext || window.webkitAudioContext)();
                }
                oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(110, audioCtx.currentTime);

                gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 2);

                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                oscillator.start();
                soundBtn.innerHTML = '<i class="ri-volume-up-line"></i><span>Synth Active</span>';
                isPlaying = true;
            } else {
                if (oscillator) oscillator.stop();
                soundBtn.innerHTML = '<i class="ri-volume-mute-line"></i><span>Audio Synth</span>';
                isPlaying = false;
            }
        });
    }

});

// 6. GLOBAL 10D INTERACTIVE HOTSPOT & DRAWER MODAL CONTROLLER
function openHotspotModal(type) {
    const modal = document.getElementById("hotspotModal");
    const body = document.getElementById("modal-content-body");
    modal.classList.add("active");

    let content = "";

    if (type === 'drawer') {
        content = `
            <div style="text-align: center;">
                <span class="caption-badge"><i class="ri-archive-line"></i> 10D INSPECTION — DESK & DRAWER</span>
                <h2 style="font-family: var(--font-heading); font-size: 2.2rem; margin: 0.5rem 0 1rem;">Hand-Carved Imperial Teak Desk</h2>
                <div style="border-radius: 4px; overflow: hidden; margin-bottom: 1.5rem; border: 1px solid var(--gold-primary);">
                    <img src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1000&auto=format&fit=crop" style="width:100%; height: 260px; object-fit: cover;">
                </div>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                    <strong>Drawer Interior Contents:</strong> Gold-embossed leather diary, 24k gold nib fountain pen, vintage brass room key, and customized herbal incense set by <em>Jaipur Imperial Crafts</em>.
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                    <span style="color: var(--gold-primary); font-family: var(--font-heading); font-size: 1.5rem;">Included with Suite ($1,800/night)</span>
                    <a href="tel:+918081915068" class="btn-primary"><i class="ri-phone-line"></i> Reserve +91 8081915068</a>
                </div>
            </div>
        `;
    } else if (type === 'window') {
        content = `
            <div style="text-align: center;">
                <span class="caption-badge"><i class="ri-camera-lens-line"></i> DRONE WINDOW CAMERA TRANSITION</span>
                <h2 style="font-family: var(--font-heading); font-size: 2.2rem; margin: 0.5rem 0 1rem;">Imperial Archway Window View</h2>
                <div style="border-radius: 4px; overflow: hidden; margin-bottom: 1.5rem; border: 1px solid var(--gold-primary);">
                    <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop" style="width:100%; height: 260px; object-fit: cover;">
                </div>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                    <strong>Drone Flyout Perspective:</strong> Direct unblocked 180° panorama of Udaipur Lake, private plunge pool balcony, and sunset mountain ridges.
                </p>
                <div style="display: flex; justify-content: center; gap: 1rem;">
                    <a href="tel:+918081915068" class="btn-primary"><i class="ri-phone-line"></i> Book Window Suite +91 8081915068</a>
                </div>
            </div>
        `;
    } else if (type === 'wardrobe') {
        content = `
            <div style="text-align: center;">
                <span class="caption-badge"><i class="ri-door-lock-line"></i> 10D INSPECTION — ROYAL WARDROBE</span>
                <h2 style="font-family: var(--font-heading); font-size: 2.2rem; margin: 0.5rem 0 1rem;">Handcrafted Rosewood Wardrobe</h2>
                <div style="border-radius: 4px; overflow: hidden; margin-bottom: 1.5rem; border: 1px solid var(--gold-primary);">
                    <img src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1000&auto=format&fit=crop" style="width:100%; height: 260px; object-fit: cover;">
                </div>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                    <strong>Wardrobe Interior:</strong> Italian velvet hangers, plush organic cotton robes, electronic biometric safe, and complimentary silk slippers.
                </p>
                <a href="tel:+918081915068" class="btn-primary"><i class="ri-phone-line"></i> Concierge Hotline +91 8081915068</a>
            </div>
        `;
    } else if (type === 'bed') {
        content = `
            <div style="text-align: center;">
                <span class="caption-badge"><i class="ri-hotel-bed-line"></i> LUXURY BEDDING SPECS</span>
                <h2 style="font-family: var(--font-heading); font-size: 2.2rem; margin: 0.5rem 0 1rem;">Custom King Featherbed</h2>
                <div style="border-radius: 4px; overflow: hidden; margin-bottom: 1.5rem; border: 1px solid var(--gold-primary);">
                    <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop" style="width:100%; height: 260px; object-fit: cover;">
                </div>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                    <strong>Specifications:</strong> 1,000 Thread-Count Egyptian Cotton, Hungarian goose-down pillows, hand-loomed silk drapes by <em>Royal Banaras Weavers</em>.
                </p>
                <a href="tel:+918081915068" class="btn-primary"><i class="ri-phone-line"></i> Call +91 8081915068</a>
            </div>
        `;
    } else if (type === 'pool') {
        content = `
            <div style="text-align: center;">
                <span class="caption-badge"><i class="ri-drop-line"></i> HEATED POOL SPECIFICATION</span>
                <h2 style="font-family: var(--font-heading); font-size: 2.2rem; margin: 0.5rem 0 1rem;">Marble Heated Plunge Pool</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                    Temperature auto-regulated at 28°C (82°F) with underwater LED mood lighting and organic jasmine water treatments.
                </p>
                <a href="tel:+918081915068" class="btn-primary"><i class="ri-phone-line"></i> Book +91 8081915068</a>
            </div>
        `;
    } else {
        content = `
            <div style="text-align: center;">
                <h2 style="font-family: var(--font-heading); font-size: 2rem; margin-bottom: 1rem;">10D Drone Exploration Mode</h2>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">For full personalized itinerary and video walkthroughs, speak directly with our concierge.</p>
                <a href="tel:+918081915068" class="btn-primary"><i class="ri-phone-line"></i> Call +91 8081915068</a>
            </div>
        `;
    }

    body.innerHTML = content;
}

function closeHotspotModal() {
    const modal = document.getElementById("hotspotModal");
    modal.classList.remove("active");
}