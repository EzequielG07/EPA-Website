document.addEventListener('DOMContentLoaded', () => {
    // Al cargar la página, inicializamos el formulario por primera vez
    initFormulario();
});

function initFormulario() {
    // 1. Referencias de los elementos del DOM (Buscadas en fresco)
    const form = document.querySelector('form');
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

    // Respaldo de la estructura HTML interna del formulario para el reinicio
    const estructuraOriginalForm = form.innerHTML;

    // ==========================================
    // LÓGICA DEL DROPDOWN Y RENDERS DE TAGS
    // ==========================================
    const toggleDropdown = (e) => {
        e.preventDefault();
        const isHidden = servicesDropdown.classList.contains('hidden');
        if (isHidden) {
            servicesDropdown.classList.remove('hidden');
            toggleIcon.classList.add('rotate-180');
        } else {
            servicesDropdown.classList.add('hidden');
            toggleIcon.classList.remove('rotate-180');
        }
    };

    const closeDropdownOnClickAway = (e) => {
        if (!toggleServicesBtn.contains(e.target) && !servicesDropdown.contains(e.target)) {
            servicesDropdown.classList.add('hidden');
            toggleIcon.classList.remove('rotate-180');
        }
    };

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

    // Asignación de eventos de interfaz
    toggleServicesBtn.addEventListener('click', toggleDropdown);
    document.addEventListener('click', closeDropdownOnClickAway);
    checkboxes.forEach((cb) => cb.addEventListener('change', updateTags));
    tagsContainer.addEventListener('click', removeTagViaButton);

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
            toggleServicesBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }
        return true;
    };

    // Escuchadores en tiempo real
    nombreInput.addEventListener('blur', validateNombre);
    nombreInput.addEventListener('input', () => {
        if (nombreInput.parentElement.querySelector('.error-message')) validateNombre();
    });
    celularInput.addEventListener('blur', validateCelular);
    celularInput.addEventListener('input', () => {
        if (celularInput.parentElement.querySelector('.error-message')) validateCelular();
    });
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
        if (emailInput.parentElement.querySelector('.error-message')) validateEmail();
    });

    // ==========================================
    // ENVÍO ASÍNCRONO Y INYECCIÓN DE PANTALLA DE ÉXITO
    // ==========================================
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNombreValid = validateNombre();
        const isCelularValid = validateCelular();
        const isEmailValid = validateEmail();
        const isServicesValid = validateServices();

        if (!isNombreValid || !isCelularValid || !isEmailValid || !isServicesValid) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando solicitud...
            </span>
        `;

        const serviciosSeleccionados = [];
        checkboxes.forEach((cb) => {
            if (cb.checked) serviciosSeleccionados.push(cb.getAttribute('data-label'));
        });

        const formData = {
            nombre: nombreInput.value.trim(),
            celular: celularInput.value.trim(),
            email: emailInput.value.trim(),
            servicios: serviciosSeleccionados.join(', '),
            comentario: comentarioInput ? comentarioInput.value.trim() : '',
        };

        const ENDPOINT = 'https://formsubmit.co/ajax/ezequiel.guaymas07@gmail.com';

        fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (response.ok) {
                    // Removemos el evento click-away global de este ciclo para evitar fugas de memoria
                    document.removeEventListener('click', closeDropdownOnClickAway);

                    // Mostramos pantalla de éxito
                    form.innerHTML = `
                    <div class="flex flex-col items-center justify-center text-center py-12 px-4 animate-fade-in bg-zinc-900/40 border border-zinc-800 rounded-2xl w-full">
                        <div class="w-16 h-16 bg-logo-fucsia/10 border border-logo-fucsia/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(219,39,119,0.15)]">
                            <svg class="w-8 h-8 text-logo-fucsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">¡Solicitud Recibida!</h3>
                        <p class="text-zinc-400 text-sm max-w-sm leading-relaxed mb-8">
                            Hemos procesado tus datos correctamente. Nuestro equipo técnico analizará los servicios seleccionados y se contactará con vos a la brevedad.
                        </p>
                        <button type="button" id="reset-form-btn" class="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 hover:text-white transition-all duration-200 focus:outline-none cursor-pointer">
                            Realizar otra consulta
                        </button>
                    </div>
                `;
                    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    throw new Error('Error en servidor');
                }
            })
            .catch((error) => {
                console.error(error);
                alert('Hubo un problema al enviar el formulario.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
    });

    // ==========================================
    // ESCUCHA DEL BOTÓN DE REINICIO (DELEGACIÓN)
    // ==========================================
    form.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'reset-form-btn') {
            e.preventDefault();

            // 1. Desmarcar TODOS los checkboxes físicamente en el DOM antes de borrar el HTML
            // Esto destruye el estado residual en la memoria del navegador
            checkboxes.forEach((cb) => {
                cb.checked = false;
            });

            // 2. Restauramos la estructura limpia original al formulario
            form.innerHTML = estructuraOriginalForm;

            // 3. Volvemos a ejecutar la función para enlazar los elementos nuevos
            initFormulario();
        }
    });
}

// --- LÓGICA DEL NAVBAR RESPONSIVE ---
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (menuBtn && mobileMenu && menuIcon) {
    // Toggle para abrir y cerrar el menú
    menuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');

        // Cambia el icono de hamburguesa a una equis (X) dinámicamente
        if (isHidden) {
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16'); // Hamburguesa
            menuIcon.innerHTML =
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        } else {
            menuIcon.innerHTML =
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'; // Cruz
        }
    });

    // Cerrar el menú automáticamente al hacer clic en cualquier link del menú móvil
    mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.innerHTML =
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        });
    });
}

//TODO LOGICA BOTON IDIOMAS
document.addEventListener('DOMContentLoaded', () => {
    const btnIdioma = document.getElementById('btn-idioma');
    const menuIdiomas = document.getElementById('menu-idiomas');

    if (btnIdioma && menuIdiomas) {
        // Abrir/Cerrar menú flotante
        btnIdioma.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            menuIdiomas.classList.toggle('hidden');
        });

        // Cerrar si hace clic afuera
        document.addEventListener('click', (e) => {
            if (!btnIdioma.contains(e.target) && !menuIdiomas.contains(e.target)) {
                menuIdiomas.classList.add('hidden');
            }
        });
    }
});

// Función infalible mediante cookies nativas de Google
function cambiarIdioma(codigo) {
    // Definimos el dominio actual para que la cookie aplique a todo el sitio
    const dominio = window.location.hostname === 'localhost' ? '' : ';domain=.github.io';

    if (codigo === 'es') {
        // Para volver al español, borramos la cookie de traducción
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' + dominio;
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    } else {
        // Para otros idiomas, seteamos la ruta de traducción de Google (De Español 'es' a destino)
        document.cookie = 'googtrans=/es/' + codigo + '; path=/' + dominio;
        document.cookie = 'googtrans=/es/' + codigo + '; path=/';
    }

    // Recargamos la página para que Google lea la cookie y traduzca al vuelo
    location.reload();
}
