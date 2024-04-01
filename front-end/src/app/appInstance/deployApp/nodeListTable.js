
import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import Ripples from 'react-ripples'
//Constant
import { addedgeAppConst } from '@/constant/addedgeAppConst';

//Environment
import { devConfig } from '@/environment/devlopment';
import Spinner from '@/components/Spinner';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const NodeListTable = (props) => {

    const envConfig = devConfig;
    const checkbox = useRef()
    const { nodeData, columndata } = props;
    const [nodeList, setNodeList] = useState(nodeData)
    const [checked, setChecked] = useState(false)
    const [indeterminate, setIndeterminate] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [tableSpinner, setTableSpinner] = useState(false);

    useEffect(() => {
        setChecked(false)
        setIndeterminate(false)
        setNodeList(nodeData)
    }, [nodeData])

    useLayoutEffect(() => {
        const isIndeterminate = selectedItems.length > 0 && selectedItems.length < nodeList.length
        setChecked(selectedItems.length === nodeList?.length)
        setIndeterminate(isIndeterminate)
        checkbox.current.indeterminate = isIndeterminate
    }, [selectedItems])

    function toggleAll() {
        setSelectedItems(checked || indeterminate ? [] : nodeList)
        setChecked(!checked && !indeterminate)
        setIndeterminate(false)
    }

    const ActivateHandler = (node, index) => {
        setTableSpinner(true)
        let formData = node && node.formData ? node.formData : '';
        // console.log('nodeinterfaceListInterface',node,node.interfaceList)
        let interfaceArr = [];
        node.interfaceList.forEach(ele => {
            interfaceArr.push({
                intfname: ele && ele.Interface && ele.Interface.name ? ele.Interface.name : '',
                directattach: ele && ele.Interface && ele.Interface.directattach ? ele.Interface.directattach : false,
                netname: ele && ele.Interface && ele.Interface.type ? ele.Interface.type : '',
                privateip: ele && ele.Interface && ele.Interface.privateip ? ele.Interface.privateip : '',
                acls: ele && ele.Interface && ele.Interface.acls ? ele.Interface.acls : [],
            })
        });

        let appInstancePayload = {
            "name": formData && formData.name ? formData.name : '',
            "appId": node && node.application ? node.application : '',
            "deviceId": formData && formData.node ? formData.node : '',
            "activate": true,
            "interfaces": interfaceArr && interfaceArr.length > 0 ? interfaceArr : [],
        }

        // console.log('app instance list', appInstancePayload);
        applicationInstancePostAPICall(appInstancePayload);
    }

    const applicationInstancePostAPICall = async (params) => {
        let url = `${envConfig.backendBaseUrl}/api/v1/instances`;
        let body = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        }

        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val.error == false && val.message.toLowerCase() == "data saved successfully") {
                        toast.success("Added application instance successfully");
                        setTableSpinner(false);
                        router.push("/appInstance");
                    } else {
                        toast.error("Failed to add application instance");
                        setTableSpinner(false);
                    }
                })
        }
        catch (e) {
            console.log("Error in Application Instance Post API Call:", e)
            setTableSpinner(false)
        }
    }

    return (
        <div className="flow-root md:py-0">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full align-middle sm:px-6 pb-2 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg overflow-y-auto h-[400px]">
                        <table className="min-w-full divide-y divide-gray-300 ">
                            <thead >
                                <tr>
                                    <th scope="col" className="sticky top-0 z-10 sm:w-12 sm:px-6 bg-dark">
                                        <input
                                            type="checkbox"
                                            className=" absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded font-normal border-gray-300 text-blue-900 focus:border-blue-900 focus:border-transparent focus:ring-0 checked:autofill-none"
                                            ref={checkbox}
                                            checked={checked}
                                            onChange={toggleAll}
                                        />
                                    </th>
                                    {columndata.map((node, index) => (
                                        <th key={index}
                                            scope="col"
                                            className="sticky top-0 whitespace-nowrap bg-dark  px-3 py-4 sm:w-12 text-center text-sm  text-white font-normal "
                                        >
                                            {node.column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className=" bg-white">
                                {!tableSpinner && nodeList && nodeList.length > 0 && nodeList.map((node, index) => (
                                    <tr key={index} className={classNames(selectedItems.includes(node) ? 'bg-blue-50' : "bg-white", "border-b-[1px] hover:bg-blue-50")}>
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
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center"> {node && node.appsName ? node.appsName : '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center"> {node && node.application ? node.application : '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">{node && node.nodeName ? node.nodeName : "-"}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                            <div className='flex flex-wrap text-center justify-center items-center'>
                                                {(node && node.interfaceList && node.interfaceList.length > 0 && node.interfaceList.map((val, i) => <span key={i} className='px-1 py-1'>{(val.label + ',') || '-'}</span>)) || '-'}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-1 py-1 text-sm justify-center items-center text-center">
                                            <Ripples>
                                                <button
                                                    className={classNames(node.activate ? "bg-gray-400" : "bg-blue-800 hover:bg-blue-900",
                                                        "rounded-md  px-2 py-2 w-24  text-sm text-white shadow-sm  justify-center items-center")}
                                                    type="button"
                                                    onClick={() => ActivateHandler(node, index)}
                                                    disabled={node.activate}
                                                >
                                                    {node.activate ? addedgeAppConst.activated : addedgeAppConst.activate}
                                                </button>
                                            </Ripples>
                                        </td>
                                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                            <span
                                                className={classNames("Approved" === 'Approved' ? 'bg-green-900 text-white' : "", "rounded-md px-2 py-2 w-24  text-sm text-white shadow-sm")}>
                                                {addedgeAppConst.success}
                                            </span>
                                        </td> */}
                                        {/* <td className="border px-4 py-2">
                                       <span
                                       className={`
                                         first-letter:  inline-block px-2 py-1 rounded-full
                                         ${item.status === 'Pending' ? 'bg-yellow-500 text-white' : ''}
                                         ${item.status === 'Approved' ? 'bg-green-500 text-white' : ''}
                                         ${item.status === 'Rejected' ? 'bg-red-500 text-white' : ''}
                                        `}
                                         >
                                        {item.status}
                                        </span>
                                       </td> */}
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>

                        {tableSpinner &&
                            <div className="flex justify-center items-center h-[250px]">
                                <Spinner />
                            </div>
                        }

                        {!tableSpinner && nodeList && nodeList.length == 0 &&
                            <div className="w-full  justify-center items-center bg-white">
                                <p className='flex text-base h-[250px] leading-9 justify-center items-center'>
                                    {addedgeAppConst.noData}
                                </p>
                            </div>
                        }
                    </div>
                </div>

            </div>
        </div >
    );

}
export default NodeListTable;