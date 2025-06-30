import React, { useState } from "react";
import { X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
const GenerateReportModal = ({ onClose }) => {
    const [filterType, setFilterType] = useState("date");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [clientName, setClientName] = useState("");
    const generatePDF = (reportData) => {
        if (!Array.isArray(reportData) || reportData.length === 0) {
            alert("Nenhum dado disponível para gerar o relatório.");
            return;
        }

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Relatório de Pedidos", 14, 22);

        const now = new Date().toLocaleString();
        doc.setFontSize(10);
        doc.text(`Gerado em: ${now}`, 14, 30);

        let tableColumn = [];
        let tableRows = [];

        // Verifica formato para montar tabela certa
        if (reportData[0].id) {
            // Relatório por cliente - lista de pedidos
            tableColumn = ["ID do Pedido", "Tipo de Pagamento", "Total do Pedido (R$)"];
            tableRows = reportData.map(item => [
                item.id || "N/A",
                item.paymentType || "N/A",
                item.totalOrder ? item.totalOrder.toFixed(2) : "0.00"
            ]);
        } else if (reportData[0].paymentType && reportData[0].total_orders) {
            // Relatório agregado por tipo de pagamento
            tableColumn = ["Tipo de Pagamento", "Total de Pedidos", "Valor Total (R$)", "Valor Médio (R$)"];
            tableRows = reportData.map(item => [
                item.paymentType || "N/A",
                item.total_orders || "0",
                item.total_value ? Number(item.total_value).toFixed(2) : "0.00",
                item.avg_order_value ? Number(item.avg_order_value).toFixed(2) : "0.00",
            ]);
        } else {
            alert("Formato de dados desconhecido para gerar relatório.");
            return;
        }

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [255, 99, 71] }
        });

        doc.save("relatorio_pedidos.pdf");
    };


    const handleGenerate = async () => {
        let test;
        try {
            let url = "";

            if (filterType === "date") {
                url = `http://localhost:3000/api/relatorios/pagamento?startDate=${startDate}&endDate=${endDate}`;

            } else {
                url = `http://localhost:3000/api/pedidos?cliente=${clientName}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            test = data
            if (filterType == "date") {
                test = data.paymentReport
            }

            generatePDF(test);


            onClose();
        } catch (err) {
            console.error("Erro ao gerar relatório:", err);
            alert("Erro ao gerar relatório.");
        }
    };




    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold text-red-500">Gerar Relatório</h2>
                    <button onClick={onClose}>
                        <X size={24} className="text-gray-600 hover:text-black" />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="font-medium block mb-1">Filtrar por:</label>
                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="date">Período</option>
                        <option value="client">Cliente</option>
                    </select>
                </div>

                {filterType === "date" ? (
                    <div className="space-y-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Data início"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Data fim"
                        />
                    </div>
                ) : (
                    <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Nome do cliente"
                    />
                )}

                <div className="flex justify-end mt-5 gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                    <button onClick={handleGenerate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Gerar</button>
                </div>
            </div>
        </div>
    );
};

export default GenerateReportModal;
