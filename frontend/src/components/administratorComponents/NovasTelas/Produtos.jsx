import { useState } from "react";
import { FiFilter, FiList, FiSearch, FiXCircle } from "react-icons/fi";

export function Produtos() {
    const [showForm, setShowForm] = useState(false);
    const [showGroupOptions, setShowGroupOptions] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [showTypeOptions, setShowTypeOptions] = useState(false);
    const [selectedType, setSelectedType] = useState("");

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const groups = [
        "Drinks", "Cervejas", "Vinhos", "Não Alcoólicos", "Porçoes", "Doses", "Garrafas", "Combos"
    ];

    return (
        <div>
            <div className="m-7">
                <div>
                    <h1 className="text-red-500 font-black text-5xl mt-4">PRODUTOS</h1>
                    <h3 className="font-bold">Crie e gerencie os dados de seus produtos.</h3>
                    <hr className="border-y-2 w-full mt-2 border-gray-200" />
                </div>

                <div className="flex mt-4 ml-10">
                    <div className="bg-gray-200 w-4/5 p-1 rounded-2xl">
                        <FiSearch size={25} className="text-red-500 ml-2" />
                    </div>
                    <div>
                        <FiFilter size={25} className="text-red-500 mt-1 ml-2" />
                    </div>
                    <div>
                        <button
                            className="bg-green-400 p-1 pl-4 pr-4 rounded-2xl font-bold ml-2 transition-colors duration-300 ease-in-out hover:bg-green-500"
                            onClick={toggleForm}
                        >
                            +ADICIONAR
                        </button>
                    </div>
                </div>

                <div className="bg-gray-200 h-auto mt-4 p-8 rounded-2xl"></div>
            </div>

            {showForm && (
                <div className="fixed bottom-0 right-0 h-full w-1/3 bg-gray-300 shadow-2xl p-6 rounded-tl-2xl rounded-bl-2xl border-t flex flex-col">
                    <div className="cursor-pointer ">
                        <button
                            className="text-2xl  text-black ml-2 hover:bg-gray-300 hover:text-gray-500"
                            onClick={toggleForm}
                        >
                            <FiXCircle size={30} />
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold flex justify-center m-2">Adicionar Produto</h2>

                    <div className="mt-24 space-y-2">
                        <input type="number" placeholder="EAN" className="w-full p-2 border rounded-lg" />
                        <input type="text" placeholder="Nome do Produto" className="w-full p-2 border rounded-lg" />
                        <div className="flex justify-between space-x-2">
                            <input type="number" placeholder="Qtd.:" className="w-full p-2 border rounded-lg" />
                            <input type="number" placeholder="Preço:" className="w-full p-2 border rounded-lg" />
                        </div>
                        <input type="text" placeholder="Descrição:" className="w-full p-2 border rounded-lg" />

                        <div className="flex justify-between space-x-2">
                            <div className="relative w-full">
                                <button
                                    onClick={() => setShowGroupOptions(!showGroupOptions)}
                                    className="w-full p-2 border rounded-lg bg-white text-left"
                                >
                                    {selectedGroup || "Selecione um grupo"}
                                </button>
                                {showGroupOptions && (
                                    <ul className="absolute w-full bg-white border rounded-lg mt-1 shadow-lg z-10">
                                        {groups.map((group, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    setSelectedGroup(group);
                                                    setShowGroupOptions(false);
                                                }}
                                                className="p-1 cursor-pointer hover:bg-gray-200"
                                            >
                                                {group}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="relative w-full">
                                <button
                                    onClick={() => setShowTypeOptions(!showTypeOptions)}
                                    className="w-full p-2 border rounded-lg bg-white text-left"
                                >
                                    {selectedType || "Selecione o tipo"}
                                </button>
                                {showTypeOptions && (
                                    <ul className="absolute w-full bg-white border rounded-lg mt-1 shadow-lg z-10">
                                        {["Kg", "Un"].map((type, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    setSelectedType(type);
                                                    setShowTypeOptions(false);
                                                }}
                                                className="p-1 cursor-pointer hover:bg-gray-200"
                                            >
                                                {type}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    <button className="bg-green-500 hover:bg-green-400 text-white font-bold px-4 py-2 rounded-lg absolute bottom-6 left-1/2 transform -translate-x-1/2 w-24 mb-10">
                        Salvar
                    </button>
                </div>
            )}
        </div>
    );
}
