import { ResponsiveBar } from '@nivo/bar'

const ResponsiveBarChartGrouped = ({ chartData, barChartStyle }) => {

    const data = [
        {
            "country": "CPU",
            "ACTIVE": 17,
            "ACTIVEColor": "hsl(305, 70%, 50%)",
            "ARCHIVED": 15,
            "ARCHIVEDColor": "hsl(77, 70%, 50%)",
            "CREATED": 5,
            "CREATEDColor": "hsl(140, 70%, 50%)",
            "DELETED": 17,
            "DELETEDColor": "hsl(130, 70%, 50%)",
        },
        {
            "country": "Memory",
            "UsedMB": 10,
            "UsedMBColor": "hsl(312, 70%, 50%)",
            "Allocated": 15,
            "AllocatedColor": "hsl(236, 70%, 50%)",
            "Total": 20,
            "TotalColor": "hsl(10, 70%, 50%)",

        },
        {
            "country": "Network",
            "ACTIVE": 14,
            "ACTIVEColor": "hsl(315, 70%, 50%)",
            "ARCHIVED": 5,
            "ARCHIVEDColor": "hsl(154, 70%, 50%)",
            "CREATED": 14,
            "CREATEDColor": "hsl(10, 70%, 50%)",
            "DELETED": 9,
            "DELETEDColor": "hsl(148, 70%, 50%)",
         
        },
        {
            "country": "Applications",
            "ACTIVE": 13,
            "ACTIVEColor": "hsl(122, 70%, 50%)",
            "ARCHIVED": 8,
            "ARCHIVEDColor": "hsl(174, 70%, 50%)",
            "CREATED": 2,
            "CREATEDColor": "hsl(153, 70%, 50%)",
            "DELETED": 3,
            "DELETEDColor": "hsl(302, 70%, 50%)",
            // "INACTIVE": 4,
            // "INACTIVEColor": "hsl(351, 70%, 50%)",
            // "REGISTERED": 12,
            // "GISTEREDColor": "hsl(190, 70%, 50%)",
            // "UNSPECIFIED":1,
        },
        
    ]

    return (
        <ResponsiveBar
            data={data}
            keys={[
                "UsedMB",
                "Allocated",
                "Total",
                "ACTIVE",
                "ARCHIVED",
                "CREATED",
                "DELETED",
                // "INACTIVE",
                // "REGISTERED",
                // "UNSPECIFIED"

            ]}
            indexBy="country"
            margin={barChartStyle.marginBar}
            padding={0.1}
            innerPadding={1}
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
                // legend: 'country',
                legendPosition: 'middle',
                legendOffset: 13
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
            // legends={[{ ...barChartStyle.barChartStyle }]}
        />
    )
}
export default ResponsiveBarChartGrouped;