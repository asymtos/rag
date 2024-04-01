import React, { Fragment } from "react";
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from 'next/navigation';
//Icons
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
//Environment
import { devConfig } from "@/environment/devlopment";
//Util
import { titleCase } from "@/utils/conversion";
//components
import ResponsivePieChart from '../../../components/nivoCharts/PieChart';
import ResponsiveLineChart from '../../../components/nivoCharts/LineChart';
import Spinner from "@/components/Spinner";
import { computeAppConst } from "@/constant/applicationConst";
import ResponsiveBarChartGrouped from "@/components/nivoCharts/BarChartGrouped";

const ApplicationView = () => {
    const envConfig = devConfig;

    const [appBundleDetail, setAppBundleDetail] = useState(null);
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const [userArr, setUserArr] = useState(computeAppConst.userData);
    const [onExpand, setOnExpand] = useState(null);


    const queryParams = useSearchParams();

    const appId = queryParams.get("value");


    useEffect(() => {
        getAppBundleDetail(appId);
        setUserArr(computeAppConst.userData)
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

    const margin = { top: 20, right: 20, bottom: 30, left: 20 }

    const getAppBundleDetail = async (id) => {

        let url = `${envConfig.backendBaseUrl}/api/v1/apps/${id}`;

        let body = {
            method: 'GET'
        }

        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.error == false && val.message.toLowerCase() == "get data successfully") {

                        if (val.data) {
                            let res = val.data;

                            let tempObj = {
                                appName: res.name ? res.name : '',
                                title: res.title ? res.title : '',
                                description: res.description ? res.description : '',
                                imageName: res.imagename ? res.imagename : '',
                                imageArc: res.imagearchitecture ? res.imagearchitecture : '',
                                imagePath: res.imagepath ? res.imagepath : '',
                                imageSize: res.imagesize ? res.imagesize : 0,
                                interfaces: res.manifestjson && res.manifestjson.interfaces && res.manifestjson.interfaces.length > 0 ? res.manifestjson.interfaces : [],
                                deploymentType: res.manifestjson && res.manifestjson.deploymentType ? res.manifestjson.deploymentType : '',
                                appCategory: res.manifestjson && res.manifestjson.desc && res.manifestjson.desc.appCategory ? res.manifestjson.desc.appCategory : '',
                                logo: res.logo ? res.logo : '',
                                license: res.license ? res.license : '',
                                version: res.userDefinedVersion ? res.userDefinedVersion : '',
                            }

                            setLoading(false);
                            setAppBundleDetail(tempObj);
                        }
                        else {
                            setLoading(false);
                            setAppBundleDetail(null);
                        }

                    }
                    else {
                        setLoading(false);
                        setAppBundleDetail(null);
                    }

                })
        }
        catch (e) {
            setLoading(false);
            setAppBundleDetail(null)
        }

    }


    const marginLine = { top: 15, right: 10, bottom: 50, left: 25 }

    const lineChartStyle = {
        anchor: 'bottom-left',
        direction: 'row',
        justify: false,
        translateX: -15,
        translateY: 45,
        itemsSpacing: 5,
        itemDirection: 'left-to-right',
        itemWidth: 100,
        itemHeight: 16,
        itemOpacity: 0.75,
        symbolSize: 12,
        itemsSpacing: 10,
        symbolShape: 'circle',
        symbolBorderColor: 'rgba(0, 0, 0, .5)',
        toggleSerie: true,
        effects: [
            {
                on: 'hover',
                style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                }
            }
        ]
    }

    const marginBar = { top: 15, right: 10, bottom: 25, left: 25 }

    function TableExpandedRow(intf, onExpand) {
        return (
            <>

                {intf.name == onExpand && (
                    <>
                        <tr className="bg-blue-50">
                            <td></td>

                            {intf.acls.map((res, i) => (
                                <td key={i}>
                                    <div className="flex flex-col h-[125px] m-2">
                                        <h2 className="flex items-center justify-start lg:text-base leading-7 sm:truncate sm:text-sm sm:tracking-tight">{res.name}</h2>
                                        <div className="border-b-2 mb-2 border-gray-300 w-[50%]"></div>
                                        <div>
                                            {res.matches.map((mat, i) => (
                                                <div key={i} className="flex flex-row justify-start items-start">
                                                    <p className="text-sm w-[35%]">
                                                        {titleCase(mat.type)}
                                                    </p>
                                                    <p className='pr-2'>{':'}</p>
                                                    <p className="text-sm whitespace-normal w-[52%]">
                                                        {mat.value || '-'}
                                                    </p>
                                                </div>
                                            ))
                                            }
                                        </div>

                                    </div>
                                </td>
                            ))}

                        </tr>
                    </>
                )}
            </>
        );
    }

    const onExpanded = (name) => {
        if (name === onExpand) {
            setOnExpand(null);
        } else {
            setOnExpand(name);
        }
    };
    function expandableButton(toggle, name) {
        return (
            <>
                <button onClick={() => toggle(name)}>
                    <svg
                        className="w-3 h-3  dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 8"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={
                                name === onExpand
                                    ? "M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"
                                    : "m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
                            }
                        />
                    </svg>
                </button>
            </>
        );
    }

    if (loading) {
        return <div className="flex justify-center items-end h-96"> <Spinner /></div>
    } else {
        return (
            <div className="flex flex-col px-[24px] pt-4 gap-4">
                <div className="flex flex-col self-stretch">
                    <button className="flex items-center gap-[4px]">
                        <ArrowLeftCircleIcon onClick={() => router.back()} className="w-8 h-8 mr-4 hover:text-blue-800 " aria-hidden={true} />
                        <p className="text-xl not-italic font-semibold leading-9 sans-serif text-[#1C1917]">
                            {computeAppConst.applicationView.viewTitle}
                        </p>
                    </button>
                </div>

                <div className="flex w-full gap-3">
                    <div className="flex w-[70%] gap-4" >
                        <div className="flex flex-col mb-2 text-sm overflow-auto w-full p-2 gap-y-4">

                            {appBundleDetail && appBundleDetail.appName ?
                                <>

                                    <div className="flex flex-col">
                                        <h2 className="flex  pb-2 items-center justify-start lg:text-base leading-7 sm:truncate sm:text-sm sm:tracking-tight">Indentity</h2>

                                        <div className="flex flex-row flex-wrap gap-y-3 ring-2 ring-gray-900/5 rounded-lg shadow-lg p-4">
                                            <div className="flex flex-row justify-start items-start w-[33%]">
                                                <p className="text-sm w-[48%]">
                                                    Application Name
                                                </p>
                                                <p className='pr-2'>{':'}</p>
                                                <p className="text-sm whitespace-normal w-[52%]">
                                                    {appBundleDetail.appName || '-'}
                                                </p>
                                            </div>
                                            <div className="flex flex-row justify-start items-start w-[33%]">
                                                <p className="text-sm w-[50%]">
                                                    Application Category
                                                </p>
                                                <p className='pr-2'>{':'}</p>
                                                <p className="text-sm whitespace-normal w-[50%]">
                                                    {appBundleDetail.appCategory || '-'}
                                                </p>
                                            </div>
                                            <div className="flex flex-row justify-start items-start w-[33%]">
                                                <p className="text-sm w-[45%]">
                                                    Deployment Type
                                                </p>
                                                <p className='pr-2'>{':'}</p>
                                                <p className="text-sm whitespace-normal w-[55%]">
                                                    {appBundleDetail.deploymentType || '-'}
                                                </p>
                                            </div>
                                            <div className="flex flex-row justify-start items-start w-[33%]">
                                                <p className="text-sm w-[50%] ">
                                                    Description
                                                </p>
                                                <p className='pr-2'>{':'}</p>
                                                <p className="text-sm whitespace-normal w-[50%]">
                                                    {appBundleDetail.description || '-'}
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="flex  pb-2 items-center justify-start lg:text-base leading-7 sm:truncate sm:text-sm sm:tracking-tight">Image Details</h2>

                                        <div className="flex flex-row flex-wrap gap-y-3 ring-2 ring-gray-900/5 rounded-lg shadow-lg p-4">
                                            <div className="flex flex-row justify-start items-start w-[33%]">
                                                <p className="text-sm w-[48%]">
                                                    Image Name
                                                </p>
                                                <p className='pr-2'>{':'}</p>
                                                <p className="text-sm whitespace-normal w-[52%]">
                                                    {appBundleDetail.imageName || '-'}
                                                </p>
                                            </div>
                                            <div className="flex flex-row justify-start items-start w-[33%]">
                                                <p className="text-sm w-[50%]">
                                                    Image Architecture
                                                </p>
                                                <p className='pr-2'>{':'}</p>
                                                <p className="text-sm whitespace-normal w-[50%]">
                                                    {appBundleDetail.imageArc || '-'}
                                                </p>
                                            </div>
                                            <div className="flex flex-row justify-start items-start w-[33%]">
                                                <p className="text-sm w-[45%]">
                                                    Image Path
                                                </p>
                                                <p className='pr-2'>{':'}</p>
                                                <p className="text-sm whitespace-normal w-[55%]">
                                                    {appBundleDetail.imagePath || '-'}
                                                </p>
                                            </div>
                                            <div className="flex flex-row justify-start items-start w-[33%]">
                                                <p className="text-sm w-[48%]">
                                                    Image Size
                                                </p>
                                                <p className='pr-2'>{':'}</p>
                                                <p className="text-sm whitespace-normal w-[52%]">
                                                    {appBundleDetail.imageSize || '-'}
                                                </p>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <h2 className="flex  pb-2 items-center justify-start lg:text-base leading-7 sm:truncate sm:text-sm sm:tracking-tight">Interfaces</h2>

                                        <div className="flex flex-row flex-wrap gap-y-3 ring-2 ring-gray-900/5 rounded-lg shadow-lg p-4">
                                            <table className="table-auto min-w-full divide-y divide-gray-300 border">
                                                <thead>
                                                    <tr className='bg-blue-200 sticky top-0 z-10'>

                                                        <th scope="col"
                                                            className="whitespace-nowrap px-3 py-4 sm:w-12 text-center text-sm font-normal">
                                                        </th>

                                                        <th scope="col"
                                                            className="whitespace-nowrap px-3 py-4 sm:w-12 text-center text-sm font-normal"
                                                        >
                                                            {'Name'}
                                                        </th>

                                                        <th scope="col"
                                                            className="whitespace-nowrap px-3 py-4 sm:w-12 text-center text-sm font-normal"
                                                        >
                                                            {'Type'}
                                                        </th>

                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {appBundleDetail.interfaces.map((inf, index) => (
                                                        <Fragment key={index}>
                                                            <tr className="border-b-[1px]">
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                                                                    {expandableButton(onExpanded, inf.name)}
                                                                </td>
                                                                <td className="relative whitespace-nowrap px-3 py-4 text-sm text-center">
                                                                    {inf.name || "-"}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-center">{inf.type || '-'}</td>

                                                            </tr>
                                                            {TableExpandedRow(inf, onExpand)}
                                                        </Fragment>
                                                    ))
                                                    }

                                                </tbody>
                                            </table>

                                        </div>
                                    </div>

                                </>
                                :
                                <div className="flex justify-center items-center h-[220px] w-auto ">
                                    <p className='text-base leading-9 '>No data found</p>
                                </div>
                            }
                        </div>

                        {/* <div className="flex flex-col shadow-xl justify-center items-center px-4 h-[280px] border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] border-solid[#D7D3D0] ring-2 ring-gray-900/5" style={{ width: '33%' }}>
                        <h2 className="flex  py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">Performance Metrics</h2>
                        {performanceMetrics && performanceMetrics.length > 0 ? <ResponsiveLineChart chartData={performanceMetrics} lineChartStyle={{ lineChartStyle, marginLine }} /> :
                            <div className="flex justify-center items-center h-[220px] w-auto ">
                                <p className='text-base leading-9 '>No data found</p>
                            </div>
                        }
                    </div> */}

                        {/* <div className="flex flex-col shadow-xl justify-center items-center px-4 h-[280px] border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] border-solid[#D7D3D0] ring-2 ring-gray-900/5" style={{ width: '33%' }}>
                        <h2 className="flex  py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">Memory usage</h2>
                        {nodeMemroyUsage && nodeMemroyUsage.length > 0 ? <ResponsiveLineChart chartData={nodeMemroyUsage} lineChartStyle={{ lineChartStyle, marginLine }} /> :
                            <div className="flex justify-center items-center h-[220px] w-auto ">
                                <p className='text-base leading-9 '>No data found</p>
                            </div>
                        }
                    </div> */}

                    </div>

                    <div className="border-l-2 border-gray-300"></div>

                    <div className="flex w-[30%]" >

                        {/* User Activity */}
                        <div className="flex w-11/12 flex-col justify-center items-center px-4 h-52 bg-[#FDFDFC] ">
                            <h2 className="flex  py-2 items-center justify-center lg:text-base leading-7 sm:truncate sm:text-sm sm:tracking-tight">User Activity</h2>
                            {userArr && userArr.length > 0 ? <ResponsivePieChart chartData={userArr} pieChartStyle={{ pieChartStyle, margin }} /> :
                                <div className="flex justify-center items-center h-[220px] w-auto ">
                                    <p className='text-base leading-9 '>No data found</p>
                                </div>
                            }
                        </div>

                        {/*    <div className="flex flex-col shadow-xl justify-center items-center px-4 h-[280px] border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] border-solid[#D7D3D0] ring-2 ring-gray-900/5" style={{ width: '33%' }}>
                        <h2 className="flex  py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">Application </h2>
                        {nodeMemroyUsage && nodeMemroyUsage.length > 0 ? <ResponsiveBarChartGrouped chartData={nodeMemroyUsage} barChartStyle={{ marginBar }} /> :
                            <div className="flex justify-center items-center h-[220px] w-auto ">
                                <p className='text-base leading-9 '>No data found</p>
                            </div>
                        }
                    </div>

                    <div className="flex flex-col shadow-xl justify-center items-center px-4 h-[280px] border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] border-solid[#D7D3D0] ring-2 ring-gray-900/5" style={{ width: '33%' }}>
                        <h2 className="flex  py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">Network status</h2>
                        {nodeCpuUsage && nodeCpuUsage.length > 0 ? <ResponsiveLineChart chartData={nodeCpuUsage} lineChartStyle={{ lineChartStyle, marginLine }} /> :
                            <div className="flex justify-center items-center h-[220px] w-auto ">
                                <p className='text-base leading-9 '>No data found</p>
                            </div>
                        }
                    </div>
                    <div className="flex flex-col shadow-xl justify-center items-center px-4 h-[280px] border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] border-solid[#D7D3D0] ring-2 ring-gray-900/5" style={{ width: '33%' }}>
                        <h2 className="flex  py-2 items-center justify-center lg:text-base leading-7 text-gray-900 sm:truncate sm:text-sm sm:tracking-tight">CPU status</h2>
                        {nodeCpuUsage && nodeCpuUsage.length > 0 ? <ResponsiveLineChart chartData={nodeCpuUsage} lineChartStyle={{ lineChartStyle, marginLine }} /> :
                            <div className="flex justify-center items-center h-[220px] w-auto ">
                                <p className='text-base leading-9 '>No data found</p>
                            </div>
                        }
                    </div>*/}
                    </div>
                </div>



            </div>
        )
    }
}

export default ApplicationView; 