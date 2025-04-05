import React, { useState, useEffect } from "react";
import { authenticatedApi } from "./interfaces/api";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Usuario } from "./interfaces/usuario";
import moment from 'moment';
import { useSelector } from 'react-redux';

const Evaluacion = ({ isClearfix = false }: { isClearfix?: boolean }) => {
    const authentication = useSelector((state: any) => state.auth.authentication);
    const { id } = useParams();
    const [data, setData] = useState({
        fechaNota: moment().format("DD/MM/YYYY"),
        terapeuta: authentication.profile.id,
        paciente: id,
        nota: "",
        fechaDiagnostico: moment().format("DD/MM/YYYY"),
        terapeutaDiagnostico: authentication.profile.id,
        adjunto: null,
        descripcion: ""
    });

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [notas, setNotas] = useState<{
        terapeuta: number; id: number, fechaNota: string, nota: string, nombre_completo_terapeuta: string
    }[]>([]);
    const [diagnosticos, setDiagnosticos] = useState<{
        adjunto: any;
        enlace: string | undefined;
        terapeutaDiagnostico: number; id: number, fechaDiagnostico: string, nota: string, terapeuta: string, nombre_completo_terapeuta: string
    }[]>([]);

    const fetchData = async () => {
        try {
            const usuariosResponse = await authenticatedApi().get('/usuario');
            setUsuarios(usuariosResponse.data);

            const notasResponse = await authenticatedApi().get(`/evaluacion_notas/paciente/${id}`);
            setNotas(notasResponse.data);

            const diagnosticosResponse = await authenticatedApi().get(`/evaluacion_diagnostico/paciente/${id}`);
            setDiagnosticos(diagnosticosResponse.data);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleInputChange = (e: any) => {
        const { id, value, type, checked, files } = e.target;
        setData((prevData) => ({
            ...prevData,
            [id]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmitNota = async (e: any) => {
        e.preventDefault();
        const nuevaNota = { nota: data.nota, terapeuta: data.terapeuta, paciente: id, fecha: moment().format("YYYY-MM-DD") };
        try {
            const response = await authenticatedApi().post(`/evaluacion_notas/`, nuevaNota);
            toast.success('Nota agregada con éxito');
            setData({ ...data, nota: "" }); // Limpiar el campo de nota después de agregar
            fetchData(); // Vuelve a cargar los datos
        } catch (error) {
            toast.error('Error al agregar la nota');
        }
    };

    const handleSubmitDiagnostico = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fecha', moment().format("YYYY-MM-DD"));
        formData.append('terapeuta', data.terapeutaDiagnostico.toString());
        formData.append('paciente', id?.toString() || '');
        formData.append('nota', data.descripcion); // Añadiendo descripción al formulario
        if (data.adjunto) {
            formData.append('adjunto', data.adjunto);
        }

        try {
            const response = await authenticatedApi().post('/evaluacion_diagnostico', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Diagnóstico agregado con éxito');
            setData({ ...data, descripcion: "", adjunto: null }); // Limpiar los campos después de agregar
            fetchData(); // Vuelve a cargar los datos
        } catch (error) {
            toast.error('Error al agregar el diagnóstico');
        }
    };

    const eliminarNota = async (notaId: number) => {
        try {
            await authenticatedApi().delete(`/evaluacion_notas/${notaId}`);
            toast.success("Nota eliminada con éxito");
            fetchData(); // Vuelve a cargar los datos
        } catch (error) {
            console.error("Error al eliminar nota:", error);
            toast.error("Error al eliminar nota");
        }
    };

    const eliminarDiagnostico = async (diagnosticoId: number) => {
        try {
            await authenticatedApi().delete(`/evaluacion_diagnostico/${diagnosticoId}`);
            toast.success("Diagnóstico eliminado con éxito");
            fetchData(); // Vuelve a cargar los datos
        } catch (error) {
            console.error("Error al eliminar diagnóstico:", error);
            toast.error("Error al eliminar diagnóstico");
        }
    };

    return (
        <div>
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Informe de Diagnóstico</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmitDiagnostico}>
                                <div className="row">
                                    <div className="form-group col-md-3">
                                        <label>Fecha</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="fechaDiagnostico"
                                            value={data.fechaDiagnostico}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group col-md-3">
                                        <label>Terapeuta</label>
                                        <select
                                            className="form-control"
                                            id="terapeutaDiagnostico"
                                            value={data.terapeutaDiagnostico}
                                            disabled
                                        >
                                            {usuarios.map((usuario) => (
                                                <option key={usuario.id} value={usuario.id}>
                                                    {usuario.nombre + " " + usuario.apellido}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group col-md-3">
                                        <label>Descripción</label>
                                        <textarea
                                            className="form-control"
                                            id="descripcion"
                                            value={data.descripcion}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-3">
                                        <label>Adjuntar Informe</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="adjunto"
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                </div>
                                <button type="submit" className="btn btn-info">Agregar</button>
                            </form>
                            <div className="row mt-2">
                                <div className="col-md-12">
                                    <h4>Diagnósticos Agregados</h4>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th>Terapeuta</th>
                                                    <th>Descripción</th>
                                                    <th>Informe</th>
                                                    <th>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {diagnosticos.map((diagnostico) => (
                                                    <tr key={diagnostico.id}>
                                                        <td>{moment(diagnostico.fechaDiagnostico).format('DD/MM/YYYY')}</td>
                                                        <td>{diagnostico.nombre_completo_terapeuta}</td>
                                                        <td style={{ maxWidth: '300px', overflow: 'auto' }}>
                                                            {diagnostico.nota}
                                                        </td>
                                                        <td>
                                                            {diagnostico.adjunto ? (
                                                                <a href={diagnostico.adjunto} target="_blank" rel="noopener noreferrer">Descargar</a>
                                                            ) : (
                                                                "No disponible"
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="icon-block btn btn-link"
                                                                onClick={() => eliminarDiagnostico(diagnostico.id)}
                                                            >
                                                                <i className="fa fa-fw fa-times"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Notas Internas</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmitNota}>
                                <div className="row">
                                    <div className="form-group col-md-3">
                                        <label>Fecha</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="fechaNota"
                                            value={data.fechaNota}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group col-md-3">
                                        <label>Terapeuta</label>
                                        <select
                                            className="form-control"
                                            id="terapeuta"
                                            value={data.terapeuta}
                                            disabled
                                        >
                                            {usuarios.map((usuario) => (
                                                <option key={usuario.id} value={usuario.id}>
                                                    {usuario.nombre + " " + usuario.apellido}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group col-md-3">
                                        <label>Nota</label>
                                        <textarea
                                            className="form-control"
                                            id="nota"
                                            value={data.nota}
                                            onChange={handleInputChange}
                                            style={{ minHeight: '100px' }}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-info">Agregar</button>
                            </form>
                            <div className="row mt-2">
                                <div className="col-md-12">
                                    <h4>Notas Agregadas</h4>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th>Terapeuta</th>
                                                    <th>Nota</th>
                                                    <th>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notas.map((nota) => (
                                                    <tr key={nota.id}>
                                                        <td>{moment(nota.fechaNota).format('DD/MM/YYYY')}</td>
                                                        <td>{nota.nombre_completo_terapeuta}</td>
                                                        <td style={{ maxWidth: '300px', maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                                                            {nota.nota}
                                                        </td>

                                                        <td>
                                                            <button
                                                                className="icon-block btn btn-link"
                                                                onClick={() => eliminarNota(nota.id)}
                                                            >
                                                                <i className="fa fa-fw fa-times"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Evaluacion;
