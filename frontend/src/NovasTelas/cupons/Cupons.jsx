import React, { useEffect, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { X } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // importa o plugin para estender o jsPDF

export function Cupons() {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [cupons, setCupons] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discountValue: 0,
        usageLimit: 1,
    });

    // Estado para busca e filtro
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all"); // all | ativo | expirado
    const [logs, setLogs] = useState([]);

    // Buscar cupons do backend
    const fetchCupons = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/cupons");
            const data = await res.json();
            setCupons(data);
        } catch (err) {
            console.error("Erro ao buscar cupons:", err);
        }
    };
    const fetchLogs = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/cupons/logs");
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error("Erro ao buscar logs:", err);
        }
    }
    useEffect(() => {
        fetchCupons();
        fetchLogs(); 

    }, []);

    // Filtrar os cupons com base na busca e filtro selecionado
    const filteredCupons = cupons.filter((cupom) => {
        const matchesSearch = cupom.code.toLowerCase().includes(searchTerm.toLowerCase());
        let matchesFilter = true;
        if (filterStatus === "ativo") {
            matchesFilter = cupom.usageLimit > 0;
        } else if (filterStatus === "expirado") {
            matchesFilter = cupom.usageLimit === 0;
        }
        return matchesSearch && matchesFilter;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = editingId ? "PUT" : "POST";
        const url = editingId
            ? `http://localhost:3000/api/cupons/${editingId}`
            : "http://localhost:3000/api/cupons";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert(isEditing ? "Cupom atualizado!" : "Cupom criado com sucesso!");
                setShowModal(false);
                setFormData({ code: "", discountValue: 0, usageLimit: 1 });
                setEditingId(null);
                setIsEditing(false);
                fetchCupons();
            } else {
                alert("Erro ao salvar cupom.");
            }
        } catch (err) {
            console.error("Erro ao salvar:", err);
        }
    };

    const handleEdit = (cupom) => {
        setFormData({
            code: cupom.code,
            discountValue: cupom.discountValue,
            usageLimit: cupom.usageLimit,
        });
        setEditingId(cupom.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeactivate = async (id) => {
        if (!window.confirm("Tem certeza que deseja inativar este cupom?")) return;

        try {
            const res = await fetch(`http://localhost:3000/api/cupons/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usageLimit: 0 }),
            });

            if (res.ok) {
                alert("Cupom inativado com sucesso!");
                fetchCupons();
            } else {
                alert("Erro ao inativar cupom.");
            }
        } catch (err) {
            console.error("Erro ao inativar:", err);
        }
    };

    // Geração de PDF com lista de cupons filtrados
    const generatePDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text("Relatório de Cupons", 14, 20);

    // Cabeçalhos da tabela de cupons
    doc.setFontSize(12);
    doc.text("Código", 14, 30);
    doc.text("ID", 64, 30);
    doc.text("Desconto", 104, 30);
    doc.text("Status", 154, 30);

    let yPosition = 40;
    const rowHeight = 10;

    filteredCupons.forEach((cupom, index) => {
        const y = yPosition + index * rowHeight;
        doc.text(cupom.code, 14, y);
        doc.text(cupom.id.toString(), 64, y);
        doc.text(`R$ ${cupom.discountValue.toFixed(2)}`, 104, y);
        doc.text(cupom.usageLimit > 0 ? "Ativo" : "Expirado", 154, y);
    });

    // Espaço para nova seção
    yPosition += filteredCupons.length * rowHeight + 20;
    doc.setFontSize(16);
    doc.text("Histórico de Ações dos Cupons", 14, yPosition);

    yPosition += 10;
    doc.setFontSize(11);
    logs.forEach((log, index) => {
        const date = new Date(log.criado_em).toLocaleString("pt-BR");
        const text = `#${log.id} - [${date}] Cupom ${log.cupom?.code || "?"} - ${log.acao.toUpperCase()} por ${log.usuario}`;
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(text, 14, yPosition);
        yPosition += 8;
    });

    doc.save("relatorio_cupons.pdf");
};




    return (
        <div className="m-7">
            <div>
                <h1 className="text-red-500 font-black text-5xl mt-4">CUPONS</h1>
                <h3 className="font-bold">Crie e gerencie os dados dos cupons.</h3>
                <hr className="border-y-2 w-full mt-2 border-gray-200" />
            </div>

            <div className="flex mt-4 ml-10 items-center gap-2">
                <div className="bg-gray-200 w-4/5 p-1 rounded-2xl flex items-center">
                    <FiSearch size={25} className="text-red-500 ml-2" />
                    <input
                        type="text"
                        placeholder="Buscar cupom..."
                        className="bg-transparent w-full ml-2 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <FiFilter size={25} className="text-red-500 mt-1 ml-2 cursor-pointer" title="Filtrar Status" />
                <select
                    className="border rounded p-1 ml-2"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    title="Filtrar Status"
                >
                    <option value="all">Todos</option>
                    <option value="ativo">Ativos</option>
                    <option value="expirado">Expirados</option>
                </select>
                <button
                    onClick={() => {
                        setShowModal(true);
                        setIsEditing(false);
                        setEditingId(null);
                        setFormData({ code: "", discountValue: 0, usageLimit: 1 });
                    }}
                    className="bg-green-400 p-1 pl-4 pr-4 rounded-2xl font-bold ml-2 hover:bg-green-500 transition"
                >
                    +ADICIONAR
                </button>
                <button
                    onClick={generatePDF}
                    className="bg-blue-500 p-1 pl-4 pr-4 rounded-2xl font-bold ml-2 hover:bg-blue-600 transition text-white"
                    title="Gerar Relatório PDF"
                >
                    Gerar PDF
                </button>
            </div>

            {/* Cabeçalho da tabela */}
            <div className="grid grid-cols-7 font-bold text-base text-gray-600 border-b pb-2 mt-4">
                <h3>Nome</h3>
                <h3>ID Cupom</h3>
                <h3>Desconto</h3>
                <h3>Status</h3>
                <div></div> {/* espaço vazio */}
                <div></div> {/* espaço vazio */}
                <h3>Ações</h3> {/* nova coluna para botões */}
            </div>

            {/* Lista de cupons filtrados */}
            {filteredCupons.map((cupom) => (
                <div
                    key={cupom.id}
                    className="grid grid-cols-7 text-sm text-gray-800 py-2 border-b items-center"
                >
                    <div>{cupom.code}</div>
                    <div>{cupom.id}</div>
                    <div>R$ {cupom.discountValue?.toFixed(2)}</div>
                    <div>
                        {cupom.usageLimit > 0 ? (
                            <span className="text-green-600 font-bold">Ativo</span>
                        ) : (
                            <span className="text-gray-400">Expirado</span>
                        )}
                    </div>
                    <div></div>
                    <div></div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleEdit(cupom)}
                            className="text-blue-500 font-semibold hover:underline"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => handleDeactivate(cupom.id)}
                            className="text-red-500 font-semibold hover:underline"
                        >
                            Inativar
                        </button>
                    </div>
                </div>
            ))}

            {/* Modal de Criação / Edição */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative animate-fade-in">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-red-500">
                            {isEditing ? "Editar Cupom" : "Novo Cupom"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Código</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, code: e.target.value }))
                                    }
                                    required
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Valor do Desconto</label>
                                <input
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            discountValue: parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                    required
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Limite de Uso</label>
                                <input
                                    type="number"
                                    value={formData.usageLimit}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            usageLimit: parseInt(e.target.value) || 1,
                                        }))
                                    }
                                    required
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-red-500 text-white font-bold px-4 py-2 rounded-md w-full mt-2"
                            >
                                {isEditing ? "Atualizar Cupom" : "Criar Cupom"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
