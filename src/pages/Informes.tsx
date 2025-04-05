import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, DatePicker, Select, message } from 'antd';
import { authenticatedApi } from "./interfaces/api";
import 'react-toastify/dist/ReactToastify.css';
import '../styles/informes.css'; // Importación del archivo .css
const { RangePicker } = DatePicker;
const { Option } = Select;

const Informes = () => {
  const [visible, setVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [pacientes, setPacientes] = useState([]);
  const [terapeutas, setTerapeutas] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf'); // Default format
  const [selectedPacientes, setSelectedPacientes] = useState<string[]>([]);
  const [selectedResponsables, setSelectedResponsables] = useState<string[]>([]);
  const [selectedAgendas, setSelectedAgendas] = useState<string[]>([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState<any[]>([]); // Estado para el periodo seleccionado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pacientesResponse, terapeutasResponse, responsablesResponse, agendasResponse] = await Promise.all([
          authenticatedApi().get('/informes/pacientes'),
          authenticatedApi().get('/informes/terapeutas'),
          authenticatedApi().get('/informes/responsables'),
          authenticatedApi().get('/informes/agendas'),
        ]);

        setPacientes(pacientesResponse.data);
        setTerapeutas(terapeutasResponse.data);
        setResponsables(responsablesResponse.data);
        setAgendas(agendasResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showModal = (reportType: string) => {
    setSelectedReport(reportType);
    setVisible(true);
  };

  const handleOk = async () => {
    if (!selectedReport || !selectedFormat) {
      message.error('Tipo de informe o formato no válido');
      return;
    }

    setVisible(false);

    try {
      let url = '';
      let data = {};

      switch (selectedReport) {
        case 'pacientes':
          url = `/informes/generate/pacientes?format=${selectedFormat}`;
          data = { pacientes: selectedPacientes };
          break;
        case 'responsables':
          url = `/informes/generate/responsables?format=${selectedFormat}`;
          data = { responsables: selectedResponsables };
          break;
        case 'agendas':
          url = `/informes/generate/agendas?format=${selectedFormat}`;
          data = { agendas: selectedAgendas };
          break;
        case 'contabilidad':
          url = `/informes/generate/contabilidad?format=${selectedFormat}`;
          data = { periodo: selectedPeriodo.map(date => date.format('YYYY-MM-DD')) };
          break;
        case 'facturacion-terapeutas':
          url = `/informes/generate/facturacion-terapeutas?format=${selectedFormat}`;
          data = { periodo: selectedPeriodo.map(date => date.format('YYYY-MM-DD')) };
          break;
        case 'os-primera-consulta':
          url = `/informes/generate/os-primera-consulta?format=${selectedFormat}`;
          break;
        case 'agendasCanceladas': // Caso añadido
          url = `/informes/generate/agendasCanceladas?format=${selectedFormat}`;
          data = { periodo: selectedPeriodo.map(date => date.format('YYYY-MM-DD')) };
          break;
        // Agrega otros casos aquí según sea necesario
        default:
          message.error('Tipo de informe no válido');
          return;
      }

      const response = await authenticatedApi().post(url, data, { responseType: 'blob' });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${selectedReport}.${selectedFormat}`;
      link.click();

      message.success('Informe generado con éxito');
    } catch (error) {
      console.error('Error generando el informe:', error);
      message.error('Error generando el informe');
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSelectChange = (selectedItems: string[], reportType: string) => {
    if (reportType === 'pacientes') {
      if (selectedItems.includes('all')) {
        setSelectedPacientes(pacientes.map((paciente: any) => paciente.id.toString()));
      } else {
        setSelectedPacientes(selectedItems);
      }
    } else if (reportType === 'responsables') {
      if (selectedItems.includes('all')) {
        setSelectedResponsables(responsables.map((responsable: any) => responsable.id.toString()));
      } else {
        setSelectedResponsables(selectedItems);
      }
    } else if (reportType === 'agendas') {
      if (selectedItems.includes('all')) {
        setSelectedAgendas(agendas.map((agenda: any) => agenda.id.toString()));
      } else {
        setSelectedAgendas(selectedItems);
      }
    }
  };

  const renderForm = () => {
    if (loading) {
      return <p>Cargando datos...</p>;
    }

    switch (selectedReport) {
      case 'pacientes':
        return (
          <Form>
            <Form.Item label="Periodo">
              <RangePicker onChange={(dates) => setSelectedPeriodo(dates ? dates : [])} />
            </Form.Item>
            <Form.Item label="Paciente">
              <Select
                mode="multiple"
                placeholder="Selecciona pacientes"
                value={selectedPacientes}
                onChange={(value) => handleSelectChange(value, 'pacientes')}
              >
                <Option key="all" value="all">
                  Seleccionar todo
                </Option>
                {pacientes.map((paciente: any) => (
                  <Option key={paciente.id} value={paciente.id.toString()}>
                    {paciente.nombre} {paciente.apellido}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Formato">
              <Select defaultValue="pdf" onChange={value => setSelectedFormat(value)}>
                <Option value="xls">Excel (.xls)</Option>
                <Option value="csv">CSV (.csv)</Option>
                <Option value="pdf">PDF (.pdf)</Option>
              </Select>
            </Form.Item>
          </Form>
        );
      case 'responsables':
        return (
          <Form>
            <Form.Item label="Periodo">
              <RangePicker onChange={(dates) => setSelectedPeriodo(dates ? dates : [])} />
            </Form.Item>
            <Form.Item label="Responsable">
              <Select
                mode="multiple"
                placeholder="Selecciona responsables"
                value={selectedResponsables}
                onChange={(value) => handleSelectChange(value, 'responsables')}
              >
                <Option key="all" value="all">
                  Seleccionar todo
                </Option>
                {responsables.map((responsable: any) => (
                  <Option key={responsable.id} value={responsable.id.toString()}>
                    {responsable.nombre} {responsable.apellido}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Formato">
              <Select defaultValue="pdf" onChange={value => setSelectedFormat(value)}>
                <Option value="xls">Excel (.xls)</Option>
                <Option value="csv">CSV (.csv)</Option>
                <Option value="pdf">PDF (.pdf)</Option>
              </Select>
            </Form.Item>
          </Form>
        );
      case 'agendas':
        return (
          <Form>
            <Form.Item label="Periodo">
              <RangePicker onChange={(dates) => setSelectedPeriodo(dates ? dates : [])} />
            </Form.Item>
            <Form.Item label="Agenda">
              <Select
                mode="multiple"
                placeholder="Selecciona agendas"
                value={selectedAgendas}
                onChange={(value) => handleSelectChange(value, 'agendas')}
              >
                <Option key="all" value="all">
                  Seleccionar todo
                </Option>
                {agendas.map((agenda: any) => (
                  <Option key={agenda.id} value={agenda.id.toString()}>
                    {agenda.descripcion} {agenda.fecha}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Formato">
              <Select defaultValue="pdf" onChange={value => setSelectedFormat(value)}>
                <Option value="xls">Excel (.xls)</Option>
                <Option value="csv">CSV (.csv)</Option>
                <Option value="pdf">PDF (.pdf)</Option>
              </Select>
            </Form.Item>
          </Form>
        );
      case 'contabilidad':
        return (
          <Form>
            <Form.Item label="Periodo">
              <RangePicker onChange={(dates) => setSelectedPeriodo(dates ? dates : [])} />
            </Form.Item>
            <Form.Item label="Formato">
              <Select defaultValue="pdf" onChange={value => setSelectedFormat(value)}>
                <Option value="xls">Excel (.xls)</Option>
                <Option value="csv">CSV (.csv)</Option>
                <Option value="pdf">PDF (.pdf)</Option>
              </Select>
            </Form.Item>
          </Form>
        );
      case 'facturacion-terapeutas':
        return (
          <Form>
            <Form.Item label="Periodo">
              <RangePicker onChange={(dates) => setSelectedPeriodo(dates ? dates : [])} />
            </Form.Item>
            <Form.Item label="Formato">
              <Select defaultValue="pdf" onChange={value => setSelectedFormat(value)}>
                <Option value="xls">Excel (.xls)</Option>
                <Option value="csv">CSV (.csv)</Option>
                <Option value="pdf">PDF (.pdf)</Option>
              </Select>
            </Form.Item>
          </Form>
        );
      case 'os-primera-consulta':
        return (
          <Form>
            <Form.Item label="Formato">
              <Select defaultValue="pdf" onChange={value => setSelectedFormat(value)}>
                <Option value="xls">Excel (.xls)</Option>
                <Option value="csv">CSV (.csv)</Option>
                <Option value="pdf">PDF (.pdf)</Option>
              </Select>
            </Form.Item>
          </Form>
        );
      case 'agendasCanceladas': // Formulario para agendas canceladas
        return (
          <Form>
            <Form.Item label="Periodo">
              <RangePicker onChange={(dates) => setSelectedPeriodo(dates ? dates : [])} />
            </Form.Item>
            <Form.Item label="Formato">
              <Select defaultValue="pdf" onChange={value => setSelectedFormat(value)}>
                <Option value="xls">Excel (.xls)</Option>
                <Option value="csv">CSV (.csv)</Option>
                <Option value="pdf">PDF (.pdf)</Option>
              </Select>
            </Form.Item>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Informes</h1>
      <div className="informes-container">
        <div className="informe-card orange" onClick={() => showModal('pacientes')}>
          <i className="fas fa-users"></i>
          <div>Listado de Pacientes</div>
        </div>
        <div className="informe-card green" onClick={() => showModal('responsables')}>
          <i className="fas fa-user-tie"></i>
          <div>Listado de Responsables</div>
        </div>
        <div className="informe-card pink" onClick={() => showModal('agendas')}>
          <i className="fas fa-calendar-alt"></i>
          <div>Listado de Agendas</div>
        </div>
        <div className="informe-card salmon" onClick={() => showModal('contabilidad')}>
          <i className="fas fa-file-invoice-dollar"></i>
          <div>Informe de Contabilidad</div>
        </div>
        <div className="informe-card blue" onClick={() => showModal('os-primera-consulta')}>
          <i className="fas fa-hospital-user"></i>
          <div>Informe de Pacientes con OS Primera Consulta</div>
        </div>
        <div className="informe-card purple" onClick={() => showModal('agendasCanceladas')}>
          <i className="fas fa-calendar-times"></i>
          <div>Informe de Agendas Canceladas</div>
        </div>
        <div className="informe-card teal" onClick={() => showModal('osCanceladas')}>
          <i className="fas fa-file-excel"></i>
          <div>Informe de OS Canceladas</div>
        </div>
        <div className="informe-card indigo" onClick={() => showModal('facturacion-terapeutas')}>
          <i className="fas fa-chart-line"></i>
          <div>Informe de Facturación por Terapeuta</div>
        </div>
        <br />
      </div>

      <Modal
        title="Generar Informe"
        open={visible} // Usa 'open' en lugar de 'visible'
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {renderForm()}
      </Modal>
    </div>
  );
};

export default Informes;
