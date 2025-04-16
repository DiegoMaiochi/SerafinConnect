import React, { useState } from "react";

export default function ProductList({ products }) {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 18;

    const totalPages = Math.ceil(products.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="bg-gray-200 h-full mt-4 p-4 rounded-2xl">
            {currentProducts.length > 0 ? (
                <>
                    <ul className="grid grid-cols-6 gap-4">
                        {currentProducts.map((product) => (
                            <li key={product.id} className="bg-gray-400 p-4 rounded-xl shadow-md">
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
        </div>
    );
}
