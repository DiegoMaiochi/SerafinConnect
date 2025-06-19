import { useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";

export function Mesas() {
  const [modalOpen, setModalOpen] = useState(false);
  const [numeroMesa, setNumeroMesa] = useState("");
  const [status, setStatus] = useState("ativo"); // selecionado por padrão

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Número da mesa:", numeroMesa);
    console.log("Status:", status);

    setModalOpen(false);
    setNumeroMesa("");
    setStatus("ativo"); // resetar para ativo ao fechar
  }

  return (
    <div>
      <div className="m-7">
        <div>
          <h1 className="text-red-500 font-black text-5xl mt-4">MESAS</h1>
          <h3 className="font-bold">
            Crie e gerencie as mesas de seu estabelecimento.
          </h3>
          <hr className="border-y-2 w-full mt-2 border-gray-200" />
        </div>
        <div className="flex mt-4 ml-10 items-center">
          <div className="bg-gray-200 w-4/5 p-1 rounded-2xl flex items-center">
            <FiSearch size={25} className="text-red-500 ml-2" />
            <input
              type="text"
              placeholder="Buscar mesas..."
              className="bg-transparent ml-2 outline-none w-full"
            />
          </div>
          <div>
            <FiFilter
              size={25}
              className="text-red-500 mt-1 ml-2 cursor-pointer"
            />
          </div>
          <div>
            <h1
              onClick={() => setModalOpen(true)}
              className="bg-green-400 p-1 pl-4 pr-4 rounded-2xl font-bold ml-2 cursor-pointer select-none"
            >
              +ADICIONAR
            </h1>
          </div>
        </div>

        <div className="bg-gray-200 h-auto mt-4 p-8 rounded-2xl ">
          {/* Aqui você pode listar as mesas */}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Adicionar Mesa</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col font-semibold">
                Número da mesa:
                <input
                  type="number"
                  value={numeroMesa}
                  onChange={(e) => setNumeroMesa(e.target.value)}
                  required
                  className="border border-gray-300 rounded px-2 py-1 mt-1"
                />
              </label>

              <label className="flex flex-col font-semibold">
                Status:
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="border border-gray-300 rounded px-2 py-1 mt-1"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </label>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
