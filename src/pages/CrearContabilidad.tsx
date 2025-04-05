import React, { useState, useEffect } from "react";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Link } from "react-router-dom";
import { Proveedor } from "./interfaces/proveedor";
import ModalIngreso from './ModalIngreso'; // Importa el modal
import ModalEgreso from './ModalEgreso'; // Importa el modal

const CrearContabilidad = () => {
    const [centro, setCentro] = useState({
        razon_social: "",
        ruc: "",
        direccion: "",
        celular_salida: "",
    });

    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [egresos, setEgresos] = useState<any[]>([]);
    const [ingresos, setIngresos] = useState<any[]>([]);
    const [modalIngresoOpen, setModalIngresoOpen] = useState(false);
    const [modalEgresoOpen, setModalEgresoOpen] = useState(false);

    const fetchCentro = () => {
        authenticatedApi()
            .get('/empresa/1') // Cambiar el endpoint según tu configuración
            .then((response) => {
                setCentro(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener datos del centro:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Error al cargar los datos del centro',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
            });
    };

    const fetchProveedores = () => {
        authenticatedApi()
            .get('/proveedor')
            .then((response) => {
                setProveedores(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener proveedores:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Error al cargar los proveedores',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
            });
    };

    useEffect(() => {
        fetchCentro();
        fetchProveedores();
    }, []);

    const handleAgregarEgreso = (nuevoEgreso: any) => {
        const monto = parseFloat(nuevoEgreso.monto);
        const nuevo = { ...nuevoEgreso, monto, iva: monto / 11 };
        setEgresos([...egresos, nuevo]);
    };

    const handleAgregarIngreso = (nuevoIngreso: any) => {
        const monto = parseFloat(nuevoIngreso.monto);
        setIngresos([...ingresos, { ...nuevoIngreso, monto }]);
    };

    const formatearNumero = (numero: number) => {
        return new Intl.NumberFormat('de-DE').format(numero);
    };

    const sumatoriaEgresos = egresos.reduce((acc, egreso) => acc + egreso.monto, 0);
    const sumatoriaIngresos = ingresos.reduce((acc, ingreso) => acc + ingreso.monto, 0);

    return (
        <div>
            <ContentHeader title="Contabilidad Básica" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <div>
                                <p><strong>Empresa:</strong> {centro.razon_social}</p>
                                <p><strong>RUC:</strong> {centro.ruc}</p>
                                <p><strong>Dirección:</strong> {centro.direccion}</p>
                                <p><strong>Teléfono:</strong> {centro.celular_salida}</p>
                            </div>
                            <div className="card-tools" style={{ position: 'absolute', right: '10px', top: '10px' }}>
                                <Link to="/ListarContabilidad" className="btn btn-info">
                                    Volver a la Lista
                                </Link>
                            </div>
                        </div>

                        {/* Sección de Ingreso */}
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">Ingreso</h3>
                            <button className="btn btn-info" onClick={() => setModalIngresoOpen(true)}>Agregar Ingreso</button>
                        </div>
                        <ModalIngreso
                            isOpen={modalIngresoOpen}
                            onRequestClose={() => setModalIngresoOpen(false)}
                            handleAgregarIngreso={handleAgregarIngreso}
                        />

                        {/* Sección de Egreso */}
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">Egreso</h3>
                            <button className="btn btn-info" onClick={() => setModalEgresoOpen(true)}>Agregar Egreso</button>
                        </div>
                        <ModalEgreso
                            isOpen={modalEgresoOpen}
                            onRequestClose={() => setModalEgresoOpen(false)}
                            handleAgregarEgreso={handleAgregarEgreso}
                            proveedores={proveedores}
                        />

                        {/* Sección de Totales */}
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">Total</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="form-group col-md-4">
                                    <label>Total Ingreso</label>
                                    <input type="text" className="form-control" value={formatearNumero(sumatoriaIngresos)} readOnly />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Total Egreso</label>
                                    <input type="text" className="form-control" value={formatearNumero(sumatoriaEgresos)} readOnly />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Diferencia</label>
                                    <input type="text" className="form-control" value={formatearNumero(sumatoriaIngresos - sumatoriaEgresos)} readOnly />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CrearContabilidad;
