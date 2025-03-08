import { FiFilter, FiList, FiSearch } from "react-icons/fi";

export function Dashboard(){
    return(
        <div className="m-7">
            <div>
                <h1 className="text-red-500 font-black text-5xl mt-4">DASHBOARD</h1>
                <h3 className="font-bold">Olá, Seja Bem Vindo!</h3>
                <hr className="border-y-2 w-full mt-2 border-gray-200"/>
            </div>
            <div className="flex mt-4 ml-10">
                <div className="bg-gray-200 w-4/5 p-1 rounded-2xl">
                    <FiSearch size={25} className="text-red-500 ml-2"/>
                </div>
                <div>
                    <FiFilter size={25} className="text-red-500 mt-1 ml-2"/>
                </div>
                <div>
                    <FiList size={25} className="text-red-500 mt-1 ml-2"/>
                </div>
                <div>
                    <h1 className="bg-green-400 p-1 pl-4 pr-4 rounded-2xl font-bold ml-4">+ADICIONAR</h1>
                </div>
            </div>

            {/*A altura da área onde os pedidos são apresentados muda conforme os pedidos aparecem*/}
            {/*Preciso validar como deixar a altura fixa
                - Validar como trazer os pedidos;
                - Validar quantos pedidos serão apresentados e como serão apresentados;            
            */}

            <div className="bg-gray-200 h-auto mt-4 p-8 rounded-2xl flex justify-evenly relative">
                <div className="bg-gray-400 h-16 p-4 pl-7 pr-7 rounded-3xl font-bold text-lg">
                    <h1>FINALIZADOS: </h1>
                </div>

                <div className="border-l-2 border-gray-600"></div>
                
                <div className="bg-gray-400 h-16 p-4 pl-7 pr-7 rounded-3xl font-bold text-lg">
                    <h1>FINALIZADOS: </h1>
                </div>
            </div>
        </div>
    )
}