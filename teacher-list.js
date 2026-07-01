import { fetchAPI, hasRole } from '/api-client.js';

// teacher-list.js

// 1. Simulación de datos
const mockData = [
  { id: 1, cedula: 'V-15123456', nombre: 'Carlos Rodríguez', especialidad: 'Matemáticas' },
  { id: 2, cedula: 'V-12987654', nombre: 'Luisa Martínez', especialidad: 'Física' },
  { id: 3, cedula: 'V-17111222', nombre: 'Andrés Gil', especialidad: 'Química' },
  { id: 4, cedula: 'V-14555888', nombre: 'Sofía Castro', especialidad: 'Literatura' },
];

$(document).ready(async () => {
  
  // Llamada real al backend con nuestro fetch seguro (envía token y tenant)
  const response = await fetchAPI('/docente/listado');
  const data = await response.json();
  // El backend retorna un Array directamente
  const teachers = Array.isArray(data) ? data : mockData;

  const table = $('#datatableTeacher').DataTable({
    data: teachers,
    columns: [
      { data: 'id' },
      { data: 'numeroDocumento' },
      { 
        data: null,
        render: function(data, type, row) {
          return `${row.primerNombre || ''} ${row.primerApellido || ''}`;
        }
      },
      { data: 'categoria' },
      { 
        // Columna de acciones
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

  // Delegación de eventos para botones
  $('#datatableTeacher tbody').on('click', '.btn-delete', function() {
    const id = $(this).data('id');
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará el docente ID " + id + " permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          '¡Eliminado!',
          'El docente ha sido borrado.',
          'success'
        );
      }
    });
  });

});
