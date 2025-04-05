export interface tratamiento_proceso {
  id: number;
  fecha: Date;
  terapeuta: number;
  descripcion: string;
  adjunto: string | null;
  paciente: number;
}
