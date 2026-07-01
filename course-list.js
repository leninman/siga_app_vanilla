import { fetchAPI, hasRole } from '/api-client.js';

// course-list.js

const mockData = [
  { id: 'C001', annio: '1ero', seccion: 'A', nivel: 'Básica', turno: 'Mañana', periodoAcademico: '2023-2024' },
  { id: 'C002', annio: '2do', seccion: 'B', nivel: 'Básica', turno: 'Tarde', periodoAcademico: '2023-2024' },
  { id: 'C003', annio: '5to', seccion: 'A', nivel: 'Diversificado', turno: 'Mañana', periodoAcademico: '2023-2024' }
];

$(document).ready(async () => {
  
  let courses = mockData;
  try {
      const response = await fetchAPI('/curso/listado');
      const data = await response.json();
      courses = Array.isArray(data) ? data : mockData;
  } catch (error) {
      console.error('Error fetching courses:', error);
  }

  const table = $('#datatableCourse').DataTable({
    data: courses,
    columns: [
      { data: 'id' },
      { data: 'annio' },
      { data: 'seccion' },
      { data: 'nivel' },
      { data: 'turno' },
      { data: 'periodoAcademico' },
      { 
        data: null, 
        render: function(data, type, row) {
          const btnVer = `<button class="btn btn-sm btn-info btn-view shadow-sm" data-id="${row.id}">Ver</button>`;
          const btnEditar = hasRole('ADMINISTRATIVO') || hasRole('DIRECTOR') 
              ? `<button class="btn btn-sm btn-warning btn-edit shadow-sm" data-id="${row.id}">Editar</button>` 
              : '';
          const btnBorrar = hasRole('ADMINISTRATIVO') 
              ? `<button class="btn btn-sm btn-danger btn-delete shadow-sm" data-id="${row.id}">Borrar</button>` 
              : '';
          
          return `${btnVer} ${btnEditar} ${btnBorrar}`;
        }
      }
    ],
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
    }
  });

  // SweetAlert Integration para el botón Borrar
  $('#datatableCourse tbody').on('click', '.btn-delete', function() {
    const id = $(this).data('id');
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará el curso " + id + " permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí iría la llamada fetch() real al backend
        Swal.fire(
          '¡Eliminado!',
          'El curso ha sido eliminado con éxito.',
          'success'
        );
      }
    });
  });

  const btnAddCourse = document.getElementById('btnAddCourse');
  if (btnAddCourse && !hasRole('ADMINISTRATIVO') && !hasRole('DIRECTOR')) {
      btnAddCourse.style.display = 'none';
  } else if (btnAddCourse) {
      $(btnAddCourse).on('click', () => {
        Swal.fire('Función en desarrollo', 'El formulario de cursos está pendiente', 'info');
      });
  }

});
