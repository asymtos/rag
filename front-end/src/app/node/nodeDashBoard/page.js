"use client"; //This is client component

//Component
import SideBarMain from "@/components/sidebar";
import NodeDashboardChart from "./nodeDashboard";


const NodeDashboardMain = () => {
    return (
        <div className="h-[100%]">
            <SideBarMain>
                <div className="h-[100%]">
                    <NodeDashboardChart />
                </div>
            </SideBarMain>
        </div>
    )
}

export default NodeDashboardMain;
