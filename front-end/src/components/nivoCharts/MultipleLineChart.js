
import { ResponsiveLine } from '@nivo/line'

const ResponsiveMultiLineChart = ({ chartData, lineChartStyle }) => {

   

    return (
        <ResponsiveLine
            data={chartData}
            enableArea={true}
            areaOpacity={0.1}
            animate
            curve="monotoneX"
            enableSlices="x"
            margin={lineChartStyle.marginMulLine}
            yScale={{
                type: 'linear',
                stacked: false,
                reverse: false,
                max:"auto",
                nice: 500

            }}
            yFormat=">-.0f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 2,
                tickPadding: 2,
                tickRotation: 0,
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                tickSize: 2,
                tickPadding: 2,
                tickRotation: 0,
                legendOffset: -40,
                legendPosition: 'middle',
            }}
            pointSize={4}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={1}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[{ ...lineChartStyle.lineChartStyle }]}
            colors={{ scheme: 'dark2' }}
        />
    )
}
export default ResponsiveMultiLineChart;