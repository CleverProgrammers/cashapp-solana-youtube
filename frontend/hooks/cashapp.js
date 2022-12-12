import { useEffect, useState } from "react"
// Function that gets random avatar based on wallet address
import { getAvatarUrl } from "../functions/getAvatarUrl"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import BigNumber from 'bignumber.js';



export const useCashApp = () => {

    // LocalStorage Hook
    const useLocalStorage = (storageKey, fallbackState) => {
        const [value, setValue] = useState(
            JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState
        );
        useEffect(() => {
            localStorage.setItem(storageKey, JSON.stringify(value));
        }, [value, storageKey]);
        return [value, setValue];
    };

    // const qaziAddress = new PublicKey('2aaKJpbQNpJXPgReNKQtB5ozs1DnoADCQCGk5pD7x2Xg') 

    // I can create a transaction request with Solana pay between two wallets
    // I want to be able to decide which two wallets to send/receive sol
    const { connection } = useConnection();
    const { connected, publicKey, sendTransaction } = useWallet()

    const [avatar, setAvatar] = useState("")
    const [userAddress, setUserAddress] = useState("11111111111111111111111111111111")
    const [amount, setAmount] = useState(0)
    // State for localStorage Array
    const [transactions, setTransactions] = useLocalStorage("transactions", []);
    const [newTransactionModalOpen, setNewTransactionModalOpen] = useState(false)

    useEffect(() => {
        if (connected) {
            setAvatar(getAvatarUrl(publicKey.toString()))
            setUserAddress(publicKey.toString())
        }
    }, [connected])

    // Args:
    // - fromWallet: PublicKey
    // - toWallet: PublicKey
    // - amount: BigNumber
    // - reference: PublicKey
    async function makeTransaction(fromWallet, toWallet, amount, reference) {
        const network = WalletAdapterNetwork.Devnet
        const endpoint = clusterApiUrl(network)
        const connection = new Connection(endpoint)

        // Get a recent blockhash to include in the transaction
        const { blockhash } = await connection.getLatestBlockhash('finalized')

        const transaction = new Transaction({
            recentBlockhash: blockhash,
            // The buyer pays the transaction fee
            feePayer: fromWallet,
        })

        // Create the instruction to send SOL from the buyer to the shop
        const transferInstruction = SystemProgram.transfer({
            fromPubkey: fromWallet,
            lamports: amount.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
            toPubkey: toWallet,
        })

        // Add the reference to the instruction as a key
        // This will mean this transaction is returned when we query for the reference
        transferInstruction.keys.push({
            pubkey: reference,
            isSigner: false,
            isWritable: false,
        })

        // Add the instruction to the transaction
        transaction.add(transferInstruction)

        return transaction
    }

    // TODO: Move somewhere reasonable if here is not reasonable
    async function doTransaction({ amount, receiver, transactionPurpose }) {
        const fromWallet = publicKey
        const toWallet = new PublicKey(receiver)
        const bnAmount = new BigNumber(amount)
        const reference = Keypair.generate().publicKey
        const transaction = await makeTransaction(fromWallet, toWallet, bnAmount, reference)

        const txnHash = await sendTransaction(transaction, connection)
        // console.log(txnHash)


        const newID = (transactions.length + 1).toString()
        const newTransaction = {
            id: newID,
            from: {
                name: publicKey,
                handle: publicKey,
                avatar: avatar,
                verified: true,
            },
            to: {
                name: receiver,
                handle: '-',
                avatar: getAvatarUrl(receiver.toString()),
                verified: false,
            },
            description: transactionPurpose,
            transactionDate: new Date(),
            status: 'Completed',
            amount: amount,
            source: '-',
            identifier: '-',
        };
        setNewTransactionModalOpen(false);
        setTransactions([newTransaction, ...transactions]);
    }



    return { getAvatarUrl, avatar, userAddress, amount, setAmount, makeTransaction, doTransaction, transactions, setTransactions, newTransactionModalOpen, setNewTransactionModalOpen }
}