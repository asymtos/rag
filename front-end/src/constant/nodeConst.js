export const computeNodeConst = {
    title: "Compute Node",
    addNodeBtn: "Add Compute Node",
    addTitle: "Provision the Compute Node",
    save: "Save",
    cancel: "Cancel",
    identity: "Indentity",
    details: "Details",
    tableTitle: "List of Compute Nodes",
    totalNodes: 'Total Nodes',
    nodeDashboard: "Compute Node",
    tableEdit: "Edit",
    tableView: "View",
    tableDelete: "Delete",
    tablePage: "Page",
    tablePrevious: "Previous",
    tableNext: "Next",
    tableAction: "Action",
    addtlConfig: "Additional Configuration",
    portMapping: "Configure Port",
    additionalPort: "Configure Additional Port",
    portMapField: {
        interfaceName: "Interface Name",
        bundle: "Bundle",
        type: "Type",
        interfaceUsage: "Interface Usage",
        cost: "Cost",
        network: "Network",
        tags: "Tag",
        configure: "Configuration",
        dhcp: "DHCP",
        classification: "Classification",
        proxy: "Proxy",

    },
    uploadFile: "Upload File",
    fieldLabel: {
        name: "Name *",
        computeType: "Compute Type",
        description: "Description",
        assetId: "Asset ID",
        assetLoc: "Asset Location",
        identityType: "Identity Type *",
        serialNo: "Serial Number *",
        brand: "Brand *",
        modal: "Model *",
        onboardingkey: "Onboarding Key *",
        uploadNodeCert: "Upload Node Certificate *",
    },
    addtlConfigObj: {
        activateNode: "Activate Compute Node",
        activateDefault: "Activate Default App Network"
    },
    nodeColArr: [
        {
            column: 'Node Name',
            id: 1
        },
        {
            column: 'Serial Number',
            id: 2
        },
        {
            column: 'Status',
            id: 3
        },
        {
            column: 'Location',
            id: 4
        },
    ],
    identityTypeArr: [
        // { name: "Retrieve Onboarding details later", value: 1 },
        { name: "Upload Node Certificate", value: 2 },
        // { name: "Onboarding Key", value: 3 },
        // { name: "Generate Single-Use EVE-OS Installer", value: 4 },
    ],
    interfaceUsageArr: [
        { name: "Unused", value: 1 },
        { name: "Management", value: 2 },
        { name: "App Direct", value: 3 },
        { name: "App Shared", value: 4 },
        { name: "App Disabled", value: 5 },
    ],
    brandList: [
        { name: "Advantech", value: 1 }
    ],
    modalList: [
        { name: "Advantech-EI5-D210", value: 1 }
    ],
    modalObj:
    {
        modalId: 1,
        architecture: "Unknown",
        memory: "4.00 GB",
        cpu: "4",
        storage: "32.00 GB",
        portMapping: [
            {
                member: "eth0",
                bundle: "eth0",
                type: "Ethernet",
                interfaceUsage: '',
                cost: '',
                network: '',
                taglist: [{
                    key: '',
                    value: ''
                }]
            },
            {
                member: "eth1",
                bundle: "eth1",
                type: "Ethernet",
                interfaceUsage: '',
                cost: '',
                network: '',
                taglist: [{
                    key: '',
                    value: ''
                }]
            },
            {
                member: "Audio",
                bundle: "Audio",
                type: "Audio",
                interfaceUsage: '',
                cost: '',
                taglist: [{
                    key: '',
                    value: ''
                }]
            },
            {
                member: "USB0",
                bundle: "USB",
                type: "USB",
                interfaceUsage: '',
                cost: '',
                taglist: [{
                    key: '',
                    value: ''
                }]
            },
            {
                member: "USB1",
                bundle: "USB",
                type: "USB",
                interfaceUsage: '',
                cost: '',
                taglist: [{
                    key: '',
                    value: ''
                }]
            },
            {
                member: "USB2",
                bundle: "USB",
                type: "USB",
                interfaceUsage: '',
                cost: '',
                taglist: [{
                    key: '',
                    value: ''
                }]
            },
            {
                member: "USB3",
                bundle: "USB",
                type: "USB",
                interfaceUsage: '',
                cost: '',
                taglist: [{
                    key: '',
                    value: ''
                }]
            },

        ]
    },
    noData: "No data found",
    networkArr: [
        { name: "defaultIPv4-net", value: 1 }
    ],
    interfaceNameList: [
        "wlan", "eth"
    ],
    appinstanceName:"App instance Status",
    memoryStatus: "Memory metrics",
    nodeOcc: "Node occupancy",
    netStatus: "Network metrics",
    cpuStatus: "CPU metrics",
    nodeSummary: "Node summary",
    delete: 'Delete',
    singleNodeTitle: "Node Dashboard",
    totMem: "Total Memory : ",
    timeStamp: "TIMESTAMP : ",
    hoursText: "Last 2 hours",
    hoursEvent: "Last 10 errors and warnings",
    nodeInfo: {
        edgeModelName: "Edge Node Model",
        manufacturer: "Manufacturer",
        version: "Version",
        cpuArch: "CPU Architecture",
        nCpu: "No of CPU",
        memory: "Memory",
        storage: "Storage",
        ipaddress:"IP Address"
    },
    total: "Total",
    allocated: 'Allocated',
    used: 'Used',
    nodeEvent:"Events",
    nodeStatusName:"App instance status",
    columnList: [
        {
            column: 'Max',
            id: 1
        },
        {
            column: 'Min',
            id: 2
        },
        {
            column: 'Average ',
            id: 3
        },
        {
            column: 'current',
            id: 4
        },
    ]
}