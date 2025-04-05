export interface tratamiento_reevaluacion {
  id: number;
  fecha: Date;
  terapeuta: number;
  paciente: number;
  descripcion: string;
  adjunto: string;
  publicid?: string;
}
