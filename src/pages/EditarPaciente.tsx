import { useState, useEffect, FormEvent } from "react";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Departamentos from "./interfaces/departamentos";
import Ciudades from "./interfaces/ciudades";
import { useSelector } from 'react-redux';
type Departamento = keyof typeof Ciudades;
type Ciudad = typeof Ciudades[Departamento][number];
const EditarPaciente = () => {
    const authentication = useSelector((state: any) => state.auth.authentication);
    const [data, setData] = useState({
        nombre: '',
        apellido: '',
        tipo_documento: '',
        numero_documento: '',
        fecha_nacimiento: '',
        pais: '',
        departamento: '',
        ciudad: '',
        barrio: '',
        direccion: '',
        tipo_contacto: '',
        observacion_contacto: '',
        estado: '',
        escuela: '',
        grado: '',
        turno: '',
        foto: '',
        publicid: '',
    });
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        authenticatedApi()
        .get(`/paciente/${id}`)
        .then((res) => {
            setData(res.data);
        })
    }, [id]);


    const [file, setFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setFile(e.target.files[0]);
        }
      };
      async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();
        if (file) {
            formData.append("foto", file); // Cambia "file" a "foto"
        }
        try {
            const api = authenticatedApi();
            let newData = { ...data, usuario:authentication.profile.id}; // Agrega el usuario
        
            // Si hay un archivo seleccionado, procede con la carga y actualización de la foto
            if (file) {
                const responseUpload = await api.post("/paciente/foto", formData);
                const { url, public_id } = responseUpload.data;
              newData = { ...newData, foto: url, publicid: public_id };
            }
         
            //console.log(newData)
            //return
        api.put(`/paciente/${id}`, newData)
            .then((res) => {
                console.log(res);
                toast.success("Guardado con éxito!");
                setTimeout(() => {
                    navigate(`/paciente/${res.data.id}`);  // Asegúrate de que res.data.id tiene el ID correcto
                }, 3000);
            })
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar");
          }
    }
    return (
        <div>
            <ContentHeader title="Agregar Paciente" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Ingresar Información del Paciente</h3>
                            <div className="card-tools">
                                <Link to={`/paciente/${id}`} className="btn btn-info">
                                    Volver a la Ficha
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} className="row">
                                <div className="form-group col-md-6">
                                    <label>Nombre*</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="form-control"
                                        id="nombre"
                                        placeholder="Nombre"
                                        required
                                        value={data.nombre}
                                        onChange={(e) => setData({ ...data, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Apellido*</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="apellido"
                                        placeholder="Apellido"
                                        required
                                        value={data.apellido}
                                        onChange={(e) =>
                                            setData({ ...data, apellido: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Tipo de Documento*</label>
                                    <select
                                        className="form-control"
                                        id="tipo_documento"
                                        value={data.tipo_documento}
                                        onChange={(e) => setData({ ...data, tipo_documento: e.target.value })}
                                    >
                                        <option value="Cédula">Cédula</option>
                                        <option value="Pasaporte">Pasaporte</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Número de Documento*</label>
                                    <input
                                        type="string"
                                        className="form-control"
                                        id="numero_documento"
                                        placeholder="Número de Documento"
                                        required
                                        value={data.numero_documento}
                                        onChange={(e) =>
                                            setData({ ...data, numero_documento: e.target.value })
                                        }
                                    />
                                </div>
                               
                                <div className="form-group col-md-6">
                                    <label>Fecha de Nacimiento*</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha_nacimiento"
                                        required
                                        value={data.fecha_nacimiento}
                                        onChange={(e) =>
                                            setData({ ...data, fecha_nacimiento: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Escuela</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="escuela"
                                        placeholder="Escuela"
                                        value={data.escuela}
                                        onChange={(e) =>
                                            setData({ ...data, escuela: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Grado</label>
                                    <select
                                        className="form-control"
                                        id="grado"
                                        value={data.grado}
                                        onChange={(e) => setData({ ...data, grado: e.target.value })}
                                    >
                                        <option value="Maternal">Maternal</option>
                                        <option value="Pre-Jardín">Pre-Jardín</option>
                                        <option value="Jardín">Jardín</option>
                                        <option value="Pre-escolar">Pre-escolar</option>
                                        <option value="Primer Grado">Primer Grado</option>
                                        <option value="Segundo Grado">Segundo Grado</option>
                                        <option value="Tercer Grado">Tercer Grado</option>
                                        <option value="Cuarto Grado">Cuarto Grado</option>
                                        <option value="Quinto Grado">Quinto Grado</option>
                                        <option value="Sexto Grado">Sexto Grado</option>
                                        <option value="Séptimo Grado">Séptimo Grado</option>
                                        <option value="Octavo Grado">Octavo Grado</option>
                                        <option value="Noveno Grado">Noveno Grado</option>
                                        <option value="N/A">N/A</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Turno</label>
                                    <select
                                        className="form-control"
                                        id="turno"
                                        value={data.turno}
                                        onChange={(e) => setData({ ...data, turno: e.target.value })}
                                    >
                                        <option value="Mañana">Mañana</option>
                                        <option value="Tarde">Tarde</option>
                                        <option value="Noche">Noche</option>
                                        <option value="Doble Escolaridad">Doble Escolaridad</option>
                                        <option value="N/A">N/A</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Foto del Paciente</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="foto"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>País</label>
                                    <select
                                        className="form-control"
                                        id="pais"
                                        value={data.pais}
                                        onChange={(e) => setData({ ...data, pais: e.target.value })}
                                    >
                                        <option value="Alemania">Alemania</option>
                                        <option value="Argentina">Argentina</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Bolivia">Bolivia</option>
                                        <option value="Brasil">Brasil</option>
                                        <option value="Canadá">Canadá</option>
                                        <option value="Chile">Chile</option>
                                        <option value="China">China</option>
                                        <option value="Colombia">Colombia</option>
                                        <option value="Corea del Sur">Corea del Sur</option>
                                        <option value="España">España</option>
                                        <option value="Estados Unidos">Estados Unidos</option>
                                        <option value="Francia">Francia</option>
                                        <option value="India">India</option>
                                        <option value="Indonesia">Indonesia</option>
                                        <option value="Italia">Italia</option>
                                        <option value="Japón">Japón</option>
                                        <option value="México">México</option>
                                        <option value="Paraguay">Paraguay</option>
                                        <option value="Perú">Perú</option>
                                        <option value="Polonia">Polonia</option>
                                        <option value="Portugal">Portugal</option>
                                        <option value="Reino Unido">Reino Unido</option>
                                        <option value="Rusia">Rusia</option>
                                        <option value="Sudáfrica">Sudáfrica</option>
                                        <option value="Suiza">Suiza</option>
                                        <option value="Turquía">Turquía</option>
                                        <option value="Ucrania">Ucrania</option>
                                        <option value="Uruguay">Uruguay</option>
                                        <option value="Venezuela">Venezuela</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Departamento</label>
                                    <select
                                        className="form-control"
                                        id="departamento"
                                        value={data.departamento}
                                        onChange={(e) => {
                                            const selectedDepartamento = e.target
                                                .value as Departamento;
                                            const defaultCiudad =
                                                selectedDepartamento in Ciudades
                                                    ? Ciudades[
                                                    selectedDepartamento as Departamento
                                                    ][0]
                                                    : "";
                                            setData({
                                                ...data,
                                                departamento: selectedDepartamento,
                                                ciudad: defaultCiudad,
                                            });
                                        }}
                                    >
                                        <option value="">
                                            Seleccionar el Departamento
                                        </option>
                                        {Departamentos.map((departamento) => (
                                            <option key={departamento} value={departamento}>
                                                {departamento}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Ciudad</label>
                                    <select
                                        className="form-control"
                                        id="ciudad"
                                        value={data.ciudad || ""}
                                        onChange={(e) =>
                                            setData({ ...data, ciudad: e.target.value })
                                        }
                                    >
                                        <option value="">Seleccionar la Ciudad</option>
                                        {data.departamento in Ciudades
                                            ? Ciudades[
                                                data.departamento as Departamento
                                            ].map((ciudad: Ciudad) => (
                                                <option key={ciudad} value={ciudad}>
                                                    {ciudad}
                                                </option>
                                            ))
                                            : null}
                                    </select>
                                </div>

                                <div className="form-group col-md-4">
                                    <label>Barrio</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="barrio"
                                        placeholder="Barrio"
                                        value={data.barrio}
                                        onChange={(e) =>
                                            setData({ ...data, barrio: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group col-md-8">
                                    <label>Dirección</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="direccion"
                                        placeholder="Dirección"
                                        value={data.direccion}
                                        onChange={(e) =>
                                            setData({ ...data, direccion: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Tipo de Contacto</label>
                                    <select
                                        className="form-control"
                                        id="tipo_contacto"
                                        value={data.tipo_contacto}
                                        onChange={(e) => setData({ ...data, tipo_contacto: e.target.value })}
                                    >
                                        <option value="Redes Sociales">Redes Sociales</option>
                                        <option value="Recomendación">Recomendación</option>
                                        <option value="Familiar/amigos">Familiar/amigos</option>
                                        <option value="Cartelería">Cartelería</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-8">
                                    <label>Observación: </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="observacion_contacto"
                                        placeholder="Observación del contacto"
                                        value={data.observacion_contacto}
                                        onChange={(e) =>
                                            setData({ ...data, observacion_contacto: e.target.value })
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
                </div >
            </section >
        </div >
    );
};
export default EditarPaciente;