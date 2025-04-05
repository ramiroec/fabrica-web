export interface Paciente {
    interventionPlan: any;
    recommendations: any;
    id: number;
    fecha_registro: Date;
    nombre: string;
    apellido: string;
    tipo_documento: string;
    numero_documento: string;
    fecha_nacimiento: Date;
    escuela: string;
    grado: string;
    turno: string;
    edad: number;
    pais: string;
    departamento: string;
    ciudad: string;
    barrio: string;
    direccion: string;
    tipo_contacto?: string;
    observacion_contacto?: string;
    responsable?: string;
    celular?: string;
    foto?: string;
    publicid?: string; 
    nombre_maestro?: string;
    contacto_maestro?: string;
  }
  