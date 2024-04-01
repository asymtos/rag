"use client"; //This is client component

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

//Next import
import Image from 'next/image'
import { useRouter } from 'next/navigation';

//Supa base
import { supabase } from '@/utils/supabase';

//Assets
import mypic from '../../../public/assets/images/Blue Logo.png';

//Constant
import { signInConst } from '@/constant/signInConst';

//Environment
import { devConfig } from '@/environment/devlopment';


const ForgotPassword = () => {

    const router = useRouter();
    const envConfig = devConfig;
    const [state, setData] = useState([]);


    const handleChange = (e) => {
        setData({ ...state, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let email = state && state.email ? state.email : '';
        const { data, error } = await supabase.auth.resetPasswordForEmail(email,
            {
                redirectTo: `${envConfig.siteUrl}/updatePassword`
            });

        if (data) {
            toast.success("Reset password url sent to your mail");
        }
        else if (error) {
            toast.error("Failed to sent reset password url");
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
                                {signInConst.forgotPassword}
                            </h2>
                        </div>

                        {/* Form */}
                        <form className="space-y-6" method='POST' onSubmit={handleSubmit}>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm leading-6 text-gray-900">
                                    {signInConst.email}
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-dark px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-dark-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-600">
                                    {signInConst.submit}
                                </button>
                            </div>
                        </form>
                        {/* End of Form */}

                        <p className="mt-10 text-center text-sm text-gray-500">
                            {signInConst.backTo + ' '}
                            <button onClick={() => router.push("/signin")} className="font-medium leading-6 text-blue-800 hover:text-blue-600">
                                {signInConst.signinButton}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ForgotPassword; 