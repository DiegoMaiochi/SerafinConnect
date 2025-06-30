import { useEffect, useState } from "react";
import { FiSearch, FiUser, FiXCircle } from "react-icons/fi";
import { RelatorioPedidosCliente } from './RelatorioPedidosCliente';

export function Usuarios() {
    const [showForm, setShowForm] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [tipo, setTipo] = useState("cliente");
    const [status, setStatus] = useState("ativo");
    const [documento, setDocumento] = useState("");

    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [filtroStatus, setFiltroStatus] = useState("todos");

    const [clienteEditandoId, setClienteEditandoId] = useState(null);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;

    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);

    const toggleForm = () => setShowForm(!showForm);

    const fetchUsuarios = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/clientes");
            if (res.ok) {
                const responseData = await res.json();
                setUsuarios(responseData.data);
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

    const limparFormulario = () => {
        setNome("");
        setEmail("");
        setTelefone("");
        setSenha("");
        setTipo("cliente");
        setStatus("ativo");
        setClienteEditandoId(null);
    };

    const handleSubmit = async () => {
        if (!nome || !email || !telefone || !tipo || !status || (!clienteEditandoId && !senha)) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        const payload = {
            name: nome,
            email,
            phone: telefone,
            tipo,
            status: status === "ativo",
            document: documento,
        };

        if (!clienteEditandoId) payload.password = senha;

        try {
            const url = clienteEditandoId
                ? `http://localhost:3000/api/cliente/${clienteEditandoId}`
                : `http://localhost:3000/api/clientes`;

            const method = clienteEditandoId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert(clienteEditandoId ? "Cliente atualizado!" : "Cliente cadastrado!");
                limparFormulario();
                toggleForm();
                fetchUsuarios();
            } else {
                const error = await res.json();
                throw new Error(error?.error || "Erro desconhecido");
            }
        } catch (err) {
            console.error("Erro ao salvar:", err);
            alert("Erro ao salvar cliente.");
        }
    };

    const editarCliente = (cliente) => {
        setNome(cliente.name);
        setEmail(cliente.email);
        setTelefone(cliente.phone);
        setTipo(cliente.tipo || "cliente");
        setStatus(cliente.status ? "ativo" : "inativo");
        setClienteEditandoId(cliente.id);
        setShowForm(true);
    };

    const usuariosFiltrados = usuarios.filter((usuario) =>
        usuario.name.toLowerCase().includes(busca.toLowerCase()) &&
        (filtroTipo === "todos" || usuario.tipo === filtroTipo) &&
        (filtroStatus === "todos" || (usuario.status ? "ativo" : "inativo") === filtroStatus)
    );

    const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(inicio, fim);

    const mudarPagina = (pagina) => {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaAtual(pagina);
        }
    };

    const abrirRelatorio = (usuario) => {
        setClienteSelecionado(usuario);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setClienteSelecionado(null);
    };

    return (
        <div className="m-7">
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 px-2 w-full">
                {/* Título com ícone */}
                <h1 className="text-blue-500 font-bold text-3xl flex items-center gap-2">
                    <FiUser className="text-4xl" />
                    Clientes
                </h1>

                {/* Campo de busca */}
                <div className="relative">
                    <FiSearch size={20} className="absolute left-2 top-2.5" />
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        className="pl-8 pr-4 py-2 border rounded-2xl"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                {/* Filtro */}
                <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="border px-4 py-2 rounded-2xl"
                >
                    <option value="todos">Todos os status</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                </select>

                {/* Botão adicionar */}
                <button
                    className="bg-green-400 p-2 px-4 rounded-2xl font-bold transition-colors duration-300 ease-in-out hover:bg-green-500"
                    onClick={() => {
                        limparFormulario();
                        setShowForm(true);
                    }}
                >
                    + ADICIONAR
                </button>
            </div>

            {/* Cabeçalho */}
            <div className="bg-gray-200 h-auto mt-4 p-4 rounded-2xl font-bold text-base text-gray-600">
                <div className="flex justify-evenly">
                    <div>Nome</div>
                    <div>Telefone</div>
                    <div>E-mail</div>
                    <div>Tipo</div>
                    <div>Status</div>
                    <div>Ações</div>
                </div>
            </div>

            {/* Lista */}
            <div className="space-y-2 mt-4">
                {usuariosPaginados.length > 0 ? (
                    usuariosPaginados.map((usuario) => (
                        <div
                            key={usuario.id}
                            className="flex justify-evenly p-4 bg-white shadow rounded-md text-gray-700 items-center"
                        >
                            <div className="w-1/6 text-center">{usuario.name}</div>
                            <div className="w-1/6 text-center">{usuario.phone}</div>
                            <div className="w-1/6 text-center">{usuario.email}</div>
                            <div className="w-1/6 text-center capitalize">{usuario.tipo || "cliente"}</div>
                            <div className="w-1/6 text-center capitalize">{usuario.status ? "ativo" : "inativo"}</div>
                            <div className="w-1/6 text-center flex gap-2 justify-center">
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    onClick={() => abrirRelatorio(usuario)}
                                >
                                    Ver Relatório
                                </button>
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                    onClick={() => editarCliente(usuario)}
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Nenhum usuário encontrado.</p>
                )}
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button onClick={() => mudarPagina(paginaAtual - 1)} disabled={paginaAtual === 1} className="px-3 py-1 rounded border disabled:opacity-50">Anterior</button>
                    {[...Array(totalPaginas)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => mudarPagina(i + 1)}
                            className={`px-3 py-1 rounded border ${paginaAtual === i + 1 ? "bg-red-500 text-white" : "bg-white text-gray-700"}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => mudarPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas} className="px-3 py-1 rounded border disabled:opacity-50">Próxima</button>
                </div>
            )}

            {/* Formulário lateral */}
            {showForm && (
                <div className="fixed bottom-0 right-0 h-full w-1/4 bg-gray-300 shadow-2xl p-6 rounded-tl-2xl rounded-bl-2xl border-t flex flex-col">
                    <button
                        className="text-2xl text-black ml-2 self-end hover:bg-gray-300 hover:text-gray-500"
                        onClick={toggleForm}
                    >
                        <FiXCircle size={30} />
                    </button>
                    <h2 className="text-2xl font-bold text-center m-2">
                        {clienteEditandoId ? "Editar Cliente" : "Adicionar Usuário"}
                    </h2>

                    <div className="mt-8 space-y-4">
                        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 border rounded-lg" />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-lg" />
                        <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full p-2 border rounded-lg" />
                        <input
                            type="text"
                            placeholder="Documento (CPF/CNPJ)"
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        {!clienteEditandoId && (
                            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full p-2 border rounded-lg" />
                        )}
                        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full p-2 border rounded-lg">
                            <option value="cliente">Cliente</option>
                            <option value="funcionário">Funcionário</option>
                        </select>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded-lg">
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>

                    <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-400 text-white font-bold px-4 py-2 rounded-lg absolute bottom-6 left-1/2 transform -translate-x-1/2 w-24">
                        Salvar
                    </button>
                </div>
            )}

            {modalAberto && clienteSelecionado && (
                <RelatorioPedidosCliente
                    clienteId={clienteSelecionado.id}
                    isOpen={modalAberto}
                    onClose={fecharModal}
                />
            )}
        </div>
    );
}
