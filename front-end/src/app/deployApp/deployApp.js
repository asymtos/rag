//react
import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";

// const
import { addedgeAppConst } from "@/constant/addedgeAppConst";

//Environment file
import Spinner from "@/components/Spinner";
import { devConfig } from '@/environment/devlopment';
import NodeListTable from "./nodeListTable";


const DeployEdgeApp = () => {

    const envConfig = devConfig;
    const data = {
        name: '',
        appBundle: '',
        node: '',
    }

    const [formData, setFormData] = useState(data);
    const [loading, setLoading] = useState(true);
    const [edgeAppArr, seteEdgeAppArr] = useState([])
    const [nodeArr, setNodeArr] = useState([])
    const [edgeAppname, setEdgeAppname] = useState('');
    const [selectedNodeData, setSelectedNodeData] = useState();
    const [appInterfaceArr, setAppInterfaceArr] = useState([])
    const [selectedInterface, setSelectedInterface] = useState([]);
    const [nodeTableData, setNodeTableData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [nodeName, setNodeName] = useState('');


    useEffect(() => {

        getAppDataList();
        getNodeDataList();
    }, [])

    const getAppDataList = async () => {

        let url = `${envConfig.backendBaseUrl}/api/v1/apps/`;
        let body = {
            method: 'GET'
        }

        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && (val.error == false) && (val.message.toLowerCase() == "get data successfully") && val.data) {
                        if (val.data && val.data.length > 0) {
                            seteEdgeAppArr(val.data);
                            setLoading(false);
                        }
                        else {
                            seteEdgeAppArr([]);
                            setLoading(false)
                        }
                    } else {
                        seteEdgeAppArr([]);
                        setLoading(false)
                    }
                });
        }
        catch (e) {
            setLoading(false)
            seteEdgeAppArr([]);
        }
    }

    const getNodeDataList = async () => {

        let url = `${envConfig.backendBaseUrl}/api/v1/devices/`;
        let body = {
            method: 'GET'
        }

        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && (val.error == false) && (val.message.toLowerCase() == "get data successfully") && val.data) {
                        if (val.data && val.data.length > 0) {
                            setNodeArr(val.data);
                            setLoading(false)
                        }
                        else {
                            setNodeArr([]);
                            setLoading(false)
                        }
                    } else {
                        setNodeArr([]);
                        setLoading(false)
                    }
                });
        }
        catch (e) {
            setLoading(false)
            setNodeArr([]);
        }
    }

    const getselectedAppData = async (appId) => {
        // console.log("appIdappId",appId)
        let url = `${envConfig.backendBaseUrl}/api/v1/apps/id/${appId}`;
        let body = {
            method: 'GET'
        }

        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    // console.log("valvalvalvalvalvalvalvalvalvalvalintrfacee",val)
                    if (val && (val.error == false) && (val.message.toLowerCase() == "get data successfully") && val.data) {
                        if (val.data) {
                            setAppInterfaceArr([]);
                            setSelectedInterface([]);

                            if (val.data.manifestjson && val.data.manifestjson.interfaces && val.data.manifestjson.interfaces.length > 0) {
                                var temp = [];
                                val.data.manifestjson.interfaces.map((val) => {
                                    temp.push({
                                        label: val && val.name ? val.name : '',
                                        value: Math.random(),
                                        Interface: { ...val }
                                    })
                                })
                                setAppInterfaceArr(temp)
                            } else {
                                setAppInterfaceArr([]);
                                setSelectedInterface([]);
                            }

                        }
                        else {
                            setAppInterfaceArr([]);
                            setSelectedInterface([]);
                        }
                    } else {
                        setAppInterfaceArr([]);
                        setSelectedInterface([]);
                    }
                });
        }
        catch (e) {
            console.log("Error select app api call:", e)
        }
    }



    const NodeHandler = async (e) => {
        const { name, value } = e.target;
        if (value) {
            setFormData({ ...formData, [name]: value });

            // let filterVal = nodeArr.find((res) => {
            //     return res.id === value;
            // })
            // let appName = filterVal && filterVal != undefined ? filterVal.name : '';

            setNodeName(value);

            // await getselectedNodeData(e.target.value);
        }
    }

    const onChangeEdgeApp = async (e) => {
        const { name, value } = e.target;
        if (value) {
            setFormData({ ...formData, [name]: value })

            let filterVal = edgeAppArr.find((res) => {
                return res.id === value;
            })
            let appName = filterVal && filterVal != undefined ? filterVal.name : '';

            setEdgeAppname(appName);
            await getselectedAppData(value);
        }
    }


    const SelectHandler = async (e) => {
        // console.log("datadatadata", selectedNodeData, selectedInterface, edgeAppname)
        let tempObj = {
            application: edgeAppname ? edgeAppname : '',
            nodeName: nodeName ? nodeName : '',
            appsName: formData && formData.name ? formData.name : '',
            interfaceList: selectedInterface && selectedInterface.length > 0 ? selectedInterface : [],
            formData: formData ? formData : '',
            activate: false
        }

        // await setSelectedData([...selectedData, tempObj]); //For multiple data
        setSelectedData([tempObj]); // Single data

    }

    const clearField = () => {
        setFormData(data);
        setSelectedInterface([]);
    }

    const columnList = [
        {
            column: 'Application Name',
            id: 1
        },
        {
            column: 'Compute Node',
            id: 2
        },
        {
            column: 'Interfaces',
            id: 3
        },
        {
            column: 'Activate',
            id: 4
        },
        {
            column: 'Status',
            id: 5
        },
    ]

    const handleFieldChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    if (loading) {
        return <div className="flex justify-center items-end h-96"> <Spinner /></div>
    } else {
        return (
            <div>
                <div className="flex flex-col px-[24px]">
                    <div className="self-stretch py-1">
                        <p className="text-xl not-italic leading-9 sans-serif text-black">
                            {addedgeAppConst.title}
                        </p>
                    </div>
                    <div className='ring-2 ring-gray-900/5 shadow-l flex flex-col p-4 border rounded-lg bg-inherit border-solid[#D7D3D0] gap-10 justify-center items-center'>

                        <div className="flex flex-row w-full gap-24">
                            {/* Name */}

                            <div className="w-1/5">
                                <label htmlFor="name" className="block text-sm  leading-6 text-gray-900">
                                    {addedgeAppConst.name}
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        placeholder='Apps Name'
                                        onChange={handleFieldChange}
                                        required
                                        className="block rounded-md w-full border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row w-full gap-24">
                            {/* edgeApp */}
                            <div className="w-1/4">
                                <label htmlFor="edgeApp1" className="block text-sm leading-6 text-gray-900">
                                    {addedgeAppConst.AddEdgeLabel}
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="appBundle"
                                        name="appBundle"
                                        className="mt-2 block w-full h-10 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6 placeholder:text-sm placeholder:text-gray-400"
                                        placeholder='Select Application'
                                        onChange={onChangeEdgeApp}
                                        required
                                    >
                                        <option value={''}>Select Application</option>
                                        {edgeAppArr.map((data, i) => (
                                            <option key={i} value={data.id}>{data.name ? data.name : ""}</option>
                                        ))
                                        }
                                    </select>
                                </div>
                            </div>

                            {/*multiple nodes */}
                            {/* <div className="w-1/3">
                                <label htmlFor="nodeArr" className="block text-sm leading-6 text-gray-900">
                                    {addedgeAppConst.nodeLabel}
                                </label>
                                <div className="mt-2">
                                    <MultiSelect
                                        options={nodeArr}
                                        value={nodeData}
                                        hasSelectAll={false}
                                        onChange={setNodeData}
                                        className='w-full text-sm '
                                    />
                                </div>
                            </div> */}

                            {/* node */}
                            <div className="w-1/4">
                                <label htmlFor="node1" className="block text-sm leading-6 text-gray-900">
                                    {addedgeAppConst.nodeLabel}
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="node"
                                        name="node"
                                        className="mt-2 block w-full h-10 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6 placeholder:text-sm placeholder:text-gray-400"
                                        placeholder='Select Node'
                                        onChange={NodeHandler}
                                        required
                                    // value={formData.node}
                                    >
                                        <option value={''}>Select  Node</option>
                                        {nodeArr.map((data, i) => (
                                            <option key={i} value={data.name}>{data.name ? data.name : "-"}</option>
                                        ))
                                        }
                                    </select>
                                </div>
                            </div>

                            {/* interface */}
                            <div className="w-1/3">
                                <label htmlFor="inter" className="block text-sm leading-6 text-gray-900">
                                    {addedgeAppConst.nodeInterfaceLabel}
                                </label>
                                <div className="mt-2">
                                    <MultiSelect
                                        options={appInterfaceArr}
                                        value={selectedInterface}
                                        hasSelectAll={false}
                                        onChange={setSelectedInterface}
                                        className='w-full text-sm '
                                    />
                                </div>
                            </div>

                            <div className="pt-8 w-40">
                                <button className="rounded-md bg-dark px-2 py-2 w-full h-10 text-sm text-white shadow-sm hover:bg-blue-800 flex justify-center items-center"
                                    type="button"
                                    onClick={SelectHandler}
                                >
                                    {addedgeAppConst.selectbtn}
                                </button>
                            </div>
                        </div>

                        <div className="w-full">
                            <NodeListTable nodeData={selectedData} columndata={columnList} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DeployEdgeApp;