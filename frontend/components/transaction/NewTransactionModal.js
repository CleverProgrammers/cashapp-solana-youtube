import { useState } from 'react'
import Modal from '../Modal'
import { useCashApp } from '../../hooks/cashapp.js'

const NewTransactionModal = ({ modalOpen, setModalOpen, addTransaction }) => {
    const { amount, setAmount } = useCashApp()

    const [receiver, setReceiver] = useState('')
    const [transactionPurpose, setTransactionPurpose] = useState('')

    const onAmountInput = (e) => {
        e.preventDefault()
        const newAmount = e.target.value

        setAmount(newAmount)

        const input = document.querySelector('input#amount')
        input.style.width = newAmount.length + 'ch'
    }

    const onPay = async () => {
        await addTransaction({ amount, receiver, transactionPurpose })
        setAmount(0)

    }

    return (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div className="relative flex flex-col items-center justify-center space-y-8">
                <div className="flex items-center justify-center text-center text-7xl font-semibold text-[#00d54f]">
                    <input className="w-12 outline-none" id="amount" name="amount" type="number" value={amount} onChange={onAmountInput} min={0} />
                    <label htmlFor="amount">SOL</label>
                </div>

                <div className="flex w-full flex-col space-y-2">
                    <div className="flex rounded-lg border border-gray-200 p-4">
                        <label className="text-gray-300" htmlFor="receiver">
                            To:
                        </label>
                        <input className="w-full pl-2 font-medium text-gray-600 placeholder-gray-300 outline-none" id="receiver" name="receiver" type="text" placeholder="Name, $Cashtag, SMS, Email" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
                    </div>

                    <div className="flex rounded-lg border border-gray-200 p-4">
                        <label className="text-gray-300" htmlFor="transactionPurpose">
                            For:
                        </label>
                        <input className="w-full pl-2 font-medium text-gray-600 placeholder-gray-300 outline-none" id="transactionPurpose" name="transactionPurpose" type="text" placeholder="Dinner, Rent, etc." value={transactionPurpose} onChange={(e) => setTransactionPurpose(e.target.value)} />
                    </div>
                </div>

                <div className="flex w-full space-x-1">
                    <button onClick={onPay} className="w-full rounded-lg bg-[#00d54f] py-3 px-12 text-white hover:bg-opacity-70">
                        Pay
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default NewTransactionModal
