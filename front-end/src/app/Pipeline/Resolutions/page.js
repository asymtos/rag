"use client"; //This is client component


//Component
import SideBarMain from '@/components/sidebar';
import Resolution from './Resolution';

const Resolutions = () => {
    return (
        <SideBarMain>
            <div>
                <Resolution />
            </div>
        </SideBarMain>
    )
}

export default Resolutions;