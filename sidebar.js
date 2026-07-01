// sidebar.js
// Inject FontAwesome globally first
if (!document.getElementById('fa-cdn')) {
  const fa = document.createElement('link');
  fa.id = 'fa-cdn';
  fa.rel = 'stylesheet';
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  document.head.appendChild(fa);
}

const sidebarHTML = `
  <div class="sidebar d-flex flex-column p-3 text-white">
    <ul class="nav nav-pills flex-column mb-auto mt-2" id="sidebar-accordion">
      <!-- Personas -->
      <li class="nav-item mb-2">
        <a href="#menu-personas" data-toggle="collapse" class="nav-link text-white sidebar-link d-flex justify-content-between align-items-center">
          <div><i class="fa-solid fa-users" style="width: 20px; text-align: center;"></i> <span>Personas</span></div>
          <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem;"></i>
        </a>
        <div class="collapse" id="menu-personas" data-parent="#sidebar-accordion">
          <ul class="nav flex-column ml-3 pl-3 border-left border-secondary mt-1">
            <li class="nav-item"><a href="/student.html" class="nav-link text-white py-1 sidebar-sublink" style="opacity: 0.8; font-size: 0.9rem;">Alumnos</a></li>
            <li class="nav-item"><a href="/teacher.html" class="nav-link text-white py-1 sidebar-sublink" style="opacity: 0.8; font-size: 0.9rem;">Docentes</a></li>
          </ul>
        </div>
      </li>
      
      <!-- Configuración -->
      <li class="nav-item mb-2">
        <a href="#menu-config" data-toggle="collapse" class="nav-link text-white sidebar-link d-flex justify-content-between align-items-center">
          <div><i class="fa-solid fa-gear" style="width: 20px; text-align: center;"></i> <span>Configuración</span></div>
          <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem;"></i>
        </a>
        <div class="collapse" id="menu-config" data-parent="#sidebar-accordion">
          <ul class="nav flex-column ml-3 pl-3 border-left border-secondary mt-1">
            <li class="nav-item"><a href="/course.html" class="nav-link text-white py-1 sidebar-sublink" style="opacity: 0.8; font-size: 0.9rem;">Materias y Cursos</a></li>
            <li class="nav-item"><a href="#" class="nav-link text-white py-1 sidebar-sublink" style="opacity: 0.8; font-size: 0.9rem;">Cursos Activos</a></li>
            <li class="nav-item"><a href="#" class="nav-link text-white py-1 sidebar-sublink" style="opacity: 0.8; font-size: 0.9rem;">Maestro de Materias</a></li>
            <li class="nav-item"><a href="#" class="nav-link text-white py-1 sidebar-sublink" style="opacity: 0.8; font-size: 0.9rem;">Maestro de Períodos</a></li>
          </ul>
        </div>
      </li>

      <!-- Calificaciones -->
      <li class="nav-item mb-2">
        <a href="#menu-calif" data-toggle="collapse" class="nav-link text-white sidebar-link d-flex justify-content-between align-items-center">
          <div><i class="fa-solid fa-folder-open" style="width: 20px; text-align: center;"></i> <span>Calificaciones</span></div>
          <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem;"></i>
        </a>
        <div class="collapse" id="menu-calif" data-parent="#sidebar-accordion">
          <ul class="nav flex-column ml-3 pl-3 border-left border-secondary mt-1">
            <li class="nav-item"><a href="#" class="nav-link text-white py-1 sidebar-sublink" style="opacity: 0.8; font-size: 0.9rem;">Consultar</a></li>
          </ul>
        </div>
      </li>

      <!-- Seguridad -->
      <li class="nav-item mb-2">
        <a href="#menu-seguridad" data-toggle="collapse" class="nav-link text-white sidebar-link d-flex justify-content-between align-items-center">
          <div><i class="fa-solid fa-lock" style="width: 20px; text-align: center;"></i> <span>Seguridad</span></div>
          <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem;"></i>
        </a>
        <div class="collapse" id="menu-seguridad" data-parent="#sidebar-accordion">
          <ul class="nav flex-column ml-3 pl-3 border-left border-secondary mt-1">
            <li class="nav-item"><a href="#" class="nav-link text-white py-1 sidebar-sublink" style="opacity: 0.8; font-size: 0.9rem;">Usuarios</a></li>
            <li class="nav-item"><a href="#" class="nav-link text-white py-1 sidebar-sublink" style="opacity: 0.8; font-size: 0.9rem;">Cambiar clave</a></li>
          </ul>
        </div>
      </li>
    </ul>
    <hr class="border-secondary">
    <div class="mt-auto">
      <a href="/index.html" class="d-flex align-items-center text-white text-decoration-none sidebar-link" style="opacity: 0.8">
        <i class="fa-solid fa-right-from-bracket" style="width: 20px; text-align: center;"></i>
        <span><strong>Cerrar Sesión</strong></span>
      </a>
    </div>
  </div>
`;

const topbarHTML = `
  <div class="topbar w-100 d-flex justify-content-between align-items-center" style="background: url('/images/cinta_azul_.png') center/cover no-repeat;">
    <div class="d-flex align-items-center">
      <a href="/index.html" class="d-flex align-items-center text-white text-decoration-none">
        <img src="/images/siga.png" alt="SIGA" style="height: 40px; margin-right: 15px;">
        <div class="d-flex flex-column">
          <span style="font-family: cursive; font-size: 1.2rem;">Sistema de Gestión Académica</span>
        </div>
      </a>
    </div>
    <div class="d-flex align-items-center">
      <img src="/images/usuario.png" alt="Usuario" style="height: 40px; border-radius: 50%; background: white; padding: 2px;">
    </div>
  </div>
`;

export function initSidebar() {
  const container = document.getElementById('sidebar-container');
  if (container) {
    container.innerHTML = sidebarHTML;
    
    // Inject the topbar right after the sidebar-container
    container.insertAdjacentHTML('afterend', topbarHTML);
    
    // Marcar el enlace activo basado en la URL actual
    const currentPath = window.location.pathname;
    const links = container.querySelectorAll('.sidebar-link');
    links.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active', 'bg-primary');
        link.classList.remove('text-white');
      }
    });
  }
}
