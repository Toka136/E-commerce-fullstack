'use client'
import { Mail, Lock, Unlock } from 'lucide-react';
import { loginInputT } from '../types/loginType';
import { loginSchema } from '../schema/loginSchema';
import { useLogin } from '../hooks/useLogin';
import { useFormik } from 'formik';
import { useState } from 'react';
export const LoginForm=()=>{
    const [showPassword, setShowPassword] = useState(false);
    const {handleLogin}=useLogin()
    const loginFrmik=useFormik<loginInputT>({
        initialValues: {
          email: '',
          password: '',
        }, 
        validationSchema: loginSchema,
        onSubmit: handleLogin
    })
    return(
        <form className="space-y-6 mt-10" onSubmit={loginFrmik.handleSubmit}>
          {/* Email Field */}
          <div>
            <label htmlFor="email"  className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-300" aria-hidden="true" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
               onChange={loginFrmik.handleChange}
                value={loginFrmik.values.email}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-300 bg-gray-50/30"
                placeholder="reader@libro.com"
              />
            </div>
              {loginFrmik.errors.email && <span className="text-red-500 text-s mt-20">{loginFrmik.errors.email}</span>}

          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-500 hover:text-blue-600 text-xs">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                   <Unlock className="h-5 w-5 text-gray-300" aria-hidden="true" />
                ) : (
                  <Lock className="h-5 w-5 text-gray-300" aria-hidden="true" />
                 
                )}
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-300 bg-gray-50/30"
                placeholder="••••••••"
                onChange={loginFrmik.handleChange}
                value={loginFrmik.values.password}
              />
              {loginFrmik.errors.password && loginFrmik.touched.password && <span className="text-red-500 text-xs">{loginFrmik.errors.password}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#3b59c4] hover:bg-[#2f49aa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </form>
    )
}