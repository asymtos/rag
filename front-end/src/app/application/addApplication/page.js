"use client"; //This is client component

import React from 'react'

//Component
import SideBarMain from '@/components/sidebar';
import AddApplication from './addApplication';

const AddApplicationMain = () => {
    return (
        <SideBarMain>
            <div>
                <AddApplication />
            </div>
        </SideBarMain>
    )
}

export default AddApplicationMain;