import Tratamiento from './Tratamiento';

const TratamientoTab = ({isActive}: {isActive: boolean}) => {
  return (
    <div className={`tab-pane ${isActive ? 'active' : ''}`}>
      <Tratamiento isClearfix={false} />
    </div>
  );
};

export default TratamientoTab;
