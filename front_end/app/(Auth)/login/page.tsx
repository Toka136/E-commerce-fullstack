import { LoginForm } from "@/features/Auth/components/loginForm";

export default function LoginPage() {
  return (
    <div className=" bg-[#f8fafc] flex flex-col justify-between items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top Header Section */}
      <div className="w-full max-w-md text-center mt-8 mb-8">
        <h1 className="text-2xl font-bold text-[#3b82f6]">LibroDiscovery</h1>
        <p className="mt-1 text-sm text-gray-500">
          Reconnect with your next favorite chapter.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 my-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-400 mt-1">
            Please enter your details to sign in
          </p>
        </div>

        <LoginForm />
      </div>

      {/* Footer Section */}
      <div className="w-full max-w-md text-center text-sm text-gray-500 mb-4 mt-8">
        Don't have an account?{' '}
        <a href="/register" className="font-medium text-blue-500 hover:text-blue-600">
          Create an Account
        </a>
      </div>
    </div>
  );
}