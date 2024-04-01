"use client"; //This is client component

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Ripples from 'react-ripples';
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


const SignIn = () => {

  const router = useRouter();

  const [state, setData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    setData({ ...state, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email: state && state.email ? state.email : '',
      password: state && state.password ? state.password : '',
    });

    if (user && user.id) {

      const name = user.user_metadata ?
        (user.user_metadata.firstName ? user.user_metadata.firstName : '') + (user.user_metadata.lastName ? ' ' + user.user_metadata.lastName : '') : '';

      window.localStorage.setItem(
        "userData",
        JSON.stringify({
          email: user.email,
          uid: user.id,
        })
      );
      window.localStorage.setItem("userName", name);

      toast.success("Signed in successfully");
      router.push("/dashboard")
    }
    else if (error) {
      toast.error("Please check your email and password!");
    }

  }

  return (

    <>
      <Toaster />
      <div className="flex min-h-screen flex-1 flex-col justify-center sm:px-6 lg:px-8">
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
                {signInConst.title}
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

              {/* Forgot password - need to check in supabase */}
              <div className="flex items-center justify-end">

                <div className="text-sm leading-6">
                  <a href='/forgotPassword'
                    className="font-medium text-blue-800 hover:text-blue-600"
                  >
                    {signInConst.forgotPassword}?
                  </a>
                </div>
              </div>

              {/* Button */}
              <div>
              <Ripples className='flex w-full'>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-dark px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-dark-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-600">
                  {signInConst.signinButton}
                </button>
                </Ripples>
              </div>
            </form>
            {/* End of Form */}

            <p className="mt-10 text-center text-sm text-gray-500">
              {signInConst.notMember + '? '}
              <button onClick={() => router.push("/signup")} className="font-medium leading-6 text-blue-800 hover:text-blue-600">
                {signInConst.signupButton}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
export default SignIn; 