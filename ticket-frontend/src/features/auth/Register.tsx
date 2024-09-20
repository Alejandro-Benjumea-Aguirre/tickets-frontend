import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import Select from '../../components/Select';
/* import { getRoles } from '../../services/roles';
import { getDepartments } from '../../services/departments';
import { getCampus } from '../../services/campus'; */

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [rol, setRol] = useState<string | number>('');
  const [depatment, setDepartment] = useState<string | number>('');
  const [campus, setCampus] = useState<string | number>('');
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

/*   const responseRoles = await getRoles();
  const optionsRoles = await responseRoles.data;

  const responseDepatments = await getDepartments();
  const optionsDepartments = await responseDepatments.data;

  const responseCampus = await getCampus();
  const optionsCampus = await responseCampus.data; */

  const optionsRoles = [
    { value: '', label: 'Seleccionar' },
    { value: '1', label: 'Administrador' },
    { value: '2', label: 'Empleado' },
    { value: '3', label: 'cliente' }
  ];

  const optionsDepartments = [
    { value: '', label: 'Seleccionar' },
    { value: '1', label: 'Cliente' },
    { value: '2', label: 'Desarrollo' },
    { value: '3', label: 'Mesa de ayuda' }
  ];

  const optionsCampus = [
    { value: '', label: 'Seleccionar' },
    { value: '1', label: 'Cafam' },
    { value: '2', label: 'PANA' },
    { value: '3', label: 'Magisterio' }
  ];

  const handleSelectRol = (value: string | number) => {
    setRol(value);
  };

  const handleSelectDepartment = (value: string | number) => {
    setDepartment(value);
  };

  const handleSelectCampus = (value: string | number) => {
    setCampus(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(authContext && authContext.registerUser) {
      try {
        await authContext.registerUser();
        navigate('/login');
      } catch (error) {
        console.error('Error al registrar:', error);
      }
    }
  };

  return (
    <div className="flex w-full bg-teal-100 h-screen justify-center items-center">
      <form onSubmit={handleSubmit} className='w-[400px]'>
        <h2 className="text-3xl font-medium text-gray-600 dark:text-white mb-6 text-center">Crear Usuario</h2>
        <div>
          <label htmlFor="name" 
                 className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Nombre:
          </label>
          <input
            type="text"
            className="block w-full p-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-xs focus:ring-blue-200 
                focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required/>
        </div>
        <div>
          <label htmlFor="name" 
                 className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Username:
          </label>
          <input
            type="text"
            className="block w-full p-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-xs focus:ring-blue-200 
                focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required/>
        </div>
        <div>
          <label htmlFor="email" 
                 className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
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
          <label htmlFor="rol" 
                 className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Rol:
          </label>
          <Select
            options={optionsRoles}
            selectedValue={rol}
            onChange={handleSelectRol}
          />
        </div>
        <div>
          <label htmlFor="department" 
                 className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Departamento:
          </label>
          <Select
            options={optionsDepartments}
            selectedValue={depatment}
            onChange={handleSelectDepartment}
          />
        </div>
        <div>
          <label htmlFor="capus" 
                 className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Campo:
          </label>
          <Select
            options={optionsCampus}
            selectedValue={campus}
            onChange={handleSelectCampus}
          />
        </div>
        <div>
          <label htmlFor="pasword" 
                 className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
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

export default Register;
