import { ResponsiveBar } from '@nivo/bar'

const ResponsiveBarChart = ({ chartData, barChartStyle }) => {

    return (
        <ResponsiveBar
            data={chartData}
            keys={['value']}
            indexBy="label"
            margin={barChartStyle.marginBar}
            padding={0.4}
            innerPadding={1}
            groupMode="stacked"
            colorBy='indexValue'
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'dark2' }}
            borderRadius={5}
            borderColor={{ theme: 'background' }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 0,
                tickPadding: 4,
                tickRotation: -10,
            }}
            labelTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        '5'
                    ]
                ]
            }}
            // legends={[{ ...barChartStyle.barChartStyle }]}
        />
    )
}
export default ResponsiveBarChart;