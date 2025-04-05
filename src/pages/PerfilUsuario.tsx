import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ContentHeader } from "@components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { Image } from "@profabric/react-components";
import { Usuario } from "./interfaces/usuario";
import styled from "styled-components";
import EditarPerfilUsuario from './EditarPerfilUsuario';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StyledUserImage = styled(Image)`
  --pf-border: 3px solid #adb5bd;
  --pf-padding: 3px;
`;

const PerfilUsuario = () => {
  const [data, setData] = useState<Usuario | null>(null);
  const [detallesPago, setDetallesPago] = useState<any[]>([]);
  const [ordenesServicio, setOrdenesServicio] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const authentication = useSelector((state: any) => state.auth.authentication);
  const [activeTab, setActiveTab] = useState("ACTIVITY");
  const [t] = useTranslation();

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const fetchData = async () => {
    try {
      const response = await authenticatedApi().get(`/usuario/${authentication.profile.id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  }; 
  useEffect(() => {
    fetchData();
  }, []);



  return (
    <>
      <ContentHeader title="Perfil" />
      <section className="content">
        <div className="container-fluid">
          {data && (
            <div className="row">
              <div className="col-md-3">
                <div className="card card-info card-outline">
                  <div className="card-body box-profile">
                    <div className="text-center">
                      <StyledUserImage
                        width={100}
                        height={100}
                        rounded
                        src={
                          data.foto
                            ? `${authentication.profile.foto}`
                            : `https://cdn-icons-png.flaticon.com/512/6073/6073873.png`
                        }
                        alt="User profile"
                      />
                    </div>
                    <h3 className="profile-username text-center">
                      {data.nombre} {data.apellido}
                    </h3>
                    <p className="text-muted text-center">
                      {authentication.profile.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-9">
                <div className="card card-info card-outline">
                  <div className="card-header p-2"></div>
                  <div className="card-body">
                    <div className="col-md-12">
                      <div className="card card-light">
                        <div className="card-header">
                          <h4 className="card-title">Datos Personales</h4>
                          <div className="card-tools">
                            <button
                              className="btn bg-info"
                              onClick={() => setIsEditing(true)}
                            >
                              Editar Perfil
                            </button>
                            <EditarPerfilUsuario
                              isOpen={isEditing}
                              onRequestClose={() => setIsEditing(false)}
                            />
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <p>
                                <strong>Nombre: </strong>
                                {data.nombre_completo}
                              </p>
                              <p>
                                <strong>Tipo de Documento: </strong>
                                {data.tipo_documento}
                              </p>
                              <p>
                                <strong>Celular:</strong> {data.telefono}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <p>
                                <strong>Email:</strong> {data.email}
                              </p>
                              <p>
                                <strong>Número de Documento: </strong>
                                {data.numero_documento}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PerfilUsuario;
