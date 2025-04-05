import { useState, useEffect, useRef } from "react";
import { ContentHeader } from "@components";
import { Chart, registerables } from "chart.js";
import { useSelector } from "react-redux";

Chart.register(...registerables);

const Dashboard = () => {
  const authentication = useSelector((state: any) => state.auth.authentication);

  const productChartRef = useRef<HTMLCanvasElement>(null);
  const cityChartRef = useRef<HTMLCanvasElement>(null);
  const salesChartRef = useRef<HTMLCanvasElement>(null);
  const productTypeChartRef = useRef<HTMLCanvasElement>(null);

  const [productosProducidos, setProductosProducidos] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [ordenesServicio, setOrdenesServicio] = useState(0);
  const [nuevosClientes, setNuevosClientes] = useState(0);

  useEffect(() => {
    // Datos ficticios para los KPI
    setProductosProducidos(1200);
    setTotalClientes(350);
    setOrdenesServicio(450);
    setNuevosClientes(50);

    // Gráfico de Clientes Registrados por Mes
    const clientesPorMes = [50, 70, 90, 120, 150, 180, 200, 220, 250, 280, 300, 350];
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const clientChart = new Chart(productChartRef.current!, {
      type: "line",
      data: {
        labels: meses,
        datasets: [
          {
            label: "Clientes Registrados",
            data: clientesPorMes,
            borderColor: "#84A238",
            backgroundColor: "#BFD496",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Gráfico de Clientes por Ciudad
    const ciudades = ["Asunción", "Ciudad del Este", "Encarnación", "San Lorenzo", "Luque"];
    const clientesPorCiudad = [150, 100, 50, 30, 20];

    const cityChart = new Chart(cityChartRef.current!, {
      type: "bar",
      data: {
        labels: ciudades,
        datasets: [
          {
            label: "Clientes por Ciudad",
            data: clientesPorCiudad,
            backgroundColor: "#EA5F7D",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Gráfico de Ventas de los últimos 12 meses
    const ventasPorMes = [5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000];

    const salesChart = new Chart(salesChartRef.current!, {
      type: "bar",
      data: {
        labels: meses,
        datasets: [
          {
            label: "Ventas",
            data: ventasPorMes,
            backgroundColor: "#23B5C2",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Gráfico de Donas de Tipo de Producto Producido
    const tiposProducto = ["Vasos Térmicos", "Envases de Helados", "Ladrillos de Isopor"];
    const cantidadProducto = [400, 300, 500];

    const productTypeChart = new Chart(productTypeChartRef.current!, {
      type: "doughnut",
      data: {
        labels: tiposProducto,
        datasets: [
          {
            label: "Cantidad",
            data: cantidadProducto,
            backgroundColor: ["#FAB733", "#84A238", "#EA5F7D"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      clientChart.destroy();
      cityChart.destroy();
      salesChart.destroy();
      productTypeChart.destroy();
    };
  }, []);

  return (
    <div>
      <ContentHeader title="Dashboard" />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-6">
              <div className="small-box" style={{ backgroundColor: "#84A238" }}>
                <div className="inner">
                  <h3 style={{ color: "#ffffff" }}>{productosProducidos}</h3>
                  <p style={{ color: "#ffffff" }}>Productos Producidos</p>
                </div>
                <div className="icon" style={{ color: "#BFD496" }}>
                  <i className="fas fa-box" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box" style={{ backgroundColor: "#EA5F7D" }}>
                <div className="inner">
                  <h3 style={{ color: "#ffffff" }}>{totalClientes}</h3>
                  <p style={{ color: "#ffffff" }}>Clientes Totales</p>
                </div>
                <div className="icon" style={{ color: "#ffadad" }}>
                  <i className="fas fa-users" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box" style={{ backgroundColor: "#23B5C2" }}>
                <div className="inner">
                  <h3 style={{ color: "#ffffff" }}>{ordenesServicio}</h3>
                  <p style={{ color: "#ffffff" }}>Órdenes de Servicio</p>
                </div>
                <div className="icon" style={{ color: "#b1ebf0" }}>
                  <i className="fas fa-file-alt" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box" style={{ backgroundColor: "#FAB733" }}>
                <div className="inner">
                  <h3 style={{ color: "#ffffff" }}>{nuevosClientes}</h3>
                  <p style={{ color: "#ffffff" }}>Nuevos Clientes</p>
                </div>
                <div className="icon" style={{ color: "#f0d77d" }}>
                  <i className="fas fa-user-plus" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="card" style={{ height: "400px" }}>
                <div className="card-header" style={{ backgroundColor: "#ffffff" }}>
                  <h3 className="card-title">Clientes Registrados por Mes</h3>
                </div>
                <div className="card-body">
                  <canvas id="productChart" ref={productChartRef}></canvas>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card" style={{ height: "400px" }}>
                <div className="card-header" style={{ backgroundColor: "#ffffff" }}>
                  <h3 className="card-title">Clientes por Ciudad</h3>
                </div>
                <div className="card-body">
                  <canvas id="cityChart" ref={cityChartRef}></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="card" style={{ height: "400px" }}>
                <div className="card-header" style={{ backgroundColor: "#ffffff" }}>
                  <h3 className="card-title">Ventas de los últimos 12 meses</h3>
                </div>
                <div className="card-body">
                  <canvas id="salesChart" ref={salesChartRef}></canvas>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card" style={{ height: "400px" }}>
                <div className="card-header" style={{ backgroundColor: "#ffffff" }}>
                  <h3 className="card-title">Tipo de Producto Producido</h3>
                </div>
                <div className="card-body">
                  <canvas id="productTypeChart" ref={productTypeChartRef}></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;