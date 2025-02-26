import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiPackage } from "react-icons/fi";

export function SideBar(){
    return(
        <div>
            <div>
                <div>
                    <FiHome size={24} color="black" />
                    <FiUser size={24} color="black" />
                    <FiPackage size={24} color="black" />
                </div>
            </div>
        </div>
    )
}