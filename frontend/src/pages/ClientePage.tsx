import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiLogOut, FiUser, FiMenu, FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAccessToken, removeTokens } from "../utils/tokenStorage";
import OrderForm from "../NovasTelas/dashboard/OrderForm"; // seu componente OrderForm importado
import ClientOrderForm from "./ClientOrderForm"; // novo componente

interface Product {
  id: number;
  ean: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  group: string;
  type: string;
  status: string;
}

export default function ClientePage() {
  const token = getAccessToken();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showMenuMobile, setShowMenuMobile] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setUserEmail(storedEmail);
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:3000/api/produtos", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data: Product[] = await response.json();
          const activeProducts = data.filter((p) => p.status === "active");
          setProducts(activeProducts);
          setFilteredProducts(activeProducts);
        } else {
          console.error("Erro ao buscar produtos");
        }
      } catch (err) {
        console.error("Erro na requisição:", err);
      }
    }
    fetchProducts();
  }, [token]);

  // Filtra por tipo selecionado
  useEffect(() => {
    if (!filterType) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.type === filterType));
    }
  }, [filterType, products]);

  const addToCart = (product: Product, qty = 1) => {
    if (qty < 1) return;
    setCart((oldCart) => {
      const existing = oldCart.find((item) => item.product.id === product.id);
      if (existing) {
        return oldCart.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...oldCart, { product, qty }];
    });
  };

  const updateCartQty = (productId: number, qty: number) => {
    if (qty < 1) return;
    setCart((oldCart) =>
      oldCart.map((item) =>
        item.product.id === productId ? { ...item, qty } : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((oldCart) => oldCart.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    alert(`Pedido finalizado com ${cart.length} itens.`);
    setCart([]);
    setShowCart(false);
  };

  const handleLogout = () => {
    removeTokens();
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowMenuMobile(false);
  };

  return (
    <>
      {/* Menu fixo top */}
      <nav className="fixed top-0 left-0 right-0 bg-red-500 text-white flex items-center justify-between px-4 py-3 shadow-md z-50">
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setShowMenuMobile(!showMenuMobile)}
          aria-label="Abrir menu"
        >
          <FiMenu size={28} />
        </button>

        <div className="hidden md:flex items-center space-x-3">
          <FiUser size={24} />
          <span className="font-semibold">{userEmail || "Usuário"}</span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={scrollToTop}
            className="hover:underline font-semibold"
            title="Cardápio"
          >
            Cardápio
          </button>

          <button
            className="relative"
            onClick={() => setShowCart(!showCart)}
            title="Carrinho"
          >
            <FiShoppingCart size={26} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full text-xs px-1 font-bold">
                {cart.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 hover:underline font-semibold"
            title="Sair"
          >
            <FiLogOut size={22} />
            <span>Sair</span>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {showMenuMobile && (
          <div className="absolute top-full left-0 right-0 bg-red-600 text-white flex flex-col space-y-2 px-4 py-3 md:hidden z-40">
            <span className="flex items-center space-x-2 font-semibold">
              <FiUser size={20} />
              <span>{userEmail || "Usuário"}</span>
            </span>
            <button
              className="text-left hover:underline font-semibold"
              onClick={scrollToTop}
            >
              Cardápio
            </button>
            <button
              className="relative flex items-center"
              onClick={() => {
                setShowCart(!showCart);
                setShowMenuMobile(false);
              }}
            >
              <FiShoppingCart size={24} />
              <span className="ml-2 font-semibold">Carrinho</span>
              {cart.length > 0 && (
                <span className="ml-2 bg-white text-red-600 rounded-full text-xs px-2 font-bold">
                  {cart.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </button>
            <button
              className="text-left hover:underline font-semibold"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        )}
      </nav>

      {/* Conteúdo principal */}
      <main className="pt-16 p-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-red-500">Cardápio</h1>
          <div className="flex items-center space-x-3">
            <select
              className="border rounded px-3 py-2"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filtrar por tipo de produto"
            >
              <option value="">Todos os tipos</option>
              {[...new Set(products.map((p) => p.type))].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowOrderModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Novo Pedido
            </button>
          </div>
        </div>

        {/* Lista de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length === 0 && (
            <p className="text-center col-span-full">Nenhum produto disponível.</p>
          )}
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2 line-clamp-3">{product.description}</p>
                <p className="font-bold mb-4">R$ {product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="w-16 border rounded px-2 py-1 text-center"
                  aria-label={`Quantidade para ${product.name}`}
                  id={`qty-input-${product.id}`}
                />
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition flex-1"
                  onClick={() => {
                    const input = document.getElementById(
                      `qty-input-${product.id}`
                    ) as HTMLInputElement | null;
                    const qty = input ? Number(input.value) : 1;
                    if (!qty || qty < 1) {
                      alert("Quantidade inválida");
                      return;
                    }
                    addToCart(product, qty);
                    alert(`Adicionado ${qty}x ${product.name} ao carrinho.`);
                  }}
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Carrinho lateral */}
      {showCart && (
        <aside className="fixed top-0 right-0 w-4/5 max-w-xs h-full bg-white shadow-lg p-4 overflow-auto z-50 transition-transform duration-300 ease-in-out">
          <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
            Seu Pedido
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              aria-label="Fechar carrinho"
            >
              &times;
            </button>
          </h2>
          {cart.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <>
              <ul className="divide-y divide-gray-200 mb-4">
                {cart.map(({ product, qty }) => (
                  <li
                    key={product.id}
                    className="py-2 flex justify-between items-center space-x-2"
                  >
                    <span className="flex-1">
                      {product.name} x{" "}
                      <input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) =>
                          updateCartQty(product.id, Number(e.target.value))
                        }
                        className="w-16 border rounded px-2 py-1 text-center"
                      />
                    </span>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remover do carrinho"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleCheckout}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Finalizar Pedido
              </button>
            </>
          )}
        </aside>
      )}

      {/* Modal de criação de pedido */}
    {/* Botão abre modal pedido */}
      <button
        onClick={() => setShowOrderModal(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition z-40"
        aria-label="Fazer novo pedido"
      >
        Novo Pedido
      </button>

      {showOrderModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="client-order-form-title"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto p-6 relative">
            <button
              onClick={() => setShowOrderModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              aria-label="Fechar modal"
            >
              <FiXCircle size={28} />
            </button>
            <ClientOrderForm
              onClose={() => setShowOrderModal(false)}
              onOrderPlaced={() => {
                // Se quiser, pode atualizar algo aqui no ClientePage
                setCart([]);
                setShowCart(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
