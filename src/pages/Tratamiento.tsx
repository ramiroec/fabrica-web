import { useState, useEffect } from "react";
import { authenticatedApi } from "./interfaces/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Usuario } from "./interfaces/usuario";
import moment from 'moment';
import { useSelector } from 'react-redux';

const Tratamiento = ({ isClearfix = false }: { isClearfix?: boolean }) => {
    const authentication = useSelector((state: any) => state.auth.authentication);
    const { id } = useParams();
    const [data, setData] = useState({
        fecha: moment().format('YYYY-MM-DD'),
        terapeuta: authentication.profile.id,
        nota: "",
        descripcion: "",
        adjunto: null,
        descripcionReevaluacion: "",
        informeAdjuntoReevaluacion: null,
    });

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [notas, setNotas] = useState<{
        id: number; fecha: string; notas: string; terapeuta: number; nombre_completo_terapeuta: string
    }[]>([]);
    const [procesos, setProcesos] = useState<{
        id: number; fecha: string; terapeuta: number; descripcion: string; adjunto: string; nombre_completo_terapeuta: string
    }[]>([]);
    const [reevaluaciones, setReevaluaciones] = useState<{
        id: number; fecha: string; terapeuta: number; descripcion: string; adjunto: string; nombre_completo_terapeuta: string
    }[]>([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const usuariosResponse = await authenticatedApi().get('/usuario');
            setUsuarios(usuariosResponse.data);

            const notasResponse = await authenticatedApi().get(`/tratamiento_notas/paciente/${id}`);
            setNotas(notasResponse.data);

            const procesosResponse = await authenticatedApi().get(`/tratamiento_procesos/paciente/${id}`);
            setProcesos(procesosResponse.data);

            const reevaluacionesResponse = await authenticatedApi().get(`/tratamiento_reevaluaciones/paciente/${id}`);
            setReevaluaciones(reevaluacionesResponse.data);
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
        const nuevaNota = { fecha: data.fecha, notas: data.nota, terapeuta: data.terapeuta, paciente: id };
        try {
            const response = await authenticatedApi().post('/tratamiento_notas', nuevaNota);
            toast.success('Nota agregada con éxito');
            fetchData(); // Vuelve a cargar los datos
            setData({ ...data, nota: "" }); // Limpiar el campo de nota después de agregar
        } catch (error) {
            toast.error('Error al agregar la nota');
        }
    };

    const handleSubmitProceso = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fecha', moment().format("YYYY-MM-DD"));
        formData.append('terapeuta', data.terapeuta.toString());
        formData.append('paciente', id?.toString() || '');
        formData.append('descripcion', data.descripcion);
        if (data.adjunto) {
            formData.append('adjunto', data.adjunto);
        }

        try {
            const response = await authenticatedApi().post('/tratamiento_procesos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Proceso agregado con éxito');
            fetchData(); // Vuelve a cargar los datos
            setData({ ...data, descripcion: "", adjunto: null });
        } catch (error) {
            toast.error('Error al agregar el proceso');
        }
    };

    const handleSubmitReevaluacion = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fecha', moment().format("YYYY-MM-DD"));
        formData.append('terapeuta', data.terapeuta.toString());
        formData.append('paciente', id?.toString() || '');
        formData.append('descripcion', data.descripcionReevaluacion);
        if (data.informeAdjuntoReevaluacion) {
            formData.append('adjunto', data.informeAdjuntoReevaluacion);
        }

        try {
            const response = await authenticatedApi().post('/tratamiento_reevaluaciones', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Reevaluación agregada con éxito');
            fetchData(); // Vuelve a cargar los datos
            setData({ ...data, descripcionReevaluacion: "", informeAdjuntoReevaluacion: null });
        } catch (error) {
            toast.error('Error al agregar la reevaluación');
        }
    };

    const eliminarNota = async (notaId: number) => {
        try {
            await authenticatedApi().delete(`/tratamiento_notas/${notaId}`);
            toast.success("Nota eliminada con éxito");
            fetchData(); // Vuelve a cargar los datos
        } catch (error) {
            console.error("Error al eliminar nota:", error);
            toast.error("Error al eliminar nota");
        }
    };

    const eliminarProceso = async (procesoId: number) => {
        try {
            await authenticatedApi().delete(`/tratamiento_procesos/${procesoId}`);
            toast.success("Proceso eliminado con éxito");
            fetchData(); // Vuelve a cargar los datos
        } catch (error) {
            console.error("Error al eliminar proceso:", error);
            toast.error("Error al eliminar proceso");
        }
    };

    const eliminarReevaluacion = async (reevaluacionId: number) => {
        try {
            await authenticatedApi().delete(`/tratamiento_reevaluaciones/${reevaluacionId}`);
            toast.success("Reevaluación eliminada con éxito");
            fetchData(); // Vuelve a cargar los datos
        } catch (error) {
            console.error("Error al eliminar reevaluación:", error);
            toast.error("Error al eliminar reevaluación");
        }
    };

    return (
        <div>
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Informe de Proceso</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmitProceso}>
                                <div className="row">
                                    <div className="form-group col-md-3">
                                        <label>Fecha</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="fecha"
                                            value={moment(data.fecha).format('DD/MM/YYYY')}
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
                                            <option value="">Seleccione un terapeuta</option>
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
                                    <h4>Informes de Proceso Agregados</h4>
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
                                                {procesos.map((proceso) => (
                                                    <tr key={proceso.id}>
                                                        <td>{moment(proceso.fecha).format('DD/MM/YYYY')}</td>
                                                        <td>{usuarios.find(user => user.id === proceso.terapeuta)?.nombre}</td>
                                                        <td style={{ maxWidth: '300px', maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                                                            {proceso.descripcion}
                                                        </td>
                                                        <td>
                                                            <a href={proceso.adjunto} target="_blank" rel="noopener noreferrer">Descargar</a>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="icon-block btn btn-link"
                                                                onClick={() => eliminarProceso(proceso.id)}
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
                            <h3 className="card-title">Informe de Reevaluación</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmitReevaluacion}>
                                <div className="row">
                                    <div className="form-group col-md-3">
                                        <label>Fecha</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="fecha"
                                            value={moment(data.fecha).format('DD/MM/YYYY')}
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
                                            <option value="">Seleccione un terapeuta</option>
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
                                            id="descripcionReevaluacion"
                                            value={data.descripcionReevaluacion}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-3">
                                        <label>Adjuntar Informe</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="informeAdjuntoReevaluacion"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-info">Agregar</button>
                            </form>
                            <div className="row mt-2">
                                <div className="col-md-12">
                                    <h4>Informes de Reevaluación Agregados</h4>
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
                                                {reevaluaciones.map((reevaluacion) => (
                                                    <tr key={reevaluacion.id}>
                                                        <td>{moment(reevaluacion.fecha).format('DD/MM/YYYY')}</td>
                                                        <td>{usuarios.find(user => user.id === reevaluacion.terapeuta)?.nombre}</td>
                                                        <td style={{ maxWidth: '300px', maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                                                            {reevaluacion.descripcion}
                                                        </td>
                                                        <td>
                                                            <a href={reevaluacion.adjunto} target="_blank" rel="noopener noreferrer">Descargar</a>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="icon-block btn btn-link"
                                                                onClick={() => eliminarReevaluacion(reevaluacion.id)}
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
                                            id="fecha"
                                            value={moment(data.fecha).format('DD/MM/YYYY')}
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
                                            <option value="">Seleccione un terapeuta</option>
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
                                                    <th>Tercapeuta</th>
                                                    <th>Nota</th>
                                                    <th>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notas.map((nota) => (
                                                    <tr key={nota.id}>
                                                        <td>{moment(nota.fecha).format('DD/MM/YYYY')}</td>
                                                        <td>{usuarios.find(user => user.id === nota.terapeuta)?.nombre}</td>
                                                        <td style={{ maxWidth: '300px', maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                                                            {nota.notas}
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

export default Tratamiento;
