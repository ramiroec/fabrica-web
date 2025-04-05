import Orden from './ListarOrden';

const ActivityTab = ({isActive}: {isActive: boolean}) => {
  return (
    <div className={`tab-pane ${isActive ? 'active' : ''}`}>
      <Orden isClearfix={false} />
    </div>
  );
};

export default ActivityTab;
