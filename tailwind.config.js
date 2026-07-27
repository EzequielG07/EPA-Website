/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './*.html', // Captura index.html, admin.html y cualquier otro HTML en la raíz
        './src/**/*.{html,js,css}', // Captura HTML/JS dentro de src/
        './assets/**/*.js', // Captura scripts JS en assets/
        './js/**/*.js', // Captura scripts si tenés carpeta js/
    ],
    theme: {
        extend: {
            colors: {
                logo: {
                    fucsia: '#e600a0',
                    cian: '#00d2ff',
                    azul: '#2000b0',
                    dark: '#0d0d12',
                },
            },
        },
    },
    plugins: [],
};
