import { API_BASE_URL } from './api-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const tenantSelect = document.getElementById('tenantSelect');
            const tenantId = tenantSelect ? tenantSelect.value : 'siga_jrpocaterra';

            try {
                // Mostrar spinner
                Swal.fire({
                    title: 'Iniciando sesión...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                });

                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Tenant-ID': tenantId
                    },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    throw new Error('Credenciales inválidas');
                }

                const data = await response.json();
                const token = data.token;

                // Guardar datos en localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('tenantId', tenantId);

                // Decodificar JWT para obtener roles
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = atob(payloadBase64);
                const payloadObj = JSON.parse(decodedPayload);
                
                // Normalmente los roles en Spring Security JWT están en una propiedad como 'roles', 'authorities', o 'scope'
                // Guardamos el payload entero por conveniencia
                localStorage.setItem('jwtPayload', decodedPayload);

                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Inicio de sesión exitoso',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = '/home.html';
                });

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso Denegado',
                    text: 'El usuario no pertenece al colegio seleccionado o las credenciales son incorrectas.'
                });
                console.error('Login error:', error);
            }
        });
    }
});
