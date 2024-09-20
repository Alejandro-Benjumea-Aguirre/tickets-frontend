import Swal from 'sweetalert2'

import { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (authContext && authContext.loginUser) {
      try {
        await authContext.loginUser(email, password);
        navigate('/dashboard');
      } catch (error) {
        console.log('Error: ', error)
        Swal.fire({
          title: "¡Error!?",
          text: "Se presento un error al momento de iniciar sesión.",
          icon: "warning"
        });
      }
    }
  };

  return (
    <div className="flex w-full bg-teal-100 h-screen justify-center items-center">
      <form onSubmit={handleSubmit} className='w-[400px]'>
        <h2 className="text-3xl font-medium text-gray-600 dark:text-white mb-4 text-center">
          Iniciar Sesión
        </h2>
        <div>
          <label htmlFor="username" 
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Username:
          </label>
          <input type="text" 
                className="block w-full p-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-xs focus:ring-blue-200 
                focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required />
        </div>
        <div>
          <label htmlFor="password" 
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Contraseña
          </label>
          <input
            type="password"
            className="block w-full p-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-xs focus:ring-blue-200 
                focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='flex justify-center items-center'>
          <button type="submit" 
                  className="px-2 py-2 text-sm w-[180px] font-semibold text-center text-white bg-blue-700 rounded-lg 
                  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
                  dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Iniciar Sesión
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
