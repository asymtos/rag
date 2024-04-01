import { ResponsiveBar } from '@nivo/bar'

const ResponsiveNetworkBarChart = ({ chartData, chartStyle }) => {

    const MyCustomTooltip = ({ data }) => {
        const { interface_name, rx_bytes, tx_bytes, ...newData } = data;
        const entries = Object.entries(newData);
        return (
            <div className="bg-stone-50 p-2 border  rounded-lg shadow-lg">
                <div className='grid grid-flow-row grid-cols-2'>
                    <p className="flex items-strat justify-strat text-sm px-2">
                        interface_name
                    </p>
                    <p className="flex items-strat justify-strat text-sm ">
                        {`: ${data.interface_name || ''}`}
                    </p>
                    <p className="flex items-strat justify-strat text-sm px-2">
                        tx_bytes
                    </p>
                    <p className="flex items-strat justify-strat text-sm ">
                        {`: ${data.tx_bytes * 1048576 || ''}`}
                    </p>
                    <p className="flex items-strat justify-strat text-sm px-2">
                        rx_bytes
                    </p>
                    <p className="flex items-strat justify-strat text-sm ">
                        {`: ${data.rx_bytes * 1048576 || ''}`}
                    </p>
                </div>
                {entries.map(([key, value], index) => (
                    <div key={index} className='grid grid-flow-row grid-cols-2'>
                        <p className="flex items-strat justify-strat text-sm px-2">
                            {key || ''}
                        </p>
                        <p className="flex items-strat justify-strat text-sm ">
                            {`: ${value || ''}`}
                        </p>
                    </div>
                ))}
            </div>
        )
    };

    return (
        <ResponsiveBar
            data={chartData}
            keys={["tx_bytes", "rx_bytes",]}
            indexBy="interface_name"
            margin={chartStyle.marginNetwork}
            padding={0.5}
            innerPadding={1}
            yFormat=">-.2f"
            groupMode="grouped"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'dark2' }}
            borderRadius={5}
            borderColor={{ theme: 'background' }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 0,
                tickPadding: 7,
                tickRotation: -10,
                legendPosition: 'middle',
                legendOffset: 13
            }}
            axisLeft={{
                tickSize: 2,
                tickPadding: 2,
                legendPosition: 'middle',
                format: (value) => `${value}MB`,
            }}
            labelSkipWidth={21}
            labelSkipHeight={7}
            labelTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        '5'
                    ]
                ]
            }}
            tooltip={MyCustomTooltip}
            label={d => `${d.id}`}
        />
    )
}
export default ResponsiveNetworkBarChart;