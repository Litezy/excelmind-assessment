import { Brain, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CookieName, ErrorMessage, handleApiError, SuccessMessage, UserRoles } from '../../utils/pageUtils';
import { Apis, PostApi } from '../../services/API';
import Cookies from 'js-cookie'
import { decodeToken } from 'react-jwt'
import Loader from '../../components/Loader';
import ModalLayout from '../../shared/ModalLayout';

interface formprops {
    email: string;
    password: string;
}
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState<formprops>({
        email: "", password: '',
    })

    const [loading, setLoading] = useState(false)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!form.email || !form.password) {
            ErrorMessage("Please enter yout email and password")
        }
        const formdata = {
            email: form.email,
            password: form.password
        }

        setLoading(true)
        try {
            const response = await PostApi(Apis.auth.login, formdata)
            if (response.status !== 200) {
                handleApiError(response)
            }
            await new Promise((res) => setTimeout(res, 2000))
            Cookies.set(CookieName, response.token, { path: '/' });
            const decoded: any = decodeToken(response.token)
            console.log(decoded)
            const findRole = UserRoles.find(item => item.role === decoded.role)
            if (findRole) return navigate(`${findRole.url}`)
            SuccessMessage(response.message)
        } catch (error) {
            handleApiError(error)
        } finally {
            setLoading(false)
        }

    }
    const navigate = useNavigate()
    return (
        <div className="lg:min-h-screen py-5 lg:py-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">

            {loading &&
                <ModalLayout modalclass={`${loading && 'h-screen overflow-hidden'} w-11/12 mx-auto`} setModal={setLoading}>
                    <div className=""><Loader /></div>
                </ModalLayout>
            }
            <div className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-xl border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ExcelMind</h1>
                    <p className="text-gray-600">Sign in to your learning platform</p>
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

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                name='password'
                                value={form.password}
                                onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 pr-12"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="submit"

                            className={`
                                ${loading ? "bg-blue-200 cursor-not-allowed" : 'cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600'}
                                w-full  text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 `}
                        >
                            {loading ? '...please wait' : 'Sign In'}
                        </button>

                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?
                        <span
                            onClick={() => navigate('/signup')}
                            className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium ml-1">Sign up</span>
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

export default Login