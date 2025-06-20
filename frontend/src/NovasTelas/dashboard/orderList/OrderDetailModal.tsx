import { X } from "lucide-react";

interface Item {
    product: {
        name: string
    };
    quantity: number;
    price: number;
}

interface Cliente {
    name: string;
}

interface Pedido {
    id: string;
    cliente?: Cliente;
    tableId?: string;
    paymentType?: string;
    status: string;
    totalOrder?: number;
    ItensPedido?: Item[];
}

interface PedidoDetalhesModalProps {
    pedido: Pedido;
    onClose: () => void;
}

const PedidoDetalhesModal: React.FC<PedidoDetalhesModalProps> = ({ pedido, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-red-500 mb-4">Detalhes do Pedido</h2>

                {/* Cabeçalho */}
                <div className="mb-4 space-y-1">
                    <div><strong>Cliente:</strong> {pedido.cliente?.name || "N/A"}</div>
                    <div><strong>Mesa:</strong> {pedido.tableId || "N/A"}</div>
                    <div><strong>Método de Pagamento:</strong> {pedido.paymentType || "N/A"}</div>
                    <div><strong>Status:</strong> {pedido.status}</div>
                    <div><strong>Total:</strong> R$ {pedido.totalOrder?.toFixed(2) || "0.00"}</div>
                </div>

                {/* Itens */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
                    {pedido.ItensPedido && pedido.ItensPedido.length > 0 ? (
                        <ul className="space-y-2">
                            {pedido.ItensPedido.map((item, index) => (
                                <li key={index} className="border p-2 rounded-md">
                                    <div><strong>Produto:</strong> {item.product.name}</div>
                                    <div><strong>Quantidade:</strong> {item.quantity}</div>
                                    <div><strong>Preço:</strong> R$ {item.price?.toFixed(2)}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhum item encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PedidoDetalhesModal;
