/* Stopwatch + Countdown with center landing
   Panels order: [Stopwatch | Landing | Countdown]
   - Clicking Stopwatch slides LEFT (to index 0)
   - Clicking Countdown slides RIGHT (to index 2)
   - Back returns to center (index 1)
*/

document.addEventListener('DOMContentLoaded', () =>
{

    /* ================= Utilities ================= */
    const fmt = {
        two: n => String(Math.floor(n)).padStart(2, '0'),
        three: n => String(Math.floor(n)).padStart(3, '0'),
        hmsms(ms)
        {
            ms = Math.max(0, ms);
            const h = Math.floor(ms / 3600000);
            const m = Math.floor((ms % 3600000) / 60000);
            const s = Math.floor((ms % 60000) / 1000);
            const x = Math.floor(ms % 1000);
            return { hours: h, minutes: m, seconds: s, milli: x };
        },
        toHMSS(ms)
        {
            const { hours, minutes, seconds, milli } = fmt.hmsms(ms);
            return { main: `${fmt.two(hours)}:${fmt.two(minutes)}:${fmt.two(seconds)}`, ms: fmt.three(milli) };
        }
    };

    /* ================= BaseTimer ================= */
    class BaseTimer
    {
        constructor(onTick) { this.onTick = onTick; this.running = false; this._raf = null; this._last = 0; }
        start() { } // override
        stop() { this.running = false; cancelAnimationFrame(this._raf); this._raf = null; }
    }

    /* ================= Stopwatch ================= */
    class StopwatchTimer extends BaseTimer
    {
        constructor(onTick) { super(onTick); this.elapsed = 0; }
        reset() { this.elapsed = 0; this.onTick?.(this.elapsed); }
        start()
        {
            if (this.running) return;
            this.running = true; this._last = performance.now();
            const loop = (t) =>
            {
                if (!this.running) return;
                const dt = t - this._last; this._last = t;
                this.elapsed += dt; this.onTick?.(this.elapsed);
                this._raf = requestAnimationFrame(loop);
            };
            this._raf = requestAnimationFrame(loop);
        }
    }

    /* ================= Countdown ================= */
    class CountdownTimer extends BaseTimer
    {
        constructor(onTick, onDone) { super(onTick); this.duration = 0; this.remaining = 0; this.onDone = onDone; }
        set(ms) { this.duration = Math.max(0, ms); this.remaining = this.duration; this.onTick?.(this.remaining); }
        resetToPreset() { this.remaining = this.duration; this.onTick?.(this.remaining); }
        start()
        {
            if (this.running || this.remaining <= 0) return;
            this.running = true; this._last = performance.now();
            const loop = (t) =>
            {
                if (!this.running) return;
                const dt = t - this._last; this._last = t;
                this.remaining = Math.max(0, this.remaining - dt);
                this.onTick?.(this.remaining);
                if (this.remaining <= 0) { this.stop(); this.onDone?.(); return; }
                this._raf = requestAnimationFrame(loop);
            };
            this._raf = requestAnimationFrame(loop);
        }
    }

    /* ================= Carousel (pixel-based) ================= */
    const viewport = document.querySelector('.viewport');
    const carousel = document.getElementById('carousel');

    // Start centered on Landing (index 1)
    let current = 1;

    function setTransform(index, animate = true)
    {
        const w = viewport.clientWidth;
        if (!animate)
        {
            const prev = carousel.style.transition;
            carousel.style.transition = 'none';
            carousel.style.transform = `translate3d(${-index * w}px,0,0)`;
            void carousel.offsetWidth; // reflow
            carousel.style.transition = prev || 'transform 420ms ease';
        } else
        {
            carousel.style.transform = `translate3d(${-index * w}px,0,0)`;
        }
    }
    function go(index)
    {
        current = Math.max(0, Math.min(2, index));
        setTransform(current, true);
        if (current === 1) document.title = 'Online Stopwatch – Landing';
    }
    window.addEventListener('resize', () => setTransform(current, false));

    // Navigation wiring
    document.getElementById('goStopwatch').addEventListener('click', () => go(0)); // left
    document.getElementById('goCountdown').addEventListener('click', () => go(2)); // right
    document.getElementById('backFromStopwatch').addEventListener('click', (e) => { e.preventDefault(); go(1); });
    document.getElementById('backFromCountdown').addEventListener('click', (e) => { e.preventDefault(); go(1); });

    /* ================= Stopwatch UI ================= */
    const sw = {
        main: document.getElementById('swTime'),
        ms: document.getElementById('swMs'),
        startStop: document.getElementById('swStartStop'),
        clear: document.getElementById('swClear')
    };

    const stopwatch = new StopwatchTimer((ms) =>
    {
        const { main, ms: ms3 } = fmt.toHMSS(ms);
        sw.main.textContent = main;
        sw.ms.textContent = ms3;
        if (stopwatch.running) document.title = `${main}.${ms3} – Stopwatch`;
    });
    stopwatch.reset();

    sw.startStop.addEventListener('click', () =>
    {
        if (stopwatch.running)
        {
            stopwatch.stop();
            sw.startStop.textContent = 'Start';
            document.title = `${sw.main.textContent}.${sw.ms.textContent} – Stopwatch`;
        } else
        {
            stopwatch.start();
            sw.startStop.textContent = 'Stop';
        }
    });
    sw.clear.addEventListener('click', () =>
    {
        stopwatch.stop(); stopwatch.reset();
        sw.startStop.textContent = 'Start';
        document.title = `${sw.main.textContent}.${sw.ms.textContent} – Stopwatch`;
    });

    /* ================= Countdown UI ================= */
    const cd = {
        keypadStage: document.getElementById('cdKeypadStage'),
        keypadScreen: document.getElementById('cdKeypadScreen'),
        keypad: document.getElementById('keypad'),
        runStage: document.getElementById('cdRunStage'),
        runControls: document.getElementById('cdRunControls'),
        timeMain: document.getElementById('cdTime'),
        timeMs: document.getElementById('cdMs'),
        startBtn: document.getElementById('cdStart'),
        resetBtn: document.getElementById('cdReset')
    };

    let keypadDigits = '';
    function renderKeypad()
    {
        const minutes = parseInt(keypadDigits || '0', 10);
        const hours = Math.floor(minutes / 60), mins = minutes % 60;
        cd.keypadScreen.textContent = `${fmt.two(hours)}:${fmt.two(mins)}`;
    }
    renderKeypad();

    cd.keypad.addEventListener('click', (e) =>
    {
        const el = e.target.closest('.key'); if (!el) return;
        if (el.dataset.action === 'set')
        {
            const minutes = parseInt(keypadDigits || '0', 10);
            const ms = Math.max(0, minutes) * 60000;
            countdown.set(ms);
            cd.keypadStage.style.display = 'none';
            cd.keypad.style.display = 'none';
            cd.runStage.style.display = '';
            cd.runControls.style.display = '';
            document.title = `${cd.timeMain.textContent}.${cd.timeMs.textContent} – Countdown`;
        } else if (el.dataset.action === 'clear')
        {
            keypadDigits = ''; renderKeypad();
        } else
        {
            if (keypadDigits.length < 4) { keypadDigits += el.textContent.trim(); renderKeypad(); }
        }
    });

    // Small beep when finished
    const beep = () =>
    {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
        o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
        o.stop(ctx.currentTime + 0.4);
    };

    const cdWrap = document.getElementById('cdRunStage');
    const countdown = new CountdownTimer((ms) =>
    {
        const { main, ms: ms3 } = fmt.toHMSS(ms);
        cd.timeMain.textContent = main;
        cd.timeMs.textContent = ms3;
        if (countdown.running) document.title = `${main}.${ms3} – Countdown`;
    }, () =>
    {
        document.title = `00:00:00 – Time’s up`;
        cdWrap.classList.add('blink'); // background toggles via CSS
        beep();
    });

    cd.startBtn.addEventListener('click', () =>
    {
        cdWrap.classList.remove('blink');
        countdown.start();
    });
    cd.resetBtn.addEventListener('click', () =>
    {
        cdWrap.classList.remove('blink');
        countdown.stop();
        countdown.resetToPreset();
        document.title = `${cd.timeMain.textContent}.${cd.timeMs.textContent} – Countdown`;
    });

    // Initialize position to center (Landing)
    setTransform(current, false);
});
