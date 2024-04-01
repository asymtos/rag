import { ResponsivePie } from '@nivo/pie';


const ResponsivePieChart = (props) => {

    const defaultProps = {
        chartData: [],
        pieChartStyle: [],

    }
    const { chartData, pieChartStyle ,totalCount,} = { ...defaultProps, ...props };

    const CustomCenter = ({ centerX, centerY }) => (
        <text x={centerX} y={centerY} textAnchor="middle" dominantBaseline="middle" className='flex flex-col items-center'>
            <span>Total</span>
            <span>{totalCount ? totalCount: 0}</span>
        </text>
    );

    return (
        <>
            <ResponsivePie
                data={chartData}
                margin={pieChartStyle.margin}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={2}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                colors={{ scheme: 'dark2' }}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.2
                        ]
                    ]
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            2
                        ]
                    ]
                }}
                // legends={[
                //     {
                //         ...pieChartStyle.pieChartStyle,
                //     }
                // ]}
                layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends']}
            />

            {totalCount ? <div
                style={{
                    position: 'absolute',
                    top: '52%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <CustomCenter />
            </div> : <></>}
        </>
    )
}

export default ResponsivePieChart;