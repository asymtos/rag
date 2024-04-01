'use client' //This is client component
import React from "react";
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Ripples from 'react-ripples'
//Icons
import { PlusCircleIcon, } from "@heroicons/react/24/outline";
//Component
import ResponsivePieChart from '../../components/nivoCharts/PieChart'
import ListTable from "./tableView";
import Spinner from "@/components/Spinner";
//Constant
import { computeNodeConst } from "@/constant/nodeConst";
//Environment
import { devConfig } from "@/environment/devlopment";

const NodeMaster = () => {
    const envConfig = devConfig;
    const [nodeStatus, setNodeStatus] = useState('');
    const [nodeStatusChartData, setNodeStatusChartData] = useState([]);
    const [nodeSecondChartData, setNodeSecondChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nodeTableData, setNodeTableData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        getComputeNodeData();
        getComputeNodeStatus();
    }, []);

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
                        if (summaryByState) {
                            var valObj = summaryByState.values ? summaryByState.values : '';
                            const { INACTIVE, ACTIVE, ...firstData } = valObj;
                            const { REGISTERED, CREATED, ...secondData } = valObj;
                            var obj = {
                                name: summaryByState.description ? summaryByState.description : '',
                                total: val.data && val.data.totalCount ? val.data.totalCount : 0
                            }

                            setNodeStatus(obj);
                            var data = [];
                            for (const [key, value] of Object.entries(firstData)) {
                                data.push({
                                    "id": key,
                                    "label": key,
                                    "value": value,
                                })
                            }
                            setNodeStatusChartData(data)
                            var temp = [];
                            for (const [key, value] of Object.entries(secondData)) {
                                temp.push({
                                    "id": key,
                                    "label": key,
                                    "value": value,
                                })
                            }
                            setNodeSecondChartData(temp)
                        }
                    }
                    else {
                        setNodeStatusChartData([])
                        setNodeStatus('')
                    }

                })
        }
        catch (e) {
            setNodeStatusChartData([])
            setNodeStatus('')
        }
    }

    const getComputeNodeData = async () => {

        let url = `${envConfig.backendBaseUrl}/api/v1/devices/`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.message.toLowerCase() == "get data successfully") {
                        var tableData = val.data ? val.data : [];
                        setNodeTableData(tableData)
                        setLoading(false);
                    }
                    else {
                        setLoading(false);
                        setNodeTableData([])
                    }
                })
        }
        catch (e) {
            setLoading(false);
            setNodeTableData([])
        }
    }

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

    const margin = { top: 20, right: 20, bottom: 30, left: 20 }

    const columnList = computeNodeConst.nodeColArr;

    const onAddClick = () => {
        router.push("/node/addNode");
    }

    if (loading) {
        return <div className="flex justify-center items-end h-96"> <Spinner /></div>
    } else {
        return (
            <div className="flex flex-col px-[24px] pt-4 gap-4 ">

                <div className="self-stretch">
                    <p className="text-2xl not-italic leading-9 sans-serif text-black">
                        {computeNodeConst.nodeDashboard}
                    </p>
                </div>

                <div className="flex flex-col px-2 pb-4 border rounded-lg bg-blue-50 border-solid[#D7D3D0] ring-2 ring-gray-900/5 h-[260px] w-auto">
                    <div className="flex flex-row">
                        <p className="flex-row leading-9 sans-serif text-center w-1/3 text-black">{nodeStatus?.name || "Compute Node Status"}</p>
                        <p className="flex-row leading-9 sans-serif text-center w-1/3 text-black">{nodeStatus?.name || "Compute Node Status"}</p>
                    </div>

                    <div className="flex flex-row">
                        {nodeStatusChartData && nodeStatusChartData.length > 0 ?
                            <>
                                <div className="relative flex justify-center items-center h-[220px] w-1/3">
                                    <ResponsivePieChart chartData={nodeStatusChartData} pieChartStyle={{ pieChartStyle, margin }} totalCount={nodeStatus?.total} />
                                </div>
                                <div className="relative flex justify-center items-center h-[220px] w-1/3">
                                    <ResponsivePieChart chartData={nodeSecondChartData} pieChartStyle={{ pieChartStyle, margin }} totalCount={nodeStatus?.total} />
                                </div>
                            </> : <>
                                <div className="relative flex justify-center items-center h-[220px] w-1/3">
                                    <p className='text-base leading-9'>{computeNodeConst.noData}</p>
                                </div>
                                <div className="relative flex justify-center items-center h-[220px] w-1/3">
                                    <p className='text-base leading-9'>{computeNodeConst.noData}</p>
                                </div>
                            </>
                        }
                    </div>
                </div>

                <div className="flex flex-col p-4  shadow-xl border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] ring-2 ring-gray-900/5">
                    <div className="flex flex-row justify-between items-center sm:flex-auto">
                        <h1 className="text-base   leading-6">{computeNodeConst.tableTitle}</h1>
                        <Ripples>
                        <button className="rounded-md bg-dark px-2 py-2 text-sm  text-white shadow-sm hover:bg-blue-800  flex justify-center items-center"
                            type="button"
                            onClick={onAddClick}  >
                            <span>
                                <PlusCircleIcon className="w-5 h-5 mr-1" aria-hidden={true} />
                            </span>
                            {computeNodeConst.addNodeBtn}
                        </button>
                        </Ripples>
                    </div>
                    <ListTable nodeData={nodeTableData} columndata={columnList} />
                </div>

            </div>
        )
    }
}

export default NodeMaster; 