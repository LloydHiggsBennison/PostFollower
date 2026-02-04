// Postfollower - Main JS (Landing Page)
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.8)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Animate on scroll
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Typing effect
    const typingElement = document.querySelector('.typing-effect p');
    if (typingElement) {
        const originalText = typingElement.textContent;
        typingElement.textContent = '';
        let index = 0;
        function typeChar() {
            if (index < originalText.length) {
                typingElement.textContent += originalText[index];
                index++;
                setTimeout(typeChar, 15);
            }
        }
        setTimeout(typeChar, 1000);
    }

    // ========================================
    // DEMO SECTION - GENERATE POSTS
    // ========================================
    const demoBtn = document.getElementById('demoGenerateBtn');
    const demoResult = document.getElementById('demoResult');

    if (demoBtn && demoResult) {
        demoBtn.addEventListener('click', async () => {
            const businessType = document.getElementById('demoNegocio')?.value || 'Emprendimiento';
            const tone = document.getElementById('demoTono')?.value || 'profesional';
            const network = document.getElementById('demoRed')?.value || 'instagram';

            // Loading state
            demoBtn.disabled = true;
            demoBtn.innerHTML = '<div class="spinner"></div> Generando...';
            demoResult.innerHTML = '<p class="placeholder-text">✨ Generando posts con IA...</p>';

            // Simulate AI generation
            await new Promise(r => setTimeout(r, 2000));

            const posts = [
                { content: `✨ ¿Sabías que ${businessType} puede transformar tu día? Descubre cómo en nuestra última publicación 👆\n\n¿Cuál es tu experiencia favorita con nosotros? Cuéntanos en los comentarios 💬`, hashtags: ['#Emprendimiento', '#Chile', '#Calidad'] },
                { content: `🔥 ¡Nuevo en ${businessType}!\n\nEstamos emocionados de compartir esto contigo. Porque tú mereces lo mejor 💯\n\n¿Te gustaría saberlo? Escríbenos 📩`, hashtags: ['#Novedades', '#Tendencias'] },
                { content: `💡 CONSEJO DEL DÍA\n\nUn pequeño cambio puede hacer una gran diferencia. En ${businessType} lo sabemos bien.\n\n¿Cuál es tu hack favorito? 👇`, hashtags: ['#Tips', '#Consejos'] },
                { content: `📸 Behind the scenes de ${businessType} ✨\n\nAsí es como trabajamos para darte siempre lo mejor. Con pasión, dedicación y mucho ❤️`, hashtags: ['#BehindTheScenes', '#Trabajo'] },
                { content: `🎉 ¡GRACIAS por ser parte de nuestra comunidad!\n\nCada día nos motivan a ser mejores. ${businessType} existe gracias a ustedes 🙏`, hashtags: ['#Comunidad', '#Gracias'] }
            ];

            demoResult.innerHTML = posts.map((post, i) => `
                <div style="background: rgba(255,255,255,0.1); padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                    <div style="font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-bottom: 0.25rem;">Post ${i + 1}</div>
                    <div style="font-size: 0.875rem; line-height: 1.6;">${post.content.replace(/\n/g, '<br>')}</div>
                    <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #6ee7b7;">${post.hashtags.join(' ')}</div>
                </div>
            `).join('');

            // Reset button
            demoBtn.disabled = false;
            demoBtn.innerHTML = `
                <span>Generar 5 Posts</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
            `;
        });
    }
});

