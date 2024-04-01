"use client"; //This is client component

import React from 'react'

//Component
import AddNode from './addNode';
import SideBarMain from '@/components/sidebar';

const AddNodeMain = () => {
    return (
        <SideBarMain>
            <div>
                <AddNode />
            </div>
        </SideBarMain>
    )
}

export default AddNodeMain;