"use client"; //This is client component
import React from 'react';
//Component
import SideBarMain from '@/components/sidebar';
import MLOpsApplication from './MLOpsApplication';

const MLOpsApplicationMain = () => {
    return (
  
        <SideBarMain>
            <div className='h-[100%]'>
                <MLOpsApplication />
            </div>
        </SideBarMain>
    )
}

export default MLOpsApplicationMain;