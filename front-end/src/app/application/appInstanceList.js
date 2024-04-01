
import { useState, useEffect, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

//Next Import
import { useRouter } from 'next/navigation';
import Link from 'next/link';

//Icons
import {
    ArrowDownIcon, ArrowTopRightOnSquareIcon, ArrowUpIcon, EllipsisHorizontalIcon, EyeIcon, PencilSquareIcon, TrashIcon
} from '@heroicons/react/24/outline'

//Constant
import { computeAppConst } from '@/constant/applicationConst';

//Environment
import { devConfig } from '@/environment/devlopment';

//Component
import Spinner from '@/components/Spinner';
import ToolTip from '@/components/toolTip';
import PopupModal from '@/components/popupModal';
import { toast } from 'react-hot-toast';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const AppInstance = (props) => {
    const { cateActiveName } = props;
    const router = useRouter();

    const columndata = computeAppConst.appListCol;
    const envConfig = devConfig;
    const itemsPerPage = 10;
    const [itemOffset, setItemOffset] = useState(0);
    const [appInstanceArr, setAppInstanceArr] = useState([]);

    const [pageCount, setPageCount] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const [appInstanceList, setAppInstanceList] = useState([])
    const [tableSpinner, setTableSpinner] = useState(true);

    const [isSort, setIsSort] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemEdit, setItemEdit] = useState({ "isEdit": false, "itemId": '', 'name': '' });
    const [popupModalFlag, setPopupModalFlag] = useState(false);
    const [popupModalObj, setPopupModalObj] = useState(
        {
            popupModaltype: '',
            popupModalName: '',
            popupModalMsg: '',
            popupModalData: ''
        }
    )

    useEffect(() => {
        getAppInstanceList(cateActiveName);
    }, [cateActiveName,])


    const getAppInstanceList = async (cateActiveName) => {
        setTableSpinner(true);
        let url = `${envConfig.backendBaseUrl}/api/v1/apps/category/${cateActiveName}`;
        let body = {
            method: 'GET'
        }

        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    // console.log("Csdcscszc", val)
                    if (val && (val.error == false) && (val.message.toLowerCase() == "get data successfully") && val.data) {
                        if (val.data && val.data.length > 0) {
                            let temp = [];
                            val.data.forEach(ele => {
                                temp.push({
                                    id: ele && ele.id ? ele.id : '',
                                    name: ele && ele.name ? ele.name : '',
                                    title: ele && ele.title ? ele.title : '',
                                    description: ele && ele.description ? ele.description : '',
                                    Uuid: ele && ele.Uuid ? ele.Uuid : '',
                                    appType: ele && ele.manifestjson && ele.manifestjson.appType ? ele.manifestjson.appType : '',
                                    deploymentType: ele && ele.manifestjson && ele.manifestjson.deploymentType ? ele.manifestjson.deploymentType : '',
                                    version: ele && ele.userDefinedVersion ? ele.userDefinedVersion : '',
                                    appCategory: ele && ele.manifestjson && ele.manifestjson.desc && ele.manifestjson.desc.appCategory ? ele.manifestjson.desc.appCategory : '',
                                    logo: ele && ele.logo ? ele.logo : '',
                                    license: ele && ele.license ? ele.license : '',
                                })
                            });

                            setPageCount(Math.ceil(temp.length / itemsPerPage));
                            setCurrentItems(temp.slice(itemOffset, itemOffset + itemsPerPage))

                            setAppInstanceList(temp.slice(itemOffset, itemOffset + itemsPerPage))
                            setAppInstanceArr(temp);
                            setTableSpinner(false);
                        }
                        else {
                            setAppInstanceArr([]);
                            setAppInstanceList([]);
                            setTableSpinner(false);
                        }
                    } else {
                        setTableSpinner(false)
                        setAppInstanceArr([]);
                        setAppInstanceList([]);
                    }
                });
        }
        catch (e) {
            setTableSpinner(false)
        }

    }

    function onIDSort() {
        setIsSort(!isSort)
        if (isSort == true) {
            const numDescending = [...appInstanceList].sort((a, b) => a.name - b.name);
            setAppInstanceList(numDescending)
        } else {
            const numAscending = [...appInstanceList].sort((a, b) => b.name - a.name);
            setAppInstanceList(numAscending)
        }
    }

    const handleNextPageClick = () => {
        setCurrentPage(currentPage + 1)
        const newOffset = (currentPage * itemsPerPage) % appInstanceArr.length;
        setItemOffset(newOffset);
        setAppInstanceList(appInstanceArr.slice(newOffset, newOffset + itemsPerPage));

    };

    const handlePreviousPageClick = () => {
        setCurrentPage(currentPage - 1)
        const newOffset = itemOffset - itemsPerPage;
        setItemOffset(newOffset);
        setAppInstanceList(appInstanceArr.slice(itemOffset - itemsPerPage, itemOffset));
    };

    const onEditItem = (event) => {
        setItemEdit({ ...itemEdit, name: event.target.value })
    }

    const rowClickHandler = (name) => {
        router.push('/application/applicationView')
    }

    const editAppBundle = (rowData) => {
        setItemEdit({ "isEdit": true, "itemId": rowData.uuid, "name": rowData.name })
    }

    //Delete popup function
    const deleteAppBundle = (data) => {
        setPopupModalFlag(true);
        setPopupModalObj({
            popupModaltype: 'delete',
            popupModalName: 'Delete application ?',
            popupModalMsg: `This will delete ${data.name} application.`,
            popupModalData: data
        })
    }
    // Delete api call
    const handlecallback = async (data) => {
        console.log(" Delete api call", data)
        let url = `${envConfig.backendBaseUrl}/api/v1/apps/id/${data.name}`;
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
                    if (val.error == false) {
                        toast.success("Successfully deleted the application bundle");
                        const newData = appInstanceList.filter(item => item.name !== data.name);
                        setPageCount(Math.ceil(newData.length / itemsPerPage));
                        setAppInstanceList(newData.slice(itemOffset, itemOffset + itemsPerPage));
                    }
                    else {
                        toast.error("Failed to delete the application bundle");
                    }
                })
        }
        catch (e) {
            console.log("Error in Application bundle delete API Call:", e)
        }
    }

    const viewNode = (app) => {
        router.push("/application/applicationView" + '?' + setQueryString(app));
    }

    const setQueryString = (props) => {
        const params = new URLSearchParams();
        params.set('value', props.name);
        return params.toString();
    }

    return (

        <div className="mt-8 flow-root md:py-0">
            {popupModalFlag &&
                <PopupModal open={popupModalFlag} popupModalObj={popupModalObj} onclose={setPopupModalFlag} callBack={handlecallback} />
            }
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-auto h-[65vh] shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="table-auto min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr className='bg-dark sticky top-0 z-10'>
                                    {columndata.map((app, index) => (
                                        <th key={index}
                                            scope="col"
                                            className="whitespace-nowrap px-3 py-4 sm:w-12 text-center text-sm text-white font-normal"
                                        >
                                            {app.name === "name" ?
                                                <button className="group inline-flex" onClick={onIDSort}>
                                                    {app.name}
                                                    <span className="flex-none rounded text-gray-900">
                                                        {isSort == true ? <ArrowUpIcon className="h-5 w-8 text-white" aria-hidden="true" /> : < ArrowDownIcon className="h-5 w-8 text-white" aria-hidden="true" />}
                                                    </span>
                                                </button> : app.name}
                                        </th>
                                    ))}


                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {!tableSpinner && appInstanceList.map((app, index) => (
                                    <tr key={index} className="border-b-[1px] hover:bg-blue-50">
                                        <td className="relative whitespace-nowrap px-3 py-4 text-sm text-center">
                                            {app.name || "-"}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">{app.appCategory || '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">{app.description || '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">{app.deploymentType || "-"}</td>
                                        <td className="whitespace-nowrap py-4 text-center text-sm font-medium sm:pr-3 w-[14%] text-black-500">
                                            {/* <Menu as="div" className="relative inline-block">
                                                <Menu.Button>
                                                    <EllipsisHorizontalIcon className="-ml-0.5 h-5 w-8" aria-hidden="true" />
                                                </Menu.Button>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <div className="py-1">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button onClick={() => editAppBundle(app)}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                            'group flex items-center px-4 py-2 text-sm w-40'
                                                                        )}
                                                                        disabled
                                                                    >

                                                                        <PencilSquareIcon
                                                                            className="mr-3 h-5 w-5 text-gray-700 group-hover:text-gray-900"
                                                                            aria-hidden="true"
                                                                        />
                                                                        {computeAppConst.edit}
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        </div>
                                                        <div className="py-1">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100 text-blue-900' : 'text-dark',
                                                                            'group flex items-center px-4 py-2 text-sm w-40'
                                                                        )}
                                                                        disabled
                                                                    >

                                                                        <TrashIcon
                                                                            className="mr-3 h-5 w-5 text-dark group-hover:text-blue-900"
                                                                            aria-hidden="true"
                                                                        />
                                                                        {computeAppConst.delete}
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        </div>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu> */}

                                            <div className='flex justify-between'>

                                                <ToolTip text={computeAppConst.edit}>
                                                    <button onClick={() => editAppBundle(app)}
                                                        className={classNames(
                                                            'group flex items-center px-2 py-2 text-sm'
                                                        )}
                                                        disabled
                                                    >
                                                        <PencilSquareIcon
                                                            className="mr-3 h-5 w-5 text-green-800 group-hover:text-green-900 cursor-not-allowed"
                                                            aria-hidden="true"
                                                        />
                                                        {/* {computeAppConst.edit} */}
                                                    </button>
                                                </ToolTip>

                                                <ToolTip text={computeAppConst.view}>
                                                    <button
                                                        className={classNames(
                                                            'group flex items-center px-2 py-2 text-sm'
                                                        )}
                                                        onClick={() => viewNode(app)}
                                                    >
                                                        <EyeIcon
                                                            className="mr-3 h-5 w-5 text-teal-900 group-hover:text-dark"
                                                            aria-hidden="true"
                                                        />
                                                        {/* {computeAppConst.view} */}
                                                    </button>
                                                </ToolTip>

                                                <ToolTip text={computeAppConst.delete}>
                                                    <button
                                                        className={classNames(
                                                            'group flex items-center px-2 py-2 text-sm'
                                                        )}
                                                        onClick={() => deleteAppBundle(app)}
                                                    // disabled
                                                    >
                                                        <TrashIcon
                                                            className="mr-3 h-5 w-5 text-red-800 group-hover:text-red-900"
                                                            aria-hidden="true"
                                                        />
                                                        {/* {computeAppConst.delete} */}
                                                    </button>
                                                </ToolTip>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                                }

                            </tbody>
                        </table>

                        {tableSpinner &&
                            <div className="flex justify-center items-center h-[55vh] ">
                                <Spinner />
                            </div>
                        }

                        {!tableSpinner && appInstanceList && appInstanceList.length == 0 &&
                            <div className="flex justify-center items-center h-[55vh] ">
                                <p className='text-md leading-9 text-black '>
                                    {computeAppConst.noData}
                                </p>
                            </div>

                        }


                    </div>
                    <div className='shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"'>
                        <nav
                            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                            aria-label="Pagination"
                        >
                            <div className="hidden sm:block">
                                <p className="text-sm">
                                    {computeAppConst.page}
                                    <span>{' ' + currentPage + ' of ' + pageCount}</span>
                                </p>
                            </div>
                            <div className="flex flex-1 justify-between sm:justify-end">
                                {currentPage > 1 ? < button
                                    onClick={
                                        handlePreviousPageClick}
                                    className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                                >
                                    {computeAppConst.previous}
                                </button> : <div></div>}
                                {currentPage < pageCount ? < button
                                    onClick={handleNextPageClick}
                                    className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                                >
                                    {computeAppConst.next}
                                </button> : <div></div>}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div >
    );

}

export default AppInstance;