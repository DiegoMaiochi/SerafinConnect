import { useEffect, useState } from "react";
import { FiFilter, FiSearch, FiXCircle } from "react-icons/fi";

export function Usuarios() {
    const [showForm, setShowForm] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [tipo, setTipo] = useState("cliente");
    const [status, setStatus] = useState("ativo");
    const [usuarios, setUsuarios] = useState([]);

    const toggleForm = () => setShowForm(!showForm);

    const fetchUsuarios = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/clientes");
            if (res.ok) {
                const data = await res.json();
                setUsuarios(data);
            } else {
                console.error("Erro ao buscar usuários.");
            }
        } catch (err) {
            console.error("Erro na requisição:", err);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleSubmit = async () => {
        if (!nome || !email || !telefone || !tipo || !status) {
            alert("Preencha todos os campos.");
            return;
        }

        const novoUsuario = {
            nome,
            email,
            telefone,
            tipo,
            status,
        };

        try {
            await fetch("http://localhost:3000/api/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(novoUsuario),
            });

            alert("Usuário cadastrado com sucesso!");
            limparFormulario();
            toggleForm();
            fetchUsuarios();
        } catch (err) {
            console.error("Erro ao cadastrar:", err);
            alert("Erro ao cadastrar usuário.");
        }
    };

    const limparFormulario = () => {
        setNome("");
        setEmail("");
        setTelefone("");
        setTipo("cliente");
        setStatus("ativo");
    };

    return (
        <div className="m-7">
            <div>
                <h1 className="text-red-500 font-black text-5xl mt-4">USUÁRIOS</h1>
                <h3 className="font-bold">Crie e gerencie os dados de clientes e funcionários.</h3>
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

            <div className="buscar usuarios bg-gray-200 h-auto mt-4 p-8 rounded-2xl">
                <div className="flex justify-evenly relative font-bold text-base text-gray-600">
                    <div><h3>Nome</h3></div>
                    <div><h3>Telefone</h3></div>
                    <div><h3>E-mail</h3></div>
                    <div><h3>Tipo</h3></div>
                    <div><h3>Status</h3></div>
                </div>
            </div>

            <div className="space-y-2 mt-4">
                {usuarios.length === 0 ? (
                    <p className="text-center text-gray-500">Nenhum usuário cadastrado.</p>
                ) : (
                    usuarios.map((usuario, index) => (
                        <div
                            key={index}
                            className="flex justify-evenly p-4 bg-white shadow rounded-md text-gray-700"
                        >
                            <div className="w-1/5 text-center">{usuario.nome}</div>
                            <div className="w-1/5 text-center">{usuario.telefone}</div>
                            <div className="w-1/5 text-center">{usuario.email}</div>
                            <div className="w-1/5 text-center capitalize">{usuario.tipo}</div>
                            <div className="w-1/5 text-center capitalize">{usuario.status}</div>
                        </div>
                    ))
                )}
            </div>

            {showForm && (
                <div className="fixed bottom-0 right-0 h-full w-1/4 bg-gray-300 shadow-2xl p-6 rounded-tl-2xl rounded-bl-2xl border-t flex flex-col">
                    <button
                        className="text-2xl text-black ml-2 self-end hover:bg-gray-300 hover:text-gray-500"
                        onClick={toggleForm}
                    >
                        <FiXCircle size={30} />
                    </button>
                    <h2 className="text-2xl font-bold flex justify-center m-2">Adicionar Usuário</h2>

                    <div className="mt-12 space-y-4">
                        <input
                            type="text"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Telefone"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="" disabled>Selecione o tipo</option>
                            <option value="cliente">Cliente</option>
                            <option value="funcionário">Funcionário</option>
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="" disabled>Selecione o status</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
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