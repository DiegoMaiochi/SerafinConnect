import { useState } from "react";
import { FiFilter, FiList, FiSearch } from "react-icons/fi";

export function Produtos() {
    const [showForm, setShowForm] = useState(false);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div>
            <div className="m-7">
                <div>
                    <h1 className="text-red-500 font-black text-5xl mt-4">PRODUTOS</h1>
                    <h3 className="font-bold">Crie e gerencie os dados de seus produtos.</h3>
                    <hr className="border-y-2 w-full mt-2 border-gray-200"/>
                </div>
                
                <div className="flex mt-4 ml-10">
                    <div className="bg-gray-200 w-4/5 p-1 rounded-2xl">
                        <FiSearch size={25} className="text-red-500 ml-2"/>
                    </div>
                    <div>
                        <FiFilter size={25} className="text-red-500 mt-1 ml-2"/>
                    </div>
                    <div>
                        <button className="bg-green-400 p-1 pl-4 pr-4 rounded-2xl font-bold ml-2 transition-colors duration-300 ease-in-out hover:bg-green-600" onClick={toggleForm}>+ADICIONAR</button>
                    </div>
                </div>

                <div className="bg-gray-200 h-auto mt-4 p-8 rounded-2xl"></div>
            </div>

            {/* Formulário que aparece na metade da tela */}
            {showForm && (
                <div className="fixed bottom-0 right-0 h-full w-1/3 bg-gray-300 shadow-lg p-6 rounded-t-2xl border-t">
                    <h2 className="text-2xl font-bold flex justify-center m-4">Adicionar Produto</h2>
                    
                    {/* Campos do formulário */}
                    <div className="mt-4">
                        <input 
                            type="text" 
                            placeholder="Nome do produto" 
                            className="w-full p-2 border rounded-lg"
                        />
                        <input 
                            type="number" 
                            placeholder="Preço" 
                            className="w-full p-2 border rounded-lg mt-2"
                        />
                        <button 
                            className="bg-blue-500 text-white font-bold px-4 py-2 rounded-lg mt-4"
                        >
                            Salvar
                        </button>
                        <button 
                            className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg mt-4 ml-2"
                            onClick={toggleForm}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
