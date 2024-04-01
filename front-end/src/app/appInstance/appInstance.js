
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Ripples from 'react-ripples';
//Icons
import { PencilSquareIcon, TrashIcon, EyeIcon, PlusCircleIcon } from '@heroicons/react/24/outline'

//Constant
import { computeNodeConst } from "@/constant/nodeConst";
import { addedgeAppConst } from '@/constant/addedgeAppConst';
import { devConfig } from '@/environment/devlopment';
import Spinner from '@/components/Spinner';
import ToolTip from '@/components/toolTip';
import PopupModal from '@/components/popupModal';
import { toast } from 'react-hot-toast';
import ResponsivePieChart from '@/components/nivoCharts/PieChart';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const AppInstanceList = () => {
    const envConfig = devConfig;
    const [columndata, setColumndata] = useState(addedgeAppConst.appInstanceCol)
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [nodeList, setNodeList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [itemEdit, setItemEdit] = useState({ "isEdit": false, "itemId": '', 'name': '' });
    const router = useRouter();
    const [popupModalFlag, setPopupModalFlag] = useState(false);
    const [popupModalObj, setPopupModalObj] = useState(
        {
            popupModaltype: '',
            popupModalName: '',
            popupModalMsg: '',
            popupModalData: ''
        }
    )
    const [appInstanceStatus, setAppInstanceStatus] = useState();
    const [totalAppCount, setTotalAppCount] = useState();

    useEffect(() => {
        getNodeInstanceData();
        getComputeAppStatus()
        setColumndata(addedgeAppConst.appInstanceCol)
    }, [])

    const getNodeInstanceData = async () => {

        let url = `${envConfig.backendBaseUrl}/api/v1/instances/`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.message.toLowerCase() == "get data successfully") {
                        var tableData = val.data ? val.data : [];
                        console.log("tableDatatableData", tableData)
                        setPageCount(Math.ceil(tableData?.length / itemsPerPage))
                        setNodeList(tableData.slice(itemOffset, itemOffset + itemsPerPage))
                        setLoading(false);
                    }
                    else {
                        setLoading(false);
                        setNodeList([])
                    }
                })
        }
        catch (e) {
            setLoading(false);
            setNodeList([])
            console.log("Error in get app instance api call :", e)
        }
    }

    const getComputeAppStatus = async () => {
        let url = `${envConfig.backendBaseUrl}/api/v1/instances/appinstcount`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && val.error == false && val.message.toLowerCase() == "get data successfully") {
                        var valObj = val && val.data && val.data.appinstcount ? val.data.appinstcount : [];
                        var totalCount = val && val.data && val.data.totalcount ? val.data.totalcount : '';
                        setTotalAppCount(totalCount);
                        var data = [];
                        for (const [key, value] of Object.entries(valObj)) {
                            data.push({
                                "id": key ? key : "TEST",
                                "label": key ? key : "TEST",
                                "value": value,
                            })
                        }
                        setAppInstanceStatus(data)
                    }
                    else {
                        setAppInstanceStatus([])
                    }
                })
        }
        catch (e) {
            console.log("Error in app status api call :", e)
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

    const handleNextPageClick = () => {
        setCurrentPage(currentPage + 1)
        const newOffset = (currentPage * itemsPerPage) % nodeList.length;
        setItemOffset(newOffset);
        setNodeList(nodeList.slice(newOffset, newOffset + itemsPerPage));
        setSelectedItems([])
        setChecked(false)
    };

    const handlePreviousPageClick = () => {
        setCurrentPage(currentPage - 1)
        const newOffset = itemOffset - itemsPerPage;
        setItemOffset(newOffset);
        setNodeList(nodeList.slice(itemOffset - itemsPerPage, itemOffset));
        setSelectedItems([])
        setChecked(false)
    };

    const onEditItem = (event) => {
        setItemEdit({ ...itemEdit, name: event.target.value })
    }
    const navAppInstanceViewHandler = (nodeName) => {
        router.push("/appInstance/appInstanceView");
        // router.push("/node/nodeDashBoard" + '?' + setQueryString(nodeName));
    }

    const navDoubleClickHandler = (name) => {
        // router.push("/node/nodeDashBoard" + '?' + setQueryString(name));
    }

    const setQueryString = (props) => {
        const params = new URLSearchParams();
        params.set('nodeName', props);
        return params.toString();
    }

    const navConfigurebtnHandler = () => {
        router.push("/appInstance/deployApp");
    }

    //Delete popup function
    const onDeleteHandler = (data) => {
        setPopupModalFlag(true);
        setPopupModalObj({
            popupModaltype: 'delete',
            popupModalName: 'Delete app instance ?',
            popupModalMsg: `This will delete ${data.name} app instance.`,
            popupModalData: data
        })
    }
    // Delete api call
    const handlecallback = async (data) => {
        let url = `${envConfig.backendBaseUrl}/api/v1/instances/id/${data.name}`;
        let body = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val.error == false && val.message.toLowerCase() == "successfully deleted the application instance") {
                        toast.success("Successfully deleted the application instance");
                        const newData = nodeList.filter(item => item.name !== data.name);
                        setPageCount(Math.ceil(newData?.length / itemsPerPage))
                        setNodeList(newData.slice(itemOffset, itemOffset + itemsPerPage))
                    }
                    else {
                        toast.error("Failed to delete the application instance");
                    }
                })
        }
        catch (e) {
            console.log("Error in Application Instance delete API Call:", e)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-end h-96"> <Spinner /></div>
    } else {

        return (
            <div>
                <div className="flex flex-col px-[24px]">
                    {popupModalFlag &&
                        <PopupModal open={popupModalFlag} popupModalObj={popupModalObj} onclose={setPopupModalFlag} callBack={handlecallback} />
                    }
                    <div className="flex flex-col sm:flex-auto mt-4 sm:px-6 lg:px-8 gap-4">
                        <h1 className="text-xl leading-6">{addedgeAppConst.title}</h1>
                        {/* Chart view */}
                        <div className="flex flex-col pb-4 border rounded-lg bg-blue-50 border-solid[#D7D3D0] ring-2 ring-gray-900/5 h-[260px] w-auto">
                            <div className="flex flex-row">
                                <p className="flex-row leading-9 sans-serif text-center w-[550px] text-black">{"App Instance Status"}</p>
                            </div>

                            <div className="flex flex-row">
                                {appInstanceStatus && appInstanceStatus.length > 0 ?
                                    <div className="relative flex justify-center items-center h-[220px] w-[550px]">
                                        {appInstanceStatus && <ResponsivePieChart chartData={appInstanceStatus} pieChartStyle={{ pieChartStyle, margin }} totalCount={totalAppCount} />}
                                    </div>
                                    :
                                    <div className="relative flex justify-center items-center h-[220px] w-[550px]">
                                        <p className='text-base leading-9'>{computeNodeConst.noData}</p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row-reverse mt-4 sm:px-6 lg:px-8'>
                    <Ripples>
                        <button className="rounded-md bg-dark px-2 py-2 text-sm text-white shadow-sm hover:bg-blue-800  flex justify-center items-center"
                            type="button"
                            onClick={navConfigurebtnHandler}  >
                            <span>
                                <PlusCircleIcon className="w-5 h-5 mr-1" aria-hidden={true} />
                            </span>
                            {addedgeAppConst.configurebtn}
                        </button>
                        </Ripples>
                    </div>

                    {/* table view */}
                    <div>
                        <div className="mt-2 flow-root md:py-0">
                            <div className="overflow-x-auto">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead>
                                                <tr>
                                                    {columndata.map((data, index) => (
                                                        <th key={index}
                                                            scope="col"
                                                            className="whitespace-nowrap bg-dark relative px-3 py-4 sm:w-12 text-left text-sm  text-white font-normal "
                                                        >
                                                            {data.column}
                                                        </th>
                                                    ))}
                                                    <th
                                                        scope="col"
                                                        className="bg-dark relative px-3 py-4 sm:w-12 text-center text-sm  font-normal   text-white "
                                                    > {computeNodeConst.tableAction} </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {nodeList && nodeList.length > 0 && nodeList.map((data, index) => (
                                                    <tr key={index} onDoubleClick={() => navDoubleClickHandler(data.name)} className="hover:bg-blue-50">
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-left">{data.name ? data.name : "-"}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-left">{data.appId ? data.appId : '-'}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-left">{data.deviceId ? data.deviceId : "-"}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-left">
                                                            {data.state ? <span
                                                                className={classNames(data.state === 'RUNNING' ? 'bg-green-800' : "bg-gray-500", "rounded-lg px-2 py-1 w-24  text-sm text-white shadow-sm")}>
                                                                {data.state}
                                                            </span> : '-'}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 text-center text-sm font-medium sm:pr-3 w-[14%] text-black-500">
                                                            <div className='flex justify-between'>
                                                                <ToolTip text={computeNodeConst.tableEdit}>
                                                                    <button onClick={() => editAppBundle()}
                                                                        className={classNames(
                                                                            'group flex items-center px-2 py-2 text-sm'
                                                                        )}
                                                                        disabled
                                                                    >
                                                                        <PencilSquareIcon
                                                                            className="mr-3 h-5 w-5 text-green-800 group-hover:text-green-900 cursor-not-allowed"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </button>
                                                                </ToolTip>

                                                                <ToolTip text={computeNodeConst.tableView}>
                                                                    <button
                                                                        className={classNames(
                                                                            'group flex items-center px-2 py-2 text-sm'
                                                                        )}
                                                                        onClick={() => navAppInstanceViewHandler(data.name)}
                                                                    >
                                                                        <EyeIcon
                                                                            className="mr-3 h-5 w-5 text-teal-900 group-hover:text-dark"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </button>
                                                                </ToolTip>

                                                                <ToolTip text={computeNodeConst.tableDelete}>
                                                                    <button
                                                                        className={classNames(
                                                                            'group flex items-center px-2 py-2 text-sm'
                                                                        )}
                                                                        onClick={() => onDeleteHandler(data)}
                                                                    // disabled
                                                                    >
                                                                        <TrashIcon
                                                                            className="mr-3 h-5 w-5 text-red-800 group-hover:text-red-900"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </button>
                                                                </ToolTip>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {nodeList && nodeList.length > 0 ? <></>
                                            : <div className="w-full  justify-center items-center bg-white">
                                                <p className='flex text-base h-[150px] leading-9  justify-center items-center'>
                                                    {computeNodeConst.noData}
                                                </p>
                                            </div>
                                        }

                                        <div>
                                            <nav
                                                className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                                                aria-label="Pagination"
                                            >
                                                <div className="hidden sm:block">
                                                    <p className="text-sm text-gray-700">
                                                        {computeNodeConst.tablePage}
                                                        <span className="">{currentPage}</span> of <span className="">{pageCount}</span>
                                                    </p>
                                                </div>
                                                <div className="flex flex-1 justify-between sm:justify-end">
                                                    {currentPage > 1 ? < button
                                                        onClick={
                                                            handlePreviousPageClick}
                                                        className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm  text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                                                    >
                                                        {computeNodeConst.tablePrevious}
                                                    </button> : <div></div>}
                                                    {currentPage < pageCount ? < button
                                                        onClick={handleNextPageClick}
                                                        className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm  text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                                                    >
                                                        {computeNodeConst.tableNext}
                                                    </button> : <div></div>}
                                                </div>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div>
                </div>
            </div>
        );
    }
}

export default AppInstanceList;