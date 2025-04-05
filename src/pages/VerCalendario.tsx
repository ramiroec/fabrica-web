import { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
//import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { authenticatedApi } from './interfaces/api'; 
import { Agenda } from "./interfaces/agenda";
import { useParams } from "react-router-dom";
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');
//const localizer = momentLocalizer(moment);
const localizer = dayjsLocalizer(dayjs);

function VerCalendario({isClearfix = false}: {isClearfix?: boolean}) {
  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Sin eventos',
  };

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    authenticatedApi().get(`/agenda/usuario/${id}`)
      .then((response) => {
        const agendaEvents = response.data.map((appointment: Agenda) => ({
          title: `${appointment.especialidad_descripcion} - ${appointment.paciente_nombre_completo}`,
          start: new Date(appointment.fecha + 'T' + appointment.desde),
          end: new Date(appointment.fecha + 'T' + appointment.hasta),
          allDay: false
        }));
        setEvents(agendaEvents);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <p>Cargando agenda...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          messages={messages}
        />
      )}
    </div>
  );
}
export default VerCalendario;
