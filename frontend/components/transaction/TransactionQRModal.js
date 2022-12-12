import Modal from '../Modal'
import { createQR, encodeURL, findReference, validateTransfer, FindReferenceError, ValidateTransferError } from "@solana/pay"
import { PublicKey, Keypair } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useRef, useState } from 'react';
import { truncate } from "../../utils/string"
import { useCashApp } from '../../hooks/cashapp'
import { getAvatarUrl } from "../../functions/getAvatarUrl"



const TransactionQRModal = ({ modalOpen, setModalOpen, userAddress, setQrCode }) => {
    const { transactions, setTransactions } = useCashApp()
    const { connection } = useConnection()
    const qrRef = useRef()
    const loadQr = () => {
        setQrCode(true)
    }
    useEffect(() => {
        const recipient = new PublicKey(userAddress)
        const amount = new BigNumber("1")
        const reference = Keypair.generate().publicKey
        const label = "Evil Cookies Inc"
        const message = "Thanks for your Sol! 🍪"

        const urlParams = {
            recipient,
            // splToken: usdcAddress,
            amount,
            reference,
            label,
            message,
        }
        const url = encodeURL(urlParams)
        const qr = createQR(url, 488, 'transparent')
        if (qrRef.current) {
            qrRef.current.innerHTML = ''
            qr.append(qrRef.current)
        }

        // Wait for the user to send the transaction

        const interval = setInterval(async () => {
            console.log("waiting for transaction confirmation")
            try {
                // Check if there is any transaction for the reference
                const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' })
                console.log("validating")
                // Validate that the transaction has the expected recipient, amount and SPL token
                await validateTransfer(
                    connection,
                    signatureInfo.signature,
                    {
                        recipient,
                        amount,
                        // splToken: usdcAddress,
                        reference,
                    },
                    { commitment: 'confirmed' }
                )

                console.log("confirmed, proceed with evil deeds")

                const newID = (transactions.length + 1).toString()
                const newTransaction = {
                    id: newID,
                    from: {
                        name: recipient,
                        handle: recipient,
                        avatar: getAvatarUrl(recipient.toString()),
                        verified: true,
                    },
                    to: {
                        name: reference,
                        handle: '-',
                        avatar: getAvatarUrl(reference.toString()),
                        verified: false,
                    },
                    description: 'User sent you SOL through Phantom App!',
                    transactionDate: new Date(),
                    status: 'Completed',
                    amount: amount,
                    source: '-',
                    identifier: '-',
                };
                console.log(newTransaction, "NEW TRANSACTIONS EXISTS")
                setTransactions([newTransaction, ...transactions]);
                setModalOpen(false);


                clearInterval(interval)
            } catch (e) {
                if (e instanceof FindReferenceError) {
                    // No transaction found yet, ignore this error
                    return;
                }
                if (e instanceof ValidateTransferError) {
                    // Transaction is invalid
                    console.error('Transaction is invalid', e)
                    return;
                }
                console.error('Unknown error', e)
            }
        }, 500)

        return () => clearInterval(interval)
    })

    return (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div >
                <div className="flex flex-col items-center justify-center space-y-1">
                    <div ref={qrRef} />
                </div>

                <div className="flex flex-col items-center justify-center space-y-1">
                    <p className="text-lg font-medium text-gray-800">{truncate(userAddress)}</p>

                    <p className="text-sm font-light text-gray-600">Scan to pay ${truncate(userAddress)}</p>

                    <button onClick={() => loadQr()} className="w-full rounded-lg bg-[#16d542] py-3 hover:bg-opacity-70">
                        <span className="font-medium text-white">Load QR code</span>
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default TransactionQRModal
