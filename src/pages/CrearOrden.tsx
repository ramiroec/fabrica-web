import { useState, useEffect, SetStateAction } from "react";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { NumericFormat } from 'react-number-format';
import { Servicio } from "./interfaces/servicio";
import { Relacion_Servicio_Plan } from "./interfaces/relacion_servicio_plan";
import { Paciente } from "./interfaces/paciente";
import { Responsable } from "./interfaces/responsable";

const CrearOrden = () => {
    const { id } = useParams();
    const [data, setData] = useState({
        paciente: "",
        responsable: "",
        servicio: "",
        plan: "",
        precio_de_lista: "",
        descuento: "",
        observacion: "",
        estado: "Pendiente",
        monto_de_descuento: 0,
        monto_a_facturar: 0,
    });
    const navigate = useNavigate();

    const [isCollapsedDatosPaciente, setIsCollapsedDatosPaciente] = useState(false);
    const toggleCollapseDatosPaciente = () => {
        setIsCollapsedDatosPaciente(!isCollapsedDatosPaciente);
    };
    const [isCollapsedFactura, setIsCollapsedFactura] = useState(false);
    const toggleCollapseFactura = () => {
        setIsCollapsedFactura(!isCollapsedFactura);
    };

    const [paciente, setPaciente] = useState<Paciente | null>(null);
    useEffect(() => {
        const url = `/paciente/${id}`;
        authenticatedApi()
            .get(url)
            .then((response) => {
                setPaciente(response.data);
            })
    }, [id]);

    const [responsable, setResponsable] = useState<Responsable | null>(null);
    useEffect(() => {
        const url = `/relacion_paciente_responsable/notificacion/${id}`;
        authenticatedApi()
            .get(url)
            .then((response) => {
                setResponsable(response.data);
            })
    }, [id]);
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [selectedServicio, setSelectedServicio] = useState<{ value: number; label: string; } | null>(null);
    useEffect(() => {
        authenticatedApi()
            .get('/servicio')
            .then((response) => {
                setServicios(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener datos:", error);
            });
    }, []);
    const handleServicioChange = (selectedOption: any) => {
        //setData({ ...data, servicio: selectedOption.value });
        setSelectedServicio(selectedOption);
        setListaPlan([]); // Esto borrará los planes existentes
        setSelectedPlan(null); // Esto borrará el plan seleccionado
        setData(prevData => ({ ...prevData, precio_de_lista: "" }));
        setData(prevData => ({ ...prevData, descuento: "" }));

        // Llamar a la API para obtener los planes relacionados con el servicio seleccionado
        fetchPlanesPorServicio(selectedOption.value);
    };

    const [ListaPlan, setListaPlan] = useState<Relacion_Servicio_Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<{ value: number; label: string } | null>(null);
    const fetchPlanesPorServicio = (servicioId: any) => {
        authenticatedApi().get(`/relacion_servicio_plan/${servicioId}`)
            .then(response => {
                setListaPlan(response.data);
            })
    };
    const handlePlanChange = (selectedOption: any) => {
        console.log(selectedOption);
        setSelectedPlan(selectedOption);
        authenticatedApi().get(`/relacion_servicio_plan/${selectedServicio?.value}/${selectedOption.value}`)
            .then(response => {
                const precio = response.data[0].precio;
                setData(prevData => ({ ...prevData, precio_de_lista: precio }));
                setData(prevData => ({ ...prevData, descuento: "" }));
            })
    };

    // Manejador para cambios en el descuento
    const handleDescuentoChange = (values: any) => {
        const descuento = values.floatValue || 0;
        const monto_de_descuento = parseFloat((Number(data.precio_de_lista) * descuento / 100).toFixed(0));
        const monto_a_facturar = Number(data.precio_de_lista) - monto_de_descuento;
        setData({
            ...data,
            descuento,
            monto_de_descuento,
            monto_a_facturar,  // Calculamos el monto a facturar después del descuento
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const updatedData = {
            ...data,
            paciente: id,
            responsable: responsable ? responsable.id : null,
            servicio: selectedServicio ? selectedServicio.value : null,
            plan: selectedPlan ? selectedPlan.value : null,
            precio_de_lista: data.precio_de_lista,
            descuento: data.descuento,
            observacion: data.observacion,
            monto_de_descuento: data.monto_de_descuento,
            monto_a_facturar: data.monto_a_facturar,
            estado: data.estado
        };
        //        console.log(updatedData);
        //      return;
        const api = authenticatedApi();
        api.post("/orden_de_servicio", updatedData)
            .then((res) => {
                console.log(res);
                toast.success("Guardado con éxito!");
                setTimeout(() => {
                    navigate(`/orden_de_servicio/${res.data.id}`);
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error al guardar el registro");
            });
    };

    return (
        <div>
            <ContentHeader title="Agregar Plan" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Ingresar Orden de Servicio</h3>
                            <div className="card-tools">
                                <Link className="btn btn-info" to={`/paciente/${id}`}>
                                    Volver a la Ficha del Paciente
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="form-group col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Datos del Paciente</h3>
                                        <button
                                            className="btn btn-tool"
                                            onClick={toggleCollapseDatosPaciente}
                                        >
                                            {isCollapsedDatosPaciente ? (
                                                <i className="fas fa-plus"></i>
                                            ) : (
                                                <i className="fas fa-minus"></i>
                                            )}
                                        </button>
                                    </div>
                                    <div className={`card-body ${isCollapsedDatosPaciente ? 'collapse' : ''}`}>
                                        <div className="form-group col-md-12" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {paciente && (
                                                <div className="col-md-6">
                                                    <p><strong>Nombre y apellido:</strong> {paciente.nombre} {paciente.apellido}</p>
                                                    <p><strong>Tipo de documento:</strong> {paciente.tipo_documento}</p>
                                                    <p><strong>Número de documento:</strong> {paciente.numero_documento}</p>
                                                </div>
                                            )}
                                            <div className="col-md-6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                {responsable && (

                                                    <div className="col-md-6">

                                                        <p><strong>Responsable:</strong> {responsable.nombre} {responsable.apellido}</p>
                                                        <p><strong>Celular:</strong> {responsable.celular}</p>
                                                    </div>

                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Factura</h3>
                                        <button
                                            className="btn btn-tool"
                                            onClick={toggleCollapseFactura}
                                        >
                                            {isCollapsedFactura ? (
                                                <i className="fas fa-plus"></i>
                                            ) : (
                                                <i className="fas fa-minus"></i>
                                            )}
                                        </button>
                                    </div>
                                    <div className={`card-body ${isCollapsedFactura ? 'collapse' : ''}`}>
                                        <form onSubmit={handleSubmit} className="row">
                                            <div className="form-group col-md-5">
                                                <label>Servicio</label>
                                                <Select
                                                    options={servicios.map(servicio => ({
                                                        value: servicio.id,
                                                        label: servicio.descripcion
                                                    }))}
                                                    value={selectedServicio}
                                                    onChange={handleServicioChange}
                                                    placeholder="Seleccione un Servicio"
                                                />
                                            </div>
                                            <div className="form-group col-md-5">
                                                <label>Plan</label>
                                                <Select
                                                    id="plan"
                                                    options={ListaPlan ? ListaPlan.map(planes => ({
                                                        value: planes.plan,
                                                        label: `${planes.descripcion_plan}`
                                                    })) : []}
                                                    value={selectedPlan}
                                                    onChange={handlePlanChange}
                                                    placeholder="Buscar plan..."
                                                />
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label>Estado</label>
                                                <select
                                                    className="form-control"
                                                    id="estado"
                                                    disabled
                                                    value={data.estado}
                                                    onChange={(e) => setData({ ...data, estado: e.target.value })}
                                                >
                                                    <option value="Pendiente">Pendiente</option>
                                                    <option value="Parcial">Parcial</option>
                                                    <option value="Total">Total</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label>Precio de lista (Gs)</label>
                                                <NumericFormat
                                                    type="text"
                                                    autoFocus
                                                    className="form-control"
                                                    id="precio_de_lista"
                                                    placeholder="Precio"
                                                    required
                                                    readOnly={true}
                                                    value={data.precio_de_lista}
                                                    onValueChange={(values) => {
                                                        const { formattedValue, value } = values;
                                                        // Aquí puedes hacer lo que necesites con el valor
                                                        setData({ ...data, precio_de_lista: value });
                                                    }}
                                                    thousandSeparator='.'
                                                    decimalSeparator=","
                                                    decimalScale={0} // Esto limitará la entrada a números enteros
                                                    allowNegative={false} // Esto evitará números negativos
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label>Descuento (%)</label>
                                                <NumericFormat
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Descuento"
                                                    required
                                                    value={data.descuento}
                                                    onValueChange={handleDescuentoChange}
                                                    suffix="%"
                                                    allowNegative={false}
                                                    decimalScale={2}
                                                    allowLeadingZeros={false}
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label>Monto de descuento (Gs)</label>
                                                <NumericFormat
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Monto de descuento"
                                                    required
                                                    value={data.monto_de_descuento}
                                                    readOnly
                                                    thousandSeparator='.'
                                                    decimalSeparator=","
                                                    decimalScale={0}
                                                    allowNegative={false}
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label>Monto a facturar (Gs)</label>
                                                <NumericFormat
                                                    type="text"
                                                    className="form-control"
                                                    id="precio"
                                                    placeholder="Monto a facturar"
                                                    required
                                                    value={data.monto_a_facturar}
                                                    readOnly={true}
                                                    thousandSeparator='.'
                                                    decimalSeparator=","
                                                    decimalScale={0}
                                                    allowNegative={false}
                                                />
                                            </div>

                                            <div className="form-group col-md-12">
                                                <label>Observación General de la Facturación</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="observacion"
                                                    placeholder="Observación"
                                                    value={data.observacion}
                                                    onChange={(e) =>
                                                        setData({ ...data, observacion: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-info">
                                                Guardar
                                            </button>
                                        </form>
                                    </div>
                                    <div className="card-footer">
                                        <small>* Campos obligatorios: favor completar estos campos.</small>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div >
            </section >
        </div >
    );
};
export default CrearOrden;