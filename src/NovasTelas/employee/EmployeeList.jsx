import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { getAccessToken } from "../../utils/tokenStorage";
import Swal from "sweetalert2";

export default function EmployeeList({ employees, onUpdateEmployee }) {
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editData, setEditData] = useState({});
  const token = getAccessToken();

  const startEdit = (employee) => {
    setEditingEmployee(employee.id);
    setEditData({
      name: employee.name,
      document: employee.document,
    });
  };

  const cancelEdit = () => {
    setEditingEmployee(null);
    setEditData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/funcionario/${editingEmployee}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    });

    if (response.ok) {
      const updated = await response.json();
      onUpdateEmployee(updated); // prop do componente pai
      cancelEdit();

      // Sucesso
      Swal.fire({
        icon: "success",
        title: "Funcionário atualizado!",
        text: `Dados de ${updated.name} foram salvos com sucesso.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      const err = await response.json();
      Swal.fire({
        icon: "error",
        title: "Erro ao salvar",
        text: err?.error || "Não foi possível atualizar os dados.",
      });
    }
  } catch (error) {
    console.error("Erro ao salvar:", error);
    Swal.fire({
      icon: "error",
      title: "Erro inesperado",
      text: "Não foi possível atualizar o funcionário.",
    });
  }
};


  return (
    <div className="mt-8 px-10">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-bold">Nome</th>
            <th className="px-4 py-3 text-left text-sm font-bold">Documento</th>
            <th className="px-4 py-3 text-center text-sm font-bold">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr key={employee.id}>
              {editingEmployee === employee.id ? (
                <>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="document"
                      value={editData.document}
                      onChange={handleChange}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button onClick={handleSave} className="text-green-600 font-bold">
                      Salvar
                    </button>
                    <button onClick={cancelEdit} className="text-red-500 font-bold">
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-2">{employee.name}</td>
                  <td className="px-4 py-2">{employee.document}</td>
                  <td className="px-4 py-2 text-center">
                    <FiEdit
                      size={20}
                      className="inline text-blue-500 cursor-pointer"
                      onClick={() => startEdit(employee)}
                    />
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
