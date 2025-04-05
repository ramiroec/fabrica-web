export interface Proveedor {
    id: number;
    razon_social: string;
    nombre_fantasia: string;
    tipo_documento: string;
    numero_documento: string;
    pais: string;
    departamento: string;
    ciudad: string;
    barrio?: string;
    direccion: string;
    telefono: string;
    email: string;
    nombre_contacto: string;
    estado: 'Activo' | 'Inactivo'; // Limita los valores posibles de 'estado'
}
