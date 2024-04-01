"use client";
//This is client component

//Component
import SideBarMain from "@/components/sidebar";
import DeployEdgeApp from "./deployApp";


const DeployEdgeAppMain = () => {
    return (
        <SideBarMain>
            <div>
                <DeployEdgeApp />
            </div>
        </SideBarMain>
    )
}

export default DeployEdgeAppMain;