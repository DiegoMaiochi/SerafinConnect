import React, { useState, useEffect } from "react";
import { Search, Filter, PlusCircle, X, FileText } from "lucide-react";
import OrderForm from "./OrderForm";
import PedidoList from "./orderList/orderList";
import EditPedidoModal from "./orderList/editOrderModal";
import GenerateReportModal from "./reports/GenerateReportModal";
import { MdOutlineSpaceDashboard } from "react-icons/md";

export function Dashboard() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pedidoList, setPedidoList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenEditModal = (pedido) => {
    setPedidoSelecionado(pedido);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setPedidoSelecionado(null);
    setEditModalOpen(false);
  };

  const fetchPedidos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/pedidos");
      if (response.ok) {
        const data = await response.json();
        setPedidoList(data);
      } else {
        console.error("Erro ao buscar pedidos.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleOrderSubmit = () => {
    handleCloseModal();
    fetchPedidos();
  };

  const handlePedidoUpdate = async (pedidoAtualizado) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pedido/${pedidoAtualizado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoAtualizado),
      });

      if (response.ok) {
        alert("Pedido atualizado com sucesso!");
        handleCloseEditModal();
        fetchPedidos();
      } else {
        alert("Erro ao atualizar o pedido.");
      }
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      alert("Erro ao atualizar o pedido.");
    }
  };

  const pedidosFiltrados = pedidoList.filter((pedido) => {
    const matchesSearch = pedido.cliente?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? pedido.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalFinalizados = pedidoList.filter(p => p.status === "finalizado").length;
  const totalPendentes = pedidoList.filter(p => p.status === "pendente").length;

  return (
    <div className="m-7">
      {/* Topo: título + busca à esquerda / ações à direita */}
      <div className="flex flex-wrap items-center justify-between mt-4 px-2 w-full gap-4">
        {/* Esquerda */}
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-blue-500 font-bold text-3xl flex items-center gap-2">
            <MdOutlineSpaceDashboard className="text-4xl" />
            Pedidos
          </h1>

          <div className="flex items-center p-2 rounded-2xl min-w-[250px] flex-1 max-w-[400px]">
            <Search size={25} className="ml-2" />
            <input
              type="text"
              placeholder="Pesquisar por cliente..."
              className="bg-transparent w-full ml-2 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Direita */}
        <div className="flex items-center gap-2 relative flex-wrap ml-auto">


          <Filter
            size={25}
            className="cursor-pointer"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            title="Filtrar por status"
          />

          {showFilterDropdown && (
            <div className="absolute top-10 left-0 bg-white border rounded shadow-md p-2 z-50 w-40">
              {["Todos", "Pendente", "Finalizado", "Cancelado"].map((status) => {
                const value = status.toLowerCase();
                return (
                  <div
                    key={value}
                    className={`cursor-pointer px-2 py-1 rounded ${statusFilter === (value === "todos" ? null : value)
                        ? "bg-red-200"
                        : "hover:bg-gray-200"
                      }`}
                    onClick={() => {
                      setStatusFilter(value === "todos" ? null : value);
                      setShowFilterDropdown(false);
                    }}
                  >
                    {status}
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3 py-2 rounded-full flex items-center border-2"
          >
            <FileText size={20} className="mr-2" /> Relatório
          </button>

          <button
            onClick={handleOpenModal}
            className="bg-green-400 p-2 px-3 rounded-2xl font-bold flex items-center hover:bg-green-500 transition-colors"
          >
            <PlusCircle size={20} className="mr-2" /> Adicionar Pedido
          </button>
        </div>
      </div>

      {/* Modal de relatório */}
      {isReportModalOpen && (
        <GenerateReportModal onClose={() => setIsReportModalOpen(false)} />
      )}

      {/* Resumo de status */}
      <div className="bg-gray-200 h-auto mt-4 p-8 rounded-2xl flex flex-col md:flex-row justify-evenly gap-4 relative">
        <div className="bg-gray-400 h-16 p-4 pl-7 pr-7 rounded-3xl font-bold text-lg flex items-center justify-center">
          <h1>FINALIZADOS: {totalFinalizados}</h1>
        </div>

        <div className="hidden md:block border-l-2 border-gray-600"></div>

        <div className="bg-gray-400 h-16 p-4 pl-7 pr-7 rounded-3xl font-bold text-lg flex items-center justify-center">
          <h1>PENDENTES: {totalPendentes}</h1>
        </div>
      </div>

      {/* Lista de pedidos */}
      <PedidoList pedidos={pedidosFiltrados} onEditPedido={handleOpenEditModal} />

      {/* Modal de novo pedido */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-4xl relative animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-500">Novo Pedido</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-black transition p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            <OrderForm onSubmit={handleOrderSubmit} />
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {editModalOpen && pedidoSelecionado && (
        <EditPedidoModal
          pedido={pedidoSelecionado}
          onClose={handleCloseEditModal}
          onUpdate={handlePedidoUpdate}
          employeeId={1}
        />
      )}
    </div>
  );
}

export default Dashboard;
