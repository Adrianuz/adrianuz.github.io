// Smooth scrolling e animações
document.addEventListener('DOMContentLoaded', function() {
    // Scroll suave para links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Atualizar link ativo
                updateActiveLink(this);
            }
        });
    });
    
    // Animação de entrada das seções
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animação especial para skill tags
                if (entry.target.classList.contains('skills')) {
                    animateSkillTags(entry.target);
                }
                
                // Animação especial para projetos
                if (entry.target.classList.contains('projects')) {
                    animateProjectCards(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observar todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Destacar link ativo na navegação durante scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    updateActiveLink(activeLink);
                }
            }
        });
        
        // Efeito no header durante scroll
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Typing effect para o título
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        typeWriter(heroTitle, originalText, 100);
    }
    
    // Contador animado (se houver elementos com números)
    animateCounters();
    
    // Inicializar tooltips para skills
    initializeSkillTooltips();
    
    // Performance: lazy loading para imagens (se houver)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Funções auxiliares
function updateActiveLink(activeLink) {
    // Remover classe ativa de todos os links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Adicionar classe ativa ao link atual
    activeLink.classList.add('active');
}

function typeWriter(element, text, speed) {
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

function animateSkillTags(skillsSection) {
    const skillTags = skillsSection.querySelectorAll('.skill-tag');
    
    skillTags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(20px)';
            tag.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'translateY(0)';
            }, 50);
        }, index * 50);
    });
}

function animateProjectCards(projectsSection) {
    const projectCards = projectsSection.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 100);
        }, index * 200);
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000; // 2 segundos
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            counter.textContent = Math.floor(current);
            
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            }
        }, duration / steps);
    });
}

function initializeSkillTooltips() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            // Adicionar efeito visual
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Função para copiar email (se necessário)
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(function() {
        // Mostrar feedback visual
        showToast('Email copiado para a área de transferência!');
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        font-size: 0.875rem;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Função para alternar tema (dark mode) - opcional
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

// Carregar tema salvo
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Debounce para performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Otimizar scroll handler
const optimizedScrollHandler = debounce(function() {
    // Lógica de scroll otimizada
}, 16); // ~60fps

// Adicionar event listener otimizado
window.addEventListener('scroll', optimizedScrollHandler);

// Preload de recursos críticos
function preloadResources() {
    const criticalResources = [
        // Adicionar URLs de recursos críticos se houver
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'image'; // ou 'script', 'style', etc.
        document.head.appendChild(link);
    });
}

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics (se necessário)
function trackEvent(eventName, properties = {}) {
    // Implementar tracking de eventos
    console.log('Event tracked:', eventName, properties);
}

// Adicionar tracking para interações importantes
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary')) {
        trackEvent('CTA_Click', { button: 'primary', section: 'hero' });
    }
    
    if (e.target.matches('.project-link')) {
        trackEvent('Project_Link_Click', { project: e.target.closest('.project-card').querySelector('.project-title').textContent });
    }
    
    if (e.target.matches('.contact-link')) {
        trackEvent('Contact_Click', { method: e.target.textContent.trim() });
    }
});

// Melhorar acessibilidade
document.addEventListener('keydown', function(e) {
    // Navegação por teclado
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Inicializar aplicação
function initApp() {
    loadSavedTheme();
    preloadResources();
}

// Chamar inicialização quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}