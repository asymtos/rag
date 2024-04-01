import { ResponsiveSunburst } from '@nivo/sunburst'
import React, { useState } from 'react';
import Ripples from 'react-ripples';

const ResponsiveSunburstChart = ({ chartData, chartStyle }) => {

    const data = {
        "name": "root",
        "color": "hsl(338, 70%, 50%)",
        "children": chartData ? chartData : [],
    }

    const [childData, setChildData] = useState(data);

    const customLabel = (node) => {
        // You can add logic here to customize the labels
        if (node.depth === 2) {
            // Change the label for child nodes at depth 2
            return `${node.data.itemCount}`;
        }
        // Use the default label for other nodes
        return node.data.itemName;
    };

    // Handle click event to drill down into children
    const handleNodeClick = (node) => {
        if (node.depth === 1) {
            const dataValue = {
                "name": "root",
                "color": "hsl(338, 70%, 50%)",
                "children": node.data ? [node.data] : [],
            }
            setChildData(dataValue)
        }
    }

    // Handle click event to reset chart data
    const restChatHandler = () => {
        setChildData(data)
    }

    const CustomCenter = ({ centerX, centerY }) => (
        <text x={centerX} y={centerY} textAnchor="middle" dominantBaseline="middle" className='flex flex-col items-center'>
            <span>Total</span>
            <span>{chartStyle?.totalNodeCount ? chartStyle.totalNodeCount : 0}</span>
        </text>
    );

    return (
        <>
            <div className='flex self-stretch justify-end'>
            <Ripples className="rounded-md">
                <button className="rounded-md bg-dark px-3 py-0.5 text-sm  text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                    onClick={restChatHandler}>
                    Reset
                </button>
                </Ripples>
            </div>
            <ResponsiveSunburst
                data={childData}
                margin={chartStyle.marginSun}
                id="itemName"
                value="itemCount"
                valueFormat=" >-"
                sortByValue={true}
                borderColor="#ffffff"
                borderWidth={2}
                cornerRadius={4}
                colors={{ scheme: 'dark2' }}
                childColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'brighter',
                            '0.3'
                        ]
                    ]
                }}
                enableArcLabels={true}
                arcLabel={customLabel}
                arcLabelsRadiusOffset={0.35}
                arcLabelsSkipAngle={8}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            '5'
                        ]
                    ]
                }}
                onClick={handleNodeClick}
                motionConfig="gentle"
                transitionMode="pushIn"
            />

            {chartStyle?.totalNodeCount ? <div
                style={{
                    position: 'absolute',
                    top: '55%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <CustomCenter />
            </div> : <></>}
        </>
    );
}
export default ResponsiveSunburstChart;