import React from 'react';
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

function LineChartSkeleton() {
    return (
        <div className="h-[95%] w-[100%]">
            {/* Chart */}
            <div className="h-[80%]">
                <Skeleton width={'100%'} height={'100%'} borderRadius={8} baseColor={'#ccc'}/>
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap space-x-4">
                {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div className="w-4 h-3 rounded-full "><Skeleton baseColor={'#ccc'}/></div>
                        <div className="w-14 h-3">
                            <Skeleton baseColor={'#ccc'}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LineChartSkeleton;
