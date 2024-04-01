
import { computeNodeConst } from '@/constant/nodeConst';
import { ResponsiveLine } from '@nivo/line'

const ResponsiveLineChart = ({ chartData, lineChartStyle, type }) => {

    return (
        <ResponsiveLine
            data={chartData}
            enableArea={true}
            areaOpacity={0.1}
            animate
            curve="monotoneX"
            enableSlices="x"
            margin={type == computeNodeConst.cpuStatus ? lineChartStyle.margincpu : lineChartStyle.marginLine}
            yScale={{
                type: 'linear',
                stacked: false,
                reverse: false,
                min: type == computeNodeConst.cpuStatus || type == computeNodeConst.memoryStatus ? 0 : "auto",
                max: type == computeNodeConst.cpuStatus || type == computeNodeConst.memoryStatus ? 100 : "auto",
                nice: 500
            }}
            yFormat=">-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 2,
                tickPadding: 2,
                tickRotation: 0,
                legendOffset: 36,
                legendPosition: 'middle',
                legend: type == computeNodeConst.cpuStatus ? 'Minutes' : '',
            }}
            axisLeft={{
                tickSize: 2,
                tickPadding: 2,
                tickRotation: 0,
                legendOffset: -40,
                legendPosition: 'middle',
                format: (value) => type == computeNodeConst.cpuStatus || type == computeNodeConst.memoryStatus ? `${value}%` : value,
            }}
            pointSize={4}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={1}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            // legends={[{ ...lineChartStyle.lineChartStyle }]}
            colors={{ scheme: 'dark2' }}
        />
    )
}
export default ResponsiveLineChart;