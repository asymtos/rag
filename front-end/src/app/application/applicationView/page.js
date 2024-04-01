"use client"; //This is client component

import React from 'react';

//Component
import ApplicationView from './applicationView';
import SideBarMain from '@/components/sidebar';

const ApplicationViewMain = () => {
    return (
        <SideBarMain>
            <div>
                <ApplicationView />
            </div>
        </SideBarMain>
    )
}

export default ApplicationViewMain;