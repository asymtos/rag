import React, { Fragment } from 'react'
//Headless import
import { Dialog, Transition } from '@headlessui/react'
//Icons
import { addedgeAppConst } from '@/constant/addedgeAppConst'

const PopupModal = (props) => {
    const { open, onclose, popupModalObj,callBack } = props;
    const header = popupModalObj.popupModalName ? popupModalObj.popupModalName : "Delete";
    const message = popupModalObj.popupModalMsg ? popupModalObj.popupModalMsg : "Are you sure delete this"

    const deleteHandler = async (data) => {
        await callBack(data);
        onclose(false)
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[999]" onClose={onclose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="lg:min-w-screen-sm h-[10rem] relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="w-full sm:flex sm:items-start">
                                    <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg border-b-[1px] pb-2 leading-6 text-gray-900">
                                            <p>{header}</p>
                                        </Dialog.Title>
                                        <div className='mt-4 justify-center items-center h-[40rem]'>
                                            {/*Component */}
                                            <div className='pb-2'>
                                                <p>{message}</p>
                                            </div>
                                            <div className='flex flex-row justify-end gap-4 py-2'>
                                                <button className="rounded-md bg-gray-500 px-2 py-1.5 text-sm text-white shadow-sm hover:bg-gray-600  flex justify-center items-center"
                                                    type="button"
                                                    onClick={() => onclose(false)}
                                                >
                                                    {addedgeAppConst.cancel}
                                                </button>
                                                <button className="rounded-md bg-red-500 px-2 py-1.5 text-sm text-white shadow-sm hover:bg-red-600  flex justify-center items-center"
                                                    type="button"
                                                    onClick={() => deleteHandler(popupModalObj.popupModalData)}
                                                >
                                                    {addedgeAppConst.delete}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default PopupModal;