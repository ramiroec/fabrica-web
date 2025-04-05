export interface Orden_de_Servicio {
  [x: string]: any;

  servicio: string;
  servicio_descripcion: string;
  plan: string;
  plan_descripcion: string;
  precio_de_lista: number;
  paciente_nombre_apellido: string;
  responsable_nombre_apellido: string;
  tipo_documento: string;
  numero_documento: string;
  estado_pago: string;
  estado_os: string;
  estado: string;
  descuento: number;
  observacion: string;
  fecha: string;
  monto_de_descuento: number;
  monto_a_facturar: number;
  celular: string;
  saldo: number;
}

