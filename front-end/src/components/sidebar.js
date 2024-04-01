"use client"; //This is client component

import { Fragment, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

//Next Import
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

//Headless UI
import { Dialog, Menu, Transition, Disclosure, } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

import {
    Bars3Icon,
    ChevronDownIcon,
    HomeIcon,
    UserIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

//Supa base
import { supabase } from '@/utils/supabase';

//Assests
import Logo from "../../public/assets/images/White Logo.png";

//Constant
import { navbarConst } from '@/constant/navbar';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const SideBarMain = ({ children }) => {

    const router = useRouter();
    const currentPage = usePathname();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userName, setUserName] = useState('');


    useEffect(() => {
        let name = window.localStorage.getItem("userName");
        setUserName(name);
    }, [])

    const userNavigation = navbarConst.userNavigation;
    const navigation = navbarConst.navigation;

    navigation.forEach(item => {

        !item.children ? (
            item.current = (item.href === currentPage)
        ) : (
            item.children.forEach((val) => {
                val.current = (val.href === currentPage)
            })
        )
    })

    const signOut = async () => {

        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error("Failed to sign out");
        }
        else {
            window.localStorage.clear();
            router.push('/signin');
        }
    }

    return (
        <>
            {/* Toast */}
            <Toaster />

            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                                <span className="sr-only">{navbarConst.closeSidebar}</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Sidebar component, swap this element with another sidebar if you like */}
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark px-6 pb-4">
                                        <div className="flex h-16 shrink-0 items-center gap-4">
                                            <Image
                                                className="h-8 w-auto"
                                                src={Logo}
                                                alt="Asymtos"
                                            />
                                            <div>
                                                <p className='flex mt-4 text-white text-sm'>V 1.0.0</p>
                                            </div>
                                        </div>

                                        {/* Nav button */}
                                        <nav className="flex flex-1 flex-col">
                                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                                <li>
                                                    <ul role="list" className="-mx-2 space-y-1">
                                                        {navigation.map((item, i) => (
                                                            <li key={i}>
                                                                {!item.children ? (
                                                                    <a
                                                                        href={item.href}
                                                                        className={classNames(
                                                                            item.current
                                                                                ? 'bg-gray-50 text-dark'
                                                                                : 'text-white hover:text-dark hover:bg-gray-50',
                                                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 '
                                                                        )}
                                                                    >
                                                                        <item.icon
                                                                            className={classNames(
                                                                                item.current ? 'text-dark' : 'text-white group-hover:text-dark',
                                                                                'h-6 w-6 shrink-0'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />
                                                                        {item.name}
                                                                    </a>
                                                                ) : (
                                                                    <Disclosure as="div">
                                                                        {({ open }) => (
                                                                            <>
                                                                                <Disclosure.Button
                                                                                    as="a"
                                                                                    //    href={item.href}
                                                                                    className={classNames(
                                                                                        item.current ? 'bg-gray-50 text-dark' : 'text-white hover:text-dark hover:bg-gray-50',
                                                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 '
                                                                                    )}
                                                                                >
                                                                                    <item.icon
                                                                                        className={classNames(
                                                                                            item.current ? 'text-dark' : 'text-white group-hover:text-dark',
                                                                                            'h-6 w-6 shrink-0'
                                                                                        )}
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                    {item.name}
                                                                                    <ChevronRightIcon
                                                                                        className={classNames(
                                                                                            item.current ? '  text-dark' : 'text-gray-50',
                                                                                            open ? "rotate-90 text-dark" : "text-dark",
                                                                                            'ml-auto h-5 w-5 shrink-0 group-hover:text-dark'
                                                                                        )}
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                </Disclosure.Button>
                                                                                <Disclosure.Panel as="ul" className="mt-2 pl-8 space-y-1">
                                                                                    {item.children.map((subItem, i) => (
                                                                                        <li key={i}>
                                                                                            <a
                                                                                                // as="a"
                                                                                                href={subItem.href}
                                                                                                className={classNames(
                                                                                                    subItem.current ? 'bg-gray-50 text-dark' : 'text-white hover:text-dark hover:bg-gray-50',
                                                                                                    'group flex gap-x-3 gap-y-3 rounded-md p-2 text-sm leading-6 flex-end'
                                                                                                )}
                                                                                            >
                                                                                                <subItem.icon
                                                                                                    className={classNames(
                                                                                                        subItem.current ? 'text-dark' : 'text-white group-hover:text-dark',
                                                                                                        'h-6 w-6 shrink-0'
                                                                                                    )}
                                                                                                    aria-hidden="true"
                                                                                                />
                                                                                                {subItem.name}
                                                                                            </a>
                                                                                        </li>
                                                                                    ))}
                                                                                </Disclosure.Panel>
                                                                            </>
                                                                        )}
                                                                    </Disclosure>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop - Hidden*/}
                <div className="hidden lg:inset-y-0 lg:z-50 lg:w-72 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-dark px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center">
                            <Image
                                className="h-10 w-auto"
                                src={Logo}
                                alt="Asymtos"
                            />
                        </div>

                        {/* Nav button */}
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-50 text-dark'
                                                            : 'text-white hover:text-dark hover:bg-gray-50',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 '
                                                    )}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            item.current ? 'text-dark' : 'text-white group-hover:text-dark',
                                                            'h-6 w-6 shrink-0'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className='flex flex-col h-screen'>
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 bg-dark items-center gap-x-4 border-b border-gray-200 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button type="button" className="-m-2.5 p-2.5 text-white" onClick={() => setSidebarOpen(true)}>
                            <span className="sr-only">{navbarConst.openSidebar}</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        <div>
                            <Image
                                className="h-6 w-auto"
                                src={Logo}
                                alt="Asymtos"
                            />
                        </div>

                        {/* Separator */}
                        {/* <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" /> */}

                        <div className="flex flex-1 gap-x-4 self-stretch justify-end lg:gap-x-6">
                            <div className="flex items-center gap-x-4 lg:gap-x-6">

                                {/* Separator */}
                                {/* <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" /> */}

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative">
                                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                        <span className="sr-only">{navbarConst.openUserMenu}</span>
                                        <UserIcon
                                            className="h-8 w-8 p-1 rounded-full bg-gray-50"
                                        />
                                        <span className="hidden lg:flex lg:items-center">
                                            <span className="ml-4 text-sm  leading-6 text-white" aria-hidden="true">
                                                {userName}
                                            </span>
                                            <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-200" aria-hidden="true" />
                                        </span>
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                            {userNavigation.map((item, i) => (
                                                <Menu.Item key={i}>
                                                    {({ active }) => (
                                                        <a
                                                            href={item.href}
                                                            className={classNames(
                                                                active ? 'bg-gray-50' : '',
                                                                'block px-3 py-1  text-sm leading-6 text-gray-900 cursor-pointer'
                                                            )}
                                                            onClick={item.name === "Sign out" ? signOut : ''}
                                                        >
                                                            {item.name}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col h-[92%]'>
                        {children &&
                            <main className='h-[100%]'>
                                <div className='h-[100%]'>
                                    {children}
                                </div>
                            </main>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default SideBarMain;
