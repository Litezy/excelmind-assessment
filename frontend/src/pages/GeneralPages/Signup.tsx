import { Brain, Eye, EyeOff } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import RoleDropdown from '../../components/RoleDropDown';
import { CookieName, ErrorMessage, handleApiError, SuccessMessage, UserRoles, validatePassword } from '../../utils/pageUtils';
import { Apis, PostApi } from '../../services/API';
import Cookies from 'js-cookie'
import { decodeToken } from 'react-jwt'
import ModalLayout from '../../shared/ModalLayout';
import Loader from '../../components/Loader';


interface formprops {
  email: string;
  password: string;
  confirm_password: string;
  role: string
}
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<formprops>({
    email: "", password: '', confirm_password: "", role: ''
  })

  const [loading, setLoading] = useState(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate()
  const roles = [
    'student', 'lecturer', 'admin'
  ]
  const [role, setRole] = useState('');



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.email || !form.password || !form.role || !form.confirm_password) {
      ErrorMessage("Please fill all fields")
      return;
    }
    if (form.confirm_password !== form.password) {
      ErrorMessage('Password mismatch(s)')
      return;
    }
    const error = validatePassword(form.password);
    if (error) {
      ErrorMessage(error);
      return;
    }
    const formdata = {
      email: form.email,
      password: form.password,
      role: form.role,
    }
    setLoading(true)
    try {
      const response = await PostApi(Apis.auth.register, formdata)
      if (response.status !== 201) {
        handleApiError(response)
      }
      await new Promise((res) => setTimeout(res, 2000))
      Cookies.set(CookieName, response.token, { path: '/' });
      const decoded: any = decodeToken(response.token)
      const findRole = UserRoles.find(item => item.role === decoded.role)
      if (findRole) return navigate(`${findRole.url}`)
      SuccessMessage(response.message)
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (role.trim() !== "") {
      setForm({ ...form, role: role })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, setRole])



  return (
    <div className="lg:min-h-screen py-5  bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center lg:py-4 px-4">

      {loading &&
        <ModalLayout modalclass={`w-11/12 mx-auto`} setModal={setLoading}>
          <div className=""><Loader /></div>
        </ModalLayout>
      }
      <div className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ExcelMind</h1>
          <p className="text-gray-600">Sign up and have an account today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name='email'
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 pr-12"
              placeholder="Enter your email"
            />
          </div>
          <RoleDropdown roles={roles} selectedRole={role} onChange={setRole} />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name='confirm_password'
                value={form.confirm_password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>


          <div className="space-y-3">
            <button
              type="submit"
              className={` ${loading ? "bg-blue-200 cursor-not-allowed" : 'cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600'} w-full  text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200  `}>
              {loading ? '...please wait ' : 'Sign Up'}
            </button>

          </div>
        </form>

        <div className="mt-8 w-full text-center ">
          <p className="text-sm text-gray-600">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium ml-1">Sign in</span>
          </p>
        </div>
        <div className="mt-3 w-full text-center ">
          <p className="text-sm text-gray-600">
            Go back
            <span
              onClick={() => navigate("/")}
              className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium ml-1">Home</span>
          </p>
        </div>
      </div>
    </div>
  );

}

export default Signup