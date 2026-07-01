import { API_BASE_URL } from './api-config.js';

export async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId') || 'siga_jrpocaterra'; // Default tenant

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'X-Tenant-ID': tenantId
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            // Unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('tenantId');
            Swal.fire({
                icon: 'error',
                title: 'Sesión Expirada',
                text: 'Por favor, inicie sesión nuevamente.',
                confirmButtonText: 'Ir al Login'
            }).then(() => {
                window.location.href = '/index.html';
            });
            throw new Error('No autorizado (401)');
        }

        if (response.status === 403) {
            // Forbidden
            Swal.fire({
                icon: 'warning',
                title: 'Acceso Denegado',
                text: 'No tienes permisos suficientes para realizar esta acción.'
            });
            throw new Error('Prohibido (403)');
        }

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return response;
    } catch (error) {
        throw error;
    }
}

export function getJwtPayload() {
    const payloadStr = localStorage.getItem('jwtPayload');
    if (!payloadStr) return null;
    try {
        return JSON.parse(payloadStr);
    } catch (e) {
        return null;
    }
}

export function hasRole(roleName) {
    const payload = getJwtPayload();
    if (!payload) return false;
    
    // Asumiendo que los roles pueden venir en 'roles', 'authorities' o un string separado por comas
    const authorities = payload.roles || payload.authorities || payload.scope || [];
    
    if (Array.isArray(authorities)) {
        return authorities.some(r => r === roleName || r === `ROLE_${roleName}` || r.authority === roleName || r.authority === `ROLE_${roleName}`);
    } else if (typeof authorities === 'string') {
        return authorities.includes(roleName) || authorities.includes(`ROLE_${roleName}`);
    }
    return false;
}
