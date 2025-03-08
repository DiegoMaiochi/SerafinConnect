import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiPackage } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { Dashboard } from "./Dashboard";
import { Usuarios } from "./Usuario";

export function SideBar(){
    return(
        <div className="flex">
            <div className="bg-gray-200 w-20 h-screen flex flex-col justify-between relative">
                <div className="space-y-4">
                    <FiHome size={50} className=" text-red-500 mx-auto mt-4"/>
                    <FiUser size={50} className=" text-red-500 mx-auto"/>
                    <FiPackage size={50} className=" text-red-500 mx-auto"/>
                </div>
                <FiSettings size={50} className=" text-red-500 mx-auto mb-4"/>
            </div>
            <div className="w-full">
                {/* para visualizar a página do dashboard basta substituir o arquivo Usuarios para o arquivo Dashboard */}
                <Usuarios/>
            </div>
        </div>
    )
}