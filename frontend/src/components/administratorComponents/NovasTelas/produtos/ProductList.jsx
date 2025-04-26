import React, { useState } from "react";
import { FiXCircle } from "react-icons/fi";

export default function ProductList({ products }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const productsPerPage = 18;

    const totalPages = Math.ceil(products.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const toggleForm = () => setShowForm(!showForm);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseSidebar = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="relative bg-gray-200 h-full mt-4 p-4 rounded-2xl">
            {currentProducts.length > 0 ? (
                <>
                    <ul className="grid grid-cols-6 gap-4">
                        {currentProducts.map((product) => (
                            <li
                                key={product.id}
                                className="bg-gray-400 p-4 rounded-xl shadow-md cursor-pointer hover:bg-gray-500 transition"
                                onClick={() => handleProductClick(product)}
                            >
                                <p><strong>Nome:</strong> {product.name}</p>
                                <p><strong>EAN:</strong> {product.ean}</p>
                                <p><strong>Preço:</strong> R$ {product.price}</p>
                                <p><strong>Quantidade:</strong> {product.quantity}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-center mt-6 space-x-2">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded-lg font-semibold ${currentPage === index + 1 ? 'bg-red-500 text-white' : 'bg-white text-red-500 border border-red-500'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <p>Nenhum produto cadastrado.</p>
            )}

            {selectedProduct && (
                <div className="fixed top-0 right-0 h-full w-96 bg-gray-300 shadow-2xl p-6 z-50 flex flex-col">
                    <button className="text-2xl text-black ml-2 self-end hover:bg-gray-300 hover:text-gray-500"
                        onClick={handleCloseSidebar}>
                        <FiXCircle size={30} />
                    </button>

                    <h2 className="text-2xl font-bold flex justify-center m-2">Detalhes do Produto</h2>

                    <div className="bg-gray-400 p-4 rounded-xl shadow-md mt-12">
                        <p><strong>Nome:</strong> {selectedProduct.name}</p>
                        <p><strong>EAN:</strong> {selectedProduct.ean}</p>
                        <p><strong>Preço:</strong> R$ {selectedProduct.price}</p>
                        <p><strong>Quantidade:</strong> {selectedProduct.quantity}</p>
                    </div>
                    
                </div>
            )}
        </div>
    );
}
