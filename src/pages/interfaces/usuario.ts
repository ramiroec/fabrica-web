export interface Usuario {
  id: number;
  usuario: string;
  contrasena: string;
  nombre: string;
  nombre_completo?: string; // Nombre completo (si está disponible)
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  perfil: number;
  perfil_descripcion?: string; // Descripción del perfil (si está disponible)
  email: string;
  telefono: string;
  estado: string;
  departamento?: number; // Nuevo campo
  departamento_descripcion?: string; // Descripción del departamento (si está disponible)
  cargo?: string; // Nuevo campo
  superior?: number; // Nuevo campo
  superior_nombre?: string; // Nombre del superior (si está disponible)
  foto?: string; // URL de la foto (si está disponible)
}