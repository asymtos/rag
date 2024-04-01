"use client"; //This is client component

//Component
import NodeMaster from "./nodeMaster";
import SideBarMain from "../../components/sidebar";


const NodeMasterMain = () => {
    return (

        <SideBarMain>
            <div>
                <NodeMaster />
            </div>
        </SideBarMain>
    )
}

export default NodeMasterMain;
