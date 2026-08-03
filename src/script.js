document.addEventListener('DOMContentLoaded', () => {
    initFormulario();
});

// Listener global para cerrar el dropdown si se hace click afuera
let closeDropdownHandler = null;

function initFormulario() {
    const form = document.querySelector('form');
    if (!form) return;

    // Configuración de WhatsApp (Código país + código de área + número)
    // Ejemplo Argentina: '5491112345678'
    const TELEFONO_WSP = '5491151779388';

    const toggleServicesBtn = document.getElementById('toggle-services-btn');
    const servicesDropdown = document.getElementById('services-dropdown');
    const toggleIcon = document.getElementById('toggle-icon');
    const checkboxes = document.querySelectorAll('.service-checkbox');
    const tagsContainer = document.getElementById('selected-tags-container');
    const placeholder = document.getElementById('no-services-placeholder');

    const nombreInput = document.getElementById('nombre');
    const celularInput = document.getElementById('celular');
    const emailInput = document.getElementById('email');
    const comentarioInput = document.getElementById('comentario');
    const redsocialInput = document.getElementById('red-social');

    // Respaldo del HTML original
    const estructuraOriginalForm = form.innerHTML;

    // ==========================================
    // LÓGICA DEL DROPDOWN Y TAGS
    // ==========================================
    const toggleDropdown = (e) => {
        e.preventDefault();
        const isHidden = servicesDropdown.classList.contains('hidden');
        if (isHidden) {
            servicesDropdown.classList.remove('hidden');
            if (toggleIcon) toggleIcon.classList.add('rotate-180');
        } else {
            servicesDropdown.classList.add('hidden');
            if (toggleIcon) toggleIcon.classList.remove('rotate-180');
        }
    };

    if (closeDropdownHandler) {
        document.removeEventListener('click', closeDropdownHandler);
    }

    closeDropdownHandler = (e) => {
        if (
            toggleServicesBtn &&
            servicesDropdown &&
            !toggleServicesBtn.contains(e.target) &&
            !servicesDropdown.contains(e.target)
        ) {
            servicesDropdown.classList.add('hidden');
            if (toggleIcon) toggleIcon.classList.remove('rotate-180');
        }
    };

    document.addEventListener('click', closeDropdownHandler);

    function updateTags() {
        const existingTags = tagsContainer.querySelectorAll('.dynamic-tag');
        existingTags.forEach((tag) => tag.remove());

        let hasChecked = false;

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                hasChecked = true;
                const labelText = checkbox.getAttribute('data-label');
                const value = checkbox.value;

                const tag = document.createElement('div');
                tag.className =
                    'dynamic-tag flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 border border-zinc-800 rounded-lg transition duration-200 hover:border-logo-fucsia/40 animate-fade-in';
                tag.innerHTML = `
                    <span>${labelText}</span>
                    <button type="button" data-value="${value}" class="remove-tag-btn text-zinc-500 hover:text-logo-fucsia transition-colors duration-150 focus:outline-none cursor-pointer p-0.5">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                `;
                tagsContainer.appendChild(tag);
            }
        });

        if (hasChecked) {
            placeholder.classList.add('hidden');
            tagsContainer.classList.remove('border-rose-500/80', 'bg-rose-950/10');
            tagsContainer.classList.add('border-zinc-800', 'bg-zinc-900/20');
        } else {
            placeholder.classList.remove('hidden');
        }
    }

    const removeTagViaButton = (e) => {
        const removeBtn = e.target.closest('.remove-tag-btn');
        if (removeBtn) {
            const valueToUncheck = removeBtn.getAttribute('data-value');
            const correspondingCheckbox = document.querySelector(`.service-checkbox[value="${valueToUncheck}"]`);
            if (correspondingCheckbox) {
                correspondingCheckbox.checked = false;
                updateTags();
            }
        }
    };

    if (toggleServicesBtn) toggleServicesBtn.addEventListener('click', toggleDropdown);
    checkboxes.forEach((cb) => cb.addEventListener('change', updateTags));
    if (tagsContainer) tagsContainer.addEventListener('click', removeTagViaButton);

    // ==========================================
    // SISTEMA DE VALIDACIONES
    // ==========================================
    const showError = (inputElement, message) => {
        const parent = inputElement.parentElement;
        let errorMsg = parent.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message text-rose-500 text-xs mt-1 block pl-1 animate-fade-in';
            parent.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
        inputElement.classList.remove('border-zinc-800', 'focus:border-logo-cian', 'focus:ring-logo-cian');
        inputElement.classList.add('border-rose-500/80', 'focus:border-rose-500', 'focus:ring-rose-500');
    };

    const clearError = (inputElement) => {
        const parent = inputElement.parentElement;
        const errorMsg = parent.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
        inputElement.classList.remove('border-rose-500/80', 'focus:border-rose-500', 'focus:ring-rose-500');
        inputElement.classList.add('border-zinc-800', 'focus:border-logo-cian', 'focus:ring-logo-cian');
    };

    const validateNombre = () => {
        const value = nombreInput.value.trim();
        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ'\s]{3,50}$/;
        if (value === '') {
            showError(nombreInput, 'El nombre es obligatorio.');
            return false;
        }
        if (!nombreRegex.test(value)) {
            showError(nombreInput, 'Ingresá un nombre válido (mínimo 3 caracteres, sin números).');
            return false;
        }
        clearError(nombreInput);
        return true;
    };

    const validateCelular = () => {
        const value = celularInput.value.trim();
        const celularRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-s./0-9\s]{6,20}$/;
        if (value === '') {
            showError(celularInput, 'El celular es obligatorio.');
            return false;
        }
        if (!celularRegex.test(value)) {
            showError(celularInput, 'Formato inválido. Ej: +54 9 11 1234-5678');
            return false;
        }
        clearError(celularInput);
        return true;
    };

    const validateEmail = () => {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === '') {
            showError(emailInput, 'El correo electrónico es obligatorio.');
            return false;
        }
        if (!emailRegex.test(value)) {
            showError(emailInput, 'Ingresá un correo electrónico válido.');
            return false;
        }
        clearError(emailInput);
        return true;
    };

    const validateServices = () => {
        const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
        if (!anyChecked) {
            tagsContainer.classList.remove('border-zinc-800', 'bg-zinc-900/20');
            tagsContainer.classList.add('border-rose-500/80', 'bg-rose-950/10');
            if (toggleServicesBtn) toggleServicesBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }
        return true;
    };

    if (nombreInput) {
        nombreInput.addEventListener('blur', validateNombre);
        nombreInput.addEventListener('input', () => {
            if (nombreInput.parentElement.querySelector('.error-message')) validateNombre();
        });
    }

    if (celularInput) {
        celularInput.addEventListener('blur', validateCelular);
        celularInput.addEventListener('input', () => {
            if (celularInput.parentElement.querySelector('.error-message')) validateCelular();
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', () => {
            if (emailInput.parentElement.querySelector('.error-message')) validateEmail();
        });
    }

    // ==========================================
    // ENVÍO A WHATSAPP
    // ==========================================
    const handleSubmit = (e) => {
        e.preventDefault();

        const isNombreValid = validateNombre();
        const isCelularValid = validateCelular();
        const isEmailValid = validateEmail();
        const isServicesValid = validateServices();

        if (!isNombreValid || !isCelularValid || !isEmailValid || !isServicesValid) return;

        const serviciosSeleccionados = [];
        checkboxes.forEach((cb) => {
            if (cb.checked) serviciosSeleccionados.push(`• ${cb.getAttribute('data-label')}`);
        });

        const nombre = nombreInput.value.trim();
        const celular = celularInput.value.trim();
        const email = emailInput.value.trim();
        const red = redsocialInput.value.trim();
        const comentario = comentarioInput ? comentarioInput.value.trim() : '';

        // Construcción del mensaje con formato WhatsApp (*negrita*, saltos de línea)
        let mensaje = `*¡Hola! Nueva consulta desde la web*\n\n`;
        mensaje += `*Nombre:* ${nombre}\n`;
        mensaje += `*Celular:* ${celular}\n`;
        mensaje += `*Email:* ${email}\n`;
        mensaje += `*Red Social:* ${red}\n\n`;
        mensaje += `*Servicios de interés:*\n${serviciosSeleccionados.join('\n')}\n`;

        if (comentario !== '') {
            mensaje += `\n*Comentario:* ${comentario}`;
        }

        // Generar enlace para WhatsApp
        const whatsappUrl = `https://wa.me/${TELEFONO_WSP}?text=${encodeURIComponent(mensaje)}`;

        // Abrir WhatsApp en una nueva pestaña
        window.open(whatsappUrl, '_blank');

        // Mostramos el mensaje de éxito en la web para que la UI responda adecuadamente
        if (closeDropdownHandler) {
            document.removeEventListener('click', closeDropdownHandler);
        }

        form.innerHTML = `
            <div class="flex flex-col items-center justify-center text-center py-12 px-4 animate-fade-in bg-zinc-900/40 border border-zinc-800 rounded-2xl w-full">
                <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                    <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">¡Redirigiendo a WhatsApp!</h3>
                <p class="text-zinc-400 text-sm max-w-sm leading-relaxed mb-8">
                    Se ha abierto una nueva ventana con WhatsApp. Presioná "Enviar" en la app para enviarnos tu solicitud.
                </p>
                <button type="button" id="reset-form-btn" class="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 hover:text-white transition-all duration-200 focus:outline-none cursor-pointer">
                    Realizar otra consulta
                </button>
            </div>
        `;
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const resetBtn = document.getElementById('reset-form-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                form.innerHTML = estructuraOriginalForm;
                initFormulario();
            });
        }
    };

    form.onsubmit = handleSubmit;
}

// ==========================================
// NAVBAR RESPONSIVE & IDIOMAS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const btnIdiomaDesktop = document.getElementById('btn-idioma-desktop');
    const menuIdiomasDesktop = document.getElementById('menu-idiomas-desktop');
    const btnIdiomaMobile = document.getElementById('btn-idioma-mobile');
    const menuIdiomasMobile = document.getElementById('menu-idiomas-mobile');
    const flechaIdiomaMobile = document.getElementById('flecha-idioma-mobile');

    if (menuBtn && mobileMenu && menuIcon) {
        menuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');

            if (isHidden && menuIdiomasMobile && flechaIdiomaMobile) {
                menuIdiomasMobile.classList.add('hidden');
                flechaIdiomaMobile.classList.remove('rotate-180');
            }

            if (isHidden) {
                menuIcon.innerHTML =
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            } else {
                menuIcon.innerHTML =
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            }
        });

        mobileLinks.forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuIcon.innerHTML =
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            });
        });
    }

    if (btnIdiomaDesktop && menuIdiomasDesktop) {
        btnIdiomaDesktop.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            menuIdiomasDesktop.classList.toggle('hidden');
        });
    }

    if (btnIdiomaMobile && menuIdiomasMobile && flechaIdiomaMobile) {
        btnIdiomaMobile.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isHidden = menuIdiomasMobile.classList.toggle('hidden');

            if (!isHidden) {
                flechaIdiomaMobile.classList.add('rotate-180');
            } else {
                flechaIdiomaMobile.classList.remove('rotate-180');
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (menuIdiomasDesktop && !btnIdiomaDesktop.contains(e.target) && !menuIdiomasDesktop.contains(e.target)) {
            menuIdiomasDesktop.classList.add('hidden');
        }
    });
});

// function cambiarIdioma(codigo) {
//     const dominio = window.location.hostname === 'localhost' ? '' : ';domain=.github.io';

//     if (codigo === 'es') {
//         document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' + dominio;
//         document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
//     } else {
//         document.cookie = 'googtrans=/es/' + codigo + '; path=/' + dominio;
//         document.cookie = 'googtrans=/es/' + codigo + '; path=/';
//     }

//     location.reload();
// }

function cambiarIdioma(codigo) {
    // 1. Obtener el dominio actual dinámicamente
    const hostname = window.location.hostname;

    // Si no es localhost, preparamos la propiedad domain con un punto adelante para cubrir subdominios
    const domainAttribute = hostname === 'localhost' ? '' : `; domain=.${hostname.replace(/^www\./, '')}`;

    if (codigo === 'es') {
        // 2. Para volver a Español: Borrar la cookie en la raíz y en el dominio específico
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domainAttribute}`;
    } else {
        // 3. Para cambiar a otro idioma (ej: 'en'): Guardar la cookie correctamente en el dominio actual
        document.cookie = `googtrans=/es/${codigo}; path=/`;
        document.cookie = `googtrans=/es/${codigo}; path=/${domainAttribute}`;
    }

    // 4. Recargar la página para aplicar los cambios
    location.reload();
}
// ==========================================
// CONFIGURACIÓN DE LA API DE INSTAGRAM
// ==========================================
// Pegá aquí el token generado desde Instagram Basic Display (User Token Generator)
const INSTAGRAM_ACCESS_TOKEN =
    'IGAAPBheOYEJpBZAFpVUWh1MHZAFOGwzRlJrNGFTeVV5OWhRdklTV09IM3NCN0xTb2lDeHo1ZA2lqSFUzRXNIdGZAZAamdyb2J0Q0ZA0eGdwSld1RHpyQWsyeDhGYnczV21pQXBhaUNjbTZAiNW16eElWOFUtblNvaW02MkJTa0xSNWd2ZAwZDZD';

/**
 * Consulta Instagram Graph API para obtener el último post/reel del cliente
 */
async function cargarUltimoPostInstagram() {
    if (!INSTAGRAM_ACCESS_TOKEN) {
        console.warn('Instagram API: Falta configurar un Access Token válido.');
        return;
    }

    // Consulta directa a la API de Instagram Basic Display pidiendo solo la última publicación
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=1&access_token=${INSTAGRAM_ACCESS_TOKEN}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('Error de Instagram API:', data.error.message);
            return;
        }

        // Extraemos la última publicación devuelta por la API
        const latestMedia = data.data && data.data.length > 0 ? data.data[0] : null;

        if (latestMedia) {
            const btnModal =
                document.getElementById('open-instagram-modal') || document.querySelector('[data-reel-id]');
            const imgCover =
                document.getElementById('reel-cover-img') || (btnModal ? btnModal.querySelector('img') : null);

            // Determinar la portada correcta (thumbnail_url para vídeos/reels, media_url para imágenes)
            const coverUrl = latestMedia.thumbnail_url || latestMedia.media_url;

            // Asignar los atributos al botón
            if (btnModal) {
                if (latestMedia.id) btnModal.setAttribute('data-reel-id', latestMedia.id);
                if (latestMedia.permalink) btnModal.setAttribute('data-reel-url', latestMedia.permalink);
            }

            // Actualizar la imagen en el DOM
            if (imgCover && coverUrl) {
                imgCover.src = coverUrl;
            }
        } else {
            console.warn('No se encontró contenido publicado en la cuenta de Instagram.');
        }
    } catch (error) {
        console.error('Error al conectar con la API de Instagram:', error);
    }
}

// ==========================================
// CONTROL DEL MODAL DE INSTAGRAM
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    // Carga inicial dinámica desde Meta API
    cargarUltimoPostInstagram();

    const openBtn = document.getElementById('open-instagram-modal');
    const modal = document.getElementById('instagram-modal');
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-modal');
    const embedTarget = document.getElementById('modal-embed-target');
    const loader = document.getElementById('modal-loader');

    if (!openBtn || !modal) return;

    let checkIframeInterval = null;

    function openModal() {
        const reelUrl = openBtn.getAttribute('data-reel-url');
        const reelId = openBtn.getAttribute('data-reel-id');

        // Preferimos el permalink completo si viene de la API, sino armamos la URL con el ID
        const targetPermalink = reelUrl || (reelId ? `https://www.instagram.com/reel/${reelId}/` : null);
        if (!targetPermalink) return;

        document.body.classList.add('overflow-hidden');

        modal.classList.remove('pointer-events-none', 'opacity-0');
        modal.classList.add('opacity-100');
        const modalContainer = modal.querySelector('.relative');
        if (modalContainer) {
            modalContainer.classList.remove('scale-95');
            modalContainer.classList.add('scale-100');
        }

        embedTarget.innerHTML = `
            <div id="modal-loader" class="absolute inset-0 bg-zinc-900/95 rounded-2xl flex flex-col items-center justify-center space-y-4 transition-opacity duration-300 z-20">
                ${loader ? loader.innerHTML : '<span class="text-xs font-bold text-zinc-400">Cargando Reel...</span>'}
            </div>
            <blockquote class="instagram-media" 
                        data-instgrm-captioned 
                        data-instgrm-permalink="${targetPermalink}?utm_source=ig_embed&amp;utm_campaign=loading" 
                        data-instgrm-version="14">
            </blockquote>
        `;

        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
        } else {
            const script = document.createElement('script');
            script.async = true;
            script.src = '//www.instagram.com/embed.js';
            document.body.appendChild(script);
        }

        const activeLoader = embedTarget.querySelector('#modal-loader');
        checkIframeInterval = setInterval(() => {
            const iframe = embedTarget.querySelector('iframe');
            if (iframe) {
                clearInterval(checkIframeInterval);
                iframe.onload = function () {
                    if (activeLoader) {
                        activeLoader.style.opacity = '0';
                        setTimeout(() => activeLoader.remove(), 400);
                    }
                };
            }
        }, 150);

        setTimeout(() => {
            clearInterval(checkIframeInterval);
            if (activeLoader) {
                activeLoader.style.opacity = '0';
                setTimeout(() => activeLoader.remove(), 400);
            }
        }, 8000);
    }

    function closeModal() {
        clearInterval(checkIframeInterval);

        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0', 'pointer-events-none');
        const modalContainer = modal.querySelector('.relative');
        if (modalContainer) {
            modalContainer.classList.remove('scale-100');
            modalContainer.classList.add('scale-95');
        }

        document.body.classList.remove('overflow-hidden');

        setTimeout(() => {
            if (embedTarget) embedTarget.innerHTML = '';
        }, 300);
    }

    openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('opacity-100')) {
            closeModal();
        }
    });
});

// ==========================================
// CONFIGURACIÓN E INICIALIZACIÓN FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: 'AIzaSyCTEKHrjvi-rZKuV7F6uF8144Oiz8kC-Xs',
    authDomain: 'epa-studio-web.firebaseapp.com',
    projectId: 'epa-studio-web',
    storageBucket: 'epa-studio-web.firebasestorage.app',
    messagingSenderId: '532664420233',
    appId: '1:532664420233:web:fafb06c49b5ba2ca2c8358',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ==========================================
// RENDERIZADO Y CARGA DINÁMICA DE TARJETAS
// ==========================================

function crearTarjetaHTML(idDoc, data) {
    // Corregido: Ahora lee 'sitio_web' tal como se guarda en admin.html
    let urlDestino = data.sitio_web ? data.sitio_web.trim() : '';
    if (urlDestino && !urlDestino.startsWith('http://') && !urlDestino.startsWith('https://')) {
        urlDestino = `https://${urlDestino}`;
    }

    const seccionLink = urlDestino
        ? `
        <div class="mt-5 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
            <span class="text-xs text-zinc-500 font-medium">Ver más</span>
            <a 
                href="${urlDestino}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-logo-fucsia transition-colors font-medium group/link"
                onclick="event.stopPropagation();" 
            >
                <span>Ir al enlace</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform">
                    <path d="M7 17l9.2-9.2M17 17V8H8"/>
                </svg>
            </a>
        </div>
    `
        : '';

    return `
    <div
        id="${idDoc}"
        class="w-full snap-start group bg-zinc-950/60 border border-zinc-800/80 p-5 sm:p-6 rounded-xl hover:border-logo-fucsia/50 transition-all duration-300 relative overflow-hidden shadow-xl hover:shadow-logo-fucsia/5 cursor-pointer flex flex-col justify-between"
    >
            <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-logo-fucsia to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div>
                <span class="text-xs text-logo-fucsia font-semibold uppercase tracking-wider block">
                    ${data.span || 'General'}
                </span>
                <h3 class="text-xl font-bold text-white mt-2">
                    ${data.h3 || 'Sin título'}
                </h3>
                <p class="text-zinc-400 text-sm mt-2 leading-relaxed">
                    ${data.p || ''}
                </p>
            </div>

            ${seccionLink}
        </div>
    `;
}

function cargarTarjetas() {
    const contenedor = document.getElementById('contenedor-tarjetas');

    if (!contenedor) {
        console.error('No se encontró el elemento #contenedor-tarjetas en el DOM.');
        return;
    }

    db.collection('tarjetas').onSnapshot(
        (snapshot) => {
            contenedor.innerHTML = '';

            if (snapshot.empty) {
                contenedor.innerHTML = `<p class="text-zinc-500 text-sm col-span-full">No hay tarjetas registradas.</p>`;
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                const tarjetaHTML = crearTarjetaHTML(doc.id, data);
                contenedor.insertAdjacentHTML('beforeend', tarjetaHTML);
            });
        },
        (error) => {
            console.error('Error al escuchar Firestore:', error);
            contenedor.innerHTML = `<p class="text-red-400 text-sm col-span-full">Error al cargar el contenido.</p>`;
        },
    );
}

document.addEventListener('DOMContentLoaded', cargarTarjetas);
