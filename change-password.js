import { fetchAPI } from '/api-client.js';
import { initMenu } from '/menu.js';

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tenantId');
  localStorage.removeItem('jwtPayload');
};

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('token')) {
    window.location.replace('/index.html');
    return;
  }

  initMenu();

  document.querySelectorAll('.toggle-password').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.target);
      const icon = button.querySelector('i');
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      icon.classList.toggle('fa-eye', !isHidden);
      icon.classList.toggle('fa-eye-slash', isHidden);
    });
  });

  document.getElementById('changePasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword.length < 8) {
      Swal.fire('Clave no válida', 'La nueva clave debe contener al menos 8 caracteres.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire('Las claves no coinciden', 'Escribe la misma nueva clave en ambos campos.', 'warning');
      return;
    }

    if (currentPassword === newPassword) {
      Swal.fire('Clave no válida', 'La nueva clave debe ser diferente de la actual.', 'warning');
      return;
    }

    try {
      Swal.fire({ title: 'Actualizando clave...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      await fetchAPI('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });

      clearSession();
      await Swal.fire({
        icon: 'success',
        title: 'Clave actualizada',
        text: 'Inicia sesión nuevamente con tu nueva clave.',
        confirmButtonText: 'Ir al inicio de sesión'
      });
      window.location.replace('/index.html');
    } catch (error) {
      let message = 'No fue posible actualizar la clave. Inténtalo nuevamente.';
      try {
        const response = error.response;
        if (response) {
          const data = await response.json();
          message = data.message || message;
        }
      } catch (_) {
        // El cliente ya mostró los errores de sesión o autorización cuando aplicaba.
      }
      Swal.fire('No se pudo actualizar la clave', message, 'error');
    }
  });
});
