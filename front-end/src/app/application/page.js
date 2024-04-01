"use client"; //This is client component

//Component
import SideBarMain from "../../components/sidebar";
import ApplicationDashboard from "./applicationDashboard";


const ApplicationDashboardMain = () => {
    return (
        <SideBarMain>
            <div>
                <ApplicationDashboard />
            </div>
        </SideBarMain>
    )
}

export default ApplicationDashboardMain;