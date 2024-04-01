"use client"; //This is client component

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Ripples from 'react-ripples';
//Next Import
import Image from 'next/image';
import { useRouter } from 'next/navigation';

//Icon
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

//Assets
import mypic from '../../../public/assets/images/Blue Logo.png';

//Supa base
import { supabase } from '@/utils/supabase';

//Constant
import { signInConst } from '@/constant/signInConst';

const Signup = () => {

  const router = useRouter();

  const [state, setData] = useState([]);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setData({ ...state, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (state.password === state.confirmPassword) {
      setIsValidPassword(false);


      const { data, error } = await supabase.auth.signUp({
        email: state && state.email ? state.email : '',
        password: state && state.password ? state.password : '',
        options: {
          data: {
            firstName: state && state.firstName ? state.firstName : '',
            lastName: state && state.lastName ? state.lastName : '',
          }
        }
      });


      if (data && data.user && data.user.id) {
        toast.success("Signed up successfully");
        router.push("/signin");
      }
      else if (error) {
        toast.error("Failed to sign up");
      }

    }
    else {
      setIsValidPassword(true);
    }


  }

  return (

    <>
      <Toaster />
      <div className="flex min-h-screen flex-1 flex-col justify-center sm:px-6 lg:px-8">
        <div className="my-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-10 shadow sm:rounded-lg sm:px-12">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              {/* Logo image */}
              <Image
                className="mx-auto h-10 w-auto"
                src={mypic}
                alt="Asymtos"
              />
              {/* Heading */}
              <h2 className="my-4 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
                {signInConst.signUpTitle}
              </h2>
            </div>
            {/* Input form */}
            <form className="space-y-6" method='POST' onSubmit={handleSubmit}>

              <div className='flex'>
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm leading-6 text-gray-900">
                    {signInConst.firstName}
                  </label>
                  <div className="mt-2">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="firstName"
                      required
                      onChange={handleChange}
                      className="block w-11/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm leading-6 text-gray-900">
                    {signInConst.lastName}
                  </label>
                  <div className="mt-2">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="lastName"
                      required
                      onChange={handleChange}
                      className="block w-11/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

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
                    onChange={handleChange}
                    required
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

              {/* Confirm password */}
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
              <Ripples className='flex w-full'>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-dark px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  {signInConst.signupButton}
                </button>
                </Ripples>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              {signInConst.alreadyHaveAcc + '? '}
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

export default Signup;