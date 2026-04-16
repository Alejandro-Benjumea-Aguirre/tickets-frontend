import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Select from '../../components/ui/Select';
import { getRoles } from '../../services/roles.service';
import { getDepartments } from '../../services/departments.service';
import { getAllCampus } from '../../services/campus.service';
import { Option } from '../../types/components.types';
import Swal from 'sweetalert2';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [rol_id, setRol] = useState<number>(0);
  const [department_id, setDepartment] = useState<number>(0);
  const [campus_id, setCampus] = useState<number>(0);
  const [optionsRoles, setOptionsRoles] = useState<Option[]>([]);
  const [optionsDepartments, setOptionsDepartments] = useState<Option[]>([]);
  const [optionsCampus, setOptionsCampus] = useState<Option[]>([]);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRoles = await getRoles();
        setOptionsRoles((responseRoles.data.body ?? []).map((r) => ({ value: r.id, label: r.name })));

        const responseDepartments = await getDepartments();
        setOptionsDepartments((responseDepartments.data.body ?? []).map((d) => ({ value: d.id, label: d.name })));

        const responseCampus = await getAllCampus();
        setOptionsCampus((responseCampus.data.body ?? []).map((c) => ({ value: c.id, label: c.name })));
      } catch {
        Swal.fire({ title: 'Error', text: 'No se pudieron cargar los datos del formulario.', icon: 'error', confirmButtonColor: '#1D9E75' });
      }
    };

    fetchData();
  }, []);

  const handleSelectRol = (value: string | number) => {
    setRol(Number(value));
  };

  const handleSelectDepartment = (value: string | number) => {
    setDepartment(Number(value));
  };

  const handleSelectCampus = (value: string | number) => {
    setCampus(Number(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (authContext && authContext.registerUser) {
      try {
        await authContext.registerUser({ email, password, name, username, rol_id, department_id, campus_id });
        navigate('/login');
      } catch {
        Swal.fire({ title: 'Error', text: 'No se pudo crear el usuario. Intenta de nuevo.', icon: 'error', confirmButtonColor: '#1D9E75' });
      }
    }
  };

  return (
    <div className="flex w-full bg-teal-100 h-screen justify-center items-center">
      <form onSubmit={handleSubmit} className='w-[400px]'>
        <h2 className="text-3xl font-medium text-gray-600 dark:text-white mb-6 text-center">Crear Usuario</h2>
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Nombre:
          </label>
          <input
            type="text"
            className="block w-full p-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-xs focus:ring-blue-200
                focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Username:
          </label>
          <input
            type="text"
            className="block w-full p-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-xs focus:ring-blue-200
                focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Email:
          </label>
          <input
            type="email"
            className="block w-full p-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-xs focus:ring-blue-200
                focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="rol" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Rol:
          </label>
          <Select
            options={optionsRoles}
            selectedValue={rol_id}
            onChange={handleSelectRol}
          />
        </div>
        <div>
          <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Departamento:
          </label>
          <Select
            options={optionsDepartments}
            selectedValue={department_id}
            onChange={handleSelectDepartment}
          />
        </div>
        <div>
          <label htmlFor="campus" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Campo:
          </label>
          <Select
            options={optionsCampus}
            selectedValue={campus_id}
            onChange={handleSelectCampus}
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Contraseña:
          </label>
          <input
            type="password"
            className="block w-full p-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-xs focus:ring-blue-200
                focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='flex justify-center items-center'>
          <button type="submit"
                  className="px-2 py-2 text-sm w-[180px] font-semibold text-center text-white bg-blue-700 rounded-lg
                  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600
                  dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2">
            Crear Usuario
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
