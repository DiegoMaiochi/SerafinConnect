import { useEffect, useState } from "react";
import { FiXCircle } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Produto {
  id: number | string;
  ean: string;
  name: string;
  quantity: number;
  price: number;
  description?: string;
  group: string;
  type: string;
  status: string;
}

interface RelatorioProdutosProps {
  produtos: Produto[];
  isOpen: boolean;
  onClose: () => void;
}

export function RelatorioProdutos({ produtos, isOpen, onClose }: RelatorioProdutosProps) {
  if (!isOpen) return null;

  function gerarPdf() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Relatório de Produtos", 14, 22);

    const head = [
      ["EAN", "Nome", "Quantidade", "Preço (R$)", "Grupo", "Tipo", "Status"],
    ];

    const body = produtos.map((p) => [
      p.ean,
      p.name,
      p.quantity.toString(),
      p.price.toFixed(2),
      p.group,
      p.type,
      p.status,
    ]);

    autoTable(doc, {
      startY: 30,
      head,
      body,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [220, 53, 69] }, // vermelho
    });

    doc.save("relatorio-produtos.pdf");
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-[90vw] max-w-5xl max-h-[80vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-600 hover:text-red-800"
          title="Fechar"
        >
          <FiXCircle size={28} />
        </button>

        <h2 className="text-2xl font-bold text-center p-4 border-b border-gray-300">
          Relatório de Produtos
        </h2>

        <div className="p-4">
          {produtos.length === 0 && <p>Nenhum produto encontrado.</p>}
          {produtos.length > 0 && (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-red-500 text-white">
                    <th className="p-2 border">EAN</th>
                    <th className="p-2 border">Nome</th>
                    <th className="p-2 border">Quantidade</th>
                    <th className="p-2 border">Preço (R$)</th>
                    <th className="p-2 border">Grupo</th>
                    <th className="p-2 border">Tipo</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((p) => (
                    <tr key={p.id} className="even:bg-gray-100">
                      <td className="p-2 border">{p.ean}</td>
                      <td className="p-2 border">{p.name}</td>
                      <td className="p-2 border">{p.quantity}</td>
                      <td className="p-2 border">{p.price.toFixed(2)}</td>
                      <td className="p-2 border">{p.group}</td>
                      <td className="p-2 border">{p.type}</td>
                      <td className="p-2 border">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={gerarPdf}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Gerar PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
