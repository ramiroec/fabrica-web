import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import initializeDataTable from "./interfaces/DataTableConfig";
import { Item_plan_inicial } from "./interfaces/item_plan_inicial";

function ListarItemPlanInicial() {
  const [items, setData] = useState<Item_plan_inicial[]>([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    const url = `/item_plan_inicial`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    if (tableRef.current && !dataTableRef.current && !loading) {
      dataTableRef.current = initializeDataTable(tableRef.current);
    }
  }, [items, loading]);

  return (
    <div>
      <ContentHeader title="Items del Plan Inicial" />
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info card-outline">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-9">
                  <h3 className="card-title">Listado de Items del Plan Inicial</h3>   
                </div>
                <div className="col-lg-3 text-right">
                    
                  <Link className="btn btn-info" to="/item_plan_inicial/crear"> 
                    Crear Item
                  </Link>
                </div>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Cargando datos...</p>
              ) : (
                <table
                  ref={tableRef}
                  className="table table-bordered table-hover datatable full-width nowrap"
                >
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Descripción del Item</th>
                      <th>Ver más</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.item_descripcion}</td>
                        <td>
                          <Link className="icon-block" to={`/item_plan_inicial/${item.id}`}>
                            <i className="fa fa-fw fa-plus"></i>Ver más
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="card-footer"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ListarItemPlanInicial;
