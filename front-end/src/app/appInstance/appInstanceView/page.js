"use client"; //This is client component

import React from 'react';

//Component
import SideBarMain from '@/components/sidebar';
import AppInstanceView from './appInstanceView';

const AppInstanceViewMain = () => {
    return (
        <SideBarMain>
            <div className='h-[100%]'>
                <AppInstanceView />
            </div>
        </SideBarMain>
    )
}

export default AppInstanceViewMain;