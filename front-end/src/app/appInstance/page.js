"use client"; //This is client component

//Component
import SideBarMain from "../../components/sidebar";
import AppInstanceList from "./appInstance";

const AppInstanceMain = () => {
    return (
        <SideBarMain>
            <div>
                  <AppInstanceList/>
            </div>
        </SideBarMain>
    )
}

export default AppInstanceMain;