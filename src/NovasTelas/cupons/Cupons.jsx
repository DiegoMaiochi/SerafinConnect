import React, { useState } from "react";
import { FiFilter, FiSearch, FiXCircle } from "react-icons/fi";
import { getAccessToken } from "../../utils/tokenStorage";

export function Cupons() {
  const [isOpen, setIsOpen] = useState(false);

  const [nome, setNome] = useState("");
  const [idCupom, setIdCupom] = useState("");
  const [tipoDesconto, setTipoDesconto] = useState("real"); 
  const [valorDesconto, setValorDesconto] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [status, setStatus] = useState("ativo");

  const clearForm = () => {
    setNome("");
    setIdCupom("");
    setTipoDesconto("real");
    setValorDesconto("");
    setDataInicio("");
    setDataFinal("");
    setStatus("ativo");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idCupom || !valorDesconto || !dataInicio || !dataFinal) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const novoCupom = {
      code: idCupom,
      usageLimit: 0,
      discountValue:
        tipoDesconto === "percentual"
          ? `${valorDesconto}%`
          : valorDesconto,
    };

    try {
      const token = getAccessToken();

      const response = await fetch("http://localhost:3000/api/desconto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoCupom),
      });

      if (response.ok) {
        alert("Cupom criado com sucesso!");
        clearForm();
        setIsOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message || "Erro ao criar cupom"}`);
      }
    } catch (error) {
      alert("Erro na requisição.");
      console.error(error);
    }
  };

  return (
    <div className="m-7">
      <div>
        <h1 className="text-red-500 font-black text-5xl mt-4">CUPONS</h1>
        <h3 className="font-bold">Crie e gerencie os dados dos cupons.</h3>
        <hr className="border-y-2 w-full mt-2 border-gray-200" />
      </div>

      <div className="flex mt-4 ml-10">
        <div className="bg-gray-200 w-4/5 p-1 rounded-2xl flex items-center">
          <FiSearch size={25} className="text-red-500 ml-2" />
          <input
            type="text"
            placeholder="Buscar cupom..."
            className="bg-transparent ml-2 w-full outline-none"
          />
        </div>
        <div>
          <FiFilter size={25} className="text-red-500 mt-1 ml-2" />
        </div>
        <div>
          <h1
            onClick={() => setIsOpen(true)}
            className="bg-green-400 p-1 pl-4 pr-4 rounded-2xl font-bold ml-2 cursor-pointer"
          >
            +ADICIONAR
          </h1>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
          <div className="bg-white w-96 h-full p-6 shadow-lg overflow-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-red-500">Novo Cupom</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold"
                aria-label="Fechar"
              >
                X
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block font-semibold">Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Nome (opcional)"
                />
              </div>

              <div>
                <label className="block font-semibold">ID Cupom *</label>
                <input
                  type="text"
                  value={idCupom}
                  onChange={(e) => setIdCupom(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block font-semibold">Tipo *</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={tipoDesconto}
                    onChange={(e) => setTipoDesconto(e.target.value)}
                    required
                  >
                    <option value="real">Valor em R$</option>
                    <option value="percentual">Valor em %</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block font-semibold">Desconto *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={valorDesconto}
                    onChange={(e) => setValorDesconto(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold">Data Início *</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold">Data Final *</label>
                <input
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold">Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded-md w-full font-bold"
              >
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-gray-200 h-auto mt-4 p-8 rounded-2xl ">
        <div className="flex justify-evenly relative font-bold text-base text-gray-600">
          <div>
            <h3>Nome</h3>
          </div>
          <div>
            <h3>ID Cupom</h3>
          </div>
          <div>
            <h3>Desconto (R$/%)</h3>
          </div>
          <div>
            <h3>Data Início</h3>
          </div>
          <div>
            <h3>Data Final</h3>
          </div>
          <div>
            <h3>Status</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
