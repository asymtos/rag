import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { Disclosure } from '@headlessui/react';
import Ripples from 'react-ripples'
//Icon
import { ChevronRightIcon, PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

//Constant
import { computeNodeConst } from '@/constant/nodeConst';

//Next Import
import { useRouter } from 'next/navigation';
import Image from 'next/image';

//Environment file
import { devConfig } from '@/environment/devlopment';

//Component
import Spinner from '@/components/Spinner';
import { ConvertImageToIntBase64 } from '@/utils/conversion';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const AddNode = () => {

    const envConfig = devConfig;
    const data = {
        name: '',
        computeType: '',
        description: '',
        assetId: '',
        assetLocation: '',
        identityType: '',
        serialNo: '',
        brand: '',
        model: '',
        onboardingKey: '',
        uploadNodeCert: '',
        activateNode: true,
        defaultApp: false,
    }
    const router = useRouter();
    const [portMapFlag, setPortMapFlag] = useState(false);
    const [identityTypeArr, setIdentityTypeArr] = useState(computeNodeConst.identityTypeArr);
    const [brandListArr, setBrandListArr] = useState([]);
    const [modalListArr, setModalListArr] = useState([]);
    const [eachModalObj, setEachModalObj] = useState({})
    const [identityTypeName, setIdentityTypeName] = useState("");
    const [formData, setFormData] = useState(data);
    const [nodeCertFile, setNodeCertFile] = useState('');
    const [nodeCertFileName, setNodeCertFileName] = useState('');
    const fileUploadInput = useRef(null);
    const [interfaceUsageArray, setinterfaceUsageArray] = useState([]);
    const [savebuttonFlag, setSavebuttonFlag] = useState(false);
    const [enableModelField, setEnableModelField] = useState(false);
    const [modelLoading, setModelLoading] = useState(false);
    const [modelInputField, setModelInput] = useState('');


    useEffect(() => {
        getBrandList();
    }, [])


    const getBrandList = async () => {

        let url = `${envConfig.backendBaseUrl}/api/v1/brands`;
        let params = {
            method: 'GET'
        }

        try {
            await fetch(url, params)
                .then(res => res.json())
                .then(brandVal => {
                    if (brandVal && (brandVal.error == false) && (brandVal.message.toLowerCase() === "get data successfully") && brandVal.data) {
                        let data = brandVal.data && brandVal.data.length > 0 ? brandVal.data : null;

                        let temp = [];
                        if (data && data.length > 0) {
                            data.forEach((res) => {
                                temp.push({
                                    name: res && res.Brand ? res.Brand : '',
                                    model: res && res.model ? res.model : '',
                                });
                            })
                            setBrandListArr(temp);
                        }
                        else {
                            setBrandListArr([]);
                        }

                    }
                    else {
                        setBrandListArr([]);
                    }
                }).catch((err) => {
                    console.log('Brand list catch error=', err);
                })
        }
        catch (e) {
            console.log("Brand list error= ", e);
        }
    }

    const addTagField = (i) => {
        if (interfaceUsageArray && interfaceUsageArray[i] && interfaceUsageArray[i].taglist && interfaceUsageArray.length > 0) {
            const temp = [...interfaceUsageArray];
            temp[i].taglist = [...temp[i].taglist, {
                key: '',
                value: ''
            }]
            setinterfaceUsageArray(temp)
        }
    }

    const removeTagField = (i, index) => {
        if (interfaceUsageArray && interfaceUsageArray[i] && interfaceUsageArray[i].taglist && interfaceUsageArray.length > 0) {
            const temp = [...interfaceUsageArray];
            const newarray = temp[i].taglist;
            newarray.splice(index, 1);
            temp[i].taglist = newarray
            setinterfaceUsageArray(temp)
        }
    }

    const handleTagChange = (e, i, index) => {
        if (interfaceUsageArray && interfaceUsageArray.length > 0) {
            e.preventDefault();
            const { name, value } = e.target;
            let tagsVal = [...interfaceUsageArray];
            if (tagsVal && tagsVal.length > 0 && tagsVal[i] && tagsVal[i].taglist.length > 0) {
                tagsVal[i].taglist[index][name] = value;
            }
            setinterfaceUsageArray(tagsVal)
        }
    }

    const handleModelChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setModelInput(value);

        if (value) {
            setModelLoading(true);
            getModelDetail(value);
        }
        else {
            setPortMapFlag(false);
            setModelLoading(false);


        }
    }

    const handleIdentityTypeChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value })
        setIdentityTypeName(value);


    }

    const handleBrandChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });

        setModelInput('');
        setPortMapFlag(false);
        setEachModalObj({});

        if (value) {
            let temp = [];
            let filterModel = brandListArr.find((res) => {
                return res.name.toLowerCase() === value.toLowerCase();
            })

            let modelList = filterModel && filterModel != undefined &&
                filterModel.model && filterModel.model.length > 0 ? filterModel.model : [];

            modelList.forEach((model) => {
                temp.push({
                    name: model && model.modelname ? model.modelname : ''
                });
            });

            setModalListArr(temp);

            setEnableModelField(true);
        }
        else {
            setModalListArr([]);
            setEnableModelField(false);
        }
    }

    const handleChangeCommon = (event) => {
        if (event.target.type === "checkbox") {
            setFormData({ ...formData, [event.target.name]: event.target.checked })
        }
        else {
            setFormData({ ...formData, [event.target.name]: event.target.value })

        }
    }

    //Submit
    const handleSubmit = async (event) => {
        setSavebuttonFlag(true);
        event.preventDefault();
        // console.log('submit event', event, formData, 'interfaces data', interfaceUsageArray);

        let interfacesArr = [];
        interfaceUsageArray.forEach(res => {
            interfacesArr.push({
                netname: res && res.network ? res.network : '',
                ipaddr: '',
                intfname: res && res.interfaceName ? res.interfaceName : '',
                intfUsage: res && res.interfaceUsage ? res.interfaceUsage : '',
                tags: {
                    additionalProp1: res && res.taglist && res.taglist.length > 0 && res.taglist[0].key ? res.taglist[0].key : '',
                    additionalProp2: res && res.taglist && res.taglist.length > 0 && res.taglist[0].value ? res.taglist[0].value : '',
                    additionalProp3: '',
                },
                macaddr: '',
                cost: '',
            })
        })

        let addObj = {
            "name": formData && formData.name ? formData.name : '',
            "description": formData && formData.description ? formData.description : '',
            "assetId": formData && formData.assetId ? formData.assetId : '',
            "identity": formData && formData.identityType ? formData.identityType : '',
            "obkey": formData && formData.onboardingKey ? formData.onboardingKey : '',
            "serialNo": formData && formData.serialNo ? formData.serialNo : '',
            "location": formData && formData.assetLocation ? formData.assetLocation : '',
            "utype": formData && formData.computeType ? formData.computeType : '',
            "modelId": formData && formData.model ? formData.model : '',
            "interfaces": interfacesArr && interfacesArr.length > 0 ? interfacesArr : [],
            "brand": formData && formData.brand ? formData.brand : '',
            "activateComputeNode": formData && formData.activateNode ? formData.activateNode : true,
            "activateDefaultAppNetwork": formData && formData.defaultApp ? formData.defaultApp : false,
            "onboarding": {
                "pemCert": formData && formData.uploadNodeCert ? formData.uploadNodeCert : '',
            }
        }

        // console.log('register node obj=', addObj);
        await computeNodeRegisterAPICall(addObj);
    }

    const uploadNodeCertificate = async (event) => {
        event.preventDefault();
        let file = event.target.files;
        if (file && file.length > 0) {

            let name = file[0] && file[0].name ? file[0].name : '';
            let nodeCert;

            try {
                nodeCert = await ConvertImageToIntBase64(file[0]);
                setFormData({ ...formData, [event.target.name]: nodeCert })
                setNodeCertFile(file[0]);
                setNodeCertFileName(name);

            }
            catch (err) {
                console.log('upload certificate catch err', err)
            }


        }
    }

    const computeNodeRegisterAPICall = async (addObj) => {

        let url = `${envConfig.backendBaseUrl}/api/v1/devices/`;
        let body = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addObj),
        }
        // console.log('add body obj=', body);
        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    // console.log('add node value=', val);
                    if (val.error == false && val.message.toLowerCase() == "data saved successfully") {
                        toast.success("Added compute node successfully");
                        setSavebuttonFlag(false);
                        router.push("/node")
                    }
                    else {
                        toast.error("Failed to add compute node");
                        setSavebuttonFlag(false);
                    }
                });
        }
        catch (e) {
            setSavebuttonFlag(false);
        }

    }

    const cancelForm = (event) => {
        // event.target.reset();
        // setFormData(data);
        router.back();
    }

    const handleInterfaceUsageChange = (event, i) => {
        interfaceUsageArray[i].interfaceUsage = event.target.value;
        let temp = [...interfaceUsageArray]
        temp[i].IntefaceUsageFlag = true
        setinterfaceUsageArray(temp)

    }

    const getModelDetail = async (modelName) => {

        let url = `${envConfig.backendBaseUrl}/api/v1/sysmodels/${modelName}`;
        let params = {
            method: 'GET'
        }

        try {
            await fetch(url, params)
                .then(res => res.json())
                .then(modelVal => {
                    if (modelVal && (modelVal.error == false) && (modelVal.message.toLowerCase() === "get data successfully") && modelVal.data) {
                        let data = modelVal.data && modelVal.data.model && modelVal.data.model.length > 0 ? modelVal.data.model[0] : null;

                        if (data) {

                            let tempPort = [];

                            let ioMemberList = data.ioMemberList && data.ioMemberList.length > 0 ? data.ioMemberList : [];

                            ioMemberList.forEach((res) => {
                                tempPort.push({
                                    interfaceName: res && res.phylabel ? res.phylabel : '',
                                    bundle: res && res.logicallabel ? res.logicallabel : '',
                                    type: res && res.ztype ? res.ztype : '',
                                    interfaceUsage: 'Unused',
                                    cost: '',
                                    network: '',
                                    taglist: [{
                                        key: '',
                                        value: ''
                                    }]
                                })
                            })

                            let temp = {
                                modelName: data.model ? data.model : '',
                                architecture: data.arch ? data.arch : '',
                                image: data.image ? data.image : '',
                                image2: data.image2 ? data.image2 : '',
                                memory: data.attr && data.attr.memory ? data.attr.memory : '',
                                storage: data.attr && data.attr.storage ? data.attr.storage : '',
                                cpu: data.attr && data.attr.cpus ? data.attr.cpus : '',
                                portMapping: tempPort && tempPort.length > 0 ? tempPort : []

                            }

                            setinterfaceUsageArray(tempPort)
                            setEachModalObj(temp);
                            setModelLoading(false);
                            setPortMapFlag(true);


                        }
                        else {
                            setEachModalObj({});
                            setModelLoading(false);
                            setPortMapFlag(false);


                        }

                    }
                    else {
                        setModelLoading(false);
                        setPortMapFlag(false);

                        setEachModalObj({});
                    }
                }).catch((err) => {
                    setModelLoading(false);
                    setPortMapFlag(false);

                    console.log('Model detail list catch error=', err);
                })
        }
        catch (e) {
            setModelLoading(false);
            setPortMapFlag(false);

            console.log("Model detail list tryCatch error= ", e);
        }
    }

    const handleNetworkChange = (event, i) => {
        interfaceUsageArray[i].network = event.target.value;
        let temp = [...interfaceUsageArray]
        setinterfaceUsageArray(temp)
    }

    const getInterfaceUsageReqBool = (name) => {
        if (name) {
            let tempBool = computeNodeConst.interfaceNameList.some(ele => {
                if (name.includes(ele)) {
                    return true;
                }

                return false;
            });
            return tempBool;
        }

        return false;

    }

    return (
        <>
            <div className='m-4'>
                <h2 className='text-lg '>
                    {computeNodeConst.addTitle}
                </h2>

                <div className='ring-4 my-4 ring-gray-400 rounded-lg bg-[#dbeaf3]'>
                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit} onReset={cancelForm}>

                        <div className='flex flex-col justify-between flex-wrap p-4 gap-y-10'>

                            {/* Brand/Modal */}
                            <div>
                                <div className='grid grid-flow-row grid-cols-2 gap-y-2 gap-x-2 pt-2'>
                                    {/* Brand */}
                                    <div>
                                        <label htmlFor="brand" className="block text-sm  leading-6 text-gray-900">
                                            {computeNodeConst.fieldLabel.brand}
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="brand"
                                                name="brand"
                                                className="mt-2 block w-4/5 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                placeholder='Select Brand'
                                                onChange={handleBrandChange}
                                                required
                                            >
                                                <option value={''}>Select Brand</option>
                                                {brandListArr.map((data, i) => (
                                                    <option key={i} value={data.name}>{data.name}</option>
                                                ))

                                                }
                                            </select>
                                        </div>
                                    </div>

                                    {/* Model */}
                                    <div>
                                        <label htmlFor="model" className="block text-sm  leading-6 text-gray-900">
                                            {computeNodeConst.fieldLabel.modal}
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="model"
                                                name="model"
                                                className="mt-2 block w-4/5 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                placeholder='Select Model'
                                                onChange={handleModelChange}
                                                required
                                                disabled={!enableModelField}
                                                value={modelInputField}
                                            >
                                                <option value={''}>Select Model</option>
                                                {modalListArr.map((data, i) => (
                                                    <option key={i} value={data.value}>{data.name}</option>

                                                ))

                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Model Info */}

                                {portMapFlag && !modelLoading &&
                                    <>
                                        <div className='flex mt-4'>
                                            <div className='w-1/2 gap-y-1'>
                                                <div className="flex items-baseline">
                                                    <p className=' w-1/5 text-sm'>{'Architecture'}</p> <p>{':'}</p><p className='text-sm ml-2'>{eachModalObj.architecture}</p>
                                                </div>
                                                <div className="flex items-baseline">
                                                    <p className=' w-1/5 text-sm'>{'CPUs'}</p> <p>{':'}</p><p className='text-sm ml-2'>{eachModalObj.cpu}</p>
                                                </div>
                                            </div>

                                            <div className='w-1/2 gap-y-1'>
                                                <div className="flex items-baseline">
                                                    <p className=' w-1/5 text-sm'>{'Memory'}</p> <p>{':'}</p><p className='text-sm ml-2'>{eachModalObj.memory}</p>
                                                </div>
                                                <div className="flex items-baseline">
                                                    <p className=' w-1/5 text-sm'>{'Storage'}</p> <p>{':'}</p><p className='text-sm ml-2'>{eachModalObj.storage}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex gap-x-8 pt-4'>
                                            <Image
                                                width={150}
                                                height={100}
                                                alt={eachModalObj.modelName}
                                                src={`data:image/png;base64,${eachModalObj.image}`}
                                            />

                                            <Image
                                                width={150}
                                                height={100}
                                                alt={eachModalObj.modelName}
                                                src={`data:image/png;base64,${eachModalObj.image2}`}
                                            />
                                        </div>
                                    </>

                                }
                                {modelLoading &&
                                    <div className="flex justify-center items-center mt-4"><Spinner /></div>
                                }
                            </div>

                            {/* === Identity === */}

                            <div className='w-full'>

                                <div className='border-b-2 border-gray-400'>
                                    <h2 className="text-base  leading-7 text-gray-900">{computeNodeConst.identity}</h2>
                                </div>

                                <div className='grid grid-flow-row grid-cols-2 gap-y-2 gap-x-2 pt-2'>

                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm  leading-6 text-gray-900">
                                            {computeNodeConst.fieldLabel.name}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="name"
                                                name="name"
                                                type="name"
                                                autoComplete="name"
                                                placeholder='Name'
                                                onChange={handleChangeCommon}
                                                required
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Compute Type */}
                                    <div>
                                        <label htmlFor="computeType" className="block text-sm  leading-6 text-gray-900">
                                            {computeNodeConst.fieldLabel.computeType}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="computeType"
                                                name="computeType"
                                                type="computeType"
                                                autoComplete="computeType"
                                                placeholder='Compute Type'
                                                onChange={handleChangeCommon}
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm  leading-6 text-gray-900">
                                            {computeNodeConst.fieldLabel.description}
                                        </label>
                                        <div className='mt-2'>
                                            <textarea
                                                id='description'
                                                placeholder="Description"
                                                name="description"
                                                onChange={handleChangeCommon}
                                                className='block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6'
                                                minLength={3}
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*=== Details ==== */}

                            <div className='w-full'>

                                <div className='border-b-2 border-gray-400'>
                                    <h2 className="text-base  leading-7 text-gray-900">{computeNodeConst.details}</h2>
                                </div>

                                <div className='grid grid-flow-row grid-cols-2 gap-y-2 gap-x-2 pt-2'>

                                    {/* Asset Id */}
                                    {/* <div>
                                        <label htmlFor="assetId" className="block text-sm  leading-6 text-gray-900">
                                            {computeNodeConst.fieldLabel.assetId}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="assetId"
                                                name="assetId"
                                                type="assetId"
                                                autoComplete="assetId"
                                                placeholder='Asset Id'
                                                onChange={handleChangeCommon}
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div> */}

                                    {/* Asset Location */}
                                    {/* <div>
                                        <label htmlFor="assetLocation" className="block text-sm  leading-6 text-gray-900">
                                            {computeNodeConst.fieldLabel.assetLoc}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="assetLocation"
                                                name="assetLocation"
                                                type="assetLocation"
                                                autoComplete="assetLocation"
                                                placeholder='Asset Location'
                                                onChange={handleChangeCommon}
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div> */}

                                    {/* Identity Type */}
                                    <div>
                                        <label htmlFor="identityType" className="block text-sm  leading-6 text-gray-900">
                                            {computeNodeConst.fieldLabel.identityType}
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="identityType"
                                                name="identityType"
                                                className="mt-2 block w-4/5 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                onChange={handleIdentityTypeChange}
                                                placeholder='Identity Type'
                                                required
                                            >
                                                <option value={''}>Select Type</option>
                                                {identityTypeArr.map((type, i) => (
                                                    <option key={i} value={type.name}>{type.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Onboarding Key */}
                                    {identityTypeName && (identityTypeName.toLowerCase() === "onboarding key") &&
                                        < div >
                                            <label htmlFor="onboardingKey" className="block text-sm  leading-6 text-gray-900">
                                                {computeNodeConst.fieldLabel.onboardingkey}
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="onboardingKey"
                                                    name="onboardingKey"
                                                    type="onboardingKey"
                                                    autoComplete="onboardingKey"
                                                    required
                                                    placeholder='Onboarding Key'
                                                    onChange={handleChangeCommon}
                                                    className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    }

                                    {/* Upload Node Certificate */}
                                    {identityTypeName && (identityTypeName.toLowerCase() === "upload node certificate") &&
                                        < div >
                                            <label htmlFor="uploadNodeCert" className="block text-sm  leading-6 text-gray-900">
                                                {computeNodeConst.fieldLabel.uploadNodeCert}
                                            </label>
                                            <div className="mt-2 flex">
                                                <button type='button'
                                                    className='rounded-md bg-blue-800 px-3 py-1.5 text-sm  text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800'
                                                    onClick={() => fileUploadInput.current.click()}>
                                                    {computeNodeConst.uploadFile}
                                                </button>

                                                <div className='ml-2'>
                                                    <span className='text-sm'>{nodeCertFileName}</span>
                                                </div>
                                            </div>

                                            <input
                                                hidden
                                                id="uploadNodeCert"
                                                name="uploadNodeCert"
                                                type="file"
                                                ref={fileUploadInput}
                                                required
                                                onChange={uploadNodeCertificate}
                                            />
                                        </div>
                                    }

                                    {/* Serial Number */}
                                    <div>
                                        <label htmlFor="serialNo" className="block text-sm  leading-6 text-gray-900">
                                            {computeNodeConst.fieldLabel.serialNo}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="serialNo"
                                                name="serialNo"
                                                type="serialNo"
                                                autoComplete="serialNo"
                                                required
                                                placeholder='Serial No'
                                                onChange={handleChangeCommon}
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                </div>

                                {portMapFlag && !modelLoading &&
                                    <div className='my-8'>

                                        {/* Port Mapping */}
                                        <Disclosure as="div">
                                            {({ open }) => (
                                                <>
                                                    <div className='mt-2'>
                                                        <h2 className="text-sm  leading-7">{computeNodeConst.portMapping}</h2>

                                                        {eachModalObj.portMapping.map((port, i) => (
                                                            getInterfaceUsageReqBool(port.interfaceName) ?

                                                                <div className='flex shadow-lg rounded-md flex-col p-4' key={i}>
                                                                    <div className='flex flex-row'>
                                                                        <div className='w-1/5 p-2'>

                                                                            <div className="flex items-baseline">
                                                                                <p className=' w-2/4 text-sm'>{computeNodeConst.portMapField.interfaceName}</p> <p className='mr-2'>{':'}</p> <p className='text-sm'>{port.interfaceName}</p>
                                                                            </div>

                                                                            {/* <div className="flex items-center">
                                                                <p className=' w-2/4 text-sm'>{computeNodeConst.portMapField.bundle}</p> <p className='mr-2'>{':'}</p> <p className='text-sm'>{port.bundle}</p>
                                                             </div>
                                                             <div className="flex items-center">
                                                                <p className=' w-2/4 text-sm'>{computeNodeConst.portMapField.type}</p> <p className='mr-2'>{':'}</p><p className='text-sm'>{port.type}</p>
                                                                   </div> */}
                                                                        </div>
                                                                        <div className='flex w-4/5'>

                                                                            {/* Interface Usage */}
                                                                            <div className='w-1/5'>
                                                                                <label htmlFor="interfaceUsage" className="block text-sm  leading-6 text-gray-900">
                                                                                    {computeNodeConst.portMapField.interfaceUsage + (getInterfaceUsageReqBool(port.interfaceName) ? ' *' : '')}
                                                                                </label>
                                                                                <div className="mt-2">
                                                                                    <select
                                                                                        id="interfaceUsage"
                                                                                        name="interfaceUsage"
                                                                                        className="mt-2 w-11/12 block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                        placeholder='Interface Usage'
                                                                                        onChange={(e) => handleInterfaceUsageChange(e, i)}
                                                                                        value={port.interfaceUsage}
                                                                                        required={getInterfaceUsageReqBool(port.interfaceName)}
                                                                                    >
                                                                                        <option value={''}>Select Usage</option>
                                                                                        {computeNodeConst.interfaceUsageArr.map((usage, i) => (
                                                                                            <option key={i} value={usage.name}>{usage.name}</option>

                                                                                        ))}

                                                                                    </select>
                                                                                </div>
                                                                            </div>

                                                                            {/* Cost */}
                                                                            {/* {(interfaceUsageArray && interfaceUsageArray[i] && interfaceUsageArray[i].interfaceUsage && interfaceUsageArray[i].interfaceUsage == "Management" && interfaceUsageArray[i].IntefaceUsageFlag) ?
                                                                <div className='w-1/5'>
                                                                    <label htmlFor="cost" className="block text-sm  leading-6 text-gray-900">
                                                                        {computeNodeConst.portMapField.cost}
                                                                    </label>
                                                                    <div className="mt-2">
                                                                        <input
                                                                            id="cost"
                                                                            name="cost"
                                                                            type="cost"
                                                                            autoComplete="cost"
                                                                            placeholder='Cost'
                                                                            className="block w-3/4 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                        />
                                                                    </div>
                                                                </div> : <></>} */}

                                                                            {/* Network */}
                                                                            {(interfaceUsageArray[i].interfaceUsage == "Management" && interfaceUsageArray[i].IntefaceUsageFlag) ?
                                                                                <div className='w-1/5'>
                                                                                    <label htmlFor="network" className="block text-sm  leading-6 text-gray-900">
                                                                                        {computeNodeConst.portMapField.network}
                                                                                    </label>
                                                                                    <div className="mt-2">
                                                                                        <select
                                                                                            id="network"
                                                                                            name="network"
                                                                                            className="mt-2 w-11/12 block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                            placeholder='Network'
                                                                                            onChange={(e) => handleNetworkChange(e, i)}
                                                                                        >
                                                                                            <option value={''}>Select network</option>
                                                                                            {computeNodeConst.networkArr.map((net, i) => (
                                                                                                <option key={i} value={net.name}>{net.name}</option>

                                                                                            ))}
                                                                                        </select>
                                                                                    </div>
                                                                                </div> : <></>}

                                                                            {/* Tags */}
                                                                            {port && port.interfaceName && port.interfaceName.toLowerCase().includes("eth") &&
                                                                                <div className='w-[35%]'>
                                                                                    <label htmlFor="tag" className="block text-sm  leading-6 text-gray-900">
                                                                                        {computeNodeConst.portMapField.tags}
                                                                                    </label>
                                                                                    <div className="border-2 border-gray-400 p-2" >

                                                                                        {interfaceUsageArray && interfaceUsageArray.length > 0 && interfaceUsageArray[i] && interfaceUsageArray[i].taglist ? interfaceUsageArray[i].taglist.map((val, index) => (
                                                                                            <div className='flex items-center mt-2' key={index}>

                                                                                                {/* Key */}
                                                                                                <div>
                                                                                                    <input
                                                                                                        id="key"
                                                                                                        name="key"
                                                                                                        type="key"
                                                                                                        autoComplete="key"
                                                                                                        placeholder='Enter Key'
                                                                                                        onChange={e => handleTagChange(e, i, index)}
                                                                                                        className="block w-10/12 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                                    />
                                                                                                </div>

                                                                                                {/* Value */}
                                                                                                <div>
                                                                                                    <input
                                                                                                        id="value"
                                                                                                        name="value"
                                                                                                        type="value"
                                                                                                        onChange={e => handleTagChange(e, i, index)}
                                                                                                        autoComplete="value"
                                                                                                        placeholder='Enter Value'
                                                                                                        className="block w-10/12 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                                    />
                                                                                                </div>

                                                                                                {/* Action Button */}
                                                                                                {/* <div className='w-3/12'>
                                                                                <button type='button'
                                                                                    onClick={() => addTagField(i)}>
                                                                                    <PlusCircleIcon className="w-6 h-6 mr-1" aria-hidden={true} />
                                                                                </button>
                                                                                {index > 0 &&
                                                                                    <button type='button'
                                                                                        onClick={() => { removeTagField(i, index) }}>
                                                                                        <XCircleIcon className="w-6 h-6 mr-1" aria-hidden={true} />
                                                                                    </button>}
                                                                            </div> */}
                                                                                            </div>
                                                                                        )) : <></>}

                                                                                    </div>
                                                                                </div>
                                                                            }

                                                                        </div>
                                                                    </div>
                                                                    {(interfaceUsageArray[i].interfaceUsage == "Management" && interfaceUsageArray[i].IntefaceUsageFlag) ?
                                                                        <div className='flex flex-col bg-white rounded-md p-2 my-2'>
                                                                            <h2 className="text-sm font-[600] leading-7">{computeNodeConst.portMapField.configure}</h2>

                                                                            <div className='flex mt-2'>
                                                                                <div className='flex w-[70%]'>
                                                                                    <div className='flex w-2/6'>
                                                                                        <p className=' w-1/5 text-sm'>{computeNodeConst.portMapField.dhcp + ' : '}</p> <p className='text-sm'>{'Not Available'}</p>
                                                                                    </div>
                                                                                    <div className='flex w-2/5'>
                                                                                        <p className=' w-1/3 text-sm'>{computeNodeConst.portMapField.classification + ' : '}</p> <p className='text-sm'>{'Ethernet'}</p>
                                                                                    </div>
                                                                                    <div className='flex w-2/6'>
                                                                                        <p className=' w-1/5 text-sm'>{computeNodeConst.portMapField.proxy + ' : '}</p> <p className='text-sm'>{'Not Configured'}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div> : <></>}

                                                                </div>
                                                                : <></>
                                                        ))}

                                                        <div className='flex flex-row justify-end'>
                                                            <Disclosure.Button
                                                                as="div"
                                                                className={classNames(
                                                                    'flex justify-end items-center pt-4'
                                                                )}
                                                            >
                                                                <button className="flex flex-row rounded-md bg-blue-800 px-3 py-1.5 text-sm text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                                                                    type="button"
                                                                >
                                                                    <p>{computeNodeConst.additionalPort}</p>
                                                                    <span>
                                                                        <ChevronRightIcon
                                                                            className={classNames(
                                                                                open ? "rotate-90 text-white" : "text-white",
                                                                                'ml-2 h-5 w-5 shrink-0 hover:text-white'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />
                                                                    </span>
                                                                </button>
                                                            </Disclosure.Button>
                                                        </div>

                                                        <Disclosure.Panel as='div'>
                                                            {eachModalObj.portMapping.map((port, i) => (
                                                                getInterfaceUsageReqBool(port.interfaceName) ? <></> :
                                                                    <div className='flex shadow-lg rounded-md flex-col p-4' key={i}>
                                                                        <div className='flex flex-row'>
                                                                            <div className='w-1/5 p-2'>

                                                                                <div className="flex items-baseline">
                                                                                    <p className=' w-2/4 text-sm'>{computeNodeConst.portMapField.interfaceName}</p> <p className='mr-2'>{':'}</p> <p className='text-sm'>{port.interfaceName}</p>
                                                                                </div>

                                                                                {/* <div className="flex items-center">
                                                                <p className=' w-2/4 text-sm'>{computeNodeConst.portMapField.bundle}</p> <p className='mr-2'>{':'}</p> <p className='text-sm'>{port.bundle}</p>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <p className=' w-2/4 text-sm'>{computeNodeConst.portMapField.type}</p> <p className='mr-2'>{':'}</p><p className='text-sm'>{port.type}</p>
                                                            </div> */}
                                                                            </div>
                                                                            <div className='flex w-4/5'>

                                                                                {/* Interface Usage */}
                                                                                <div className='w-1/5'>
                                                                                    <label htmlFor="interfaceUsage" className="block text-sm  leading-6 text-gray-900">
                                                                                        {computeNodeConst.portMapField.interfaceUsage + (getInterfaceUsageReqBool(port.interfaceName) ? ' *' : '')}
                                                                                    </label>
                                                                                    <div className="mt-2">
                                                                                        <select
                                                                                            id="interfaceUsage"
                                                                                            name="interfaceUsage"
                                                                                            className="mt-2 w-11/12 block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                            placeholder='Interface Usage'
                                                                                            onChange={(e) => handleInterfaceUsageChange(e, i)}
                                                                                            value={port.interfaceUsage}
                                                                                            required={getInterfaceUsageReqBool(port.interfaceName)}
                                                                                        >
                                                                                            <option value={''}>Select Usage</option>
                                                                                            {computeNodeConst.interfaceUsageArr.map((usage, i) => (
                                                                                                <option key={i} value={usage.name}>{usage.name}</option>

                                                                                            ))}

                                                                                        </select>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Cost */}
                                                                                {/* {(interfaceUsageArray && interfaceUsageArray[i] && interfaceUsageArray[i].interfaceUsage && interfaceUsageArray[i].interfaceUsage == "Management" && interfaceUsageArray[i].IntefaceUsageFlag) ?
                                                                <div className='w-1/5'>
                                                                    <label htmlFor="cost" className="block text-sm  leading-6 text-gray-900">
                                                                        {computeNodeConst.portMapField.cost}
                                                                    </label>
                                                                    <div className="mt-2">
                                                                        <input
                                                                            id="cost"
                                                                            name="cost"
                                                                            type="cost"
                                                                            autoComplete="cost"
                                                                            placeholder='Cost'
                                                                            className="block w-3/4 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                        />
                                                                    </div>
                                                                </div> : <></>} */}

                                                                                {/* Network */}
                                                                                {(interfaceUsageArray[i].interfaceUsage == "Management" && interfaceUsageArray[i].IntefaceUsageFlag) ?
                                                                                    <div className='w-1/5'>
                                                                                        <label htmlFor="network" className="block text-sm  leading-6 text-gray-900">
                                                                                            {computeNodeConst.portMapField.network}
                                                                                        </label>
                                                                                        <div className="mt-2">
                                                                                            <select
                                                                                                id="network"
                                                                                                name="network"
                                                                                                className="mt-2 w-11/12 block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                                placeholder='Network'
                                                                                                onChange={(e) => handleNetworkChange(e, i)}
                                                                                            >
                                                                                                <option value={''}>Select network</option>
                                                                                                {computeNodeConst.networkArr.map((net, i) => (
                                                                                                    <option key={i} value={net.name}>{net.name}</option>

                                                                                                ))}
                                                                                            </select>
                                                                                        </div>
                                                                                    </div> : <></>}

                                                                                {/* Tags */}
                                                                                {port && port.interfaceName && port.interfaceName.toLowerCase().includes("eth") &&
                                                                                    <div className='w-[35%]'>
                                                                                        <label htmlFor="tag" className="block text-sm  leading-6 text-gray-900">
                                                                                            {computeNodeConst.portMapField.tags}
                                                                                        </label>
                                                                                        <div className="border-2 border-gray-400 p-2" >

                                                                                            {interfaceUsageArray && interfaceUsageArray.length > 0 && interfaceUsageArray[i] && interfaceUsageArray[i].taglist ? interfaceUsageArray[i].taglist.map((val, index) => (
                                                                                                <div className='flex items-center mt-2' key={index}>

                                                                                                    {/* Key */}
                                                                                                    <div>
                                                                                                        <input
                                                                                                            id="key"
                                                                                                            name="key"
                                                                                                            type="key"
                                                                                                            autoComplete="key"
                                                                                                            placeholder='Enter Key'
                                                                                                            onChange={e => handleTagChange(e, i, index)}
                                                                                                            className="block w-10/12 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                                        />
                                                                                                    </div>

                                                                                                    {/* Value */}
                                                                                                    <div>
                                                                                                        <input
                                                                                                            id="value"
                                                                                                            name="value"
                                                                                                            type="value"
                                                                                                            onChange={e => handleTagChange(e, i, index)}
                                                                                                            autoComplete="value"
                                                                                                            placeholder='Enter Value'
                                                                                                            className="block w-10/12 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                                        />
                                                                                                    </div>

                                                                                                    {/* Action Button */}
                                                                                                    {/* <div className='w-3/12'>
                                                                                <button type='button'
                                                                                    onClick={() => addTagField(i)}>
                                                                                    <PlusCircleIcon className="w-6 h-6 mr-1" aria-hidden={true} />
                                                                                </button>
                                                                                {index > 0 &&
                                                                                    <button type='button'
                                                                                        onClick={() => { removeTagField(i, index) }}>
                                                                                        <XCircleIcon className="w-6 h-6 mr-1" aria-hidden={true} />
                                                                                    </button>}
                                                                            </div> */}
                                                                                                </div>
                                                                                            )) : <></>}

                                                                                        </div>
                                                                                    </div>
                                                                                }

                                                                            </div>
                                                                        </div>
                                                                        {(interfaceUsageArray[i].interfaceUsage == "Management" && interfaceUsageArray[i].IntefaceUsageFlag) ?
                                                                            <div className='flex flex-col bg-white rounded-md p-2 my-2'>
                                                                                <h2 className="text-sm font-[600] leading-7">{computeNodeConst.portMapField.configure}</h2>

                                                                                <div className='flex mt-2'>
                                                                                    <div className='flex w-[70%]'>
                                                                                        <div className='flex w-2/6'>
                                                                                            <p className=' w-1/5 text-sm'>{computeNodeConst.portMapField.dhcp + ' : '}</p> <p className='text-sm'>{'Not Available'}</p>
                                                                                        </div>
                                                                                        <div className='flex w-2/5'>
                                                                                            <p className=' w-1/3 text-sm'>{computeNodeConst.portMapField.classification + ' : '}</p> <p className='text-sm'>{'Ethernet'}</p>
                                                                                        </div>
                                                                                        <div className='flex w-2/6'>
                                                                                            <p className=' w-1/5 text-sm'>{computeNodeConst.portMapField.proxy + ' : '}</p> <p className='text-sm'>{'Not Configured'}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div> : <></>}

                                                                    </div>

                                                            ))}
                                                        </Disclosure.Panel>
                                                    </div>
                                                </>
                                            )}
                                        </Disclosure>

                                    </div>
                                }
                                {modelLoading &&
                                    <div className="flex justify-center items-center mt-4"><Spinner /></div>
                                }
                            </div>

                            {/* Additional Configuration */}

                            <div className='w-full'>

                                <div className='border-b-2 border-gray-400'>
                                    <h2 className="text-base  leading-7 text-gray-900">{computeNodeConst.addtlConfig}</h2>
                                </div>

                                <div className='grid grid-flow-row grid-cols-2 gap-y-2 gap-x-2 pt-2'>

                                    {/* Activate node */}
                                    <div className='flex justify-center mt-2'>

                                        <div>
                                            <input
                                                id="activateNode"
                                                name="activateNode"
                                                type="checkbox"
                                                autoComplete="activateNode"
                                                defaultChecked={true}
                                                onChange={handleChangeCommon}
                                                className="h-4 w-4 cursor-pointer rounded border-gray-500 focus:ring-blue-800"
                                            />
                                        </div>

                                        <div className='ml-3'>
                                            <label htmlFor="activateNode" className="block text-sm  leading-6 text-gray-900">
                                                {computeNodeConst.addtlConfigObj.activateNode}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Active default app */}
                                    <div className='flex justify-center mt-2'>

                                        <div>
                                            <input
                                                id="defaultApp"
                                                name="defaultApp"
                                                type="checkbox"
                                                autoComplete="defaultApp"
                                                onChange={handleChangeCommon}
                                                className="h-4 w-4 cursor-pointer rounded border-gray-500 focus:ring-blue-800"
                                            />
                                        </div>

                                        <div className='ml-3'>
                                            <label htmlFor="defaultApp" className="block text-sm  leading-6 text-gray-900">
                                                {computeNodeConst.addtlConfigObj.activateDefault}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Button */}
                        <div className='flex justify-center mt-2 border-t-2 border-gray-400 p-2'>
                            <div className='mr-4'>
                            <Ripples className='w-20'>
                                <button
                                    type='submit'
                                    className="rounded-full w-full bg-blue-800 px-3 py-1.5 text-sm  text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                                >
                                    {savebuttonFlag &&
                                        <svg aria-hidden="true" role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"></path>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
                                        </svg>}
                                    {computeNodeConst.save}
                                </button>
                                </Ripples>
                            </div>


                            <div className='mr-4'>
                            <Ripples className='w-20'>
                                <button
                                    type='reset'
                                    className="rounded-full w-full bg-red-700 px-3 py-1.5 text-sm  text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
                                >
                                    {computeNodeConst.cancel}
                                </button>
                                </Ripples>
                            </div>
                        </div>
                    </form>
                    {/* End of Form */}
                </div >
            </div >

        </>
    )
}

export default AddNode;