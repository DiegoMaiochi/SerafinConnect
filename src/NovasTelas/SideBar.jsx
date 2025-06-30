import { useState } from "react";
import {
    FiGrid,
    FiPackage,
    FiTag,
    FiUser,
    FiLogOut,
    FiArchive
} from "react-icons/fi";
import { GrUserWorker } from "react-icons/gr";

import { Dashboard } from "./dashboard/Dashboard";
import { Usuarios } from "./usuarios/Usuarios";
import { Produtos } from "./produtos/Produtos";
import { Cupons } from "./cupons/Cupons";
import { Funcionarios } from "./employee/Funcionarios";
import { Mesas } from "./mesas/Mesas";
import { authService } from "../services/authService";
import { Estoque } from "./Stock/stock";
import { MdOutlineSpaceDashboard } from "react-icons/md";

export function SideBar() {
    const [activeComponent, setActiveComponent] = useState("Dashboard");

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case "Dashboard":
                return <Dashboard />;
            case "Usuarios":
                return <Usuarios />;
            case "Produtos":
                return <Produtos />;
            case "Cupons":
                return <Cupons />;
            case "Mesas":
                return <Mesas />;
            case "Estoque":
                return <Estoque />;
            case "Funcionarios":
                return <Funcionarios />;
            default:
                return <Dashboard />;
        }
    };

    const menuItemClass = (component) =>
        activeComponent === component
            ? "flex items-center gap-3 p-2 rounded-md bg-blue-400/20 text-blue-600 font-medium cursor-pointer"
            : "flex items-center gap-3 p-2 rounded-md text-gray-700 hover:text-blue-600 cursor-pointer";

    const iconClass = (component) =>
        activeComponent === component ? "text-blue-600" : "text-gray-600";

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <div className="bg-gray-100 w-60 py-6 px-4">
                <div className="flex flex-col h-full justify-between">
                    <div className="space-y-7">
                        {/* Visão Geral */}
                        <div className="space-y-2">
                            <p className="text-gray-500 text-sm font-bold mt-2 mb-2 px-1">Visão Geral</p>
                            <div className={menuItemClass("Dashboard")} onClick={() => setActiveComponent("Dashboard")}>
                            <MdOutlineSpaceDashboard size={22} className={iconClass("Dashboard")} />
                            <span>Pedidos</span>
                            </div>
                        </div>

                        {/* Pessoas */}
                        <div className="space-y-2">
                            <p className="text-gray-500 text-sm font-bold mt-5 mb-2 px-1">Pessoas</p>
                            <div className={menuItemClass("Usuarios")} onClick={() => setActiveComponent("Usuarios")}>
                            <FiUser size={22} className={iconClass("Usuarios")} />
                            <span>Clientes</span>
                            </div>
                            <div className={menuItemClass("Funcionarios")} onClick={() => setActiveComponent("Funcionarios")}>
                            <GrUserWorker size={22} className={iconClass("Funcionarios")} />
                            <span>Funcionários</span>
                            </div>
                        </div>

                        {/* Gerenciamento */}
                        <div className="space-y-2">
                            <p className="text-gray-500 text-sm font-bold mt-5 mb-2 px-1">Gerenciamento</p>
                            <div className={menuItemClass("Cupons")} onClick={() => setActiveComponent("Cupons")}>
                            <FiTag size={22} className={iconClass("Cupons")} />
                            <span>Cupons</span>
                            </div>
                            <div className={menuItemClass("Mesas")} onClick={() => setActiveComponent("Mesas")}>
                            <FiGrid size={22} className={iconClass("Mesas")} />
                            <span>Mesas</span>
                            </div>
                            <div className={menuItemClass("Produtos")} onClick={() => setActiveComponent("Produtos")}>
                            <FiPackage size={22} className={iconClass("Produtos")} />
                            <span>Produtos</span>
                            </div>
                            <div className={menuItemClass("Estoque")} onClick={() => setActiveComponent("Estoque")}>
                            <FiArchive size={22} className={iconClass("Estoque")} />
                            <span>Estoque</span>
                            </div>
                        </div>
                        </div>


                    <div className="mt-6">
                        <div
                            className="flex items-center gap-3 p-2 rounded-md text-gray-700 hover:text-blue-600 cursor-pointer"
                            onClick={handleLogout}
                        >
                            <FiLogOut size={22} className="text-gray-600 hover:text-blue-600" />
                            <span className="hover:text-blue-600">Sair</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white">
                {renderComponent()}
            </div>
        </div>
    );
}
