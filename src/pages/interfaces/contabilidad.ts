export interface Contabilidad {
  id: number;
  tipo: 'Ingreso' | 'Egreso';
  tipo_movimiento: string;
  fecha: string; // Utilizamos string para la fecha en formato ISO
  descripcion: string;
  monto: number;
  iva: number;
  proveedor_id?: number;
  estado: string;
  mes: string;
  anio: number;
}
