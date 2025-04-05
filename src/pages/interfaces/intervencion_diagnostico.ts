export interface intervencion_diagnostico {
  id: number;
  fechaDiagnostico: Date;
  terapeutaDiagnostico: number;
  paciente: number;
  informeAdjunto?: string;
  publicid?: string;
  nombre_completo_terapeuta: string;
}
