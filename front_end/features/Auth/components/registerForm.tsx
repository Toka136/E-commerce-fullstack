'use client'

import { Mail, Lock, Unlock, User, UploadCloud, X } from 'lucide-react';
import { useFormik } from 'formik';
import { useState, useRef } from 'react';
import { useRegister } from '../hooks/useRegister';
import { registerInputT } from '../types/registerType';
import { registerSchema } from '../schema/registerSchema';

export const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { handleRegister } = useRegister();

    const registerFormik = useFormik<registerInputT>({
        initialValues: {
          userName: '',
          email: '',
          password: '',
          image: null,
        }, 
        validationSchema: registerSchema,
        onSubmit: handleRegister
    });

    // Handle image file selection/processing
    const handleImageFile = (file: File) => {
      if (file && file.type.startsWith('image/')) {
        registerFormik.setFieldValue('image', file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    // Drag and Drop Handlers
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageFile(e.dataTransfer.files[0]);
      }
    };

    const removeImage = () => {
      registerFormik.setFieldValue('image', null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <form className="space-y-5 mt-10" onSubmit={registerFormik.handleSubmit}>
          
          {/* Image Drag & Drop / Select Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageFile(e.target.files[0]);
                }
              }}
            />

            {!imagePreview ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50/30' 
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/30'
                }`}
              >
                <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-xs font-medium text-gray-600 text-center">
                  <span className="text-blue-500 font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, or GIF</p>
              </div>
            ) : (
              <div className="relative flex items-center justify-center w-24 h-24 mx-auto group">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-full ring-2 ring-gray-100"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-md opacity-90 hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {registerFormik.errors.image && registerFormik.touched.image && (
              <span className="text-red-500 text-xs mt-1 block">{String(registerFormik.errors.image)}</span>
            )}
          </div>

          {/* Username Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-300" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="userName"
                id="name"
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                value={registerFormik.values.userName}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-300 bg-gray-50/30 text-sm"
                placeholder="reader_libro"
              />
            </div>
            {registerFormik.errors.userName && registerFormik.touched.userName && (
              <span className="text-red-500 text-xs mt-1 block">{registerFormik.errors.userName}</span>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                value={registerFormik.values.email}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-300 bg-gray-50/30 text-sm"
                placeholder="reader@libro.com"
              />
            </div>
            {registerFormik.errors.email && registerFormik.touched.email && (
              <span className="text-red-500 text-xs mt-1 block">{registerFormik.errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
             
            </div>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer z-10" onClick={() => setShowPassword(!showPassword)}>
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
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-300 bg-gray-50/30 text-sm"
                placeholder="••••••••"
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                value={registerFormik.values.password}
              />
            </div>
            {registerFormik.errors.password && registerFormik.touched.password && (
              <span className="text-red-500 text-xs mt-1 block">{registerFormik.errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#3b59c4] hover:bg-[#2f49aa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Create Account
            </button>
          </div>
        </form>
    );
};