import React, { useState, useEffect } from 'react';
//Constant
import { dashboardConst } from '@/constant/dashboard';
//Icons
import { ArrowPathIcon, ArrowsPointingOutIcon, ArrowUpRightIcon, ArrowUturnRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
//Environment
import { devConfig } from '@/environment/devlopment';
//Component
import LineChart from '@/components/LineChart';
import BarChart from '@/components/BarChart';
import ScatterChart from '@/components/Scatter';
import Gogglemap from '@/components/Gogglemap';
import ResponsivePieChart from '@/components/nivoCharts/PieChart';
import ResponsiveLineChart from '../../components/nivoCharts/LineChart'
import Spinner from '@/components/Spinner';
import ResponsiveMultiLineChart from '@/components/nivoCharts/MultipleLineChart';
import ResponsiveSunburstChart from '@/components/nivoCharts/sunburstChart';
import LineChartSkeleton from '@/components/skeletonLoaders/lineChartSkeleton';
import ResponsiveBarChart from '@/components/nivoCharts/BarChart';
import ChartViewModal from '@/components/chartViewModel';
//Carousel
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { timeDiffrence } from '@/utils/conversion';

const Dashboard = () => {

    const envConfig = devConfig;
    const constValue = dashboardConst;
    const [nodeStatusChartData, setNodeStatusChartData] = useState();
    const [nodeCategoryChartData, setNodeCategoryChartData] = useState();
    const [nodeEventChartData, setNodeEventChartData] = useState();
    const [loading, setLoading] = useState(true);
    const [resourcedata, setResourcedata] = useState(constValue.linedataResource);
    const [eventListArr, setEventListArr] = useState([]);
    const [loadingLineChartSkeleton, setLoadingLineChartSkeleton] = useState(true);
    const [chartFullViewFlag, setChartFullViewFlag] = useState(false);
    const [chartFullViewObj, setChartFullViewObj] = useState(
        {
            chartType: '',
            stylesObj: '',
            chartName: '',
            chartData: '',
            totalCount: null,
        }
    )
    const [nodesStatusCount, setNodesStatusCount] = useState(0)
    const [applicationCategoryChartData, setApplicationCategoryChartData] = useState();
    const [totalNodeCount, setTotalNodeCount] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [eventDetails, setEventDetails] = useState();
    const [statusInference, setStatusInference] = useState('-')
    const [eventmanageInference, setEventmanageInference] = useState('-')
    const [nodeCategoryInference, setNodeCategoryInference] = useState('-')
    const [nodesLocation, setNodesLocation] = useState('Test inference data')
    const [applicationsInference, setApplicationsInference] = useState('-')
    const [eventsInference, setEventsInference] = useState('-')

    const inferenceFirstRowData = [
        `Nodes status inference : ${statusInference}`,
        `Nodes categorization inference: ${nodeCategoryInference}`,
        `Event management inference : ${eventmanageInference}`,
    ]

    const inferenceSecondRowData = [
        `Nodes location inference : ${nodesLocation}`,
        `Applications inference: ${applicationsInference}`,
        `Events inference : ${eventsInference}`,
    ]

    const UserData = [
        {
            id: 1,
            year: 2016,
            cost: 80000,
            TB: 14,
        },
        {
            id: 2,
            year: 2017,
            cost: 45677,
            TB: 45,
        },
        {
            id: 3,
            year: 2018,
            cost: 78888,
            TB: 35,
        },
        {
            id: 4,
            year: 2019,
            cost: 90000,
            TB: 20,
        },
        {
            id: 5,
            year: 2020,
            cost: 4300,
            TB: 24,
        },
    ];

    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627
        },
        zoom: 11
    };

    const businessInsights = [
        {
            "id": "2016",
            "label": "2016",
            "value": 80000 || 0,
            "color": "hsl(270, 70%, 50%)"
        },
        {
            "id": "2017",
            "label": "2017",
            "value": 45677 || 0,
            "color": "hsl(42, 70%, 50%)"
        },
        {
            "id": "2018",
            "label": "2018",
            "value": 78888 || 0,
            "color": "hsl(278, 70%, 50%)"
        },
        {
            "id": "2019",
            "label": "2019",
            "value": 90000 || 0,
            "color": "hsl(277, 70%, 50%)"
        },
        {
            "id": "2020",
            "label": "2020",
            "value": 4300 || 0,
            "color": "hsl(146, 70%, 50%)"
        },
    ]
    const pieChartStyle = {
        anchor: 'bottom',
        direction: 'row',
        justify: true,
        translateX: 0,
        translateY: 0,
        itemsSpacing: 0,
        itemWidth: 0,
        itemHeight: 0,
        itemTextColor: '#999',
        itemDirection: 'left-to-right',
        itemOpacity: 0,
        symbolSize: 0,
        symbolShape: 'square',
        effects: [
            {
                on: 'hover',
                style: {
                    itemTextColor: '#000'
                }
            }
        ],
        toggleSerie: true
    }
    const margin = { top: 15, right: 20, bottom: 30, left: 20 }
    const marginSun = { top: 0, right: 0, bottom: 25, left: 0 }
    const marginMulLine = { top: 5, right: 15, bottom: 40, left: 30 }
    const marginBar = { top: 5, right: 10, bottom: 25, left: 25 }

    const lineChartStyle = {
        anchor: 'bottom-left',
        direction: 'row',
        justify: false,
        translateX: -10,
        translateY: 38,
        itemWidth: 65,
        itemHeight: 20,
        itemsSpacing: 4,
        symbolSize: 10,
        symbolShape: 'circle',
        itemDirection: 'left-to-right',
        itemTextColor: '#777',
        effects: [
            {
                on: 'hover',
                style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                }
            }
        ],
        toggleSerie: true
    }


    useEffect(() => {
        getComputeNodeStatus();
        getComputeNodeCategory();
        getEventData();
        getEventListData();
        getAppCategoryData()
        setResourcedata(constValue.linedataResource);
    }, []);

    useEffect(() => {
        const interval = setInterval(getEventData, 60000); // Update every 1 min
        getEventData(); // Calculate the initial time difference
        return () => {
            clearInterval(interval); // Clean up the interval when the component unmounts
        };
    }, [])

    const getComputeNodeStatus = async () => {

        let url = `${envConfig.backendBaseUrl}/api/v1/devices/status`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.message.toLowerCase() == "get data successfully") {
                        let summaryByState = val.data && val.data.summaryByState ? val.data.summaryByState : null;
                        var totalCount = val && val.data && val.data && val.data.totalCount ? val.data.totalCount : 0;
                        setNodesStatusCount(totalCount);
                        var inference = val && val.data && val.data && val.data.inference ? val.data.inference : '-';
                        setStatusInference(inference);
                        if (summaryByState) {
                            var valObj = summaryByState.values ? summaryByState.values : '';
                            const { INACTIVE, ACTIVE, ...newData } = valObj;
                            var data = []
                            for (const [key, value] of Object.entries(newData)) {
                                data.push({
                                    "id": key,
                                    "label": key,
                                    "value": value,
                                })
                            }
                            setNodeStatusChartData(data)
                            setLoading(false);
                        }
                    }
                    else {
                        setNodeStatusChartData([])
                        setLoading(false);
                    }
                })
        }
        catch (e) {
            console.log('Error in compute node status api call', e);
            setLoading(false);
        }
    }

    const getComputeNodeCategory = async () => {

        let url = `${envConfig.backendBaseUrl}/api/v1/devices/brandcount`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.message.toLowerCase() == "get data successfully") {
                        if (val && val.data) {
                            var valObj = val.data && val.data.brand_data ? val.data.brand_data : [];
                            var totalNode = val.data && val.data.node_count ? val.data.node_count : 0;
                            var inference = val && val.data && val.data && val.data.brand_data_inference ? val.data.brand_data_inference : '-';
                            setNodeCategoryInference(inference);
                            var data = []
                            valObj.map((val) => {
                                data.push({
                                    "itemName": val.type,
                                    "children": val.items,
                                })
                            });
                            setTotalNodeCount(totalNode);
                            setNodeCategoryChartData(data)
                            setLoading(false);
                        }
                    }
                    else {
                        setNodeCategoryChartData([])
                        setLoading(false);
                    }
                })
        }
        catch (e) {
            console.log('Error in compute node category api call', e);
            setNodeCategoryChartData([]);
        }
    }

    const getEventData = async () => {

        let url = `${envConfig.backendBaseUrl}/api/v1/devices/log`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.message.toLowerCase() == "get data successfully") {
                        var valObj = val && val.data && val.data[0] && val.data[0].Log_info ? val.data[0].Log_info : [];
                        var inference = val && val.data && val.data[0] && val.data[0].Inference ? val.data[0].Inference : '-';
                        setEventmanageInference(inference);
                        var eventArray = [];
                        const Fromatdata = async (Intervals) => {
                            var data = [];
                            await Intervals?.map((obj) => (
                                data.push({
                                    "x": obj && obj.Time ? obj.Time : null,
                                    "y": obj && obj.Count ? obj.Count : 0,
                                })
                            ));
                            return data;
                        };
                        if (valObj && valObj.length > 0) {
                            valObj.map(async (val) => {
                                eventArray.push({
                                    "id": val.Type ? val.Type : '',
                                    "data": await Fromatdata(val.Intervals),
                                })
                            })
                            setNodeEventChartData(eventArray);
                            setLoadingLineChartSkeleton(false);
                        } else {
                            setNodeEventChartData([]);
                            setLoadingLineChartSkeleton(false);
                        }
                    }
                    else {
                        setNodeEventChartData([])
                        setLoadingLineChartSkeleton(false);
                    }
                })
        }
        catch (e) {
            console.log('Error in event api call', e);
            setLoadingLineChartSkeleton(false);
        }
    }

    const getEventListData = async () => {

        let url = `${envConfig.backendBaseUrl}/api/v1/devices/loglist`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.message.toLowerCase() == "get data successfully") {
                        var valObj = val && val.data && val.data[0] && val.data[0].LogEntries ? val.data[0].LogEntries : [];
                        var inference = val && val.data && val.data[0] && val.data[0].Inference ? val.data[0].Inference : '-';
                        setEventsInference(inference);
                        setEventListArr(valObj);
                    } else {
                        setEventListArr([]);
                    }
                })
        }
        catch (e) {
            console.log('Error in event list api call', e);

        }

    }

    const getAppCategoryData = async () => {

        let url = `${envConfig.backendBaseUrl}/api/v1/instances/appcategory`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.message.toLowerCase() == "get data successfully") {
                        var valObj = val && val.data && val.data.category ? val.data.category : [];
                        var inference = val && val.data && val.data.inference ? val.data.inference : [];
                        setApplicationsInference(inference);
                        if (valObj) {
                            var data = []
                            for (const [key, value] of Object.entries(valObj)) {
                                data.push({
                                    "label": key,
                                    "value": value,
                                })
                            }
                            setApplicationCategoryChartData(data);
                        } else {
                            setApplicationCategoryChartData([]);
                        }

                    } else {
                        setApplicationCategoryChartData([]);
                    }
                })
        }
        catch (e) {
            console.log('Error in event list api call', e);

        }
    }

    //Chart view popup function
    const chartView = (type, chartData, stylesObj, name, count) => {
        setChartFullViewFlag(true);
        setChartFullViewObj({
            chartType: type,
            chartName: name,
            chartData: chartData,
            stylesObj: stylesObj,
            totalCount: count
        })
    }

    const handleEventList = (item) => {
        setEventDetails(item)
        setIsFlipped(!isFlipped);
    }

    const eventListDetails = () => {
        return (
            <div >
                <ul role="list" className="divide-y my-2 text-sm divide-gray-200 overflow-auto w-full">
                    <li className="p-2 m-1 rounded-md gap-2 px-4 ">
                        <div className='flex flex-row'>
                            <p className='w-[20%]'>{'Type'}</p> <p className='mx-2'>{':'}</p>
                            <p className='w-[80%]'>{eventDetails.severity || '-'}</p>
                            <button className='bg-gray-100'
                                onClick={() => handleEventList('')}
                            >
                                <ArrowUpRightIcon className="h-5 w-5 text-dark "
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        <div className='flex flex-row mt-1'>
                            <p className='w-[20%] '>{'Content'}</p><p className='mx-2'>{':'}</p>
                            <p className='w-[80%]'>{eventDetails.content || "-"}</p>
                        </div>
                        <div className='flex flex-row mt-1'>
                            <p className='w-[20%] '>{'Filename'}</p><p className='mx-2'>{':'}</p>
                            <p className='w-[80%]'>{eventDetails.filename || '-'}</p>
                        </div>
                        <div className='flex flex-row mt-1'>
                            <p className='w-[20%] '>{'Function'}</p><p className='mx-2'>{':'}</p>
                            <p className='w-[80%]'>{eventDetails.function || '-'}</p>
                        </div>
                        <div className='flex flex-row mt-1'>
                            <p className='w-[20%] '>{'Source'}</p><p className='mx-2'>{':'}</p>
                            <p className='w-[80%]'>{eventDetails.source || '-'}</p>
                        </div>
                        <div className='flex flex-row mt-1'>
                            <p className='w-[20%] '>{'Timestamp'}</p><p className='mx-2'>{':'}</p>
                            <p className='w-[80%]'>{eventDetails.timestamp || '-'}</p>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }

    useEffect(() => {
        const interval = setInterval(eventTimeDiffrence, 1000); // Update every 1 second
        eventTimeDiffrence(); // Calculate the initial time difference
        return () => {
            clearInterval(interval); // Clean up the interval when the component unmounts
        };
    }, []);

    const eventTimeDiffrence = (time) => {
        return timeDiffrence(time);
    }

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 2, // Show 2 text items at a time
            slidesToSlide: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2, // Show 2 text items at a time
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1, // Show 1 text item at a time
        },
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"> <Spinner /></div>
    } else {
        return (
            <>
                <div className='flex flex-col p-3 overflow-x-hidden' >
                    {chartFullViewFlag &&
                        <ChartViewModal open={chartFullViewFlag} chartFullViewObj={chartFullViewObj} onclose={setChartFullViewFlag} />
                    }
                    <div className='m-2 bg-dark py-2 rounded-md'>
                        <div className='flex flex-row py-1 px-4 h-16'>
                            <h1 className="w-1/6 py-3 text-white text-xl justify-center sm:truncate sm:text-xl sm:tracking-tight"> {dashboardConst.technicalInsight}</h1>
                            <div className='w-5/6 px-4 rounded-md overflow-hidden py-2 bg-slate-200'>
                                {inferenceFirstRowData && inferenceFirstRowData.length > 0 ?
                                    <div>
                                        <Carousel
                                            responsive={responsive}
                                            infinite={true}
                                            // autoPlay={true}
                                            // autoPlaySpeed={2000}
                                            customTransition="all .5"
                                            removeArrowOnDeviceType={['desktop', 'tablet', 'mobile']}
                                        >
                                            {inferenceFirstRowData.map((text, index) => (
                                                <div key={index} className="flex text-start justify-start items-center horizontal-text whitespace-normal sm:truncate sm:text-sm sm:tracking-tight ">
                                                    {text}
                                                </div>
                                            ))}
                                        </Carousel>
                                    </div>
                                    : <div></div>}
                                {inferenceSecondRowData && inferenceSecondRowData.length > 0 ?
                                    <div>
                                        <Carousel
                                            responsive={responsive}
                                            infinite={true}
                                            // autoPlay={true}
                                            // autoPlaySpeed={2000}
                                            customTransition="all .5"
                                            removeArrowOnDeviceType={['desktop', 'tablet', 'mobile']}
                                        >
                                            {inferenceSecondRowData.map((text, index) => (
                                                <div key={index} className="flex text-start text-sm justify-start items-center horizontal-text whitespace-normal sm:truncate sm:text-sm sm:tracking-tight ">
                                                    {text}
                                                </div>
                                            ))}
                                        </Carousel>
                                    </div>
                                    : <div></div>}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-1 items-center px-4 py-2">
                                {/* Node status chart */}
                                <div className="relative flex flex-col shadow-xl justify-center items-center px-4 h-[250px] border rounded-lg bg-[#FDFDFC] border-gray-400 border-solid[#D7D3D0]" style={{ width: '32%' }}>
                                    <h2 className="flex py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{dashboardConst.nodeStatus}</h2>

                                    {nodeStatusChartData && nodeStatusChartData.length > 0 ?
                                        <>
                                            <button
                                                onClick={() => chartView("ResponsivePieChart", nodeStatusChartData, { pieChartStyle, margin }, dashboardConst.nodeStatus, nodesStatusCount)}
                                                className='absolute right-3 top-2'>
                                                <ArrowsPointingOutIcon className='h-5 w-5' />
                                            </button>
                                            <ResponsivePieChart chartData={nodeStatusChartData} pieChartStyle={{ pieChartStyle, margin }} totalCount={nodesStatusCount} />
                                        </>
                                        :
                                        <div className="flex justify-center items-center h-[220px] w-auto ">
                                            <p className='text-base leading-9'>{dashboardConst.noData}</p>
                                        </div>
                                    }
                                </div>
                                {/* Node categortization chart */}
                                <div className="relative flex flex-col shadow-xl justify-center items-center px-4 h-[250px] border rounded-lg bg-[#FDFDFC] border-gray-400 border-solid[#D7D3D0]" style={{ width: '32%' }}>
                                    <h2 className="flex  py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{dashboardConst.nodeBrand}</h2>
                                    {nodeCategoryChartData && nodeCategoryChartData.length > 0 ?
                                        <>
                                            <button
                                                onClick={() => chartView("ResponsiveSunburstChart", nodeCategoryChartData, { marginSun, totalNodeCount }, dashboardConst.nodeBrand)}
                                                className='absolute right-3 top-2'>
                                                <ArrowsPointingOutIcon className='h-5 w-5' />
                                            </button>
                                            <ResponsiveSunburstChart chartData={nodeCategoryChartData} chartStyle={{ marginSun, totalNodeCount }} />
                                        </>
                                        :
                                        <div className="flex justify-center items-center h-[220px] w-auto ">
                                            <p className='text-base leading-9 '>{dashboardConst.noData}</p>
                                        </div>
                                    }
                                </div>
                                {/* Event management chart */}
                                <div className="relative flex flex-col shadow-xl justify-center items-center px-4 h-[250px] border rounded-lg bg-[#FDFDFC] border-gray-400 border-solid[#D7D3D0]" style={{ width: '36%' }}>
                                    <div className="flex flex-row w-full">
                                        <h2 className=" flex w-4/5 py-2 items-center  justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{dashboardConst.eventMgmt}</h2>
                                        <div className="flex flex-row py-2 mr-8 items-center justify-center w-1/5 border rounded  border-gray-400 h-5 mt-2">
                                            <p className="flex items-center justify-center sm:truncate sm:text-[10px] sm:tracking-tight">
                                                {dashboardConst.hoursText}
                                            </p>
                                        </div>
                                    </div>
                                    {loadingLineChartSkeleton ?
                                        <div className="h-[100%] w-[100%]">
                                            <LineChartSkeleton></LineChartSkeleton>
                                        </div>
                                        : nodeEventChartData && nodeEventChartData.length > 0 ?
                                            <>
                                                <button
                                                    onClick={() => chartView("ResponsiveMultiLineChart", nodeEventChartData, { lineChartStyle, marginMulLine }, dashboardConst.eventMgmt)}
                                                    className='absolute right-3 top-2'>
                                                    <ArrowsPointingOutIcon className='h-5 w-5' />
                                                </button>
                                                <ResponsiveMultiLineChart chartData={nodeEventChartData} lineChartStyle={{ lineChartStyle, marginMulLine }} />
                                            </>
                                            : <div className="flex justify-center items-center h-[220px] w-auto ">
                                                <p className='text-base leading-9 '>{dashboardConst.noData}</p>
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className="flex flex-row gap-1 items-center px-4 pb-1">
                                {/* map chart */}
                                <div className="flex flex-col shadow-xl justify-center items-center px-4 h-[250px] border rounded-lg bg-[#FDFDFC] border-gray-400 border-solid[#D7D3D0]" style={{ width: '32%' }}>
                                    <h2 className=" flex py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{dashboardConst.location}</h2>
                                    <Gogglemap />
                                </div>
                                {/* Application chart */}
                                <div className="relative flex flex-col shadow-xl justify-center items-center px-4 h-[250px] border rounded-lg bg-[#FDFDFC] border-gray-400 border-solid[#D7D3D0]" style={{ width: '32%' }}>
                                    <h2 className="flex py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{dashboardConst.application}</h2>
                                    {applicationCategoryChartData && applicationCategoryChartData.length > 0 ?
                                        <>
                                            <button
                                                onClick={() => chartView("ResponsiveBarChart", applicationCategoryChartData, { marginBar }, dashboardConst.application)}
                                                className='absolute right-3 top-2'>
                                                <ArrowsPointingOutIcon className='h-5 w-5' />
                                            </button>
                                            <ResponsiveBarChart chartData={applicationCategoryChartData} barChartStyle={{ marginBar }} />
                                        </>
                                        : <div className="flex justify-center items-center h-[220px] w-auto ">
                                            <p className='text-base leading-9 '>{dashboardConst.noData}</p>
                                        </div>
                                    }
                                </div>
                                {/* event list chart */}
                                <div className="flex flex-col divide-gray-300 shadow-xl justify-center items-center h-[250px] border rounded-lg bg-[#FDFDFC] border-gray-400 border-solid[#D7D3D0]" style={{ width: '36%' }}>
                                    <div className="flex flex-row w-full border-b-2 px-2">
                                        <h2 className="flex w-4/6 py-2 h-10 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{dashboardConst.events}</h2>
                                        <div className="flex flex-row py-2 items-center justify-center w-2/6 border rounded  border-gray-400 h-5 mt-2">
                                            <p className="flex items-center justify-center sm:truncate sm:text-[10px] sm:tracking-tight">
                                                {dashboardConst.hoursEvent}
                                            </p>
                                        </div>
                                    </div>
                                    {eventListArr && eventListArr.length > 0 ? <ul role="list" className="divide-y my-2 text-sm divide-gray-200 overflow-auto w-full">
                                        {!isFlipped ? eventListArr.map((item, index) => (
                                            <li key={index} className="p-2 m-1 bg-gray-200 rounded-md">
                                                <div className='flex flex-row w-full justify-between items-center'>
                                                    <div className='flex flex-col w-full'>
                                                        <div className='flex flex-row'>
                                                            <p className='w-[10%]'>{'Type'}</p>
                                                            <p className='mx-2'>{':'}</p>
                                                            <p className='w-[75%]'>{item.severity}</p>
                                                            <p className='text-[12px] w-16 px-1'>{eventTimeDiffrence(item.timestamp)}</p>

                                                        </div>
                                                        <div className='flex flex-row mt-0.5'>
                                                            <p className='w-[10%] '>{'Details'}</p><p className='mx-2'>{':'}</p>
                                                            <p className='w-[90%]'>{item.content}</p>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-row'>
                                                        <button
                                                            onClick={() => handleEventList(item)}
                                                        >
                                                            <DocumentTextIcon className="h-6 w-6 text-dark "
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        )) : eventListDetails()}
                                    </ul>
                                        : <div className="flex justify-center items-center h-[220px] w-auto ">
                                            <p className='text-base leading-9 '>{dashboardConst.noData}</p>
                                        </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='m-2 bg-dark rounded-md'>
                        <h1 className=" text-white text-2xl py-3 px-5 justify-center sm:truncate sm:text-2xl sm:tracking-tight"> {dashboardConst.businessInsight}</h1>
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-1 items-center px-4 pb-4">
                                {/* Cost chart */}
                                <div className="relative flex flex-col shadow-xl justify-center items-center px-4 h-[250px] border rounded-lg bg-[#FDFDFC] border-gray-400 border-solid[#D7D3D0]" style={{ width: '32%' }}>
                                    <h2 className="flex absolute py-2 right -top-1 lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{dashboardConst.totCost}</h2>
                                    {nodeStatusChartData && nodeStatusChartData.length > 0 ?
                                        <>
                                            <button
                                                onClick={() => chartView("ScatterChart", UserData, { marginBar }, dashboardConst.totCost)}
                                                className='absolute right-3 top-2'>
                                                <ArrowsPointingOutIcon className='h-5 w-5' />
                                            </button>
                                            <ScatterChart chartData={UserData} />
                                        </>
                                        :
                                        <div className="flex justify-center items-center h-[220px] w-auto ">
                                            <p className='text-base leading-9'>{dashboardConst.noData}</p>
                                        </div>
                                    }
                                </div>
                                {/* Resource chart */}
                                <div className="relative flex flex-col shadow-xl justify-center items-center px-4 h-[250px] border rounded-lg bg-[#FDFDFC] border-gray-400 border-solid[#D7D3D0]" style={{ width: '32%' }}>
                                    <h2 className="flex py-3 w-full items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{dashboardConst.resourceUtil}</h2>
                                    {resourcedata && resourcedata.length > 0 ?
                                        <>
                                            <button
                                                onClick={() => chartView("ResponsiveMultiLineChart", resourcedata, { lineChartStyle, marginMulLine }, dashboardConst.resourceUtil)}
                                                className='absolute right-3 top-2'>
                                                <ArrowsPointingOutIcon className='h-5 w-5' />
                                            </button>
                                            <ResponsiveMultiLineChart chartData={resourcedata} lineChartStyle={{ lineChartStyle, marginMulLine }} />
                                        </>
                                        : <div className="flex justify-center items-center h-[220px] w-auto ">
                                            <p className='text-base leading-9 '>{dashboardConst.noData}</p>
                                        </div>
                                    }
                                </div>
                                {/* cost data chart */}
                                <div className="relative flex flex-col shadow-xl justify-center items-center px-4 h-[250px] border rounded-lg bg-[#FDFDFC] border-gray-400 border-solid[#D7D3D0]" style={{ width: '36%' }}>
                                    <h2 className="flex absolute py-3 w-full left-40 -top-2 lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{dashboardConst.dataTransfer}</h2>
                                    {UserData && UserData.length > 0 ?
                                        <>
                                            <button
                                                onClick={() => chartView("BarChart", UserData, { marginBar }, dashboardConst.dataTransfer)}
                                                className='absolute right-3 top-2'>
                                                <ArrowsPointingOutIcon className='h-5 w-5' />
                                            </button>
                                            <BarChart chartData={UserData} />
                                        </>
                                        : <div className="flex justify-center items-center h-[220px] w-auto ">
                                            <p className='text-base leading-9 '>{dashboardConst.noData}</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default Dashboard;