document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: true,
        touchMultiplier: 2,
    });

    // Animate Lenis on every frame
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Setup function for all animations and effects
    function setupPortfolioEffects() {
        // Smooth scroll for nav links using Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        lenis.scrollTo(targetElement);
                    }
                }
            });
        });

        // Hamburger menu functionality
        const burgerMenu = document.getElementById('burger-menu');
        const navLinks = document.querySelector('.nav-links');
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Function to handle dark/light mode toggle
        function setupThemeToggle() {
            const themeToggleBtn = document.getElementById('theme-toggle');
            const body = document.body;

            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                body.classList.add(savedTheme);
                updateThemeIcon(savedTheme);
            } else {
                body.classList.add('dark-mode');
                updateThemeIcon('dark-mode');
            }

            themeToggleBtn.addEventListener('click', () => {
                if (body.classList.contains('dark-mode')) {
                    body.classList.remove('dark-mode');
                    body.classList.add('light-mode');
                    localStorage.setItem('theme', 'light-mode');
                    updateThemeIcon('light-mode');
                } else {
                    body.classList.remove('light-mode');
                    body.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark-mode');
                    updateThemeIcon('dark-mode');
                }
            });
        }

        function updateThemeIcon(theme) {
            const themeToggleBtn = document.getElementById('theme-toggle');
            if (theme === 'dark-mode') {
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
        setupThemeToggle();

        // Parallax effect for the hero text
        gsap.to(".hero h1, .hero p, .cta-button", {
            opacity: 0,
            y: -50,
            ease: "power1.in",
            scrollTrigger: {
                trigger: ".hero",
                start: "center center",
                end: "bottom top",
                scrub: true,
            }
        });
        
        // 3D-like animation for project cards on scroll
        gsap.utils.toArray('.project-card').forEach(card => {
            gsap.fromTo(card, {
                opacity: 0,
                y: 100,
                rotationX: 45,
                scale: 0.8
            }, {
                opacity: 1,
                y: 0,
                rotationX: 0,
                scale: 1,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                }
            });
        });

        // Subtle rotation on skill and achievement cards
        gsap.utils.toArray('.skill-category, .achievement-card, .contact-card').forEach(card => {
            gsap.fromTo(card, {
                opacity: 0,
                y: 50,
                rotationY: 15
            }, {
                opacity: 1,
                y: 0,
                rotationY: 0,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                }
            });
        });

        // New! The CRAZY 3D Tilt Effect
        gsap.to("#scroll-container", {
            rotationX: 10,
            y: "-10vh",
            ease: "none",
            scrollTrigger: {
                trigger: "#scroll-container",
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });

        // Background color transitions
        const sections = document.querySelectorAll('.section-container');
        sections.forEach((section, index) => {
            const isProjectsSection = section.id === 'projects';
            if (isProjectsSection) {
                gsap.to("body", {
                    backgroundColor: "#111111",
                    duration: 1,
                    ease: "power1.inOut",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 50%",
                        end: "bottom 50%",
                        toggleActions: "play reverse play reverse",
                    }
                });
            } else if (index < sections.length - 1) {
                const nextSection = sections[index + 1];
                gsap.to("body", {
                    backgroundColor: getComputedStyle(nextSection).getPropertyValue('--background-darker'),
                    duration: 1,
                    ease: "power1.inOut",
                    scrollTrigger: {
                        trigger: nextSection,
                        start: "top 50%",
                        end: "bottom 50%",
                        toggleActions: "play reverse play reverse",
                    }
                });
            }
        });

        // Function to add active state to navigation links based on scroll position
        function setupNavActiveState() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-links a');

            sections.forEach(section => {
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 100px",
                    end: "bottom 100px",
                    onEnter: () => updateActiveLink(section.id),
                    onEnterBack: () => updateActiveLink(section.id),
                });
            });

            function updateActiveLink(currentSectionId) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === currentSectionId) {
                        link.classList.add('active');
                    }
                });
            }
        }
        setupNavActiveState();
    }

    // Function to hide the loader and show the page content
    function hideLoader() {
        const loaderWrapper = document.getElementById('loader-wrapper');
        if (loaderWrapper) {
            gsap.to(loaderWrapper, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    loaderWrapper.style.display = 'none';
                    document.body.style.overflow = '';
                    lenis.start();
                    setupPortfolioEffects();
                }
            });
        }
    }
    
    // Call hideLoader after the window loads
    window.addEventListener('load', () => {
        hideLoader();
    });
});