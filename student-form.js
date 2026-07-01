import { fetchAPI } from '/api-client.js';

document.getElementById('btnBuscarRepr').addEventListener('click', () => {
  const cedula = document.getElementById('buscarCedulaRepr').value;
  if (!cedula) {
    Swal.fire('Atención', 'Por favor, ingrese una cédula para buscar', 'warning');
    return;
  }

  // Simulación de Fetch API
  Swal.fire({
    title: 'Buscando...',
    text: 'Consultando base de datos',
    icon: 'info',
    timer: 1000,
    showConfirmButton: false
  }).then(() => {
    // Auto-completado de prueba
    document.getElementById('nombresRepr').value = 'José Antonio';
    document.getElementById('apellidosRepr').value = 'Pérez Rincón';
    Swal.fire('Encontrado', 'Representante cargado con éxito', 'success');
  });
});

document.getElementById('formAlumno').addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita recargar la página

  // Recolectar datos usando FormData nativo de Vanilla JS
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
      Swal.fire({
          title: 'Guardando...',
          allowOutsideClick: false,
          didOpen: () => {
              Swal.showLoading()
          }
      });

      const response = await fetchAPI('/alumno/crear', {
          method: 'POST',
          body: JSON.stringify(data)
      });

      if (!response.ok) {
          throw new Error('No se pudo guardar el estudiante');
      }

      Swal.fire({
        title: '¡Guardado!',
        text: 'El estudiante ha sido registrado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        window.location.href = '/student.html';
      });

  } catch (error) {
      console.error('Error saving student:', error);
      if (!error.message.includes('401') && !error.message.includes('403')) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema guardando los datos. Revisa la consola.'
          });
      }
  }
});
