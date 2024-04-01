import React, { useRef, useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { Disclosure } from '@headlessui/react';
import Ripples from 'react-ripples'
//Next Import
import Image from 'next/image';
import { useRouter } from 'next/navigation';

//Icon
import { ArrowUpTrayIcon, PlusCircleIcon, XCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid'
//Constant
import { computeAppConst } from "@/constant/applicationConst";
//Environment
import { devConfig } from '@/environment/devlopment';
//Component
import { ConvertImageToIntBase64 } from '@/utils/conversion';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const AddApplication = () => {

    const envConfig = devConfig;
    const data = {
        name: '',
        title: '',
        description: '',
        logo: '',
        category: '',
        version: '',
        deploymentType: '',
        license: '',
        resource: '',
        cpu: '',
        memory: '',
        drives: '',
        envName: '',
        directAttach: true,
        adapterType: '',
        addAconfiguration: false,
        configurationName: '',
        allowEdgeAppOverride: false,
        variableDelimiter: '',
        configurationTemplate: '',
        imagelocation: '',
        imageSize: 0,
        imagearchitecture: '',
        imageDigest: '',
        imagename: '',
    }

    const [formData, setFormData] = useState(data);
    const [savebuttonFlag, setSavebuttonFlag] = useState(false);
    const [logoFile, setLogoFile] = useState('');
    const [logFileName, setLogFileName] = useState('');
    const [licenseFileName, setLicenseFileName] = useState('');
    const fileUploadInput = useRef(null);
    const licenseUploadInput = useRef(null);
    const [categoryArr, setCategoryArr] = useState(computeAppConst.categoryList);
    const [deploymentTypeArr, setDeploymentTypeArr] = useState(computeAppConst.deploymentTypeList);
    const [resourceArr, setResourceArr] = useState(computeAppConst.resourceList);
    const [driveArr, setDriveArr] = useState([]);
    const [interfaceArr, setInterfaceArr] = useState(computeAppConst.interfaceList);
    const [adapterTypeArr, setAdapterTypeArr] = useState(computeAppConst.adapterTypeList);
    const [addEnvironmentFlag, setAddEnvironmentFlag] = useState(false);
    const [configurationFlag, setConfigurationFlag] = useState(false);
    const router = useRouter();
    const [architectureArr, setArchitectureArr] = useState(computeAppConst.architectureList);
    const [actionArr, setActionArr] = useState(computeAppConst.actionList);
    const [actionArrIN, setActionArrIN] = useState(computeAppConst.actionListIN);
    const [protocolArr, setProtocolArr] = useState(computeAppConst.protocolList);

    const ImageFileHandling = async (event) => {
        event.preventDefault();
        let file = event.target.files;
        if (file && file.length > 0) {
            let name = file[0] && file[0].name ? file[0].name : '';
            var imageFile = file[0];
            let imageData;
            try {
                imageData = await ConvertImageToIntBase64(imageFile);
                setFormData({ ...formData, [event.target.name]: imageData })
                if (event.target.name === 'license') {
                    setLicenseFileName(name)
                } else {
                    setLogFileName(name);
                    setLogoFile(URL.createObjectURL(file[0]));
                }
            } catch (error) {
                console.error('Error converting image to int64:', error);
            }
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

    const handleConfiguration = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.checked })
        setConfigurationFlag(event.target.checked);
    }

    const addTagField = () => {
        var temp = [...driveArr];
        temp = [...driveArr, {
            tag: '',
            selectImage: "",
            path: "",
            encrypted: false,
            purge: false,
            newName: '',
        },
        ]
        setDriveArr(temp)
    }

    const removeTagField = (index) => {
        var temp = [...driveArr];
        temp.splice(index, 1);
        setDriveArr(temp);
    }

    const handleEnvChange = (e, index) => {
        const { name, value, checked, files } = e.target;
        var temp = [...driveArr];

        if (e.target.type === "checkbox") {
            temp[index][name] = checked;
        }
        else if (e.target.type === "file") {
            if (files && files.length > 0) {
                var fileToLoad = files[0];
                var srcData
                var fileReader = new FileReader();
                fileReader.onloadend = function () {
                    srcData = fileReader.result;
                }
                fileReader.readAsDataURL(fileToLoad);

                temp[index][name] = srcData;
                let fileName = files[0] && files[0].name ? files[0].name : '';
                temp[index]["newName"] = fileName;
            }
        } else {
            temp[index][name] = value;
        }
        setDriveArr(temp)
    }

    const addEnvironmentHandler = () => {
        var temp = [...interfaceArr];
        temp = [...interfaceArr, {
            envName: "",
            directAttach: false,
            adapterType: "",
            outboundRules: [
                {
                    outboundHost: '',
                    protocol: '',
                    port: '',
                    action: 'Allow',
                    rate: '',
                    burst: '',
                },
            ],
            inboundRules: [
                {
                    NodePort: '',
                    protocol: '',
                    appPort: '',
                    action: 'Allow',
                    rate: '',
                    burst: '',
                    inboundIP: '',
                },
            ]
        },
        ];
        setInterfaceArr(temp)
    }

    const removeEnvironmentHandler = (index) => {
        var temp = [...interfaceArr];
        temp.splice(index, 1);
        setInterfaceArr(temp);
    }

    const environmentHandlerChange = (e, index) => {
        const { name, value, checked } = e.target;
        var temp = [...interfaceArr];
        if (e.target.type === "checkbox") {
            temp[index][name] = checked;
        } else {
            temp[index][name] = value;
        }
        setInterfaceArr(temp);
    }


    const handleEnvOutboundChange = (e, index, i) => {
        const { name, value, checked } = e.target;
        if (interfaceArr && interfaceArr[index] && interfaceArr[index].outboundRules.length > 0) {
            const temp = [...interfaceArr];
            if (e.target.type === "checkbox") {
                temp[index].outboundRules[i][name] = checked;
            } else {
                temp[index].outboundRules[i][name] = value;
            }
            setInterfaceArr(temp)
        }
    }

    const addEnvOutboundHandler = (index) => {
        if (interfaceArr && interfaceArr[index] && interfaceArr[index].outboundRules) {
            const temp = [...interfaceArr];
            temp[index].outboundRules = [...temp[index].outboundRules, {
                outboundHost: '',
                protocol: '',
                port: '',
                action: 'Allow',
                rate: '',
                burst: '',
            },]
            setInterfaceArr(temp)
        }
    }

    const removeEnvOutboundHandler = (index, i) => {
        if (interfaceArr && interfaceArr[index] && interfaceArr[index].outboundRules) {
            const temp = [...interfaceArr];
            const newarray = temp[index].outboundRules;
            newarray.splice(i, 1);
            temp[index].outboundRules = newarray
            setInterfaceArr(temp)
        }
    }

    const handleEnvInBoundChange = (e, index, j) => {
        e.preventDefault();
        const { name, value, checked } = e.target;
        if (interfaceArr && interfaceArr[index] && interfaceArr[index].inboundRules.length > 0) {
            const temp = [...interfaceArr];
            if (e.target.type === "checkbox") {
                temp[index].inboundRules[j][name] = checked;
            } else {
                temp[index].inboundRules[j][name] = value;
            }
            setInterfaceArr(temp)
        }
    }

    const addEnvInBoundHandler = (index) => {
        if (interfaceArr && interfaceArr[index] && interfaceArr[index].inboundRules) {
            const temp = [...interfaceArr];
            temp[index].inboundRules = [...temp[index].inboundRules, {
                inboundIP: '',
                protocol: '',
                appPort: '',
                nodePort: '',
                action: 'Allow',
                rate: '',
                burst: '',
            },]
            setInterfaceArr(temp)
        }
    }

    const removeEnvInBoundHandler = (index, j) => {
        if (interfaceArr && interfaceArr[index] && interfaceArr[index].inboundRules) {
            const temp = [...interfaceArr];
            const newarray = temp[index].inboundRules;
            newarray.splice(j, 1);
            temp[index].inboundRules = newarray
            setInterfaceArr(temp)
        }
    }

    const handleSubmit = async (event) => {
        setSavebuttonFlag(true);
        event.preventDefault();
        // console.log('submit event------>', event, formData, interfaceArr);

        let interfaceData = [];
        if (interfaceArr && interfaceArr.length > 0) {
            const outboundRuleFormat = (outboundArr) => {
                let outboundData = [];
                outboundArr.map((val) => {
                    outboundData.push(
                        {
                            "type": "outboundHost",
                            "value": val.outboundHost ? val.outboundHost : '',
                        },
                        {
                            "type": "protocol",
                            "value": val.protocol ? val.protocol : '',
                        },
                        {
                            "type": "port",
                            "value": val.port ? val.port : '',
                        },
                    )
                    // outboundData.push({
                    //     "outboundHost": val.outboundHost ? val.outboundHost : '',
                    //     "protocol": val.protocol ? val.protocol : '',
                    //     "port": val.port ? val.port : '',
                    //     // "action": val.action ? val.action : 'Allow',
                    //     // "rate": val.rate ? val.rate : '',
                    //     // "burst": val.burst ? val.burst : '',
                    // })
                })
                return outboundData;
            }

            const inboundRuleFormat = (inboundArr) => {
                let inboundData = [];
                inboundArr.map((val) => {
                    inboundData.push(
                        {
                            "type": "inboundIP",
                            "value": val.inboundIP ? val.inboundIP : '',
                        },
                        {
                            "type": "protocol",
                            "value": val.protocol ? val.protocol : '',
                        },
                        {
                            "type": "appPort",
                            "value": val.appPort ? val.appPort : '',
                        },
                        {
                            "type": "nodePort",
                            "value": val.nodePort ? val.nodePort : '',
                        },
                    )

                    // inboundData.push({
                    //     "inboundIP": val.inboundIP ? val.inboundIP : '',
                    //     "protocol": val.protocol ? val.protocol : '',
                    //     "appPort": val.appPort ? val.appPort : '',
                    //     "nodePort": val.nodePort ? val.nodePort : '',
                    //     // "action": val.action ? val.action : 'Allow',
                    //     // "rate": val.rate ? val.rate : '',
                    //     // "burst": val.burst ? val.burst : '',
                    // })
                })
                return inboundData;
            }

            interfaceArr.map((val) => {
                interfaceData.push(
                    {
                        "name": val.envName ? val.envName : '',
                        "directattach": val.directAttach ? val.directAttach : false,
                        "type": val.adapterType ? val.adapterType : '',
                        "acls": [
                            {
                                "name": "Outbound",
                                "matches": val.outboundRules ? outboundRuleFormat(val.outboundRules) : [],


                            },
                            {
                                "name": "Inbound",
                                "matches": val.inboundRules ? inboundRuleFormat(val.inboundRules) : []
                            }
                        ]
                    }
                );
            })
        }

        var addObj = {
            "name": formData && formData.name ? formData.name : '',
            "title": formData && formData.title ? formData.title : '',
            "description": formData && formData.description ? formData.description : '',
            "logo": null,
            "license": null,
            "cpus": formData && formData.cpu ? parseInt(formData.cpu) : 0,
            "memory": formData && formData.memory ? parseInt(formData.memory) : 0,
            "imagepath": formData && formData.imagelocation ? formData.imagelocation : '',
            "imagesize": formData && formData.imageSize ? parseInt(formData.imageSize) : 0,
            "imagearchitecture": formData && formData.imagearchitecture ? formData.imagearchitecture : '',
            "imagedigest": formData && formData.imageDigest ? formData.imageDigest : '',
            "imagename": formData && formData.imagename ? formData.imagename : '',
            "manifestjson": {
                "desc": {
                    "appCategory": formData && formData.category ? formData.category : '',
                    "os": "",
                },
                "interfaces": interfaceData ? interfaceData : [],
                // "interfaces": [{
                //     "name": formData && formData.envName ? formData.envName : '',
                //     "type": formData && formData.adapterType ? formData.adapterType : '',
                //     "optional": "",
                //     "directattach": formData && formData.directAttach ? formData.directAttach : directAttachFlag,
                //     "privateip": "",
                // },
                // ],
                "resources": {
                    "name": formData && formData.resource ? formData.resource : '',
                    "value": "",
                },
                "configuration": {
                    "customConfig": {
                        "name": formData && formData.configurationName ? formData.configurationName : '',
                        "add": formData && formData.addAconfiguration ? formData.addAconfiguration : configurationFlag,
                        "override": formData && formData.allowEdgeAppOverride ? formData.allowEdgeAppOverride : false,
                        "fieldDelimiter": formData && formData.variableDelimiter ? formData.variableDelimiter : '',
                        "template": formData && formData.configurationTemplate ? formData.configurationTemplate : '',
                    },
                },
                "deploymentType": formData && formData.deploymentType ? formData.deploymentType : '',
            },

            "userDefinedVersion": formData && formData.version ? formData.version : '',
        };

        console.log("allData", addObj);
        applicationBundlePostAPICall(addObj);
    }

    const applicationBundlePostAPICall = async (allData) => {

        let url = `${envConfig.backendBaseUrl}/api/v1/apps`;
        let body = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(allData),
        }

        try {
            await fetch(url, body)
                .then(res => res.json())
                .then(val => {
                    console.log("Added application bundle", val)
                    if (val.error == false && val.message.toLowerCase() == "data saved successfully") {
                        toast.success("Added application bundle successfully");
                        setSavebuttonFlag(false);
                        router.push("/application")
                    } else if (val.message.toLowerCase() == "entry already exists") {
                        toast.error("Entry already exists");
                        setSavebuttonFlag(false);
                    } else {
                        toast.error("Failed to add addapplication bundle");
                        setSavebuttonFlag(false);
                    }
                });
        }
        catch (e) {
            setSavebuttonFlag(false);
        }

    }

    const cancelForm = (event) => {
        event.target.reset();
        setSavebuttonFlag(false);
        setFormData(data);
        setLogoFile('');
        setLogFileName('');
        setLicenseFileName('');
        setDriveArr([{
            tag: '',
            selectImage: "",
            path: "",
            newName: '',
            encrypted: false,
            purge: false,
        },]);
        setConfigurationFlag(false);
        setAddEnvironmentFlag(false)
        setInterfaceArr([]);

        router.back();
    }


    return (
        <>
            <div className="flex flex-col px-[24px] pt-4">
                <div className="self-stretch">
                    <p className="text-xl not-italic  leading-9 sans-serif text-black">
                        {computeAppConst.addTitle}
                    </p>
                </div>
                <div className='ring-4 my-4 ring-gray-400 rounded-lg bg-[#dbeaf3]'>
                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit} onReset={cancelForm}>

                        <div className='flex flex-col justify-between flex-wrap p-4'>

                            {/* === Identity === */}
                            <div className='w-full mt-6'>
                                <div className='border-b-2 border-gray-400'>
                                    <h2 className="text-base  leading-7 text-gray-900">{computeAppConst.identity}</h2>
                                </div>

                                <div className='grid grid-flow-row grid-cols-2 gap-y-2 gap-x-2 pt-2'>

                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.name}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                autoComplete="name"
                                                placeholder='Name'
                                                onChange={handleChangeCommon}
                                                required
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <label htmlFor="title" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.title}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="title"
                                                name="title"
                                                type="text"
                                                autoComplete="title"
                                                placeholder='Title'
                                                onChange={handleChangeCommon}
                                                required
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.description}
                                        </label>
                                        <div className='mt-2'>
                                            <textarea
                                                id='description'
                                                // required
                                                placeholder="Description"
                                                name="description"
                                                type='textarea'
                                                onChange={handleChangeCommon}
                                                className='block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6'
                                                minLength={3}
                                            />

                                        </div>
                                    </div>



                                    {/* Category */}
                                    <div>
                                        <label htmlFor="category" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.category}
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="category"
                                                name="category"
                                                className="mt-2 block w-4/5 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                defaultValue=""
                                                placeholder='Select Category'
                                                onChange={handleChangeCommon}
                                                required
                                            >
                                                <option value={''}>Select Category</option>
                                                {categoryArr.map((data, i) => (
                                                    <option key={i} value={data.name}>{data.name}</option>
                                                ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    {/* Version */}
                                    <div>
                                        <label htmlFor="version" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.version}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="version"
                                                name="version"
                                                type="text"
                                                autoComplete="version"
                                                placeholder='Version'
                                                // required
                                                onChange={handleChangeCommon}
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Deployment Type */}
                                    <div>
                                        <label htmlFor="deploymentType" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.deploymentType}
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="deploymentType"
                                                name="deploymentType"
                                                className="mt-2 block w-4/5 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                defaultValue=""
                                                placeholder='Select Type'
                                                onChange={handleChangeCommon}
                                                required
                                            >
                                                <option value={''}>Select Type</option>
                                                {deploymentTypeArr.map((data, i) => (
                                                    <option key={i} value={data.name}>{data.name}</option>
                                                ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/*=== resources ==== */}
                            <div className='w-full mt-6'>

                                <div className='border-b-2 border-gray-400'>
                                    <h2 className="text-base  leading-7 text-gray-900">{computeAppConst.resources}</h2>
                                </div>

                                <div className='grid grid-flow-row grid-cols-2 gap-y-2 gap-x-2 pt-2'>

                                    {/* Resource */}
                                    <div>
                                        <label htmlFor="Resource" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.resource}
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="resource"
                                                name="resource"
                                                className="mt-2 block w-4/5 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                defaultValue=""
                                                placeholder='Select Resource'
                                                onChange={handleChangeCommon}
                                                required
                                            >
                                                <option value={''}>Select Resource</option>
                                                {resourceArr.map((data, i) => (
                                                    <option key={i} value={data.name}>{data.name}</option>
                                                ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    {/* vCPU */}
                                    <div>
                                        <label htmlFor="cpu" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.cpu}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="cpu"
                                                name="cpu"
                                                type="number"
                                                autoComplete="cpu"
                                                placeholder='vCPU'
                                                onChange={handleChangeCommon}
                                                required
                                                min={0}
                                                max={256}
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Memory */}
                                    <div>
                                        <label htmlFor="memory1" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.memory}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="memory"
                                                name="memory"
                                                type="number"
                                                autoComplete="memory"
                                                placeholder='Memory'
                                                onChange={handleChangeCommon}
                                                required
                                                min={0}
                                                // max={256}
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/*=== Image Location ==== */}
                            <div className='w-full mt-6'>

                                <div className='border-b-2 border-gray-400'>
                                    <h2 className="text-base  leading-7 text-gray-900">{computeAppConst.imageDetails}</h2>
                                </div>

                                <div className='grid grid-flow-row grid-cols-2 gap-y-2 gap-x-2 pt-2'>

                                    {/*imagename*/}
                                    <div>
                                        <label htmlFor="imagename1" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.imagename}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="imagename"
                                                name="imagename"
                                                type="text"
                                                autoComplete="imagename"
                                                placeholder='Image Name'
                                                onChange={handleChangeCommon}
                                                required
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Imagelocation */}
                                    <div>
                                        <label htmlFor="imagelocation1" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.imagelocation}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="imagelocation"
                                                name="imagelocation"
                                                type="text"
                                                autoComplete="imagelocation"
                                                placeholder='Image Location'
                                                onChange={handleChangeCommon}
                                                required
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/*imageDigest*/}
                                    <div>
                                        <label htmlFor="imageformat1" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.imageDigest}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="imageDigest"
                                                name="imageDigest"
                                                type="text"
                                                autoComplete="imageDigest"
                                                placeholder='Image Format'
                                                onChange={handleChangeCommon}
                                                // required
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/*Imagearchitecture  */}
                                    <div>
                                        <label htmlFor="imagearchitecture1" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.imagearchitecture}
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="imagearchitecture"
                                                name="imagearchitecture"
                                                className="mt-2 block w-4/5 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                defaultValue=""
                                                placeholder='Image Architecture'
                                                onChange={handleChangeCommon}
                                            // required
                                            >
                                                <option value={''}>Select Architecture</option>
                                                {architectureArr.map((data, i) => (
                                                    <option key={i} value={data.name}>{data.name}</option>
                                                ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    {/* imageSize */}
                                    <div>
                                        <label htmlFor="imageSize1" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.imageSize}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="imageSize"
                                                name="imageSize"
                                                type="number"
                                                autoComplete="imageSize"
                                                placeholder='Image Size'
                                                onChange={handleChangeCommon}
                                                // required
                                                className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* === Drives ==== */}
                            {/* <div className='w-full mt-6'>

                                <div className='border-b-2 border-gray-400'>
                                    <h2 className="text-base  leading-7 text-gray-900">{computeAppConst.drives}</h2>
                                </div>
                                <div className='grid grid-flow-row grid-cols gap-y-2 gap-x-2 pt-2'>

                                    <div className='w-9/12 mt-4'>

                                        <div className="border-2 border-gray-400 items-baseline p-2 " >
                                            <div className='flex items-center m-2 '>
                                                <div className='flex flex-row w-5/6'>
                                                    <label htmlFor="tag1" className="block w-full text-sm  leading-6 text-gray-900">
                                                        {computeAppConst.fieldLabel.tag}
                                                    </label>
                                                    <label htmlFor="selectImage1" className="block w-full text-sm  leading-6 text-gray-900">
                                                        {computeAppConst.fieldLabel.selectImage}
                                                    </label>
                                                    <label htmlFor="path1" className="block w-full text-sm  leading-6 text-gray-900">
                                                        {computeAppConst.fieldLabel.path}
                                                    </label>
                                                </div>
                                                <div className='flex flex-row w-2/6'>
                                                    <label htmlFor="encrypted1" className="block w-2/6   text-sm  leading-6 text-gray-900">
                                                        {computeAppConst.fieldLabel.encrypted}
                                                    </label>
                                                    <label htmlFor="purge1" className="block w-4/6 text-sm  leading-6 text-gray-900">
                                                        {computeAppConst.fieldLabel.purge}
                                                    </label>
                                                </div>
                                            </div>
                                            {driveArr && driveArr.length > 0 ? driveArr.map((val, index) => (

                                                <div className='flex items-center m-2 gap-6 ' key={index}>
                                                    <div className='w-5/6'>
                                                        <input
                                                            id="tag"
                                                            name="tag"
                                                            type="text"
                                                            autoComplete="tag"
                                                            value={val.tag}
                                                            placeholder='Tag'
                                                            onChange={e => handleEnvChange(e, index)}
                                                            // required
                                                            className="block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                    <div className='w-5/6'>

                                                        {driveArr && driveArr[index] && driveArr[index].newName ? <div className="w-full block rounded-md border-0 bg-white  p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6">
                                                            <button type='button' className="text-gray-400 ">
                                                                {driveArr && driveArr[index] && driveArr[index].newName ? driveArr[index].newName : computeAppConst.selectImageButton}
                                                            </button>
                                                        </div> :
                                                            <div className="w-full">
                                                                < input
                                                                    id="selectImage"
                                                                    name="selectImage"
                                                                    type="file"
                                                                    accept=".pdf,.png"
                                                                    onChange={e => handleEnvChange(e, index)}
                                                                    className="bg-white block w-full rounded-md border-0  p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>
                                                        }

                                                    </div>
                                                    <div className='w-5/6 '>
                                                        <input
                                                            id="path"
                                                            name="path"
                                                            type="text"
                                                            value={val.path}
                                                            onChange={e => handleEnvChange(e, index)}
                                                             // required
                                                            autoComplete="path"
                                                            placeholder='Path'
                                                            className="block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                    <div className='flex flex-row  w-2/6'>
                                                        <div>
                                                            <input
                                                                id="encrypted"
                                                                name="encrypted"
                                                                type="checkbox"
                                                                value={val.encrypted}
                                                                autoComplete="encrypted"
                                                                onChange={e => handleEnvChange(e, index)}
                                                                className="h-4 w-4 cursor-pointer rounded border-gray-500 focus:ring-blue-800"
                                                            />
                                                        </div>
                                                        <div className='ml-3'>
                                                            <label htmlFor="encrypted" className="block text-sm  leading-6 text-gray-900">
                                                                {computeAppConst.checkBoxText}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-row  w-2/6'>
                                                        <div>
                                                            <input
                                                                id="purge"
                                                                name="purge"
                                                                type="checkbox"
                                                                value={val.purge}
                                                                autoComplete="purge"
                                                                onChange={e => handleEnvChange(e, index)}
                                                                className="h-4 w-4 cursor-pointer rounded border-gray-500 focus:ring-blue-800"
                                                            />
                                                        </div>
                                                        <div className='ml-3'>
                                                            <label htmlFor="purge" className="block text-sm  leading-6 text-gray-900">
                                                                {computeAppConst.checkBoxText}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className='flex w-2/6 '>
                                                        <button type='button'
                                                            onClick={() => addTagField(index)}>

                                                            <PlusCircleIcon className="w-6 h-6 mr-1 text-gray-600 hover:text-gray-900" aria-hidden={true} />
                                                        </button>
                                                        {index > 0 &&
                                                            <button type='button'
                                                                onClick={() => { removeTagField(index) }}>
                                                                <XCircleIcon className="w-6 h-6 mr-1  text-gray-600 hover:text-gray-900" aria-hidden={true} />
                                                            </button>
                                                        }
                                                    </div>
                                                </div>
                                            )) : <></>}

                                        </div>
                                    </div>

                                </div>
                            </div> */}

                            {/*=== Environments ==== */}
                            <div className='w-full mt-6'>

                                <div className='border-b-2 border-gray-400'>
                                    <h2 className="text-base  leading-7 text-gray-900">{computeAppConst.environments}</h2>
                                </div>

                                {interfaceArr && interfaceArr.length > 0 ? interfaceArr.map((val, index) => (
                                    <div key={index} className='w-full mt-6 border-2 gap-y-2 gap-x-2 border-gray-400 items-baseline relative'>
                                        <Disclosure as="div">
                                            {({ open }) => (
                                                <>
                                                    <div className='flex flex-row gap-y-2 gap-x-2 p-2 pb-4'>
                                                        <button type='button'
                                                            onClick={() => removeEnvironmentHandler(index)}
                                                        >
                                                            <XCircleIcon className=" absolute w-8 h-8 -top-4 -right-4 p-1 text-gray-600 hover:text-gray-900" aria-hidden={true} />
                                                        </button>

                                                        {/* ENV Name */}
                                                        <div className='w-2/5'>
                                                            <label htmlFor="envName" className="block text-sm  leading-6 text-gray-900">
                                                                {computeAppConst.fieldLabel.envName}
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    id="envName"
                                                                    name="envName"
                                                                    type="text"
                                                                    autoComplete="envName"
                                                                    placeholder='Name'
                                                                    value={val.envName}
                                                                    onChange={(e) => environmentHandlerChange(e, index)}
                                                                    required
                                                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Direct Attach */}
                                                        <div className='flex justify-center items-center w-1/5'>
                                                            <div>
                                                                <label htmlFor="directAttach" className="block text-sm  leading-6 text-gray-900">
                                                                    {computeAppConst.fieldLabel.directAttach}
                                                                </label>
                                                                <div className='flex flex-row mt-2'>
                                                                    <div>
                                                                        <input
                                                                            id="directAttach"
                                                                            name="directAttach"
                                                                            type="checkbox"
                                                                            autoComplete="directAttach"
                                                                            value={val.directAttach}
                                                                            onChange={(e) => environmentHandlerChange(e, index)}
                                                                            className="h-4 w-4 cursor-pointer rounded border-gray-500 focus:ring-blue-800"
                                                                        />
                                                                    </div>
                                                                    <div className='ml-3'>
                                                                        <label htmlFor="directAttach" className="block text-sm  leading-6 text-gray-900">
                                                                            {computeAppConst.checkBoxText}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Adapter Type */}
                                                        <div className=' w-2/5'>
                                                            <label htmlFor="deploymentType" className="block text-sm  leading-6 text-gray-900">
                                                                {computeAppConst.fieldLabel.adapterType}
                                                            </label>
                                                            <div className="mt-2">
                                                                <select
                                                                    id="adapterType"
                                                                    name="adapterType"
                                                                    className="mt-2 block  w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                    value={val.adapterType}
                                                                    placeholder='Select Type'
                                                                    onChange={(e) => environmentHandlerChange(e, index)}
                                                                    required
                                                                >
                                                                    <option value={''}>Select Type</option>
                                                                    {adapterTypeArr.map((data) => (
                                                                        <option key={data.value} value={data.name}>{data.name}</option>
                                                                    ))
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <Disclosure.Button
                                                            as="div"
                                                            className={classNames(
                                                                'flex justify-end items-center w-1/12 px-4 pt-6'
                                                            )}
                                                        >
                                                            <ChevronRightIcon
                                                                className={classNames(
                                                                    open ? "rotate-90 text-gray-600" : "text-gray-600",
                                                                    'ml-auto h-6 w-6 shrink-0 hover:text-gray-900'
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                        </Disclosure.Button>
                                                    </div>
                                                    <Disclosure.Panel as='div'>
                                                        <div className='border-b-2 border-gray-400'></div>
                                                        <div className='bg-slate-100 p-4'>

                                                            {/* Outbound Rules */}
                                                            <div className='border-2 mb-4 border-gray-400 bg-[#dbeaf3] py-4'>
                                                                <div className='border-b-2 border-gray-400'>
                                                                    <h2 className="text-base px-4 pb-2 leading-7 text-gray-900">Outbound Rules</h2>
                                                                </div>
                                                                <div className='grid grid-flow-row grid-cols gap-y-2 gap-x-2 pt-2 px-4'>
                                                                    <div className=' mt-4'>
                                                                        <div className="border-2 border-gray-300 items-baseline py-2" >
                                                                            <div className='flex flex-row w-full px-3'>

                                                                                <label htmlFor="outboundHostorIP1" className="block w-5/6 text-sm  leading-6 text-gray-900">
                                                                                    {computeAppConst.EnvfieldLabel.outboundHostorIP}
                                                                                </label>
                                                                                <label htmlFor="protocol1" className="block w-5/6 text-sm  leading-6 text-gray-900">
                                                                                    {computeAppConst.EnvfieldLabel.protocolout}
                                                                                </label>
                                                                                <label htmlFor="port1" className="block w-5/6 text-sm  leading-6 text-gray-900">
                                                                                    {computeAppConst.EnvfieldLabel.port}
                                                                                </label>
                                                                                {/* <label htmlFor="action1" className="block w-full   text-sm  leading-6 text-gray-900">
                                                                                        {computeAppConst.EnvfieldLabel.action}
                                                                                    </label>
                                                                                    <label htmlFor="rate1" className="block w-full text-sm  leading-6 text-gray-900">
                                                                                        {computeAppConst.EnvfieldLabel.rate}
                                                                                    </label> */}


                                                                                {/* <label htmlFor="burst1" className="block w-4/6 text-sm  leading-6 text-gray-900">
                                                                                        {computeAppConst.EnvfieldLabel.burst}
                                                                                    </label> */}

                                                                            </div>
                                                                            <div className='border-b-2 border-gray-300 ' ></div>
                                                                            {interfaceArr && interfaceArr[index] && interfaceArr[index].outboundRules ? interfaceArr[index].outboundRules.map((ele, i) => (
                                                                                <div className='flex flex-row w-full px-3  pt-2 gap-8 ' key={i}>
                                                                                    <div className='flex w-10/12'>
                                                                                        <input
                                                                                            id="outboundHostorIP"
                                                                                            name="outboundHost"
                                                                                            type="text"
                                                                                            autoComplete="outboundHostorIP"
                                                                                            value={ele.outboundHost}
                                                                                            placeholder='Outbound Host or IP'
                                                                                            onChange={e => handleEnvOutboundChange(e, index, i, ele)}
                                                                                            // required
                                                                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                        />
                                                                                    </div>

                                                                                    <div className='flex w-10/12'>
                                                                                        <input
                                                                                            id="protocol"
                                                                                            name="protocol"
                                                                                            type="text"
                                                                                            value={ele.protocol}
                                                                                            onChange={e => handleEnvOutboundChange(e, index, i)}
                                                                                            // required
                                                                                            autoComplete="protocol"
                                                                                            placeholder='Protocol'
                                                                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                        />
                                                                                    </div>

                                                                                    <div className='flex w-11/12 space-x-1'>
                                                                                        <div className='flex w-3/4' >
                                                                                            <input
                                                                                                id="port"
                                                                                                name="port"
                                                                                                type="text"
                                                                                                value={ele.port}
                                                                                                onChange={e => handleEnvOutboundChange(e, index, i)}
                                                                                                // required
                                                                                                autoComplete="port"
                                                                                                placeholder='Port'
                                                                                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                            />
                                                                                        </div>

                                                                                        {/* <div className='w-5/6'>
                                                                                        <select
                                                                                            id="action"
                                                                                            name="action"
                                                                                            className="block w-11/12 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                            value={ele.action}
                                                                                            placeholder='Action'
                                                                                            onChange={(e) => handleEnvOutboundChange(e, index, i)}
                                                                                        // required
                                                                                        >
                                                                                            {actionArr.map((data,k) => (
                                                                                                <option key={k} value={data.name}>{data.name}</option>
                                                                                            ))
                                                                                            }
                                                                                        </select>
                                                                                    </div>

                                                                                    <div className='w-5/6 '>
                                                                                        <input
                                                                                            id="rate"
                                                                                            name="rate"
                                                                                            type="text"
                                                                                            value={ele.rate}
                                                                                            onChange={e => handleEnvOutboundChange(e, index, i)}
                                                                                            // required
                                                                                            autoComplete="rate"
                                                                                            disabled={ele.action == "Allow" ? true : false}
                                                                                            placeholder={ele.action == "Allow" ? "Not Available" : 'Value'}
                                                                                            className="block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                        />
                                                                                    </div>

                                                                                    <div className='w-5/6 '>
                                                                                        <input
                                                                                            id="burst"
                                                                                            name="burst"
                                                                                            type="text"
                                                                                            value={ele.burst}
                                                                                            onChange={e => handleEnvOutboundChange(e, index, i)}
                                                                                            // required
                                                                                            autoComplete="burst"
                                                                                            disabled={ele.action == "Allow" ? true : false}
                                                                                            placeholder={ele.action == "Allow" ? "Not Available" : 'Value'}
                                                                                            className="block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                        />
                                                                                    </div> */}

                                                                                        <div className='flex w-1/4 justify-center'>
                                                                                            <button type='button'
                                                                                                disabled={val && val.outboundRules && val.outboundRules.length >= 3 ? true : false}
                                                                                                onClick={() => addEnvOutboundHandler(index)}>
                                                                                                <PlusCircleIcon className="w-6 h-6 mr-1 text-gray-600 hover:text-gray-900" aria-hidden={true} />
                                                                                            </button>
                                                                                            {i > 0 &&
                                                                                                <button type='button'
                                                                                                    onClick={() => { removeEnvOutboundHandler(index, i) }}>
                                                                                                    <XCircleIcon className="w-6 h-6 mr-1  text-gray-600 hover:text-gray-900" aria-hidden={true} />
                                                                                                </button>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )) : <></>}

                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            {/* Inbound Rules */}
                                                            <div className='border-2 border-gray-400 bg-[#dbeaf3] py-4'>
                                                                <div className='border-b-2 border-gray-400'>
                                                                    <h2 className="text-base px-4 pb-2 leading-7 text-gray-900">Inbound Rules</h2>
                                                                </div>
                                                                <div className='grid grid-flow-row grid-cols gap-y-2 gap-x-2 pt-2 px-4'>
                                                                    <div className='w-full mt-4'>
                                                                        <div className="border-2 border-gray-300 items-baseline py-2" >
                                                                            <div className='flex flex-row w-full px-3'>
                                                                                <label htmlFor="protocol2" className="block w-5/6  text-sm  leading-6 text-gray-900">
                                                                                    {computeAppConst.EnvfieldLabel.protocol}
                                                                                </label>
                                                                                <label htmlFor="port2" className="block w-5/6  text-sm  leading-6 text-gray-900">
                                                                                    {computeAppConst.EnvfieldLabel.nodePort}
                                                                                </label>
                                                                                {/* <label htmlFor="action2" className="block w-5/6   text-sm  leading-6 text-gray-900">
                                                                                    {computeAppConst.EnvfieldLabel.action}
                                                                                </label> */}
                                                                                <label htmlFor="port4" className="block w-5/6  text-sm  leading-6 text-gray-900">
                                                                                    {computeAppConst.EnvfieldLabel.appPort}
                                                                                </label>
                                                                                {/* <label htmlFor="rate2" className="block w-5/6  text-sm  leading-6 text-gray-900">
                                                                                    {computeAppConst.EnvfieldLabel.rate}
                                                                                </label>
                                                                                <label htmlFor="burst2" className="block w-5/6  text-sm  leading-6 text-gray-900">
                                                                                    {computeAppConst.EnvfieldLabel.burst}
                                                                                </label> */}
                                                                                <label htmlFor="burst2" className="block w-5/6  text-sm  leading-6 text-gray-900">
                                                                                    {computeAppConst.EnvfieldLabel.inboundIP}
                                                                                </label>
                                                                            </div>
                                                                            <div className='border-b-2 border-gray-300 ' ></div>
                                                                            {interfaceArr && interfaceArr[index] && interfaceArr[index].inboundRules ? interfaceArr[index].inboundRules.map((obj, j) => (
                                                                                <div className='flex flex-row w-full px-3 pt-2 gap-8 ' key={j}>
                                                                                    <div className='flex w-10/12'>
                                                                                        <select
                                                                                            id="protocol"
                                                                                            name="protocol"
                                                                                            className="block  w-full rounded-md  border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                            placeholder='Protocol'
                                                                                            onChange={(e) => handleEnvInBoundChange(e, index, j)}
                                                                                            required
                                                                                        >
                                                                                            <option value={''}>Select Protocol</option>
                                                                                            {protocolArr.map((data, k) => (
                                                                                                <option key={k} value={data.name}>{data.name}</option>
                                                                                            ))
                                                                                            }
                                                                                        </select>
                                                                                    </div>

                                                                                    <div className='flex w-10/12'>
                                                                                        <input
                                                                                            id="nodePort"
                                                                                            name="nodePort"
                                                                                            type="text"
                                                                                            value={obj.nodePort}
                                                                                            onChange={e => handleEnvInBoundChange(e, index, j)}
                                                                                            required
                                                                                            autoComplete="nodePort"
                                                                                            placeholder='Application port'
                                                                                            className="block w-full  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                        />
                                                                                    </div>

                                                                                    {/* <div className='flex w-11/12'>
                                                                                        <select
                                                                                            id="action"
                                                                                            name="action"
                                                                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                            value={obj.action}
                                                                                            placeholder='Action'
                                                                                            onChange={(e) => handleEnvInBoundChange(e, index, j)}
                                                                                        // required
                                                                                        >
                                                                                            {actionArrIN.map((data,k) => (
                                                                                                <option key={k} value={data.name}>{data.name}</option>
                                                                                            ))
                                                                                            }
                                                                                        </select>
                                                                                    </div> */}

                                                                                    <div className='flex w-10/12'>
                                                                                        <input
                                                                                            id="appPort"
                                                                                            name="appPort"
                                                                                            type="text"
                                                                                            value={obj.appPort}
                                                                                            onChange={e => handleEnvInBoundChange(e, index, j)}
                                                                                            required
                                                                                            autoComplete="appPort"
                                                                                            // disabled={obj.action == 'Map' ? false : true}
                                                                                            placeholder='Map Port'
                                                                                            className="block  w-full  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                        />
                                                                                    </div>

                                                                                    {/* <div className='flex w-11/12'>
                                                                                        <input
                                                                                            id="rate"
                                                                                            name="rate"
                                                                                            type="text"
                                                                                            value={obj.rate}
                                                                                            onChange={e => handleEnvInBoundChange(e, index, j)}
                                                                                            // required
                                                                                            autoComplete="rate"
                                                                                            disabled={obj.action == 'Allow' ? true : false}
                                                                                            placeholder={obj.action == 'Allow' ? "Not Available" : 'Value'}
                                                                                            className="block  w-full  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                        />
                                                                                    </div>

                                                                                    <div className='flex w-11/12'>
                                                                                        <input
                                                                                            id="burst"
                                                                                            name="burst"
                                                                                            type="text"
                                                                                            value={obj.burst}
                                                                                            onChange={e => handleEnvInBoundChange(e, index, j)}
                                                                                            // required
                                                                                            autoComplete="burst"
                                                                                            disabled={obj.action == 'Allow' ? true : false}
                                                                                            placeholder={obj.action == 'Allow' ? "Not Available" : 'Value'}
                                                                                            className="block  w-full  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                        />
                                                                                    </div> */}
                                                                                    <div className='flex w-11/12 space-x-1'>
                                                                                        <div className='flex w-3/4' >
                                                                                            <input
                                                                                                id="inboundIP"
                                                                                                name="inboundIP"
                                                                                                type="text"
                                                                                                autoComplete="inboundIP"
                                                                                                value={obj.inboundIP}
                                                                                                placeholder='Inbound IP'
                                                                                                onChange={e => handleEnvInBoundChange(e, index, j)}
                                                                                                // required
                                                                                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                                                            />
                                                                                        </div>

                                                                                        <div className='flex w-1/4 justify-center' >
                                                                                            <button type='button'
                                                                                                disabled={val && val.inboundRules && val.inboundRules.length >= 3 ? true : false}
                                                                                                onClick={() => addEnvInBoundHandler(index)}>
                                                                                                <PlusCircleIcon className="w-6 h-6 mr-1 text-gray-600 hover:text-gray-900" aria-hidden={true} />
                                                                                            </button>
                                                                                            {j > 0 &&
                                                                                                <button type='button'
                                                                                                    onClick={() => { removeEnvInBoundHandler(index, j) }}>
                                                                                                    <XCircleIcon className="w-6 h-6 mr-1  text-gray-600 hover:text-gray-900" aria-hidden={true} />
                                                                                                </button>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )) : <></>}

                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    </div>
                                )) : <></>}
                                <div className='flex mt-2 gap-y-2 gap-x-2 pt-2 justify-end'>
                                    <Ripples>
                                        <button type='button'
                                            disabled={interfaceArr && interfaceArr.length >= 3 ? true : false}
                                            className={classNames(interfaceArr && interfaceArr.length >= 3 ? "bg-gray-500" : 'bg-blue-800  hover:bg-blue-600', 'rounded-md px-3 py-1.5 text-sm  text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800')}
                                            onClick={addEnvironmentHandler}
                                        >
                                            {computeAppConst.addEnvironment}
                                        </button>
                                    </Ripples>
                                </div>
                            </div>

                            {/*=== Configuration ==== */}
                            <div className='w-full mt-6'>

                                <div className='border-b-2 border-gray-400'>
                                    <h2 className="text-base  leading-7 text-gray-900">{computeAppConst.configuration}</h2>
                                </div>

                                {/* Add Configuration */}
                                <div className='grid grid-flow-row grid-cols gap-y-2 gap-x-2 pt-2'>
                                    <div className='mt-2'>
                                        <label htmlFor="configuration" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.configurationlabel}
                                        </label>
                                        <div className='flex flex-row'>
                                            <div>
                                                <input
                                                    id="addAconfiguration"
                                                    name="addAconfiguration"
                                                    type="checkbox"
                                                    autoComplete="configuration"
                                                    onChange={handleConfiguration}
                                                    className="h-4 w-4 cursor-pointer rounded border-gray-500 focus:ring-blue-800"
                                                />
                                            </div>
                                            <div className='ml-3'>
                                                <label htmlFor="addAconfiguration" className="block text-sm  leading-6 text-gray-900">
                                                    {computeAppConst.checkBoxText}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {configurationFlag == false ? <div></div> :
                                    <div>
                                        <div className='grid grid-flow-row grid-cols-2 gap-y-2 gap-x-2 pt-2'>

                                            {/* Configuration Name */}
                                            <div>
                                                <label htmlFor="configurationName" className="block text-sm  leading-6 text-gray-900">
                                                    {computeAppConst.fieldLabel.configurationName}
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        id="configurationName"
                                                        name="configurationName"
                                                        type="text"
                                                        autoComplete="configurationName"
                                                        placeholder='Configuration Name'
                                                        onChange={handleChangeCommon}
                                                        required
                                                        className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>

                                            {/* allow edge app override Configuration */}
                                            <div className='mt-4'>
                                                <label htmlFor="allowEdgeAppOverride1" className="block text-sm  leading-6 text-gray-900">
                                                    {computeAppConst.fieldLabel.allowEdgeAppOverride}
                                                </label>
                                                <div className='flex flex-row'>
                                                    <div>
                                                        <input
                                                            id="allowEdgeAppOverride"
                                                            name="allowEdgeAppOverride"
                                                            type="checkbox"
                                                            autoComplete="allowEdgeAppOverride"
                                                            onChange={handleChangeCommon}
                                                            className="h-4 w-4 cursor-pointer rounded border-gray-500 focus:ring-blue-800"
                                                        />
                                                    </div>
                                                    <div className='ml-3'>
                                                        <label htmlFor="allowEdgeAppOverride" className="block text-sm  leading-6 text-gray-900">
                                                            {computeAppConst.checkBoxText}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* variable Delimiter */}
                                            <div>
                                                <label htmlFor="variableDelimiter" className="block text-sm  leading-6 text-gray-900">
                                                    {computeAppConst.fieldLabel.variableDelimiter}
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        id="variableDelimiter"
                                                        name="variableDelimiter"
                                                        type="text"
                                                        autoComplete="variableDelimiter"
                                                        placeholder='Variable Delimiter'
                                                        onChange={handleChangeCommon}
                                                        // required
                                                        className="block w-4/5 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                        {/* configuration Template */}
                                        <div className='mt-2'>
                                            <label htmlFor="configurationTemplate" className="block text-sm  leading-6 text-gray-900">
                                                {computeAppConst.fieldLabel.configurationTemplate}
                                            </label>
                                            <div className="mt-2 justify-start items-start">
                                                <textarea
                                                    id="configurationTemplate"
                                                    name="configurationTemplate"
                                                    type="text"
                                                    autoComplete="configurationTemplate"
                                                    placeholder='Add Template'
                                                    onChange={handleChangeCommon}
                                                    required
                                                    className="block w-2/5 h-96 rounded-md text-base justify-start items-start border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className='w-full mt-6'>
                                <div className='grid grid-flow-row grid-cols-2 border-t-2 border-gray-400  gap-y-2 gap-x-2 pt-2' >
                                    {/* Logo */}
                                    <div className='flex flex-row gap-4'>
                                        < div className='w-2/6'>
                                            <label htmlFor="logo1" className="block text-sm  leading-6 text-gray-900">
                                                {computeAppConst.fieldLabel.logo}
                                            </label>

                                            <div className="mt-2  flex justify-start rounded-lg border border-dashed  bg-white border-gray-900/25">
                                                <div onClick={() => fileUploadInput.current.click()} className="m-2 flex ">
                                                    <button type='button'
                                                        className='rounded-md bg-gray-300 px-3 py-1.5 text-sm   text-gray-600 shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800'
                                                    >
                                                        {computeAppConst.Logobutton}
                                                    </button>
                                                    <ArrowUpTrayIcon className="mx-auto h-6 w-6  ml-2 m-1 text-gray-400 " aria-hidden="true" />
                                                </div>
                                                <input
                                                    hidden
                                                    id="logo"
                                                    name="logo"
                                                    type="file"
                                                    accept=".pdf,.png"
                                                    ref={fileUploadInput}
                                                    // required
                                                    onChange={ImageFileHandling}
                                                />
                                            </div>

                                            <div className='ml-2'>
                                                <span className='text-sm'>{logFileName}</span>
                                            </div>
                                        </div>
                                        {logoFile ? <div className='flex flex-row justify-center items-center w-2/6'>
                                            <Image width="60"
                                                height="50"
                                                object-fit="contain"
                                                src={logoFile}
                                                alt=''
                                            >
                                            </Image>
                                        </div> : <div></div>}
                                    </div>

                                    {/* License */}
                                    <div className='w-2/6'>
                                        <label htmlFor="license1" className="block text-sm  leading-6 text-gray-900">
                                            {computeAppConst.fieldLabel.license}
                                        </label>

                                        <div className="mt-2 flex justify-start rounded-lg border border-dashed  bg-white border-gray-900/25">
                                            <div onClick={() => licenseUploadInput.current.click()} className="m-2 flex ">
                                                <button type='button'
                                                    className='rounded-md bg-gray-300 px-3 py-1.5 text-sm   text-gray-600 shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800'
                                                >
                                                    {computeAppConst.LicenseButton}
                                                </button>
                                                <ArrowUpTrayIcon className="mx-auto h-6 w-6  ml-2 m-1 text-gray-400 " aria-hidden="true" />
                                            </div>
                                            <input
                                                hidden
                                                id="license"
                                                name="license"
                                                type="file"
                                                accept=".pdf,.png"
                                                ref={licenseUploadInput}
                                                // required
                                                onChange={ImageFileHandling}
                                            />
                                        </div>

                                        <div className='ml-2'>
                                            <span className='text-sm'>{licenseFileName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Button */}
                        <div className='flex justify-center mt-2 border-t-2 border-gray-400 p-2'>
                            {savebuttonFlag ? <div className='mr-4'>
                                <Ripples className='w-20'>
                                    <button
                                        type='submit'
                                        className="rounded-full w-full bg-blue-800 px-3 py-1.5 text-sm  text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                                    > <svg aria-hidden="true" role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"></path>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
                                        </svg>
                                        {computeAppConst.save}
                                    </button>
                                </Ripples>
                            </div> :
                                <div className='mr-4'>
                                    <Ripples className='w-20'>
                                        <button
                                            type='submit'
                                            className="rounded-full w-full bg-blue-800 px-3 py-1.5 text-sm  text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                                        >
                                            {computeAppConst.save}
                                        </button>
                                    </Ripples>
                                </div>
                            }
                            <div className='mr-4'>
                                <Ripples className='w-20'>
                                    <button
                                        type='reset'
                                        className="rounded-full w-full bg-red-700 px-3 py-1.5 text-sm  text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
                                    >
                                        {computeAppConst.cancel}
                                    </button>
                                </Ripples>
                            </div>
                        </div>
                    </form>
                    {/* Form End*/}
                </div >
            </div >

        </>
    )

}
export default AddApplication;