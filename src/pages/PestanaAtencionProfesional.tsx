import AtencionProfesional from './AtencionProfesional';

const ActivityTab = ({isActive}: {isActive: boolean}) => {
  return (
    <div className={`tab-pane ${isActive ? 'active' : ''}`}>
      <AtencionProfesional isClearfix={false} />
    </div>
  );
};

export default ActivityTab;
