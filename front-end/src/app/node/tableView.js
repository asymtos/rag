
import { useLayoutEffect, useRef, useState, Fragment, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'

//Icons
import {
    EllipsisHorizontalIcon, ArrowDownIcon, ArrowUpIcon, DocumentDuplicateIcon, ArrowsRightLeftIcon, PencilSquareIcon,
    TrashIcon, EyeIcon
} from '@heroicons/react/24/outline'

//Constant
import { computeNodeConst } from "@/constant/nodeConst";
//Component
import ToolTip from '@/components/toolTip';
import PopupModal from '@/components/popupModal';
import { devConfig } from '@/environment/devlopment';
import { toast } from 'react-hot-toast';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const ListTable = (props) => {
    const checkbox = useRef()
    const { nodeData, columndata } = props;
    const itemsPerPage = 10;
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(Math.ceil(nodeData?.length / itemsPerPage));
    const [currentItems, setCurrentItems] = useState(nodeData.slice(itemOffset, itemOffset + itemsPerPage));
    const [nodeList, setNodeList] = useState(currentItems)
    const [checked, setChecked] = useState(false)
    const [indeterminate, setIndeterminate] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [isSort, setIsSort] = useState(false)
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
    const envConfig = devConfig;


    useLayoutEffect(() => {
        const isIndeterminate = selectedItems.length > 0 && selectedItems.length < nodeList?.length
        setChecked(selectedItems.length === nodeList?.length)
        setIndeterminate(isIndeterminate)
        checkbox.current.indeterminate = isIndeterminate
    }, [selectedItems])

    function toggleAll() {
        setSelectedItems(checked || indeterminate ? [] : nodeList)
        setChecked(!checked && !indeterminate)
        setIndeterminate(false)
    }
    useEffect(() => {
        if (isSort == true) {
            const numAscending = [...currentItems].sort((a, b) => a.name - b.name);
            setNodeList(numAscending)
        } else {
            const numDescending = [...currentItems].sort((a, b) => b.name - a.name);
            setNodeList(numDescending)
        }
    }, [currentItems, isSort])


    function onIDSort() {
        setIsSort(!isSort)
        if (isSort == true) {
            const numDescending = [...currentItems].sort((a, b) => a.name - b.name);
            setNodeList(numDescending)
        } else {
            const numAscending = [...currentItems].sort((a, b) => b.name - a.name);
            setNodeList(numAscending)
        }
    }

    const handleNextPageClick = () => {
        setCurrentPage(currentPage + 1)
        const newOffset = (currentPage * itemsPerPage) % nodeData.length;
        setItemOffset(newOffset);
        setCurrentItems(nodeData.slice(newOffset, newOffset + itemsPerPage));
        setSelectedItems([])
        setChecked(false)
    };

    const handlePreviousPageClick = () => {
        setCurrentPage(currentPage - 1)
        const newOffset = itemOffset - itemsPerPage;
        setItemOffset(newOffset);
        setCurrentItems(nodeData.slice(itemOffset - itemsPerPage, itemOffset));
        setSelectedItems([])
        setChecked(false)
    };

    const onEditItem = (event) => {
        setItemEdit({ ...itemEdit, name: event.target.value })
    }
    const nodeViewHandler = (nodeName) => {
        router.push("/node/nodeDashBoard" + '?' + setQueryString(nodeName));
    }

    // const doubleClickHandler = (name) => {
    //     router.push("/node/nodeDashBoard" + '?' + setQueryString(name));
    // }

    const setQueryString = (props) => {
        const params = new URLSearchParams();
        params.set('nodeName', props);
        return params.toString();
    }

    //Delete popup function
    const deleteNode = (data) => {
        setPopupModalFlag(true);
        setPopupModalObj({
            popupModaltype: 'delete',
            popupModalName: 'Delete compute node ?',
            popupModalMsg: `This will delete ${data.name} compute node.`,
            popupModalData: data
        })
    }
    // Delete api call
    const handlecallback = async (data) => {
        // console.log("xsx",data)
        let url = `${envConfig.backendBaseUrl}/api/v1/devices/id/${data.name}`;
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
                        toast.success("Successfully deleted the compute node");
                        const newData = nodeList.filter(item => item.name !== data.name);
                        setPageCount(Math.ceil(newData?.length / itemsPerPage));
                        setCurrentItems(newData.slice(itemOffset, itemOffset + itemsPerPage));
                        setNodeList(currentItems);
                    }
                    else {
                        toast.error("Failed to delete the compute node");
                    }
                })
        }
        catch (e) {
            console.log("Error in node delete API Call:", e)
        }
    }

    return (

        <div className="mt-8 flow-root md:py-0">
            {popupModalFlag &&
                <PopupModal open={popupModalFlag} popupModalObj={popupModalObj} onclose={setPopupModalFlag} callBack={handlecallback} />
            }
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="relative  sm:w-12 sm:px-6 bg-dark">
                                        <input
                                            type="checkbox"
                                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded font-normal border-gray-300 text-blue-900 focus:border-blue-900 focus:border-transparent focus:ring-0 checked:autofill-none"
                                            ref={checkbox}
                                            checked={checked}
                                            onChange={toggleAll}
                                        />
                                    </th>
                                    {columndata.map((node, index) => (
                                        <th key={index}
                                            scope="col"
                                            className="whitespace-nowrap bg-dark relative px-3 py-4 sm:w-12 text-left text-sm  text-white font-normal "
                                        >
                                            {node.column === "name" ?
                                                <button className="group inline-flex" onClick={onIDSort}>
                                                    {node.column}
                                                    <span className="flex-none rounded text-gray-900">
                                                        {isSort == true ? <ArrowUpIcon className="h-5 w-8 text-white" aria-hidden="true" /> : < ArrowDownIcon className="h-5 w-8 text-white" aria-hidden="true" />}
                                                    </span>
                                                </button> : node.column}
                                        </th>
                                    ))}
                                    <th
                                        scope="col"
                                        className="bg-dark relative px-3 py-4 sm:w-12 text-center text-sm  font-normal   text-white "
                                    > {computeNodeConst.tableAction} </th>
                                    {/* <th scope="col" className="white space-nowrap py-4 pr-4 text-right text-sm  sm:pr-3 text-sm  text-gray-500">
                                        <Menu as="div" className="relative inline-block text-left">
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
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <div className="py-1">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    className={classNames(
                                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                        'group flex items-center px-4 py-2 text-sm'
                                                                    )}
                                                                >
                                                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M23.3333 15V14.3333C23.3333 13.3999 23.3333 12.9332 23.1517 12.5766C22.9919 12.263 22.7369 12.0081 22.4233 11.8483C22.0668 11.6666 21.6001 11.6666 20.6667 11.6666H19.3333C18.3999 11.6666 17.9332 11.6666 17.5767 11.8483C17.2631 12.0081 17.0081 12.263 16.8483 12.5766C16.6667 12.9332 16.6667 13.3999 16.6667 14.3333V15M18.3333 19.5833V23.75M21.6667 19.5833V23.75M12.5 15H27.5M25.8333 15V24.3333C25.8333 25.7334 25.8333 26.4335 25.5608 26.9683C25.3212 27.4387 24.9387 27.8211 24.4683 28.0608C23.9335 28.3333 23.2335 28.3333 21.8333 28.3333H18.1667C16.7665 28.3333 16.0665 28.3333 15.5317 28.0608C15.0613 27.8211 14.6788 27.4387 14.4392 26.9683C14.1667 26.4335 14.1667 25.7334 14.1667 24.3333V15" stroke="#79716B" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                    Delete All
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </th> */}

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {nodeList && nodeList.length > 0 && nodeList.map((node, index) => (
                                    <tr key={index} className={classNames(selectedItems.includes(node) ? 'bg-blue-50' : undefined, "hover:bg-blue-50")}>
                                        <td className="relative px-7 sm:w-12 sm:px-6 ">
                                            <input
                                                type="checkbox"
                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-900 focus:border-blue-900 focus:border-transparent focus:ring-0"
                                                value={index}
                                                checked={selectedItems.includes(node)}
                                                onChange={(e) =>
                                                    setSelectedItems(
                                                        e.target.checked
                                                            ? [...selectedItems, node]
                                                            : selectedItems.filter((p) => p !== node)
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-left">{node.name ? node.name : "-"}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-left">{node.serialno ? node.serialno : '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-left">{node.adminState ? node.adminState : '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-left">{node.location ? node.location : "-"}</td>
                                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm">{node.Project}</td> */}
                                        <td className="whitespace-nowrap py-4 text-center text-sm  sm:pr-3 w-[10%] text-black-500">
                                            {/* <Menu as="div" className="relative inline-block text-left">
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
                                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <div className="py-1">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <a onClick={() => { setItemEdit({ "isEdit": true, "itemId": node.uuid, "name": node.name }) }}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                            'group flex items-center px-4 py-2 text-sm'
                                                                        )}
                                                                    >

                                                                        <PencilSquareIcon
                                                                            className="mr-3 h-5 w-5 text-gray-700 group-hover:text-gray-900"
                                                                            aria-hidden="true"
                                                                        />
                                                                        {computeNodeConst.tableEdit}
                                                                    </a>
                                                                )}
                                                            </Menu.Item>
                                                        </div>

                                                        <div className="py-1">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <a onClick={() => nodeViewHandler(node.name)}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                            'group flex items-center px-4 py-2 text-sm'
                                                                        )}
                                                                    >

                                                                        <EyeIcon
                                                                            className="mr-3 h-5 w-5 text-gray-700 group-hover:text-gray-900"
                                                                            aria-hidden="true"
                                                                        />
                                                                        {computeNodeConst.tableView}
                                                                    </a>
                                                                )}
                                                            </Menu.Item>
                                                        </div>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu> */}

                                            <div className='flex justify-between'>

                                                <ToolTip text={computeNodeConst.tableEdit}>
                                                    <button onClick={() => { setItemEdit({ "isEdit": true, "itemId": node.uuid, "name": node.name }) }}
                                                        className={classNames(
                                                            'group flex items-center px-2 py-2 text-sm'
                                                        )}
                                                        disabled
                                                    >
                                                        <PencilSquareIcon
                                                            className="mr-3 h-5 w-5 text-green-800 group-hover:text-green-900 cursor-not-allowed"
                                                            aria-hidden="true"
                                                        />
                                                        {/* {computeNodeConst.tableEdit} */}
                                                    </button>
                                                </ToolTip>

                                                <ToolTip text={computeNodeConst.tableView}>
                                                    <button onClick={() => nodeViewHandler(node.name)}
                                                        className={classNames(
                                                            'group flex items-center px-2 py-2 text-sm'
                                                        )}
                                                    >
                                                        <EyeIcon
                                                            className="mr-3 h-5 w-5 text-teal-900 group-hover:text-dark"
                                                            aria-hidden="true"
                                                        />
                                                        {/* {computeNodeConst.tableView} */}
                                                    </button>
                                                </ToolTip>

                                                <ToolTip text={computeNodeConst.delete}>
                                                    <button
                                                        className={classNames(
                                                            'group flex items-center px-2 py-2 text-sm'
                                                        )}
                                                        onClick={() => deleteNode(node)}
                                                    // disabled
                                                    >
                                                        <TrashIcon
                                                            className="mr-3 h-5 w-5 text-red-800 group-hover:text-red-900"
                                                            aria-hidden="true"
                                                        />
                                                        {/* {computeNodeConst.delete} */}
                                                    </button>
                                                </ToolTip>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                                }
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
    );

}

export default ListTable;