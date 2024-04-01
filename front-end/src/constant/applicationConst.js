export const computeAppConst = {
  title: "Application overview dashboard",
  addNodeBtn: "Provision New Application",
  tableTitle: "List of Applications",
  noData: "No data found",
  category: "Category",
  edit: "Edit",
  page: "Page",
  previous: "Previous",
  next: "Next",
  action: "Action",
  save: 'Save',
  delete: "Delete",
  view: "View",
  appCategory:"App Category Status",

  //add application const
  addTitle: "Add Application",
  identity: "Indentity",
  save: "Save",
  cancel: "Cancel",
  uploadFile: "Upload File",
  Logobutton: "UPLOAD LOGO",
  LicenseButton: "UPLOAD LICENSE",
  selectImageButton: "Select Image",
  checkBoxText: "Yes",
  resources: "Resources",
  drives: "Drives",
  environments: 'Environments',
  addEnvironment: 'Add Environment',
  configuration: 'Configuration',
  imageDetails: 'Image Details',
  editTitle: "Edit Application",

  fieldLabel: {
    name: "Name *",
    title: "Title *",
    description: "Description",
    logo: "Logo",
    category: "Category *",
    version: "Version",
    deploymentType: "Deployment Type *",
    VNCconnection: "VNC Connection",
    license: "License",
    resource: "Resource *",
    cpu: 'CPUs *',
    memory: "Memory *",
    tag: 'Tag',
    selectImage: 'Edge App Image',
    path: 'Mount path',
    encrypted: "Encrypted",
    purge: 'Purge',
    directAttach: 'Direct Attach',
    envName: 'Interface Name*',
    adapterType: "Adapter Type *",
    configurationlabel: 'Add Custom Config Template',
    configurationName: 'Configuration Name *',
    allowEdgeAppOverride: 'Allow Edge App deployments to set entire configuration?',
    variableDelimiter: 'Variable Delimiter',
    configurationTemplate: 'Configuration Template *',
    imagelocation: "Image Location *",
    imageSize: "Image Size",
    imagearchitecture: "Image Architecture",
    imageDigest: "Image Digest",
    imagename: "Image Name *",
  },
  EnvfieldLabel: {
    outboundHostorIP: "Outbound Host or IP",
    inboundIP: "Inbound IP",
    protocol: "Protocol *",
    protocolout: 'Protocol',
    port: "Port",
    action: "Action",
    rate: 'Rate',
    burst: 'Burst',
    appPort: 'Map Port *',
    nodePort: 'Application port *',
  },
  categoryList: [
    { name: "Cloud Gateway", value: 1 },
    { name: "End Application", value: 2 },
    { name: "Infrastructure", value: 3 },
    { name: "Network Gateway", value: 4 },
    { name: "Operating System", value: 5 },
  ],
  deploymentTypeList: [
    { name: "Standalone", value: 1 },
    // { name: "Azure Runtime", value: 2 },
    // { name: "K3S", value: 3 },
    // { name: "VCE", value: 4 },
    // { name: "TKG Attach", value: 5 },
  ],
  resourceList: [
    { name: "CPU", value: 1 },
    { name: "Memory", value: 2 },
  ],
  appListCol: [
    {
      name: 'Name',
      value: 'name'
    },
    {
      name: 'Application Category',
      value: 'appCategory'
    },
    {
      name: 'Description',
      value: 'description'
    },
    {
      name: 'Deployment Type',
      value: 'deploymentType'
    },
    {
      name: 'Action',
      value: 'action'
    }
  ],
  categoryListForSideNav: [
    { name: "All Category", value: "All" },
    { name: "Cloud Gateway", value: "Cloud Gateway" },
    { name: "End Application", value: "End Application" },
    { name: "Infrastructure", value:"Infrastructure" },
    { name: "Network Gateway", value:"Network Gateway" },
    { name: "Operating System", value: "Operating System" },
  ],
  driveList: [
    {
      tag: '',
      selectImage: "",
      path: "",
      encrypted: false,
      purge: false,
      newName: ''
    },
  ],
  adapterTypeList: [
    { name: "Audio", value: 1 },
    { name: "COM", value: 2 },
    { name: "CPU", value: 3 },
    { name: "Ethernet", value: 4 },
    { name: "HDMI", value: 5 },
    { name: "USB", value: 6 },
    { name: "WLAN", value: 7 },
    { name: "WWAN", value: 8 },
  ],
  applicationView: {
    viewTitle: "Application Details",

  },
  architectureList: [
    { name: "AMD", value: 1 },
    { name: "ARM", value: 2 },
  ],
  interfaceList: [
    {
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
  ],

  actionList: [
    { name: "Allow", value: 1 },
    { name: "Limit", value: 2 },
  ],
  actionListIN: [
    { name: "Allow", value: 1 },
    { name: "Limit", value: 2 },
    { name: "Map", value: 3 },
  ],
  userData: [
    {
      "id": "Active Users",
      "label": "Active Users",
      "value": 457,
      "color": "hsl(287, 70%, 50%)"
    },
    {
      "id": "New Users",
      "label": "New Users",
      "value": 42,
      "color": "hsl(305, 70%, 50%)"
    },
    {
      "id": "Page Views",
      "label": "Page Views",
      "value": 870,
      "color": "hsl(224, 70%, 50%)"
    },
    {
      "id": "Bounce Rate",
      "label": "Bounce Rate",
      "value": 29,
      "color": "hsl(358, 70%, 50%)"
    },
  ],
  protocolList:[
    { name: "TCP", value: 1 },
    { name: "UDP", value: 2 },
  ]
}