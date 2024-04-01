import React, { useEffect, useRef, useState } from "react";
import Ripples from 'react-ripples'
//Environment
import { devConfig } from "@/environment/devlopment";
//Icons
import { ArrowUpTrayIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
//components
import Spinner from "@/components/Spinner";
import { ConvertImageToIntBase64 } from "@/utils/conversion";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const MLOpsApplication = () => {
    const [loading, setLoading] = useState(true)
    const envConfig = devConfig;
    const data = {
        appInstanceName: '',
        selectApi: '',
        inputUpload: '',
    }
    const [formData, setFormData] = useState(data);
    const [appInstanceArr, setAppInstanceArr] = useState([])
    const fileUploadInput = useRef(null);
    const [inputUploadFileName, setInputUploadFileName] = useState('');
    const [inputUploadFile, setInputUploadFile] = useState();
    const [appInstanceSelectedData, setAppInstanceSelectedData] = useState()
    const [apiInput, setApiInput] = useState(false);
    const [predictions, setPredictions] = useState();
    const [apiPath, setApiPath] = useState([]);
    const [inputLoader, setInputLoader] = useState(false);
    const [apiPathLoader, setApiPathLoader] = useState(false);

    useEffect(() => {
        getAppDataList();

    }, [])

    const getAppDataList = async () => {
        let url = `${envConfig.backendBaseUrl}/api/v1/instances/`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    if (val && (val.error == false) && (val.message.toLowerCase() == "get data successfully") && val.data) {
                        if (val.data && val.data.length > 0) {
                            setAppInstanceArr(val.data);
                            setLoading(false);
                        }
                        else {
                            setAppInstanceArr([]);
                            setLoading(false)
                        }
                    } else {
                        setAppInstanceArr([]);
                        setLoading(false)
                    }
                });
        }
        catch (e) {
            setLoading(false)
            console.log('Error in app instance api call in MLOps page :', e)
        }
    }

    const getApiPathData = async (instanceName) => {
        setApiPathLoader(true);
        let url = `${envConfig.backendBaseUrl}/api/v1/instances/id/${instanceName}`;
        let body = {
            method: 'GET'
        }
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    console.log("dcscvv", val)
                    if (val && (val.error == false) && (val.message.toLowerCase() == "get data successfully") && val.data) {
                        if (val.data && val.data.length > 0) {
                            setApiPath(val.data);
                            setApiPathLoader(false);
                        }
                        else {
                            setApiPath([]);
                            setApiPathLoader(false);
                        }
                    } else {
                        setApiPath([]);
                        setApiPathLoader(false);
                    }
                });
        }
        catch (e) {
            console.log('Error api call in apipath :', e)
            setApiPathLoader(false);
        }
    }

    const handleFieldChange = (event) => {

        setApiInput(false);
        setFormData({ ...formData, ["inputUpload"]: '' })
        setInputUploadFile();
        setInputUploadFileName();
        setApiPath([]);

        const { name, value } = event.target;
        if (value) {
            let filterVal = appInstanceArr.find((res) => {
                return res.id === value;
            })
            setAppInstanceSelectedData(filterVal)
            let instanceName = filterVal && filterVal.name ? filterVal.name : '';
            setFormData({ ...formData, [name]: instanceName })
            getApiPathData(instanceName);
        } else {
            setAppInstanceSelectedData();
            setFormData({ ...formData, [name]: "" })
        }
    }

    const handleFieldChangeapi = (event) => {
        setInputLoader(true);
        setApiInput(false);
        setFormData({ ...formData, ["inputUpload"]: '' })
        setInputUploadFile();
        setInputUploadFileName();

        const { name, value } = event.target;
        if (value) {
            // let filterVal = apiPath.find((res) => {
            //     return res.path === value;
            // })
            // let newValue = filterVal && filterVal.actionInput ? filterVal.actionInput : false;
            setApiInput(true)
            setFormData({ ...formData, [name]: value })
            setInputLoader(false);
        } else {
            setApiInput();
            setFormData({ ...formData, [name]: "" })
            setInputLoader(false);
        }
    }

    const uploadFileHandler = async (event) => {
        event.preventDefault();
        let file = event.target.files;
        if (file && file.length > 0) {
            let name = file[0] && file[0].name ? file[0].name : '';
            let inputFileData;
            try {
                inputFileData = await ConvertImageToIntBase64(file[0]);
                setFormData({ ...formData, [event.target.name]: inputFileData })
                setInputUploadFile(file[0]);
                setInputUploadFileName(name);
            }
            catch (err) {
                console.log('upload image catch err', err)
            }
        }
    }

    const CheckAllInputBool = () => {
        if (appInstanceSelectedData?.state === "RUNNING" && formData && formData.selectApi && formData.selectApi != null) {
            if (apiInput === true) {
                return inputUploadFile ? true : false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    const selectHandler = async (e) => {
        e.preventDefault();
        console.log("formdata======>", formData,)

        let param = {}
        if (inputUploadFile && apiInput === true) {
            const NewFormData = new FormData();
            NewFormData.append('file', inputUploadFile);

            // Log the FormData entries
            for (const pair of NewFormData.entries()) {
                console.log("formdata2222", pair[0], pair[1]);
            }

            param = {
                method: 'POST',
                body: NewFormData,
            }

        } else {
            param = {
                method: 'GET'
            }
        }

        if (formData?.selectApi) {
            console.log("URL=>", formData?.selectApi, "paramparam=>", param)
            try {
                const response = await fetch(formData?.selectApi, param);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setPredictions(result?.predictions);
                console.log("result11111", result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        } else {
            console.log('Endpoint not selected');
        }

    };

    if (loading) {
        return <div className="flex justify-center items-end h-96"> <Spinner /></div>
    } else {
        return (
            <>
                <div className='flex flex-col p-3 overflow-x-hidden h-[100%] bg-stone-100'>
                    <div className="flex flex-col m-2 gap-1 rounded-md ring-2 ring-gray-900/5 shadow-l border border-solid[#D7D3D0] bg-white px-4 py-2 h-[98%]">
                        <div className="flex flex-row h-16">
                            <p className="py-3 text-start sm:truncate sm:text-xl sm:tracking-tight">
                                AI Solution Engine
                            </p>
                        </div>
                        <form className="w-full" onSubmit={selectHandler}>
                            <div className="flex flex-row justify-between items-center px-4 gap-6 w-full h-24">
                                <div className="flex flex-row gap-8 w-[65%]">
                                    {/*App Instance Name */}
                                    <div className="w-[50%]">
                                        <label htmlFor="edgeApp" className="block text-sm leading-6 text-gray-900">
                                            App Instance Name *
                                        </label>
                                        <div className="flex flex-row justify-between gap-1 items-end">
                                            <div className="w-3/4">
                                                <select
                                                    id="appInstanceName"
                                                    name="appInstanceName"
                                                    className="mt-2 block w-full h-10 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6 placeholder:text-sm placeholder:text-gray-400"
                                                    placeholder='Select App Instance'
                                                    onChange={handleFieldChange}
                                                    required
                                                >
                                                    <option value={''}>Select App Instance</option>
                                                    {appInstanceArr.map((data, i) => (
                                                        <option key={i} value={data.id}>{data.name ? data.name : "-"}</option>
                                                    ))
                                                    }
                                                </select>
                                            </div>

                                            {appInstanceSelectedData && Object.keys(appInstanceSelectedData).length > 0 ?

                                                appInstanceSelectedData?.state === "RUNNING" ? <span className="inline-flex justify-center items-center w-24 h-6 py-1 px-1 rounded-full text-sm text-white bg-green-800">
                                                    Active
                                                    <CheckCircleIcon className="w-5 h-5 ml-2" aria-hidden="true" />
                                                </span>
                                                    : <span className="inline-flex justify-center items-center w-24 h-6 py-1 px-1 rounded-full text-sm text-white bg-red-500">
                                                        Inactive
                                                        <XCircleIcon className="w-5 h-5 ml-1" aria-hidden="true" />
                                                    </span>
                                                : <div></div>
                                            }

                                        </div>
                                    </div>
                                    {/* select api's */}
                                    <div className="w-[40%]">
                                        {/* <label htmlFor="edgeApp" className="block text-sm leading-6 text-gray-900">
                                            Select Endpoint *
                                        </label>
                                        {apiPathLoader ? <div className="flex justify-center h-10"> <Spinner /></div> :
                                            <div className="mt-2 w-full">
                                                <select
                                                    id="selectApi"
                                                    name="selectApi"
                                                    className="mt-2 block w-full h-10 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6 placeholder:text-sm placeholder:text-gray-400"
                                                    placeholder='Select Endpoint'
                                                    onChange={handleFieldChangeapi}
                                                    required
                                                >
                                                    <option value={''}>Select Endpoint</option>
                                                    {apiPath.map((data, i) => (
                                                        <option key={i} value={data.path}>{data.path ? data.path : "-"}</option>
                                                    ))
                                                    }
                                                </select>
                                            </div>
                                        }
                                    </div> */}

                                        <label htmlFor="edgeApp" className="block text-sm leading-6 text-gray-900">
                                            Enter Endpoint *
                                        </label>
                                        {apiPathLoader ? <div className="flex justify-center h-10"> <Spinner /></div> :
                                            <div className="mt-2 w-full">
                                                <input
                                                    id="selectApi"
                                                    name="selectApi"
                                                    type="text"
                                                    autoComplete="Enter Endpoint"
                                                    placeholder='Enter Endpoint'
                                                    onChange={handleFieldChangeapi}
                                                    required
                                                    className="mt-2 block w-full h-10 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6 placeholder:text-sm placeholder:text-gray-400"
                                                />
                                            </div>
                                        }
                                    </div>

                                </div>

                                <div className="flex flex-row items-center w-[25%]">
                                    {inputLoader === true ? <div className="flex justify-center w-10/12 mt-5"> <Spinner /></div> : apiInput === true ?
                                        <div className='w-11/12'>
                                            <label htmlFor="inputData2" className="block text-sm leading-6 text-gray-900">
                                                Input Data/upload *
                                            </label>
                                            <div className="mt-2 flex justify-start rounded-lg border border-dashed bg-white border-gray-900/25">
                                                <div onClick={() => fileUploadInput.current.click()} className="m-2 flex ">
                                                    <button type='button'
                                                        className='rounded-md bg-gray-300 px-3 py-1.5 text-sm text-gray-600 shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800'
                                                    >
                                                        Input Data/upload
                                                    </button>
                                                    <ArrowUpTrayIcon className="mx-auto h-6 w-6 ml-2 m-1 text-gray-400" aria-hidden="true" />
                                                </div>
                                                <input
                                                    hidden
                                                    id="inputUpload"
                                                    name="inputUpload"
                                                    type="file"
                                                    // accept=".pdf,.png"
                                                    ref={fileUploadInput}
                                                    required
                                                    onChange={uploadFileHandler}
                                                />
                                            </div>

                                            <div className='ml-2'>
                                                <span className='text-sm'>{inputUploadFileName}</span>
                                            </div>
                                        </div> : <></>}
                                </div>
                                <div className="pt-8 w-40">
                                    <Ripples className="w-full">
                                        <button className={classNames(CheckAllInputBool() ? 'text-white bg-dark' : 'text-gray-200 bg-gray-500',
                                            "rounded-md  px-2 py-2 w-full h-10 text-sm shadow-smflex justify-center items-center"
                                        )}
                                            type="submit"
                                            disabled={CheckAllInputBool() ? false : true}
                                        >
                                            submit
                                        </button>
                                    </Ripples>
                                </div>
                            </div>
                        </form>
                        <div className="flex flex-col mt-6 px-4 gap-4">
                            <div className="flex flex-row h-10">
                                <p className="py-3 text-start sm:truncate sm:text-base sm:tracking-tight">
                                    Output
                                </p>
                            </div>
                            {predictions ?
                                <div className="flex rounded-md ring-2 ring-gray-900/5 shadow-l border border-solid[#D7D3D0] bg-white px-4 py-2">
                                    <ul className="list-disc ml-5 w-full">
                                        {predictions.map((prediction, index) => (
                                            <div key={index} className='flex flex-row gap-2 w-full'>
                                                <p className="w-[20%] p-1">Class: {prediction.class}</p>
                                                <p className="w-[80%] p-1">Score: {prediction.score}</p>
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                                : <></>}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default MLOpsApplication; 