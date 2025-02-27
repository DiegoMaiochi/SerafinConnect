import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiPackage } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";

export function SideBar(){
    return(
        <div>
            <div>
                <div>
                    <FiHome size={50} color="#E6523A" />
                    <FiUser size={50} color="#E6523A" />
                    <FiPackage size={50} color="#E6523A" />
                    <FiSettings size={50} color="#E6523A" />
                </div>
            </div>
        </div>
    )
}