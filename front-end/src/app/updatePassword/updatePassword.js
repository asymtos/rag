"use client"; //This is client component

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

//Next import
import Image from 'next/image'
import { useRouter } from 'next/navigation';

//Supa base
import { supabase } from '@/utils/supabase';

//Icon
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

//Assets
import mypic from '../../../public/assets/images/Blue Logo.png';

//Constant
import { signInConst } from '@/constant/signInConst';

const UpdatePassword = () => {

    const router = useRouter();
    const [state, setData] = useState([]);
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        let userData = window.localStorage.getItem("userData");
        let obj = userData ? JSON.parse(userData) : {};

        if (Object.keys(obj).length != 0) {
            router.push('/dashboard');
        }

    }, [])

    const handleChange = (e) => {
        setData({ ...state, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (state.password === state.confirmPassword) {

            setIsValidPassword(false);

            const { data: { user }, error } = await supabase.auth.updateUser(
                { password: state && state.password ? state.password : '' }
            );

            if (user) {

                toast.success("Password updated successfully");
                router.push("/signin")
            }
            else if (error) {
                toast.error("Failed to update password");
            }
        }
        else {
            setIsValidPassword(true);
        }

    }

    return (

        <>
            <Toaster />
            <div className="flex min-h-full flex-1 flex-col justify-center sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">

                            {/* Logo image */}
                            <Image
                                className="mx-auto h-10 w-auto"
                                src={mypic}
                                alt="Asymtos"
                            />

                            {/* Heading */}
                            <h2 className="my-4 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
                                {signInConst.updatePasswordTitle}
                            </h2>
                        </div>

                        {/* Form */}
                        <form className="space-y-6" method='POST' onSubmit={handleSubmit}>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm leading-6 text-gray-900">
                                    {signInConst.password}
                                </label>
                                <div className="mt-2 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                    />

                                    <div className=" absolute inset-y-0 right-0 flex items-center pr-3">
                                        <div onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? (
                                                <EyeSlashIcon className='h-5 w-5' />
                                            ) : (

                                                <EyeIcon className='h-5 w-5' />
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm leading-6 text-gray-900">
                                    {signInConst.confirmPassword}
                                </label>
                                <div className="mt-2 relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                    />

                                    <div className=" absolute inset-y-0 right-0 flex items-center pr-3">
                                        <div onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? (
                                                <EyeSlashIcon className='h-5 w-5' />
                                            ) : (

                                                <EyeIcon className='h-5 w-5' />
                                            )}
                                        </div>
                                    </div>

                                    {isValidPassword}
                                    {isValidPassword &&
                                        <span className="text-sm text-red-500">{"Password does not match"}</span>
                                    }
                                </div>
                            </div>

                            {/* Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-dark px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-dark-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-600">
                                    {signInConst.updatePasswordButton}
                                </button>
                            </div>
                        </form>
                        {/* End of Form */}

                    </div>
                </div>
            </div>
        </>
    )
}
export default UpdatePassword; 