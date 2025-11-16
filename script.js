document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica de Carrossel de Depoimentos (Automático, Arrastável, Infinito) ---
    const depoimentosCarousel = document.querySelector('.depoimentos-carousel');
    const depoimentosTrack = document.querySelector('.carousel-track');
    const depoimentosItems = document.querySelectorAll('.depoimento-card');

    let currentIndex = 0;
    let autoSlideInterval;
    const slideDuration = 5000; // 5 segundos para auto-slide
    
    // Variáveis para o Arrastar (Drag)
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    if (depoimentosItems.length > 0) {
        // Clonar itens para simular o loop infinito
        depoimentosItems.forEach(item => {
            const clone = item.cloneNode(true);
            depoimentosTrack.appendChild(clone);
        });
    }

    // Calcula a largura que um item ocupa no track (incluindo margem/gap)
    function getSlideWidth() {
        if (depoimentosItems.length > 0) {
            const itemWidth = depoimentosItems[0].offsetWidth;
            const style = window.getComputedStyle(depoimentosTrack);
            const gap = parseFloat(style.gap) || 24; 
            return itemWidth + gap; 
        }
        return 0;
    }

    // Função de transição principal
    function updateCarousel(smooth = true) {
        // Só aplica a transição se o carrossel não estiver sendo arrastado
        if (smooth) {
            depoimentosTrack.style.transition = 'transform 0.5s ease-in-out';
        } else {
            depoimentosTrack.style.transition = 'none';
        }

        const slideWidth = getSlideWidth();
        const numItems = depoimentosItems.length;
        
        // Se o currentIndex exceder o número de itens originais, ajusta o índice para o início
        // A lógica de reset é feita no nextSlide para transição suave no loop.
        
        currentTranslate = -currentIndex * slideWidth;
        depoimentosTrack.style.transform = `translateX(${currentTranslate}px)`;

        startAutoSlide(); // Reinicia o auto-slide após qualquer movimento
    }

    // Move para o próximo slide no modo automático
    function nextSlide() {
        const numItems = depoimentosItems.length;
        const slideWidth = getSlideWidth();
        
        if (currentIndex < numItems) {
            currentIndex++;
        }
        
        // Simulação de loop infinito: Move para o primeiro clone
        if (currentIndex === numItems) {
            // Permite que o último slide real transicione para o primeiro clone
            depoimentosTrack.style.transition = 'transform 0.5s ease-in-out';
            depoimentosTrack.style.transform = `translateX(-${numItems * slideWidth}px)`;
            
            // Após a transição para o clone, reseta instantaneamente para o primeiro item real
            setTimeout(() => {
                depoimentosTrack.style.transition = 'none';
                currentIndex = 0;
                depoimentosTrack.style.transform = `translateX(0px)`;
            }, 500); // Deve ser igual ou ligeiramente maior que o tempo de transição CSS
        } else {
             updateCarousel();
        }
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // --- Lógica de Arrastar (Drag/Touch) ---

    // Eventos de Início (Mouse Down / Touch Start)
    depoimentosTrack.addEventListener('mousedown', dragStart);
    depoimentosTrack.addEventListener('touchstart', dragStart);
    
    // Eventos de Fim (Mouse Up / Touch End)
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
    
    // Eventos de Movimento (Mouse Move / Touch Move)
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag);

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function dragStart(e) {
        if (e.target.closest('a') || e.target.closest('button')) return; // Ignora se clicou em links
        
        stopAutoSlide(); 
        isDragging = true;
        startPos = getPositionX(e);
        prevTranslate = currentTranslate;
        depoimentosTrack.style.transition = 'none'; 
        
        animationID = requestAnimationFrame(animation); 
        depoimentosTrack.classList.add('grabbing');
    }

    function drag(e) {
        if (!isDragging) return;
        
        const currentPos = getPositionX(e);
        const distance = currentPos - startPos;
        currentTranslate = prevTranslate + distance;
    }

    function dragEnd() {
        cancelAnimationFrame(animationID);
        isDragging = false;
        depoimentosTrack.classList.remove('grabbing');
        
        const movedBy = currentTranslate - prevTranslate;
        const slideWidth = getSlideWidth();

        // Determina para qual slide ir com base na distância e na direção
        if (movedBy < -100) { // Arrastou para a esquerda (próximo slide)
            currentIndex = Math.min(currentIndex + 1, depoimentosItems.length);
        } else if (movedBy > 100) { // Arrastou para a direita (slide anterior)
            currentIndex = Math.max(currentIndex - 1, 0);
        }
        
        // Corrige a posição e reinicia o auto-slide
        updateCarousel(true); 
    }

    function animation() {
        if (isDragging) {
            depoimentosTrack.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(animation);
        }
    }

    // Iniciar o carrossel no carregamento
    if (depoimentosItems.length > 0) {
        // Pausa ao interagir
        depoimentosCarousel.addEventListener('mouseenter', stopAutoSlide);
        depoimentosCarousel.addEventListener('mouseleave', startAutoSlide);

        // Inicia o auto-slide
        startAutoSlide();
    }

    // Recalcular largura ao redimensionar (ajustar responsividade)
    window.addEventListener('resize', () => {
        prevTranslate = -currentIndex * getSlideWidth(); 
        updateCarousel(false);
    });

    // --- BLOQUEIO: Bloqueia a cópia pelo teclado (Ctrl/Cmd + C) (MANTIDO) --- 
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) { // Ctrl ou Cmd
            if (e.key === 'c' || e.key === 'C' || e.key === 'u' || e.key === 'U' || e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 's' || e.key === 'S') {
                e.preventDefault();
                return false;
            }
        }
    }); 
});