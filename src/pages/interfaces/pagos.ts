export interface Pago {
  id: number;
  nombre_completo: string;
  fecha_creacion: Date;
  periodo_pago: string;
  nombre_empleado: string;
  tipo_documento: string;
  numero_documento: string;
  especialidad: string;
  celular: string;
  fecha_pago?: Date;
  monto_total: number;
  monto_pagado?: number;
  saldo_periodo: number;
  nro_documento?: string;
  observacion?: string;
}
