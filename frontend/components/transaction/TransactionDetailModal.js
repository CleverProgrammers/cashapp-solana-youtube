import { format } from 'date-fns'
import { CheckBadgeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { capitalize } from '../../utils/string'
import Modal from '../Modal'


const TransactionDetailModal = ({ currentTransaction, modalOpen, setModalOpen }) => {
    return (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div className="space-y-20">
                <TransactionProfile name={currentTransaction?.to.name} handle={currentTransaction?.to.name} avatar={currentTransaction?.to.avatar} verified={currentTransaction?.to.verified} />

                <TransactionDetails amount={currentTransaction?.amount} description={currentTransaction?.description} transactionDate={currentTransaction?.transactionDate} />

                <TransactionStatus status={currentTransaction?.status} />

                <TransactionMetadata
                    metadata={{
                        amount: `${Number(currentTransaction?.amount).toFixed(2)} SOL`,
                        to: currentTransaction?.to.name,
                        from: currentTransaction?.from.name,
                    }}
                />

                <TransactionFooter />
            </div>
        </Modal>
    )
}

const TransactionProfile = ({ name, handle, avatar, verified }) => {
    console.log(verified)
    return (
        <div className="flex flex-col items-center space-y-3">
            <div className="h-16 w-16 rounded-full border-2 border-white">
                <img className="h-full w-full rounded-full object-cover" src={avatar} />
            </div>

            <div className="flex flex-col items-center space-y-1">
                <div className="flex items-center space-x-1">
                    <p className="font-semibold">{name}</p>
                    {verified && <CheckBadgeIcon className="h-5 w-5 text-blue-500" />}
                </div>

                <p className="text-sm font-light text-gray-600 truncate">Payment to ${handle}</p>
            </div>
        </div>
    )
}

const TransactionDetails = ({ amount, description, transactionDate }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-6xl">{Number(amount).toFixed(1)} SOL</h3>
            <div className="flex flex-col items-center text-gray-400">
                <p>{description}</p>
                <p>
                    {format(new Date(transactionDate), 'MMM d')} at {format(new Date(transactionDate), 'h:mm aa')}
                </p>
            </div>
        </div>
    )
}

const TransactionStatus = ({ status }) => {
    const isCompleted = status === 'Completed'

    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            {isCompleted ? <CheckCircleIcon className="h-8 w-8 text-[#0bb534]" /> : <XCircleIcon className="h-8 w-8 text-red-600" />}
            <p className="text-lg font-semibold">{capitalize(status)}</p>
        </div>
    )
}

const TransactionMetadata = ({ metadata }) => {
    return (
        <div className="space-y-1">
            {Object.entries(metadata).map(([title, data], index) => (
                <div key={index} className="flex justify-between">
                    <p className="text-gray-400 max-w-[25%]">{capitalize(title)}</p>
                    <p className="font-medium text-gray-400 max-w-[75%] truncate">{data}</p>
                </div>
            ))}
        </div>
    )
}

const TransactionFooter = () => {
    return (
        <div className="flex flex-col items-center justify-center text-sm text-gray-400">
            <p>Block Inc.</p>
            <p>1455 Market St. Suite 600</p>
            <p>San Francisco. CA 94103</p>
            <p>(800) 969-1940</p>
            <p>Privacy Notice</p>
        </div>
    )
}

export default TransactionDetailModal
