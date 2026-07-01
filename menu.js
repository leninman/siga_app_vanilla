import { getJwtPayload } from '/api-client.js';

export function initMenu() {
  const menuContainer = document.getElementById('menu-container');
  if (!menuContainer) return;
  
  const payload = getJwtPayload();
  const userName = payload && payload.sub ? payload.sub.toUpperCase() : 'USUARIO';
  
  const tenantId = localStorage.getItem('tenantId') || 'siga_jrpocaterra';
  let schoolName = "Colegio U.E.P. J.R. Pocaterra";
  if (tenantId === 'siga_plaza') {
      schoolName = "Colegio Plaza";
  }

  // Only show full nav if not on the login page (index.html)
  const isHome = window.location.pathname.includes('home.html') || window.location.pathname.includes('student') || window.location.pathname.includes('teacher') || window.location.pathname.includes('course');

  const headerHTML = `
    <!-- Sticky Glassmorphism Navbar -->
    <nav class="navbar navbar-expand-lg sticky-top glass-navbar py-3 px-4" style="z-index: 1050;">
      <div class="container-fluid">
        
        <!-- Brand / Logo -->
        <a class="navbar-brand d-flex align-items-center text-white" href="/home.html">
          <div class="d-flex align-items-center justify-content-center bg-white rounded-circle mr-3 shadow-sm" style="width: 45px; height: 45px;">
            <span class="text-primary font-weight-bold" style="font-size: 1.4rem; font-family: 'Outfit', sans-serif;">S</span>
          </div>
          <div>
            <h5 class="m-0 font-weight-bold text-white brand-font" style="font-size: 1.2rem; letter-spacing: 1px;">SIGA ERP</h5>
            <small style="font-size: 0.75rem; color: var(--accent-light); font-weight: 500;">${schoolName}</small>
          </div>
        </a>

        <!-- Mobile Toggle Button -->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#sigaNavbar" aria-controls="sigaNavbar" aria-expanded="false" aria-label="Toggle navigation" style="border-color: rgba(255,255,255,0.5);">
          <i class="fa-solid fa-bars text-white"></i>
        </button>

        <!-- Navbar Links -->
        <div class="collapse navbar-collapse justify-content-end" id="sigaNavbar">
          ${isHome ? `
          <ul class="navbar-nav align-items-center">
            
            <!-- Personas -->
            <li class="nav-item dropdown mx-1">
              <a class="nav-link dropdown-toggle" href="#" id="personasDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa-solid fa-users mr-1"></i> Personas
              </a>
              <div class="dropdown-menu animate-fade-in-up mt-2" aria-labelledby="personasDropdown">
                <a class="dropdown-item" href="/student.html"><i class="fa-solid fa-user-graduate mr-2 text-primary"></i> Alumnos</a>
                <a class="dropdown-item" href="/teacher.html"><i class="fa-solid fa-chalkboard-user mr-2 text-primary"></i> Docentes</a>
              </div>
            </li>

            <!-- Configuración -->
            <li class="nav-item dropdown mx-1">
              <a class="nav-link dropdown-toggle" href="#" id="configDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa-solid fa-gear mr-1"></i> Configuración
              </a>
              <div class="dropdown-menu animate-fade-in-up mt-2" aria-labelledby="configDropdown">
                <a class="dropdown-item" href="/course.html"><i class="fa-solid fa-book-open mr-2 text-primary"></i> Materias y Cursos</a>
                <a class="dropdown-item" href="#"><i class="fa-solid fa-school mr-2 text-primary"></i> Cursos Activos</a>
                <a class="dropdown-item" href="#"><i class="fa-solid fa-calendar-days mr-2 text-primary"></i> Maestro de Períodos</a>
              </div>
            </li>

            <!-- Calificaciones -->
            <li class="nav-item dropdown mx-1">
              <a class="nav-link dropdown-toggle" href="#" id="gradesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa-solid fa-folder-open mr-1"></i> Calificaciones
              </a>
              <div class="dropdown-menu animate-fade-in-up mt-2" aria-labelledby="gradesDropdown">
                <a class="dropdown-item" href="#"><i class="fa-solid fa-magnifying-glass mr-2 text-primary"></i> Consultar</a>
              </div>
            </li>

            <!-- Seguridad -->
            <li class="nav-item dropdown mx-1">
              <a class="nav-link dropdown-toggle" href="#" id="securityDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa-solid fa-shield-halved mr-1"></i> Seguridad
              </a>
              <div class="dropdown-menu animate-fade-in-up mt-2 dropdown-menu-right" aria-labelledby="securityDropdown">
                <a class="dropdown-item" href="#"><i class="fa-solid fa-users-gear mr-2 text-primary"></i> Usuarios</a>
                <a class="dropdown-item" href="#"><i class="fa-solid fa-key mr-2 text-primary"></i> Cambiar clave</a>
              </div>
            </li>

            <!-- Perfil / Avatar -->
            <li class="nav-item dropdown ml-3 pl-3 border-left" style="border-color: rgba(255,255,255,0.2) !important;">
              <a class="nav-link p-0 d-flex align-items-center" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div class="text-right mr-2 d-none d-lg-block">
                  <div class="text-white font-weight-bold" style="font-size: 0.9rem; line-height: 1.1;">${userName}</div>
                  <div style="font-size: 0.75rem; color: var(--accent-light);">En línea</div>
                </div>
                <img src="/images/usuario.png" alt="Usuario" style="height: 40px; width: 40px; background-color: white; border-radius: 50%; border: 2px solid var(--accent-color); padding: 2px;">
              </a>
              <div class="dropdown-menu dropdown-menu-right animate-fade-in-up mt-3" aria-labelledby="userDropdown">
                <div class="dropdown-header d-lg-none">
                  <span class="font-weight-bold text-primary">${userName}</span>
                </div>
                <a class="dropdown-item" href="#"><i class="fa-solid fa-id-badge mr-2 text-primary"></i> Mi Perfil</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item text-danger" href="#" id="btn-logout">
                  <i class="fa-solid fa-power-off mr-2"></i> Cerrar Sesión
                </a>
              </div>
            </li>

          </ul>
          ` : `
          <!-- Si no está en el home, puede ser otra vista pública o fallback -->
          `}
        </div>
      </div>
    </nav>
  `;

  menuContainer.innerHTML = headerHTML;

  // Inyectar el Footer automáticamente
  if (!document.getElementById('siga-footer')) {
    const footer = document.createElement('footer');
    footer.id = 'siga-footer';
    footer.className = 'w-100 py-3 text-center text-white';
    footer.style.cssText = 'background: var(--primary-color); font-size: 0.9rem; position: fixed; bottom: 0; left: 0; z-index: 1000; box-shadow: 0 -4px 10px rgba(0,0,0,0.1); border-top: 1px solid rgba(255,255,255,0.1);';
    footer.innerHTML = 'Copyright &copy; 2026 - Tecnodestreza - Todos los derechos reservados.';
    document.body.appendChild(footer);
    
    document.body.style.paddingBottom = '60px'; // Prevent content from hiding behind footer
  }
  
  // Botón Salir
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: '¿Cerrar Sesión?',
          text: "¿Estás seguro que deseas salir del sistema?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: 'var(--danger-color)',
          cancelButtonColor: 'var(--primary-color)',
          confirmButtonText: 'Sí, salir',
          cancelButtonText: 'Cancelar',
          customClass: {
            confirmButton: 'btn-premium bg-danger border-0',
            cancelButton: 'btn-premium-outline'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('token');
            localStorage.removeItem('tenantId');
            localStorage.removeItem('jwtPayload');
            window.location.href = '/index.html';
          }
        });
      } else {
        if (confirm('¿Estás seguro que deseas salir del sistema?')) {
          localStorage.removeItem('token');
          localStorage.removeItem('tenantId');
          localStorage.removeItem('jwtPayload');
          window.location.href = '/index.html';
        }
      }
    });
  }
}
