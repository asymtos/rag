"use client"; //This is client component

//Component
import Dashboard from "./dashboard";
import SideBarMain from "../../components/sidebar";


const DashboardMain = () => {
    return (
        <SideBarMain>
            <div className="bg-gray-100">
                <Dashboard />

            </div>
        </SideBarMain>
    )
}

export default DashboardMain;