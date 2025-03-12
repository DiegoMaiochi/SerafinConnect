import { useState } from "react";
import { FiCheckSquare, FiHome, FiPackage, FiSettings, FiTag, FiUser } from "react-icons/fi";
import { Dashboard } from "./Dashboard";
import { Usuarios } from "./Usuarios";
import { Produtos } from "./Produtos";
import { Cupons } from "./Cupons";
import { Mesas } from "./Mesas";

export function SideBar() {
    const [activeComponent, setActiveComponent] = useState("Dashboard");

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
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex">
            <div className="bg-gray-200 w-24 h-screen flex flex-col justify-between relative">
                <div className="space-y-5">
                    <FiHome size={50} className="text-red-500 mx-auto mt-4 cursor-pointer" onClick={() => setActiveComponent("Dashboard")} />
                    <FiUser size={50} className="text-red-500 mx-auto cursor-pointer" onClick={() => setActiveComponent("Usuarios")} />
                    <FiPackage size={50} className="text-red-500 mx-auto cursor-pointer" onClick={() => setActiveComponent("Produtos")} />
                    <FiTag size={50} className="text-red-500 mx-auto cursor-pointer" onClick={() => setActiveComponent("Cupons")} />
                    <FiCheckSquare size={50} className="text-red-500 mx-auto cursor-pointer" onClick={() => setActiveComponent("Mesas")} />
                </div>
                <FiSettings size={50} className="text-red-500 mx-auto mb-4" />
            </div>
            <div className="teste w-full">
                {renderComponent()}
            </div>
        </div>
    );
}
