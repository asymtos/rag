import React, { useEffect, useState } from 'react';
import Ripples from 'react-ripples';
//Next import
import { useRouter } from 'next/navigation';

//Constant 
import { computeAppConst } from '@/constant/applicationConst';

//Icons
import { ChevronRightIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
//Environment
import { devConfig } from '@/environment/devlopment';

//Component
import ResponsivePieChart from '@/components/nivoCharts/PieChart';
import Spinner from '@/components/Spinner';
import AppInstance from './appInstanceList';

const ApplicationDashboard = () => {

    const envConfig = devConfig;
    const applicationArr = computeAppConst.categoryListForSideNav;
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [cateListActive, setCateListActive] = useState(0);
    const [cateActiveName, setCateActiveName] = useState("All");
    const [appCategoryChartData, setAppCategoryChartData] = useState();
    const [totalAppCount, setTotalAppCount] = useState();

    useEffect(() => {
        // setCateActiveName()
        getAppCategoryData();
    }, []);

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
                        var totalCount = val && val.data && val.data.totalcount ? val.data.totalcount : '';
                        setTotalAppCount(totalCount);
                        if (valObj) {
                            var data = []
                            for (const [key, value] of Object.entries(valObj)) {
                                data.push({
                                    "id": key,
                                    "label": key,
                                    "value": value,
                                })
                            }
                            setAppCategoryChartData(data);
                            setLoading(false);
                        } else {
                            setAppCategoryChartData([]);
                            setLoading(false);
                        }
                    } else {
                        setAppCategoryChartData([]);
                        setLoading(false);
                    }
                })
        }
        catch (e) {
            console.log('Error in event list api call', e);
            setLoading(false);
        }
    }

    const pieChartStyle = {
        anchor: 'right',
        direction: 'column',
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 4,
        itemWidth: 100,
        itemHeight: 18,
        itemTextColor: '#999',
        itemDirection: 'left-to-right',
        itemOpacity: 1,
        symbolSize: 18,
        symbolShape: 'circle',
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
    const margin = { top: 20, right: 20, bottom: 30, left: 20 }

    const addClickHandler = () => {
        router.push("/application/addApplication");
    }

    const onChangeCategory = (res, i) => {
        let name = res && res.value ? res.value : '';
        setCateListActive(i);
        setCateActiveName(name);
    }


    if (loading) {
        return <div className="flex justify-center items-end h-96"> <Spinner /></div>
    } else {
        return (
            <>
                <div className="flex flex-col px-[24px] pt-4 gap-4 ">

                    <div className="self-stretch">
                        <p className="text-xl not-italic leading-9 sans-serif text-black">
                            {computeAppConst.title}
                        </p>
                    </div>

                    {/* Chart view */}
                    <div className="flex flex-col pb-4 border rounded-lg bg-blue-50 border-solid[#D7D3D0] ring-2 ring-gray-900/5 h-[260px] w-auto px-4">
                        <div className="flex flex-row">
                            <p className="flex-row leading-9 sans-serif text-center w-[550px] text-black">{computeAppConst.appCategory}</p>
                        </div>

                        <div className="flex flex-row">
                            {appCategoryChartData && appCategoryChartData.length > 0 ?
                                <div className="relative flex justify-center items-center h-[220px] w-[550px]">
                                    {appCategoryChartData && <ResponsivePieChart chartData={appCategoryChartData} pieChartStyle={{ pieChartStyle, margin }} totalCount={totalAppCount} />}
                                </div>
                                :
                                <div className="relative flex justify-center items-center h-[220px] w-[550px] ">
                                    <p className='text-base leading-9'>{computeAppConst.noData}</p>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="flex flex-col p-4 mb-4  shadow-xl border rounded-lg bg-[#FDFDFC] border-solid[#D7D3D0] ring-2 ring-gray-900/5">
                        <div className="flex flex-row justify-between items-center sm:flex-auto">
                            <h1 className="text-base  leading-6">{computeAppConst.tableTitle}</h1>
                            <Ripples>
                            <button className="rounded-md bg-dark px-2 py-2 text-sm text-white shadow-sm hover:bg-blue-800  flex justify-center items-center"
                                type="button"
                                onClick={addClickHandler}  >
                                <span>
                                    <PlusCircleIcon className="w-5 h-5 mr-1" aria-hidden={true} />
                                </span>
                                {computeAppConst.addNodeBtn}
                            </button>
                            </Ripples>
                        </div>

                        <div className='flex justify-between w-full'>
                            <div className='ml-2.5 mt-8 w-[23%]'>
                                <ul
                                    role="list"
                                    title='Category'
                                    className="w-full divide-y divide-gray-300 overflow-hidden bg-white shadow-md ring-4 ring-gray-900/5 sm:rounded-xl"
                                >
                                    <li className='px-4 py-3.5 bg-dark sm:px-6'>
                                        <h1 className='leading-6 text-white'>{computeAppConst.category}</h1>
                                    </li>
                                    {applicationArr.map((res, i) => (
                                        <li key={i}
                                            onClick={() => onChangeCategory(res, i)}
                                            className={
                                                (cateListActive === i) ?
                                                    "relative flex cursor-pointer px-4 py-3 bg-blue-200 sm:px-6"
                                                    :
                                                    "relative flex cursor-pointer px-4 py-3 hover:bg-blue-50 sm:px-6"
                                            }
                                        >

                                            <p className="text-sm leading-6 text-gray-900">
                                                {res.name}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* List */}
                            <div className='w-[75%]'>
                                <AppInstance cateActiveName={cateActiveName} />
                            </div>
                        </div>
                    </div>


                </div>
            </>
        )
    }
}

export default ApplicationDashboard;