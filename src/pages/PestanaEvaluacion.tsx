import Evaluacion from './Evaluacion';

const EvaluacionTab = ({isActive}: {isActive: boolean}) => {
  return (
    <div className={`tab-pane ${isActive ? 'active' : ''}`}>
      <Evaluacion isClearfix={false} />
    </div>
  );
};

export default EvaluacionTab;
