import ListarAgendaPaciente from './ListarAgendaPaciente';

const ActivityTab = ({isActive}: {isActive: boolean}) => {
  return (
    <div className={`tab-pane ${isActive ? 'active' : ''}`}>
      <ListarAgendaPaciente isClearfix={false} />
    </div>
  );
};

export default ActivityTab;
