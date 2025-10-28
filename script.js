document.addEventListener('DOMContentLoaded', () => {
    
    // ==================== FUNCIONALIDADE DO MENU HAMBURGUER (MOBILE) ====================
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav__link');

    // Abre/Fecha o menu ao clicar no toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
        });
    }

    // Fecha o menu ao clicar em qualquer link (para navegação suave)
    navLinks.forEach(link => link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    }));

    // ==================== EFEITO DO HEADER AO ROLAR (Scroll Header) ====================
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY >= 50) { // Adiciona a classe 'scrolled' após 50px de rolagem
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Rola para o topo (útil para quem quer colocar um botão "Voltar ao Topo")
    // O botão 'whatsapp__float' pode servir como esse botão se preferir
});