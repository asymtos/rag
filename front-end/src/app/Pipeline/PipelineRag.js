
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
const PipelineRag = () => {

    // taking errors from csv file given by Nisha
    const [errors, setErrors] = useState([]);
    const [selectedError, setSelectedError] = useState(null);



    const router = useRouter();

    useEffect(() => {
        const fetchErrors = async () => {
            try {
                const response = await fetch('/errors.csv');
                const csvData = await response.text();

                const rows = csvData.trim().split('\n');
                const headers = rows.shift().split(',');

                const parsedErrors = rows.map(row => {
                    const values = row.split(',');
                    return headers.reduce((obj, header, index) => {
                        obj[header] = values[index];
                        return obj;
                    }, {});
                });

                setErrors(parsedErrors);
            } catch (error) {
                console.error('Error fetching file:', error);
            }
        };

        fetchErrors();
    }, []);

    // const handleCheckboxChange = (errorId) => {
    //     if (selectedError === errorId) {
    //         setSelectedError(null); // Unselect if already selected
    //     } else {
    //         setSelectedError(errorId); // Select the error
    //     }
    // };

    const handleCheckboxChange = (error) => {
        if (selectedError && selectedError.id === error.id) {
            setSelectedError(null);
        } else {
            setSelectedError(error);
        }
    };


    const getResolution = () => {
        if (selectedError) {
            router.push("/Pipeline/Resolutions");
            // router.push(`/Pipeline/Resolutions?errorId=${selectedError.id}&errorDescription=${selectedError.message}`);

        } else {
            alert("Please select an error before proceeding to resolution.");
        }
    }
    return (
        <div className="flex flex-col px-[24px]">

            {/* Selected errors part */}
            <div className="flex flex-col sm:flex-auto mt-4 sm:px-6 lg:px-8 gap-4">
                <h1 className="text-xl leading-6">Errors Overview Dashboard</h1>
                <div className="flex flex-col pb-4 border rounded-lg bg-blue-50 border-solid[#D7D3D0] ring-2 ring-gray-900/50 h-[100px] w-auto">
                    <div className="flex flex-row">
                        <p className="flex-row text-xl leading-12 sans-serif text-center w-[200px] text-dark">Selected Error</p>
                    </div>
                    <div className="mx-4 mt-4 ">
                        {selectedError && (
                            <div>
                                <p>
                                    <span className='mr-2'>{selectedError}</span>
                                    <span>{errors.find(error => error.id === selectedError).message}</span></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* space between both parts and resolution button*/}
            <div className="flex flex-row-reverse mt-4 sm:px-4 lg:px-8">
                <button className="rounded-md bg-dark px-2 py-2 text-sm text-white shadow-sm hover:bg-blue-800 flex justify-center items-center" type="button" onClick={getResolution}>Resolutions</button>
            </div>


            {/* Table */}
            <div>
                <div className="mt-2 flow-root md:py-0">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table id="errorTable" className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="relative sm:w-12 sm:px-6 bg-dark">
                                            </th>
                                            <th scope="col" className="whitespace-nowrap bg-dark realtive px-3 py-4 sm:w-12 text-left text-sm text-white font-normal">
                                                Error ID
                                            </th>
                                            <th scope="col" className="whitespace-nowrap bg-dark realtive px-3 py-4 sm:w-12 text-left text-sm text-white font-normal">
                                                List of Errors
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {/* onClick={() => handleRowClick('Error 1: Something went wrong')} */}
                                        {errors.map((error) => (
                                            <tr key={error.id} className="hover:bg-blue-50">
                                                <td className="relative px-7 sm:w-12 sm:px-6">
                                                    <input type="checkbox" value="0" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-900 focus:border-blue-900 focus:border-transparent focus:ring-0" checked={selectedError === error.id}
                                                        onChange={() => handleCheckboxChange(error.id)}

                                                    />
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-am text-left">{error.id}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-am text-left">{error.message}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PipelineRag

