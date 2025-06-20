import { useState } from "react";
import { FiEdit, FiEye } from "react-icons/fi";
import { getAccessToken } from "../../utils/tokenStorage";

export default function EmployeeList({ employees, onUpdateEmployee }) {
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (employee) => {
    setEditingEmployee(employee.id);
    setEditData({ ...employee });
  };
  const token = getAccessToken()
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
        onUpdateEmployee(updated);
        cancelEdit();
      } else {
        alert("Erro ao atualizar funcionário.");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <div className="mt-8 px-10">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-bold">Nome</th>
            <th className="px-4 py-3 text-left text-sm font-bold">Documento</th>
            <th className="px-4 py-3 text-left text-sm font-bold">Telefone</th>
            <th className="px-4 py-3 text-left text-sm font-bold">E-mail</th>
            <th className="px-4 py-3 text-left text-sm font-bold">Cargo</th>
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
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="phone"
                      value={editData.phone}
                      onChange={handleChange}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="role"
                      value={editData.role}
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
                  <td className="px-4 py-2">{employee.phone}</td>
                  <td className="px-4 py-2">{employee.email}</td>
                  <td className="px-4 py-2">{employee.role}</td>
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
