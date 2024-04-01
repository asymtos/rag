import { CloudIcon, ComputerDesktopIcon, HomeIcon, RocketLaunchIcon, StarIcon, ViewfinderCircleIcon, WindowIcon } from "@heroicons/react/24/outline";

export const navbarConst = {
    closeSidebar: "Close sidebar",
    openSidebar: "Open sidebar",
    openUserMenu: "Open user menu",
    navigation: [
        { name: 'User Dashboard', href: '/dashboard', icon: HomeIcon, current: false },
        { name: 'Compute Resource', href: '/node', icon: CloudIcon, current: false },
        {
            name: 'Application', href: '/application', icon: WindowIcon, current: false,
            children: [
                { name: 'Provision', href: '/application', icon: ComputerDesktopIcon, current: false },
                { name: 'Deploy', href: '/appInstance', icon: RocketLaunchIcon, current: false },
                { name: 'AI Solution Engine', href: '/MLOps', icon: ViewfinderCircleIcon, current: false },
                { name: 'RAG Pipeline', href: '/Pipeline', icon: StarIcon, current: false },
            ],
        },
    ],
    userNavigation: [
        // { name: 'Your profile', href: '#' },
        { name: 'Sign out', },
    ],
}