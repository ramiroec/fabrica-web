import { useState, useEffect } from 'react';
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from '@components';
import axios from "axios";

// Componente principal de la página de WhatsApp
const WhatsApp = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [isClientInitialized, setIsClientInitialized] = useState<boolean>(false);

  useEffect(() => {
    checkWhatsAppStatus();
    const qrCodeRefreshInterval = setInterval(checkWhatsAppStatus, 10000); // Refresh every 20 seconds
    return () => clearInterval(qrCodeRefreshInterval); // Clean up the interval
  }, []);

  const checkWhatsAppStatus = async () => {
    try {
      const response = await axios.get('https://hosting19.rieder.net.py/api/api/whatsapp/estado');
      setIsClientInitialized(response.data.isClientInitialized);
      setQrCode(response.data.qrCodeImage || null);
    } catch (err) {
      console.error('Error checking WhatsApp status:', err);
      setError('Error checking WhatsApp status');
    }
  };

  // Función para simular un retraso
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Función para obtener el código QR desde el servidor
  const fetchQrCode = async () => {
    try {
      const response = await axios.get('https://hosting19.rieder.net.py/api/api/whatsapp/qr');
      setQrCode(response.data.qrCodeImage);
      setError(null);
    } catch (err) {
      console.error('Error fetching QR code:', err);
      setError('Error fetching QR code');
    }
  };

  // Función para iniciar el cliente de WhatsApp
  const startWhatsApp = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://hosting19.rieder.net.py/api/api/whatsapp/iniciar-whatsapp');
      console.log(response.data.message);
      await pollForQrCode();
    } catch (err) {
      console.error('Error al iniciar WhatsApp:', err);
      setError('Error al iniciar WhatsApp');
      setLoading(false);
    }
  };

  // Función para detener el cliente de WhatsApp
  const stopWhatsApp = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://hosting19.rieder.net.py/api/api/whatsapp/detener-whatsapp');
      console.log(response.data.message);
      setIsClientInitialized(false);
      setQrCode(null);
      setLoading(false);
    } catch (err) {
      console.error('Error al detener WhatsApp:', err);
      setError('Error al detener WhatsApp');
      setLoading(false);
    }
  };

  // Función para sondear periódicamente hasta obtener el código QR
  const pollForQrCode = async () => {
    const maxRetries = 5; // Número máximo de intentos
    const delayMs = 5000; // Tiempo entre intentos en milisegundos
    for (let i = 0; i < maxRetries; i++) {
      await delay(delayMs);
      try {
        const response = await axios.get('https://hosting19.rieder.net.py/api/api/whatsapp/qr');
        if (response.data.qrCodeImage) {
          setQrCode(response.data.qrCodeImage);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching QR code:', err);
      }
    }
    setError('QR code could not be fetched after multiple attempts.');
    setLoading(false);
  };

  // Función para enviar un mensaje de WhatsApp
  const sendMessage = async () => {
    setSendError(null);
    setSendSuccess(null);
    try {
      const response = await axios.post('https://hosting19.rieder.net.py/api/api/whatsapp/send', {
        numeroDestino: phoneNumber,
        mensaje: message
      });
      setSendSuccess('Mensaje enviado con éxito');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setSendError('Error al enviar mensaje');
    }
  };

  return (
    <div>
      <ContentHeader title="Código QR de WhatsApp" />
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Notificaciones por WhatsApp</h3>
            </div>
            <div className="card-body">
              {loading && <p>Cargando código QR...</p>}
              {error && <p>{error}</p>}
              {qrCode && (
                <div>
                  <img src={qrCode} alt="QR Code" />
                  <p>Escanea el código QR con WhatsApp para poder enviar mensajes.</p>
                </div>
              )}
              {!loading && !qrCode && !error && !isClientInitialized && (
                <button onClick={startWhatsApp} className="btn btn-info">
                  Iniciar WhatsApp
                </button>
              )}
              {isClientInitialized && (
                <button onClick={stopWhatsApp} className="btn btn-danger">
                  Detener WhatsApp
                </button>
              )}
              <hr />
              <h3>Enviar Mensaje de WhatsApp</h3>
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Número de Teléfono:</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    className="form-control"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Mensaje:</label>
                  <textarea
                    id="message"
                    className="form-control"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Enviar Mensaje</button>
              </form>
              {sendError && <p className="text-danger">{sendError}</p>}
              {sendSuccess && <p className="text-success">{sendSuccess}</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatsApp;
