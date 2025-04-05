import { useState } from "react";
import { Link } from "react-router-dom";

function ProcesoProduccion() {
  const [step, setStep] = useState(1);

  return (
    <div className="container">
      <div className="steps d-flex justify-content-between">
        {["Preespandido", "Secado y Curado", "Moldeado", "Corte", "Empaque"].map((title, index) => (
          <div key={index} className={`step ${step === index + 1 ? "active" : ""}`}>
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{title}</div>
            {index === 0 && <button className="btn btn-success" onClick={() => setStep(2)}>Iniciar</button>}
            {index === 2 && <button className="btn btn-danger" onClick={() => setStep(4)}>Continuar</button>}
            {index === 3 && <button className="btn btn-primary" onClick={() => setStep(5)}>Cortar</button>}
            {index === 4 && <button className="btn btn-info" onClick={() => setStep(1)}>Almacenar</button>}
          </div>
        ))}
      </div>

      <div className="section">
        <h3>Preespandido</h3>
        <div className="info-box">
          <p><strong>Código Producto:</strong> ______</p>
          <p><strong>Producto a producir:</strong> ______</p>
          <p><strong>Artículo:</strong> ______</p>
          <p><strong>Depósito retiro:</strong> ______</p>
          <p><strong>Cantidad Egreso:</strong> ______</p>
          <p><strong>UM:</strong> ______</p>
        </div>
      </div>

      <div className="section">
        <h3>Moldeado</h3>
        <div className="info-box">
          <p><strong>Equipo:</strong> ______</p>
        </div>
      </div>

      <div className="section">
        <h3>Corte</h3>
        <div className="info-box">
          <p><strong>Selección de Bloque:</strong> ______</p>
          <p><strong>Tamaño a cortar:</strong> ______</p>
        </div>
      </div>
    </div>
  );
}

export default ProcesoProduccion;
