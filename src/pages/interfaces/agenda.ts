export interface Agenda {
    id: number;
    fecha?: Date; // Usando Date para el tipo fecha
    desde?: string;
    hasta?: string;
    terapeuta?: string;
    especialidad?: string;
    paciente?: string;
    idpaciente: string;
    paciente_nombre_completo: string;
    especialidad_descripcion: string; 
    terapeuta_nombre_completo: string;
    estado: string;
    orden_de_servicio: number;
    observacion: string;
  }
  