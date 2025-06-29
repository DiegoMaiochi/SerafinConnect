import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiXCircle } from "react-icons/fi";
import { getAccessToken } from "../../utils/tokenStorage";
import EmployeeList from "./EmployeeList"; // você precisa criar esse componente como o ProductList
import FuncionarioRelatorioModal from "./FuncionarioRelatorioModal"; // ajuste o caminho se necessário

export function Funcionarios() {
    const [searchTerm, setSearchTerm] = useState("");
    const [employeeList, setEmployeeList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const token = getAccessToken();
    const [showRelatorioModal, setShowRelatorioModal] = useState(false);

    const [name, setName] = useState("");
    const [document, setDocument] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/funcionarios", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setEmployeeList(data.data); // pois o backend retorna { data: [...], total: ... }
            } else {
                console.error("Erro ao buscar funcionários.");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSubmit = async () => {
        if (!name || !document || !password) {
            alert("Preencha os campos obrigatórios.");
            return;
        }

        const newEmployee = { name, document, email, phone, password };

        try {
            const response = await fetch("http://localhost:3000/api/funcionario", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEmployee),
            });

            if (response.ok) {
                alert("Funcionário cadastrado com sucesso!");
                clearForm();
                toggleForm();
                fetchEmployees();
            } else {
                const err = await response.json();
                alert(`Erro: ${err.error || "Erro ao cadastrar funcionário."}`);
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao cadastrar funcionário.");
        }
    };

    const toggleForm = () => setShowForm(!showForm);

    const clearForm = () => {
        setName("");
        setDocument("");
        setEmail("");
        setPhone("");
        setPassword("");
    };

    const filteredEmployees = employeeList.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="m-7">
            <h1 className="text-red-500 font-black text-5xl">FUNCIONÁRIOS</h1>
            <h3 className="font-bold">Cadastre e gerencie os funcionários.</h3>
            <hr className="border-y-2 w-full mt-2 border-gray-200" />

            <div className="flex mt-4 ml-10 items-center space-x-3">
                {/* Busca */}
                <div className="bg-gray-200 w-4/5 p-1 rounded-2xl flex items-center">
                    <FiSearch size={25} className="text-red-500 ml-2" />
                    <input
                        type="text"
                        placeholder="Buscar funcionário..."
                        className="bg-transparent ml-2 w-full outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Botão Adicionar */}
                <button
                    className="bg-green-400 p-1 pl-4 pr-4 rounded-2xl font-bold ml-2 transition hover:bg-green-500"
                    onClick={toggleForm}
                >
                    +ADICIONAR
                </button>
                <button
                    className="bg-blue-500 text-white font-bold p-1 pl-4 pr-4 rounded-2xl transition hover:bg-blue-600"
                    onClick={() => setShowRelatorioModal(true)}
                >
                    RELATÓRIO
                </button>

            </div>

            <EmployeeList employees={filteredEmployees} />
        {showRelatorioModal && (
  <FuncionarioRelatorioModal onClose={() => setShowRelatorioModal(false)} />
)}
            {showForm && (
                <div className="fixed bottom-0 right-0 h-full w-1/4 bg-gray-300 shadow-2xl p-6 rounded-tl-2xl rounded-bl-2xl border-t flex flex-col">
                    <button
                        className="text-2xl text-black ml-2 self-end"
                        onClick={toggleForm}
                    >
                        <FiXCircle size={30} />
                    </button>
                    <h2 className="text-2xl font-bold flex justify-center m-2">Novo Funcionário</h2>

                    <div className="mt-12 space-y-2">
                        <input
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Documento"
                            value={document}
                            onChange={(e) => setDocument(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Telefone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-green-500 hover:bg-green-400 text-white font-bold px-4 py-2 rounded-lg absolute bottom-6 left-1/2 transform -translate-x-1/2 w-24 mb-10"
                    >
                        Salvar
                    </button>
                </div>
            )}
        </div>
    );
}
