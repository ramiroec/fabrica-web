import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Usuario } from "./interfaces/usuario";
import { authenticatedApi } from "./interfaces/api";
import { useTranslation } from 'react-i18next';
import { ContentHeader } from '@components';
import { Image } from '@profabric/react-components';
import styled from 'styled-components';
import UsuarioTab from './PestanaUsuario';
// Define un componente para los botones de pestaña
const TabButton = styled.button`
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 0.25rem 0.25rem 0 0;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;

  /* Estilo para el botón activo */
  &.active {
    background-color: #ffffff;
    border-bottom-color: transparent;
  }
`;
const StyledUserImage = styled(Image)`
  --pf-border: 3px solid #adb5bd;
  --pf-padding: 3px;
`;

const PerfilUsuario = () => {
  const [data, setData] = useState<Usuario | null>(null);
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState('Usuario');
  const [t] = useTranslation();

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    const url = `/usuario/${id}`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setData(response.data);
      })
  }, [id]);


  return (
    <>
      <ContentHeader title="Ficha del Usuario" />
      <section className="content">
        <div className="container-fluid">
          {data && (
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header p-2">
                    <ul className="nav nav-pills">
                      <li className="nav-item">
                        <TabButton
                          className={`nav-link ${activeTab === 'Usuario' ? 'active' : ''}`}
                          onClick={() => toggle('Usuario')}
                        >
                          Ficha del Usuario
                        </TabButton>
                      </li>
                      <li className="nav-item">
                        <TabButton
                          className={`nav-link ${activeTab === 'Calendario' ? 'active' : ''}`}
                          onClick={() => toggle('Calendario')}
                        >
                          Otra Opción
                        </TabButton>
                      </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <div className="tab-content">
                      <UsuarioTab isActive={activeTab === 'Usuario'} />
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
