(() => {
    const root = document.documentElement;
    const toggle = document.querySelector('.theme-toggle');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const saved = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    root.dataset.theme = saved || (prefersLight ? 'light' : 'dark');

    const setTheme = (theme) => {
        root.dataset.theme = theme;
        try { localStorage.setItem('theme', theme); } catch {}
    };

    toggle?.addEventListener('click', () => {
        const next = root.dataset.theme === 'light' ? 'dark' : 'light';

        if (!document.startViewTransition || reduceMotion.matches) {
            setTheme(next);
            return;
        }

        
        toggle?.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');


        
        // origin = center of the toggle button
        const box = toggle.getBoundingClientRect();
        const x = box.left + box.width / 2;
        const y = box.top + box.height / 2;
        const radius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        const transition = document.startViewTransition(() => setTheme(next));

        transition.ready.then(() => {
            root.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${radius}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 800,
                    easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
                    pseudoElement: '::view-transition-new(root)',
                }
            );
        });
    });
})();