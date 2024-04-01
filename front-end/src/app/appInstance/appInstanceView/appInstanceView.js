import React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

//Icons
import { ArrowLeftCircleIcon, ArrowsPointingOutIcon, ArrowUpRightIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
//Environment
import { devConfig } from "@/environment/devlopment";

//Constant
import { computeNodeConst } from "@/constant/nodeConst";

//components
import ResponsivePieChart from '../../../components/nivoCharts/PieChart';
import ResponsiveLineChart from '../../../components/nivoCharts/LineChart';
import Spinner from "@/components/Spinner";
import ResponsiveNetworkBarChart from "@/components/nivoCharts/NetworkBarChart";
import ChartViewModal from "@/components/chartViewModel";
//Carousel
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { addedgeAppConst } from "@/constant/addedgeAppConst";
import { CalculateAverageMemoryUsage, CalculateMaxMemoryUsage, CalculateMinMemoryUsage } from "@/utils/conversion";
import LineChartSkeleton from "@/components/skeletonLoaders/lineChartSkeleton";
import ResponsiveMultiLineChart from "@/components/nivoCharts/MultipleLineChart";

const AppInstanceView = () => {
    const envConfig = devConfig;
    const [nodeStatusName, setNodeStatusName] = useState('');
    const [nodeStatusChartData, setNodeStatusChartData] = useState();
    const [nodeCpuUsage, setNodeCpuUsageData] = useState([]);
    const [nodeMemroyUsage, setNodeMemroyUsage] = useState([]);
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const routerParam = useSearchParams();
    const [netWorkUsage, setNetWorkUsage] = useState([]);
    const [networkTime, setNetworkTime] = useState();
    const [nodeInfoList, setNodeInfoList] = useState(null);
    const [chartFullViewFlag, setChartFullViewFlag] = useState(false);
    const [chartFullViewObj, setChartFullViewObj] = useState(
        {
            chartType: '',
            stylesObj: '',
            chartName: '',
            chartData: ''
        }
    )
    const [nodeMemory, setNodeMemory] = useState();
    const [eventListArr, setEventListArr] = useState([]);
    const [isFlipped, setIsFlipped] = useState(false);
    const [eventDetails, setEventDetails] = useState();
    const [loadingLineChartSkeleton, setLoadingLineChartSkeleton] = useState(true);
    const [eventmanageInference, setEventmanageInference] = useState('-');
    const [nodeEventChartData, setNodeEventChartData] = useState();

    useEffect(() => {
        let nodeName = routerParam.get("nodeName") ? routerParam.get("nodeName") : "";
        getComputeNodeStatus();
        getNodecpuUsage(nodeName);
        getNodeMemoryUsage(nodeName);
        getNodeNetWorkUsage(nodeName);
        getNodeInfo(nodeName);
        getEventListData();
        getEventData();
    }, []);

    const pieChartStyle = {
        anchor: 'right',
        direction: 'column',
        effects: [
            {
                on: 'hover',
                style: {
                    itemTextColor: '#000'
                }
            }
        ],
        itemHeight: 28,
        itemTextColor: '#999',
        itemWidth: 100,
        symbolShape: 'circle',
        symbolSize: 12,
        toggleSerie: true,
        translateY: 0,
        translateX: 90
    }

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

    const margin = { top: 20, right: 20, bottom: 30, left: 20 }

    const getComputeNodeStatus = async () => {
        let url = `${envConfig.backendBaseUrl}/api/v1/instances/status`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.error == false) {
                        let summaryByState = val.data && val.data.summaryByState ? val.data.summaryByState : null;
                        if (summaryByState) {
                            var valObj = summaryByState.values ? summaryByState.values : '';
                            let name = summaryByState.description ? summaryByState.description : '';
                            setNodeStatusName(name);
                            var data = [];
                            for (const [key, value] of Object.entries(valObj)) {
                                data.push({
                                    "id": key,
                                    "label": key,
                                    "value": value,
                                })
                            }
                            setNodeStatusChartData(data)
                        }
                    }
                    else {
                        setLoading(false);
                        setNodeStatusChartData([])
                        setNodeStatusName('')
                    }

                })
        }
        catch (e) {
            setLoading(false);
            console.log("Error in node status api call :", e)
        }

    }


    const getNodecpuUsage = async (nodeName) => {

        var cpuChartData = [
            {
                "id": "Cpu",
                "color": "hsl(183, 70%, 50%)",
                "data": [
                    {
                        "x": "13:10",
                        "y": 10.31
                    },
                    {
                        "x": "13:20",
                        "y": 8.01
                    },
                    {
                        "x": "13:30",
                        "y": 40.31
                    },
                    {
                        "x": "13:40",
                        "y": 15.31
                    },
                    {
                        "x": "13:50",
                        "y": 5.31
                    },
                    {
                        "x": "14:00",
                        "y": 50.31
                    },
                    {
                        "x": "14:10",
                        "y": 10.31
                    },
                    {
                        "x": "14:20",
                        "y": 8.01
                    },
                    {
                        "x": "14:30",
                        "y": 40.31
                    },
                    {
                        "x": "14:40",
                        "y": 15.31
                    },
                    {
                        "x": "14:50",
                        "y": 5.31
                    },
                ]
            }
        ];
        setNodeCpuUsageData(cpuChartData);

        let url = `${envConfig.backendBaseUrl}/api/v1/devices/nodecpustats/${nodeName}`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.error == false && val.message.toLowerCase() == "get data successfully") {
                        var nodeUsage = val.data && val.data ? val.data : [];
                        var CpuData = [];
                        if (nodeUsage && nodeUsage != null && nodeUsage.length > 0) {
                            nodeUsage.map((obj) => {
                                CpuData.push({
                                    y: obj && obj.averagecpu ? (obj.averagecpu).toFixed(2) : 0,
                                    x: obj && obj.timestamp ? obj.timestamp : 0,
                                })
                            })
                            // console.log("CpuDataCpuData", CpuData)
                            var cpuChartData = [
                                {
                                    "id": "Cpu",
                                    "color": "hsl(183, 70%, 50%)",
                                    "data": CpuData,
                                }
                            ];
                            setNodeCpuUsageData(cpuChartData)
                            setLoading(false);
                        } else {
                            setLoading(false);
                            setNodeCpuUsageData([]);
                        }
                    }
                    else {
                        setLoading(false);
                        setNodeCpuUsageData([]);
                    }
                })
        }
        catch (e) {
            setLoading(false);
            console.log("Error in node cpu api call :", e)
        }
    }

    const getNodeMemoryUsage = async (nodeName) => {

        var memoryChartData = [
            {
                "id": "Used",
                "color": "hsl(183, 70%, 50%)",
                "data": [
                    {
                        "x": "13:10",
                        "y": 2.31
                    },
                    {
                        "x": "13:20",
                        "y": 8.01
                    },
                    {
                        "x": "13:30",
                        "y": 20.31
                    },
                    {
                        "x": "13:40",
                        "y": 15.31
                    },
                    {
                        "x": "13:50",
                        "y": 5.31
                    },
                    {
                        "x": "14:00",
                        "y": 30.31
                    },
                    {
                        "x": "14:10",
                        "y": 10.31
                    },
                    {
                        "x": "14:20",
                        "y": 8.01
                    },
                    {
                        "x": "14:30",
                        "y": 20.31
                    },
                    {
                        "x": "14:40",
                        "y": 15.31
                    },
                    {
                        "x": "14:50",
                        "y": 5.31
                    },
                ],
            },
            {
                "id": "Allocated",
                "color": "hsl(183, 70%, 50%)",
                "data": [
                    {
                        "x": "13:10",
                        "y": 80
                    },
                    {
                        "x": "13:20",
                        "y": 80
                    },
                    {
                        "x": "13:30",
                        "y": 80
                    },
                    {
                        "x": "13:40",
                        "y": 80
                    },
                    {
                        "x": "13:50",
                        "y": 80
                    },
                    {
                        "x": "14:00",
                        "y": 80
                    },
                    {
                        "x": "14:10",
                        "y": 80
                    },
                    {
                        "x": "14:20",
                        "y": 80
                    },
                    {
                        "x": "14:30",
                        "y": 80
                    },
                    {
                        "x": "14:40",
                        "y": 80
                    },
                    {
                        "x": "14:50",
                        "y": 80
                    },
                ],
            },
        ];
        setNodeMemroyUsage(memoryChartData);

        let url = `${envConfig.backendBaseUrl}/api/v1/devices/nodememorystats/${nodeName}`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.error == false && val.message.toLowerCase() == "get data successfully") {
                        var nodeUsage = val.data && val.data ? val.data : [];
                        var usedMemoryData = [];
                        var allocateData = [];
                        var totalData = [];
                        if (nodeUsage && nodeUsage.length > 0) {
                            let usedMemoryMB = [];
                            let allocateMB = [];
                            let totalMB = [];
                            nodeUsage.map((obj) => {
                                usedMemoryMB.push({ y: obj && obj.AverageUsedMemory ? (obj.AverageUsedMemory) : 0 })
                                allocateMB.push({ y: obj && obj.AverageAllocatedMemory ? (obj.AverageAllocatedMemory) : 0 })
                                totalMB.push({ y: obj && obj.AverageTotalMemory ? (obj.AverageTotalMemory) : 0 })
                                usedMemoryData.push({
                                    y: obj && obj.AverageUsedMemory ? ((obj.AverageUsedMemory / obj.AverageTotalMemory) * 100) : 0,
                                    x: obj && obj.Time ? obj.Time : 0,
                                })
                                allocateData.push({
                                    y: obj && obj.AverageAllocatedMemory ? ((obj.AverageAllocatedMemory / obj.AverageTotalMemory) * 100) : 0,
                                    x: obj && obj.Time ? obj.Time : 0,
                                })
                            })

                            var memoryChartData = [
                                {
                                    "id": "Used",
                                    "color": "hsl(183, 70%, 50%)",
                                    "data": usedMemoryData,
                                },
                                {
                                    "id": "Allocated",
                                    "color": "hsl(183, 70%, 50%)",
                                    "data": allocateData,
                                },
                            ];
                            setNodeMemroyUsage(memoryChartData)

                            const getcrtData = (crt) => {
                                let current = crt && crt.length > 0 ? crt[crt.length - 1].y : 0;
                                return current.toFixed(2)
                            }
                            var dataofMemory = [
                                {
                                    "type": "Used",
                                    "max": CalculateMaxMemoryUsage(usedMemoryMB),
                                    "min": CalculateMinMemoryUsage(usedMemoryMB),
                                    "avg": CalculateAverageMemoryUsage(usedMemoryMB),
                                    "crt": getcrtData(usedMemoryMB),
                                },
                                {
                                    "type": "Allocated",
                                    "max": CalculateMaxMemoryUsage(allocateMB),
                                    "min": CalculateMinMemoryUsage(allocateMB),
                                    "avg": CalculateAverageMemoryUsage(allocateMB),
                                    "crt": getcrtData(allocateMB),
                                },
                                {
                                    "type": "Total",
                                    "max": CalculateMaxMemoryUsage(totalMB),
                                    "min": CalculateMinMemoryUsage(totalMB),
                                    "avg": CalculateAverageMemoryUsage(totalMB),
                                    "crt": getcrtData(totalMB),
                                }
                            ]
                            setNodeMemory(dataofMemory);
                            setLoading(false);
                        } else {
                            setLoading(false);
                            setNodeMemory();
                            setNodeMemroyUsage([])
                        }
                    }
                    else {
                        setLoading(false);
                        setNodeMemory();
                        setNodeMemroyUsage([])
                    }
                })
        }
        catch (e) {
            setLoading(false);
            console.log("Error in node memory api call :", e)
        }
    }

    const getNodeNetWorkUsage = async (nodeName) => {
        var newarr = [
            {
                "interface_name": "eth0",
                "tx_bytes": (1096740 / 1048576).toFixed(2),
                "rx_bytes": (9778268 / 1048576).toFixed(2),
                "tx_drops": 0,
                "rx_drops": 0,
                "tx_pkts": 3317,
                "rx_pkts": 57707,
                "tx_errors": 4,
                "rx_errors": 0,
                "tx_acl_drops": 0,
                "rx_acl_drops": 0,
                "tx_acl_rate_limit_drops": 0,
                "rx_acl_rate_limit_drops": 0
            }
        ];

        setNetWorkUsage(newarr)
        setNetworkTime("11:36")
        let url = `${envConfig.backendBaseUrl}/api/v1/devices/nodenetworkstats/${nodeName}`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.error == false && val.message.toLowerCase() == "get data successfully") {
                        var nodeUsage = val.data && val.data && val.data[0] ? val.data[0] : [];
                        if (nodeUsage && nodeUsage.Info && nodeUsage.Info.length > 0) {
                            let newarr = [];
                            nodeUsage.Info.map((val) => {
                                newarr.push({
                                    ...val,
                                    "tx_bytes": (val.tx_bytes / 1048576).toFixed(2),
                                    "rx_bytes": (val.rx_bytes / 1048576).toFixed(2),

                                },
                                )
                            })
                            setNetWorkUsage(newarr)
                            setNetworkTime(nodeUsage.Time)
                            setLoading(false);
                        } else {
                            setLoading(false);
                            setNetWorkUsage([])
                            setNetworkTime()
                        }
                    }
                    else {
                        setLoading(false);
                        setNetWorkUsage([])
                    }
                })
        }
        catch (e) {
            setLoading(false);
            console.log("Error in node network api call :", e)
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

    const marginLine = { top: 5, right: 15, bottom: 25, left: 30 }
    const margincpu = { top: 5, right: 15, bottom: 50, left: 30 }
    const marginMulLine = { top: 5, right: 15, bottom: 40, left: 30 }
    const marginBar = { top: 15, right: 10, bottom: 25, left: 25 }
    const marginNetwork = { top: 5, right: 5, bottom: 40, left: 35 }
    //Chart view popup function
    const chartView = (type, chartData, stylesObj, name) => {
        setChartFullViewFlag(true);
        setChartFullViewObj({
            chartType: type,
            chartName: name,
            chartData: chartData,
            stylesObj: stylesObj,
        })
    }


    const getNodeInfo = async (nodeName) => {
        let url = `${envConfig.backendBaseUrl}/api/v1/devices/nodeinfo/${nodeName}`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.error == false && val.message.toLowerCase() == "get data successfully") {

                        if (val.data && val.data.length > 0) {

                            let res = val.data[0]

                            let tempInfo = {
                                edgeNodeModel: res && res.EdgeNodeModel ? res.EdgeNodeModel : '',
                                manufacturer: res && res.Manufacturer ? res.Manufacturer : '',
                                version: res && res.Version ? res.Version : '',
                                cpuArch: res && res.CpuArch ? res.CpuArch : '',
                                noOfCpu: res && res.NoOfCpu ? res.NoOfCpu : '',
                                memory: res && res.Memory ? res.Memory : '',
                                storage: res && res.Storage ? res.Storage : '',
                            };


                            setNodeInfoList(tempInfo)
                            setLoading(false);
                        } else {
                            setLoading(false);
                            setNodeInfoList(null);
                        }
                    }
                    else {
                        setLoading(false);
                        setNodeInfoList(null);
                    }
                })
                .catch(err => {
                    setLoading(false);
                    console.log("Error in node info api catch :", err)
                })
        }
        catch (e) {
            setLoading(false);
            console.log("Error in node info try/catch :", e)
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
                        var valObj = val && val.data ? val.data : [];
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

    const handleEventList = (item) => {
        setEventDetails(item)
        setIsFlipped(!isFlipped);
    }

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 2, // Show 5 text items at a time
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

    const textItem1 = [
        { data1: "Instance summary inference : metric data inference 1" },
        { data1: "Memory inference : metric data inference metric data inference 2 " },
        { data1: "App Instance inference : metric data inference 3 " },
    ]

    const textItem2 = [
        { data2: "Events inference: metric data inference 11" },
        { data2: "Network inference : metric data inference metric data inference 22" },
        { data2: "CPU inference : metric data inference 33" },
    ]

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

    if (loading) {
        return <div className="flex justify-center items-end h-96"> <Spinner /></div>
    } else {
        return (
            <>
                <div className='flex flex-col p-3 overflow-x-hidden h-[100%]'>
                    {chartFullViewFlag &&
                        <ChartViewModal open={chartFullViewFlag} chartFullViewObj={chartFullViewObj} onclose={setChartFullViewFlag} />
                    }

                    <div className="flex flex-col m-2 bg-dark rounded-md px-4 py-2 h-[96%]">
                        <div className="flex flex-row h-[10%] py-1">
                            <button className="flex items-center w-[20%]">
                                <ArrowLeftCircleIcon onClick={() => router.back()} className="w-8 h-8 mr-4 text-white hover:text-white" aria-hidden={true} />
                                <p className="py-3 text-white text-xl text-start sm:truncate sm:text-2xl sm:tracking-tight">
                                    {addedgeAppConst.instanceTitle}
                                </p>
                            </button>

                            {/* <div className='w-[80%] px-4 rounded-md overflow-hidden py-2 bg-slate-200'>
                                {textItem1 && textItem1.length > 0 ?
                                    <div>
                                        <Carousel
                                            responsive={responsive}
                                            infinite={true}
                                            // autoPlay={true}
                                            // autoPlaySpeed={2000}
                                            customTransition="all .5"
                                            removeArrowOnDeviceType={['desktop', 'tablet', 'mobile']}
                                        >
                                            {textItem1.map((text, index) => (
                                                <div key={index} className="flex text-start justify-start items-center horizontal-text whitespace-normal sm:truncate sm:text-sm sm:tracking-tight ">
                                                    {text.data1}
                                                </div>
                                            ))}
                                        </Carousel>
                                    </div>
                                    : <div></div>}
                                {textItem2 && textItem2.length > 0 ?
                                    <div>
                                        <Carousel
                                            responsive={responsive}
                                            infinite={true}
                                            // autoPlay={true}
                                            // autoPlaySpeed={2000}
                                            customTransition="all .5"
                                            removeArrowOnDeviceType={['desktop', 'tablet', 'mobile']}
                                        >
                                            {textItem2.map((text, index) => (
                                                <div key={index} className="flex text-start text-sm justify-start items-center horizontal-text whitespace-normal sm:truncate sm:text-sm sm:tracking-tight ">
                                                    {text.data2}
                                                </div>
                                            ))}
                                        </Carousel>
                                    </div>
                                    : <div></div>}
                            </div> */}
                        </div>

                        <div className="flex gap-1 h-[45%]" >
                            {/* App Instance summary */}
                            <div className="flex flex-col shadow-xl justify-center items-center px-4 h-[280px] border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] border-solid[#D7D3D0] ring-2 ring-gray-900/5" style={{ width: '33%', height: "100%" }}>
                                <h2 className="flex  py-2 items-center w-full border-b-2 justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{addedgeAppConst.instanceSummary}</h2>

                                <div className="flex flex-col justify-start items-start w-[95%] h-[95%] pt-2">
                                    <div className="flex flex-row justify-start items-center w-full">
                                        <p className="flex leading-5 text-sm w-[30%]">
                                            {addedgeAppConst.appInstanceInfo.edgeModelName}
                                        </p>
                                        <p className="px-2">{' : '}</p>
                                        <p className="flex leading-5 text-sm w-[70%]">
                                            {/* {nodeInfoList.edgeNodeModel} */}
                                            Test name
                                        </p>
                                    </div>

                                    {/* <div className="flex flex-row justify-start items-center w-full">
                                            <p className="flex leading-5 text-sm w-[30%]">
                                                {addedgeAppConst.appInstanceInfo.manufacturer}
                                            </p>
                                            <p className="px-2">{' : '}</p>
                                            <p className="flex leading-5 text-sm w-[70%]">
                                                {nodeInfoList.manufacturer}
                                            Test
                                            </p>
                                        </div> */}
                                    <div className="flex flex-row justify-start items-center w-full">
                                        <p className="flex leading-5 text-sm w-[30%]">
                                            {addedgeAppConst.appInstanceInfo.status}
                                        </p>
                                        <p className="px-2">{' : '}</p>
                                        <p className="flex leading-5 text-sm w-[70%]">
                                            {/* {nodeInfoList.status} */}
                                            RUNNING
                                        </p>
                                    </div>
                                    <div className="flex flex-row justify-start items-center w-full">
                                        <p className="flex leading-5 text-sm w-[30%]">
                                            {addedgeAppConst.appInstanceInfo.AppContainerName}
                                        </p>
                                        <p className="px-2">{' : '}</p>
                                        <p className="flex leading-5 text-sm w-[70%]">
                                            {/* {nodeInfoList.AppContainerName} */}
                                            Test Container
                                        </p>
                                    </div>
                                    <div className="flex flex-row justify-start items-center w-full">
                                        <p className="flex leading-5 text-sm w-[30%]">
                                            {addedgeAppConst.appInstanceInfo.nCpu}
                                        </p>
                                        <p className="px-2">{' : '}</p>
                                        <p className="flex leading-5 text-sm w-[70%]">
                                            {/* {nodeInfoList.noOfCpu} */}
                                            1
                                        </p>
                                    </div>
                                    <div className="flex flex-row justify-start items-center w-full">
                                        <p className="flex leading-5 text-sm w-[30%]">
                                            {addedgeAppConst.appInstanceInfo.memory}
                                        </p>
                                        <p className="px-2">{' : '}</p>
                                        <p className="flex leading-5 text-sm w-[70%]">
                                            {/* {nodeInfoList.memory} */}
                                            50000
                                        </p>
                                    </div>
                                    <div className="flex flex-row justify-start items-center w-full">
                                        <p className="flex leading-5 text-sm w-[30%]">
                                            {addedgeAppConst.appInstanceInfo.storage}
                                        </p>
                                        <p className="px-2">{' : '}</p>
                                        <p className="flex leading-5 text-sm w-[70%]">
                                            {/* {nodeInfoList.storage} */}
                                            10000
                                        </p>
                                    </div>
                                </div>
                                {/* :
                                    <div className="flex justify-center items-center h-[220px] w-auto ">
                                        <p className='text-base leading-9 '>{computeNodeConst.noData}</p>
                                    </div> */}

                            </div>

                            <div className="relative flex flex-col shadow-xl justify-center items-center px-4 h-[280px] border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] border-solid[#D7D3D0] ring-2 ring-gray-900/5" style={{ width: '33%', height: "100%" }}>
                                <div className="flex flex-row w-full">
                                    <h2 className="flex w-4/5 py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{computeNodeConst.memoryStatus}</h2>
                                    <div className="flex flex-row py-2 mr-8 items-center justify-center w-1/5 border rounded  border-gray-400 h-5 mt-2">
                                        <p className="flex items-center justify-center sm:truncate sm:text-[10px] sm:tracking-tight">
                                            {computeNodeConst.hoursText}
                                        </p>
                                    </div>
                                </div>
                                {nodeMemroyUsage && nodeMemroyUsage.length > 0 ?
                                    <>
                                        <button
                                            onClick={() => chartView("ResponsiveLineChart", nodeMemroyUsage, { lineChartStyle, marginLine }, computeNodeConst.memoryStatus)}
                                            className='absolute right-3 top-2'>
                                            <ArrowsPointingOutIcon className='h-5 w-5' />
                                        </button>
                                        <div className="flex h-[75%] w-full ">
                                            <ResponsiveLineChart chartData={nodeMemroyUsage} lineChartStyle={{ lineChartStyle, marginLine }} type={computeNodeConst.memoryStatus} />
                                        </div>

                                        <div className="flex flex-row h-[25%] w-full leading-none justify-end">
                                            <div className="flex flex-col w-[30%] px-2 pt-3 items-end">
                                                <label className="whitespace-nowrap px-2 pb-1 leading-none text-start text-[10px] text-dark font-normal">{computeNodeConst.used}</label>
                                                <label className="whitespace-nowrap px-2 pb-1 leading-none text-start text-[10px] text-dark font-normal">{computeNodeConst.allocated}</label>
                                                <label className="whitespace-nowrap px-2 pb-1 leading-none text-start text-[10px] text-dark font-normal">{computeNodeConst.total}</label>
                                            </div>
                                            <div className="flex flex-col w-[70%] items-center">
                                                <div className="flex flex-row gap-2 w-full justify-center pb-1">
                                                    {computeNodeConst.columnList.map((node, index) => (
                                                        <label key={index}
                                                            scope="col"
                                                            className="whitespace-nowrap px-2 w-4/5 text-start text-[10px] font-normal leading-none text-dark"
                                                        >
                                                            {node.column}
                                                        </label>
                                                    ))}
                                                </div>
                                                {nodeMemory && nodeMemory.length > 0 && nodeMemory.map((val, index) => (
                                                    <div key={index} className="flex flex-row gap-2 w-full justify-center pb-1">
                                                        <label className="whitespace-nowrap px-2 w-4/5 text-start text-[10px] leading-none font-normal">{val.max ? `${val.max} MB` : "0 MB"}</label>
                                                        <label className="whitespace-nowrap px-2 w-4/5 text-start text-[10px] leading-none font-normal">{val.min ? `${val.min} MB` : '0 MB'}</label>
                                                        <label className="whitespace-nowrap px-2 w-4/5 text-start text-[10px] leading-none font-normal">{val.avg ? `${val.avg} MB` : '0 MB'}</label>
                                                        <label className="whitespace-nowrap px-2 w-4/5 text-start text-[10px] leading-none font-normal">{val.crt ? `${val.crt} MB` : "0 MB"}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <div className="flex justify-center items-center h-[220px] w-auto ">
                                        <p className='text-base leading-9 '>{computeNodeConst.noData}</p>
                                    </div>
                                }
                            </div>

                            <div className="relative flex flex-col shadow-xl justify-center items-center px-4  border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] border-solid[#D7D3D0] ring-2 ring-gray-900/5" style={{ width: '34%' }}>
                                <div className="flex flex-row w-full">
                                    <h2 className="flex w-4/5  py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{computeNodeConst.cpuStatus}</h2>
                                    <div className="flex flex-row mr-8 py-2 items-center justify-center w-1/5 border rounded  border-gray-400 h-5 mt-2">
                                        <p className="flex items-center justify-center  sm:truncate sm:text-[10px] sm:tracking-tight">
                                            {computeNodeConst.hoursText}
                                        </p>
                                    </div>
                                </div>
                                {nodeCpuUsage && nodeCpuUsage.length > 0 ?
                                    <>
                                        <button
                                            onClick={() => chartView("ResponsiveLineChart", nodeCpuUsage, { lineChartStyle, margincpu }, computeNodeConst.cpuStatus)}
                                            className='absolute right-3 top-2'>
                                            <ArrowsPointingOutIcon className='h-5 w-5' />
                                        </button>
                                        <ResponsiveLineChart chartData={nodeCpuUsage} lineChartStyle={{ lineChartStyle, margincpu, }} type={computeNodeConst.cpuStatus} />
                                    </>
                                    :
                                    <div className="flex justify-center items-center h-[220px] w-auto ">
                                        <p className='text-base leading-9 '>{computeNodeConst.noData}</p>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="flex gap-1 h-[45%] py-1">
                            {/* <div className="relative flex flex-col shadow-xl justify-center items-center h-full border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] ring-2 ring-gray-900/5" style={{ width: '33%', }}>
                                <div className="flex flex-row w-full border-b-2 px-2">
                                    <h2 className="flex w-4/6 py-2  h-10 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{computeNodeConst.nodeEvent}</h2>
                                    <div className="flex flex-row py-2 items-center justify-center w-2/6 border rounded  border-gray-400 h-5 mt-2">
                                        <p className="flex items-center justify-center sm:truncate sm:text-[10px] sm:tracking-tight">
                                            {computeNodeConst.hoursEvent}
                                        </p>
                                    </div>
                                </div>
                                {eventListArr && eventListArr.length > 0 ? <ul role="list" className="divide-y my-2 text-sm divide-gray-200 overflow-auto w-full">
                                    {!isFlipped ? eventListArr.map((item, index) => (
                                        <li key={index} className="p-2 m-1 bg-gray-200 rounded-md">
                                            <div className='flex flex-row w-full justify-between items-center'>
                                                <div className='flex flex-col w-full'>
                                                    <div className='flex flex-row'>
                                                        <p className='w-[10%]'>{'Type'}</p> <p className='mx-2'>{':'}</p>
                                                        <p className='w-[90%]'>{item.severity}</p>
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
                                        <p className='text-base leading-9 '>{computeNodeConst.noData}</p>
                                    </div>}
                            </div> */}
                            {/* <div className="relative flex flex-col shadow-xl justify-center items-center px-4 h-[280px] border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] border-solid[#D7D3D0] ring-2 ring-gray-900/5" style={{ width: '34%', height: "100%" }}>
                                <h2 className="flex  py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{nodeStatusName}</h2>
                                {nodeStatusChartData && nodeStatusChartData.length > 0 ?
                                    <>
                                        <button
                                            onClick={() => chartView("ResponsivePieChart", nodeStatusChartData, { pieChartStyle, margin }, nodeStatusName)}
                                            className='absolute right-3 top-2'>
                                            <ArrowsPointingOutIcon className='h-5 w-5' />
                                        </button>
                                        <ResponsivePieChart chartData={nodeStatusChartData} pieChartStyle={{ pieChartStyle, margin }} />
                                    </>
                                    :
                                    <div className="flex justify-center items-center h-[220px] w-auto ">
                                        <p className='text-base leading-9 '>{computeNodeConst.noData}</p>
                                    </div>
                                }
                            </div> */}

                              {/* Event management chart */}
                              <div className="relative flex flex-col shadow-xl justify-center items-center px-4 h-[280px] border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] border-solid[#D7D3D0] ring-2 ring-gray-900/5" style={{ width: '33%', height: "100%" }}>
                                    <div className="flex flex-row w-full">
                                        <h2 className=" flex w-4/5 py-2 items-center  justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{addedgeAppConst.eventMgmt}</h2>
                                        <div className="flex flex-row py-2 mr-8 items-center justify-center w-1/5 border rounded  border-gray-400 h-5 mt-2">
                                            <p className="flex items-center justify-center sm:truncate sm:text-[10px] sm:tracking-tight">
                                                {addedgeAppConst.hoursText}
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
                                                    onClick={() => chartView("ResponsiveMultiLineChart", nodeEventChartData, { lineChartStyle, marginMulLine }, addedgeAppConst.eventMgmt)}
                                                    className='absolute right-3 top-2'>
                                                    <ArrowsPointingOutIcon className='h-5 w-5' />
                                                </button>
                                                <ResponsiveMultiLineChart chartData={nodeEventChartData} lineChartStyle={{ lineChartStyle, marginMulLine }} />
                                            </>
                                            : <div className="flex justify-center items-center h-[220px] w-auto ">
                                                <p className='text-base leading-9 '>{addedgeAppConst.noData}</p>
                                            </div>
                                    }
                                </div>

                            <div className="relative flex flex-col shadow-xl justify-center items-center px-4  border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] ring-2 ring-gray-900/5" style={{ width: '33%' }}>
                                <div className="flex flex-row w-full">
                                    <h2 className="flex w-4/5 py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">{computeNodeConst.netStatus}</h2>
                                    <div className="flex flex-row mr-8 py-2 items-center justify-center w-1/3 border rounded  border-gray-400 h-5 mt-2">
                                        <p className="flex items-center justify-center  sm:truncate sm:text-[10px] sm:tracking-tight pr-2 w-[70%]">
                                            {computeNodeConst.timeStamp}
                                        </p>
                                        <p className="flex items-center justify-center  sm:truncate sm:text-[10px] sm:tracking-tight w-[30%]">
                                            {networkTime ? networkTime : '--:--'}
                                        </p>
                                    </div>
                                </div>
                                {netWorkUsage && netWorkUsage.length > 0 ?
                                    <>
                                        <button
                                            onClick={() => chartView("ResponsiveNetworkBarChart", netWorkUsage, { marginNetwork }, computeNodeConst.netStatus)}
                                            className='absolute right-3 top-2'>
                                            <ArrowsPointingOutIcon className='h-5 w-5' />
                                        </button>
                                        <ResponsiveNetworkBarChart chartData={netWorkUsage} chartStyle={{ marginNetwork }} />
                                    </>
                                    :
                                    <div className="flex justify-center items-center h-[220px] w-auto ">
                                        <p className='text-base leading-9 '>{computeNodeConst.noData}</p>
                                    </div>
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </>
        )
    }
}

export default AppInstanceView; 