import React, { useState, useEffect } from "react";
import { getAccessToken } from "../utils/tokenStorage";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  status: string;
  type: string;
}

interface Props {
  onClose: () => void;
  onOrderPlaced: () => void;
}

export default function ClientOrderForm({ onClose, onOrderPlaced }: Props) {
  const token = getAccessToken();
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<{ id: number; quantity: number }[]>([]);
  const [tableNumber, setTableNumber] = useState("");
  const [paymentType, setPaymentType] = useState("dinheiro");
  const [status, setStatus] = useState("pendente");
  const [loading, setLoading] = useState(false);

  // Pega o cliente logado (pode ser e-mail ou id salvo localStorage)
  const clientId = localStorage.getItem("userId"); // ou outro campo que armazena o id do cliente

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:3000/api/produtos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data: Product[] = await res.json();
          setProducts(data.filter((p) => p.status === "active"));
        }
      } catch (err) {
        console.error("Erro ao buscar produtos", err);
      }
    }
    fetchProducts();
  }, [token]);

  const addItem = (productId: number) => {
    setItems((old) => {
      const found = old.find((i) => i.id === productId);
      if (found) {
        return old.map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...old, { id: productId, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, qty: number) => {
    if (qty < 1) return;
    setItems((old) =>
      old.map((i) => (i.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const removeItem = (productId: number) => {
    setItems((old) => old.filter((i) => i.id !== productId));
  };

  const totalPrice = items.reduce((acc, item) => {
    const prod = products.find((p) => p.id === item.id);
    if (!prod) return acc;
    return acc + prod.price * item.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      alert("Cliente não identificado, faça login novamente.");
      return;
    }
    if (items.length === 0) {
      alert("Adicione pelo menos um produto.");
      return;
    }
    if (!tableNumber.trim()) {
      alert("Informe o número da mesa.");
      return;
    }

    setLoading(true);

    const payload = {
      clientId,
      tableId: parseInt(tableNumber, 10),
      items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
      paymentType,
      status,
      totalOrder: totalPrice,
    };

    try {
      const res = await fetch("http://localhost:3000/api/pedido", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Pedido enviado com sucesso!");
        setItems([]);
        setTableNumber("");
        setPaymentType("dinheiro");
        setStatus("pendente");
        onOrderPlaced();
        onClose();
      } else {
        alert("Erro ao enviar pedido.");
      }
    } catch (err) {
      console.error("Erro ao enviar pedido:", err);
      alert("Erro ao enviar pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-auto p-4">
      <h3 className="text-xl font-bold mb-2 text-center">Faça seu pedido</h3>

      <div>
        <label className="block mb-1 font-semibold">Número da Mesa</label>
        <input
          type="number"
          min={1}
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Produtos</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-auto border rounded p-2">
          {products.map((p) => {
            const itemInCart = items.find((i) => i.id === p.id);
            return (
              <div
                key={p.id}
                className="border p-2 rounded flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-semibold">{p.name}</h4>
                  <p className="text-sm text-gray-600">R$ {p.price.toFixed(2)}</p>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  {itemInCart ? (
                    <>
                      <input
                        type="number"
                        min={1}
                        value={itemInCart.quantity}
                        onChange={(e) =>
                          updateQuantity(p.id, Number(e.target.value))
                        }
                        className="w-16 border rounded px-2 py-1 text-center"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(p.id)}
                        className="text-red-600 font-semibold"
                      >
                        Remover
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addItem(p.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Adicionar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Forma de Pagamento</label>
        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="dinheiro">Dinheiro</option>
          <option value="cartao">Cartão</option>
          <option value="pix">PIX</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Status do Pedido</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="pendente">Pendente</option>
          <option value="em_progresso">Em Progresso</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>

      <div className="text-right font-bold text-lg">
        Total: R$ {totalPrice.toFixed(2)}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
      >
        {loading ? "Enviando..." : "Enviar Pedido"}
      </button>
    </form>
  );
}
