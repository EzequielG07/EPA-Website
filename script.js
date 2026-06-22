document.addEventListener('DOMContentLoaded', () => {
    // Referencias de los elementos del DOM
    const toggleServicesBtn = document.getElementById('toggle-services-btn');
    const servicesDropdown = document.getElementById('services-dropdown');
    const toggleIcon = document.getElementById('toggle-icon');
    const checkboxes = document.querySelectorAll('.service-checkbox');
    const tagsContainer = document.getElementById('selected-tags-container');
    const placeholder = document.getElementById('no-services-placeholder');

    // 1. Mostrar / Ocultar el dropdown al hacer clic en el botón
    toggleServicesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = servicesDropdown.classList.contains('hidden');

        if (isHidden) {
            servicesDropdown.classList.remove('hidden');
            toggleIcon.classList.add('rotate-180');
        } else {
            servicesDropdown.classList.add('hidden');
            toggleIcon.classList.remove('rotate-180');
        }
    });

    // 2. Cerrar el dropdown automáticamente si el usuario hace clic afuera
    document.addEventListener('click', (e) => {
        if (!toggleServicesBtn.contains(e.target) && !servicesDropdown.contains(e.target)) {
            servicesDropdown.classList.add('hidden');
            toggleIcon.classList.remove('rotate-180');
        }
    });

    // 3. Función encargada de actualizar los tags dinámicamente
    function updateTags() {
        // Remover todos los tags pintados anteriormente
        const existingTags = tagsContainer.querySelectorAll('.dynamic-tag');
        existingTags.forEach((tag) => tag.remove());

        let hasChecked = false;

        // Recorrer los checkboxes buscando cuáles están activos
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                hasChecked = true;
                const labelText = checkbox.getAttribute('data-label');
                const value = checkbox.value;

                // Crear elemento visual del Tag
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

        // Alternar el mensaje vacío
        if (hasChecked) {
            placeholder.classList.add('hidden');
        } else {
            placeholder.classList.remove('hidden');
        }
    }

    // Escuchar el evento de cambio en los checkboxes
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', updateTags);
    });

    // 4. Permitir eliminar los tags haciendo clic directo en su botón "X"
    tagsContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-tag-btn');
        if (removeBtn) {
            const valueToUncheck = removeBtn.getAttribute('data-value');
            const correspondingCheckbox = document.querySelector(`.service-checkbox[value="${valueToUncheck}"]`);

            if (correspondingCheckbox) {
                correspondingCheckbox.checked = false;
                updateTags(); // Volver a renderizar
            }
        }
    });
});

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
