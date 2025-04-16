import { useState } from "react";
import { FiGrid, FiHome, FiPackage, FiSettings, FiTag, FiUser } from "react-icons/fi";
import { Dashboard } from "./Dashboard";
import { Usuarios } from "./Usuarios";
import { Produtos } from "./produtos/Produtos";
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

    const getIconClass = (component) =>
        activeComponent === component
            ? "bg-red-500 text-white p-2 rounded-md transition-colors duration-300 ease-in-out"
            : "text-red-500 hover:bg-gray-300 p-2 rounded-md transition-colors duration-300 ease-in-out";

    return (
        <div className="flex">
            <div className="bg-gray-200 w-24 h-screen flex flex-col justify-between relative">
                <div className="space-y-5">
                    <FiHome size={60} className={`mx-auto mt-4 cursor-pointer ${getIconClass("Dashboard")}`} onClick={() => setActiveComponent("Dashboard")} />
                    <FiUser size={60} className={`mx-auto cursor-pointer ${getIconClass("Usuarios")}`} onClick={() => setActiveComponent("Usuarios")} />
                    <FiPackage size={60} className={`mx-auto cursor-pointer ${getIconClass("Produtos")}`} onClick={() => setActiveComponent("Produtos")} />
                    <FiTag size={60} className={`mx-auto cursor-pointer ${getIconClass("Cupons")}`} onClick={() => setActiveComponent("Cupons")} />
                    <FiGrid size={60} className={`mx-auto cursor-pointer ${getIconClass("Mesas")}`} onClick={() => setActiveComponent("Mesas")} />
                </div>
                <FiSettings size={60} className="text-red-500 mx-auto mb-4" />
            </div>
            <div className="w-full">
                {renderComponent()}
            </div>
        </div>
    );
}
