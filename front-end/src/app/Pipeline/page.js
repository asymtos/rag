"use client"

import SideBarMain from '@/components/sidebar'
import PipelineRag from './PipelineRag'

const page = () => {
    return (
        <SideBarMain>
            <div className='h-[100%]'>
                <PipelineRag />
            </div>
        </SideBarMain>
    )
}

export default page
