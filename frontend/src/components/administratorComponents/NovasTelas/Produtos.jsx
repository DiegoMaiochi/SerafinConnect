import { useState, useEffect } from "react";
import { FiFilter, FiList, FiSearch, FiXCircle } from "react-icons/fi";

export function Produtos() {
    const [showForm, setShowForm] = useState(false);
    const [showGroupOptions, setShowGroupOptions] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [showTypeOptions, setShowTypeOptions] = useState(false);
    const [selectedType, setSelectedType] = useState("");

    const [ean, setEan] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const [productList, setProductList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 18;

    const toggleForm = () => setShowForm(!showForm);

    const groups = [
        "Drinks", "Cervejas", "Vinhos", "Não Alcoólicos", "Porçoes", "Doses", "Garrafas", "Combos"
    ];

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/produtos");
            if (response.ok) {
                const data = await response.json();
                setProductList(data);
            } else {
                console.error("Erro ao buscar produtos.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async () => {
        if (!ean || !name || !price || !quantity) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        if (isNaN(ean) || ean.trim() === "") {
            alert("Código EAN inválido.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/produto/ean/${ean.trim()}`);

            if (response.ok) {
                const data = await response.json();
                const updatedProduct = {
                    ...data,
                    quantity: data.quantity + parseInt(quantity),
                };

                await fetch(`http://localhost:3000/api/produto/ean/${ean.trim()}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedProduct),
                });
                alert("Produto já cadastrado. Quantidade atualizada!");
            } else if (response.status === 404) {
                const newProduct = {
                    ean: ean.trim(),
                    name,
                    description,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    group: selectedGroup,
                    type: selectedType,
                };

                await fetch("http://localhost:3000/api/produto", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newProduct),
                });
                alert("Produto cadastrado com sucesso!");
            } else {
                alert("Erro ao acessar o produto.");
            }

            clearForm();
            toggleForm();
            fetchProducts();
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao processar a requisição.");
        }
    };

    const clearForm = () => {
        setEan("");
        setName("");
        setQuantity("");
        setPrice("");
        setDescription("");
        setSelectedGroup("");
        setSelectedType("");
    };
    
    const totalPages = Math.ceil(productList.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productList.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="m-7">
                <h1 className="text-red-500 font-black text-5xl ">PRODUTOS</h1>
                <h3 className="font-bold">Crie e gerencie os dados de seus produtos.</h3>
                <hr className="border-y-2 w-full mt-2 border-gray-200" />

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
            </div>

            {showForm && (
                <div className="fixed bottom-0 right-0 h-full w-1/3 bg-gray-300 shadow-2xl p-6 rounded-tl-2xl rounded-bl-2xl border-t flex flex-col">
                    <button
                        className="text-2xl text-black ml-2 self-end hover:bg-gray-300 hover:text-gray-500"
                        onClick={toggleForm}
                    >
                        <FiXCircle size={30} />
                    </button>
                    <h2 className="text-2xl font-bold flex justify-center m-2">Adicionar Produto</h2>

                    <div className="mt-12 space-y-2">
                        <input type="number" placeholder="EAN" value={ean} onChange={e => setEan(e.target.value)} className="w-full p-2 border rounded-lg" />
                        <input type="text" placeholder="Nome do Produto" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-lg" />
                        <div className="flex justify-between space-x-2">
                            <input type="number" placeholder="Qtd.:" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full p-2 border rounded-lg" />
                            <input type="number" placeholder="Preço:" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <input type="text" placeholder="Descrição:" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded-lg" />

                        <div className="flex justify-between space-x-2">
                            <div className="relative w-full">
                                <button
                                    onClick={() => setShowGroupOptions(!showGroupOptions)}
                                    className="w-full p-2 border rounded-lg bg-white text-left"
                                >
                                    {selectedGroup || "Selecione um grupo"}
                                </button>
                                {showGroupOptions && (
                                    <ul className="absolute w-full bg-white border rounded-lg mt-1 shadow-lg z-10">
                                        {groups.map((group, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    setSelectedGroup(group);
                                                    setShowGroupOptions(false);
                                                }}
                                                className="p-1 cursor-pointer hover:bg-gray-200"
                                            >
                                                {group}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="relative w-full">
                                <button
                                    onClick={() => setShowTypeOptions(!showTypeOptions)}
                                    className="w-full p-2 border rounded-lg bg-white text-left"
                                >
                                    {selectedType || "Selecione o tipo"}
                                </button>
                                {showTypeOptions && (
                                    <ul className="absolute w-full bg-white border rounded-lg mt-1 shadow-lg z-10">
                                        {["Kg", "Un"].map((type, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    setSelectedType(type);
                                                    setShowTypeOptions(false);
                                                }}
                                                className="p-1 cursor-pointer hover:bg-gray-200"
                                            >
                                                {type}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
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
