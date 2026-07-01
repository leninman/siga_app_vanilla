import { fetchAPI, hasRole } from '/api-client.js';

$(document).ready(() => {

  let dataTable = null;

  async function loadStudents() {
    try {
      Swal.fire({
        title: 'Cargando Estudiantes...',
        text: 'Conectando con el servidor',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const response = await fetchAPI('/alumno/listado');
      const data = await response.json();
      const students = Array.isArray(data) ? data : [];

      Swal.close();

      // Destroy if already initialized
      if (dataTable) { dataTable.destroy(); }

      const canEdit = hasRole('ADMINISTRATIVO') || hasRole('DIRECTOR');

      dataTable = $('#datatableexample').DataTable({
        data: students,
        columns: [
          { data: 'id', width: '50px' },
          {
            data: null,
            render: (d, t, r) => `<span class="badge badge-light border">${r.tipoDocumento || ''}-${r.numeroDocumento || ''}</span>`
          },
          {
            data: null,
            render: (d, t, r) => {
              const nombre = `${r.primerNombre || ''} ${r.segundoNombre || ''}`.trim();
              const apellido = `${r.primerApellido || ''} ${r.segundoApellido || ''}`.trim();
              return `<strong>${nombre}</strong><br><small class="text-muted">${apellido}</small>`;
            }
          },
          { data: 'cursoAnnio', render: d => `<span class="badge" style="background:var(--accent-light);color:var(--accent-hover);font-size:0.85rem;">${d || '-'}° Año</span>` },
          { data: 'cursoSeccion', render: d => `<span class="font-weight-bold">${d || '-'}</span>` },
          { data: 'cursoNivel', render: d => `<small>${d || '-'}</small>` },
          { data: 'cursoTurno', render: d => {
            const color = d === 'MAÑANA' ? '#f59e0b' : '#6366f1';
            return `<span class="badge" style="background:${color}20;color:${color};font-size:0.8rem;">${d || '-'}</span>`;
          }},
          {
            data: null,
            orderable: false,
            render: (d, t, row) => {
              let btns = `
                <button class="action-icon-btn edit btn-view-student mr-1" data-id="${row.id}" title="Ver detalles">
                  <i class="fa-solid fa-eye"></i>
                </button>`;
              if (canEdit) {
                btns += `
                <a href="/student-form.html?id=${row.id}" class="action-icon-btn edit mr-1" title="Editar" style="text-decoration:none;">
                  <i class="fa-solid fa-pencil"></i>
                </a>
                <button class="action-icon-btn delete btn-deactivate" data-id="${row.id}" data-nombre="${row.primerNombre} ${row.primerApellido}" title="Desactivar">
                  <i class="fa-solid fa-user-slash"></i>
                </button>`;
              }
              return `<div class="d-flex align-items-center">${btns}</div>`;
            }
          }
        ],
        language: {
          "emptyTable": "No hay alumnos registrados",
          "info": "Mostrando _START_ a _END_ de _TOTAL_ alumnos",
          "infoEmpty": "Mostrando 0 alumnos",
          "infoFiltered": "(filtrado de _MAX_ total)",
          "lengthMenu": "Mostrar _MENU_ registros",
          "loadingRecords": "Cargando...",
          "processing": "Procesando...",
          "search": "Buscar:",
          "zeroRecords": "No se encontraron resultados",
          "paginate": { "first": "«", "last": "»", "next": "›", "previous": "‹" }
        },
        pageLength: 15,
        order: [[0, 'desc']],
        responsive: true,
        drawCallback: function() {
          // Re-attach events after each redraw
          attachTableEvents();
        }
      });

      // Show/hide add button based on role
      const btnAdd = document.getElementById('btnAddStudent');
      if (btnAdd && !canEdit) btnAdd.style.display = 'none';

    } catch (error) {
      if (!error.message.includes('401') && !error.message.includes('403')) {
        Swal.fire({
          icon: 'error',
          title: 'Error de Conexión',
          text: 'No se pudo obtener la lista de estudiantes.',
          footer: `<span class="text-danger">${error.message}</span>`
        });
      }
    }
  }

  function attachTableEvents() {
    // Ver detalles
    $('#datatableexample tbody').off('click', '.btn-view-student').on('click', '.btn-view-student', async function() {
      const id = $(this).data('id');
      try {
        const res = await fetchAPI(`/alumno/consultarporid/${id}`);
        const data = await res.json();
        const a = data.value || data;
        Swal.fire({
          title: `<strong>${a.primerNombre} ${a.segundoNombre || ''} ${a.primerApellido} ${a.segundoApellido || ''}</strong>`,
          html: `
            <div style="text-align:left; font-size:0.9rem;">
              <p><b>Cédula:</b> ${a.tipoDocumento || ''}-${a.numeroDocumento || ''}</p>
              <p><b>Sexo:</b> ${a.sexo || '-'} &nbsp;&nbsp; <b>Edad:</b> ${a.edad || '-'}</p>
              <p><b>Dirección:</b> ${a.direccion || '-'}</p>
              <p><b>Teléfono:</b> ${a.codigoOperadoraTelefono || ''}-${a.telefono || '-'}</p>
              <p><b>Email:</b> ${a.email || '-'}</p>
              <p><b>Curso:</b> ${a.cursoAnnio || '-'}° Año Sección ${a.cursoSeccion || '-'} (${a.cursoTurno || '-'})</p>
              <p><b>Nivel:</b> ${a.cursoNivel || '-'} &nbsp; <b>Período:</b> ${a.cursoPeriodoAcademico || '-'}</p>
              <p><b>Condición:</b> ${a.condicion || '-'}</p>
            </div>`,
          icon: 'info',
          confirmButtonText: 'Cerrar',
          showCloseButton: true
        });
      } catch(e) {
        Swal.fire('Error', 'No se pudo cargar el detalle del alumno.', 'error');
      }
    });

    // Desactivar
    $('#datatableexample tbody').off('click', '.btn-deactivate').on('click', '.btn-deactivate', async function() {
      const id = $(this).data('id');
      const nombre = $(this).data('nombre');
      const result = await Swal.fire({
        title: '¿Desactivar Alumno?',
        html: `<p>¿Está seguro que desea desactivar a <strong>${nombre}</strong>?<br>El registro no se eliminará, sólo quedará inactivo.</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
      });
      if (result.isConfirmed) {
        try {
          await fetchAPI(`/alumno/desactivar/${id}/INACTIVO`, { method: 'PUT' });
          Swal.fire({ icon: 'success', title: 'Desactivado', text: `${nombre} fue desactivado.`, timer: 2000, showConfirmButton: false });
          loadStudents(); // Reload table
        } catch(e) {
          if (!e.message.includes('401') && !e.message.includes('403')) {
            Swal.fire('Error', 'No se pudo desactivar el alumno.', 'error');
          }
        }
      }
    });
  }

  loadStudents();
});
