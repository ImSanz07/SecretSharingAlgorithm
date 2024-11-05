'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Copy, Key, Unlock, Database, SplitIcon, Split, SplitSquareHorizontal, MessageCircle } from 'lucide-react'

import { generateKeys } from './utils/generateKeys'
import { useToast } from "@/hooks/use-toast"
import secrets from 'secrets.js-grempe';
import { splitKey } from './utils/splitKey'
import {recoverKey} from './utils/recoverKey'
import { storeRemainingParts } from './utils/storeRemainingParts'
import { recoverRemainingParts } from './utils/recoverRemainingParts'

import { Wallet } from 'ethers';
import Link from 'next/link'



export default function ECCKeyManager() {
    const [publicKey, setPublicKey] = useState('')
    const [privateKey, setPrivateKey] = useState('')
    const [keyParts, setKeyParts] = useState<string[]>([])
    const [remainingParts, setRemainingParts] = useState<string[]>([])
    const [inputParts, setInputParts] = useState<string[]>(['', '', ''])
    const [recoveredKey, setRecoveredKey] = useState('')
    const [error, setError] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [seedPhrase, setSeedPhrase] = useState('')
    const [gotAddress,setGotAddress] = useState('')
    const [gotPrivateKey,setGotPrivateKey] = useState('')

    const [backupKey, setBackupKey] = useState('')


    const { toast } = useToast()

    const callGenerateKey = () => {
        

        
        if(!password){
            setError('Password is required')
            return
        }
        const {sk,pk}=generateKeys(password)
        setPublicKey(pk)
        setPrivateKey(sk)
        console.log(`Generated Secret Key: ${sk}`)
        console.log(`Generated Public Key:: ${pk}`);
        setPassword('')   
    }
    const copyButtonClicked = (key:string) => {
        if(key === 'Public Key'){
            navigator.clipboard.writeText(publicKey)
            toast({
                title: `${key} Copied to Clipboard`,
                variant: 'default',
            })
        }else{
            navigator.clipboard.writeText(privateKey)
            toast({
                title: `${key} Copied to Clipboard`,
                description: 'Be Sure to store it Securely',
                variant: 'destructive',
            })
        }
        
    }

    const splitPrivateKey = () => {
        if(!privateKey){
            toast({
                title: `Please generate the keys first`,
            })
            return
        }
        const shares = splitKey(privateKey)  
        setKeyParts(shares.slice(0, 3));
        setRemainingParts(shares.slice(3, 5));
        // storeRemainingParts(shares.slice(3, 5),password);
        // setKeyParts(shares);
        

    }

    const recoverButtonClicked = () => {
        console.log(inputParts);
        try {
            const recoveredFromParts = recoverKey(inputParts);
            setRecoveredKey(recoveredFromParts);
            toast({
                title: `Private Key ${recoveredFromParts} has been recovered!`,
            });

            if (recoveredFromParts !== privateKey) {
                setError('RecoveredPrivate Key does not match')
                toast({
                    title: `Private Key does not match`,
                    description: 'Please enter the required Parts correctly',
                    variant: 'destructive',
                })
            }
            if (recoveredFromParts === privateKey) {
                setError('')
                toast({
                    title: `Recovered Private Key Matches with Original Private Key`,
                });
            }

            
        } catch (error:any) {
            toast({
                title: error.message, // Display the error message
                variant: 'destructive', // Optionally, you can set a variant for styling
            });
        }
    }


    const checkPrivateKey = () => {        
        if (recoveredKey!==privateKey){
            setError('RecoveredPrivate Key does not match')
            toast({
                title: `Private Key does not match`,
                description: 'Please enter the required Parts correctly',
                variant: 'destructive',
            })
        }
    }

    const copyKeyParts = (part: string) => {
        navigator.clipboard.writeText(part)
        toast({
            title: `Key Part Copied to Clipboard`,
        })
    }

    const sendOTP = () => {
        if(!phoneNumber){
            toast({
                title: `Please Enter a Phone Number`,
            })
            return
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            toast({
                title: 'Invalid phone number. Please enter a 10-digit phone number.',
            })
            return
        }

        // if(!remainingParts[0]||!remainingParts[1]){
        //     setError('Generate Public Private Key first')
        //     return
        // }

        // //Verify the OTP & if Verified
        // storeRemainingParts(remainingParts, phoneNumber, password);


        
        toast({
            title: `OTP sent to ${phoneNumber}`,
        })
    }

    const recoverPrivateKey = ()=>{
        if(!seedPhrase){
            toast({
                title: `Seed Phrase is required`,
            })
        }

        console.log(`Seed Phrase: ${seedPhrase}`);
        let mnemonicWallet = Wallet.fromPhrase(seedPhrase);
        setGotAddress(mnemonicWallet.address)
        setGotPrivateKey(mnemonicWallet.privateKey)
        console.log(mnemonicWallet.address);
        console.log(mnemonicWallet.privateKey);
        
        
        

    }

    const getBackupKey = () => {
        const {part1,part2} = recoverRemainingParts(password, phoneNumber);
        console.log(`Part 1: ${part1}`);
        console.log(`Part 2: ${part2}`);
        
        setBackupKey(part1)
    }

    

    

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
            <div className="container mx-auto max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-400">Recover Private Key</h1>
                    <p className="text-gray-400">Secure recovering keys using Shamir Secret Sharing Scheme</p>
                </div>


                <Card className="bg-gray-800 border-blue-500 border-2 mb-7">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-blue-400">Mobile / Email Verification</CardTitle>
                        <CardDescription className="text-gray-400">Enter Phone Number or Email to Recover Private Key</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder='Enter Phone Number' className='mb-4'/>

                        
                        
                    </CardContent>
                    <CardFooter className="flex flex-col items-start">
                        <Button onClick={sendOTP} className="mb-4 bg-blue-600 hover:bg-blue-700">
                            <MessageCircle className="mr-2 h-4 w-4" /> Send OTP
                        </Button>
                        
                    </CardFooter>
                </Card>

                <Card className="bg-gray-800 border-blue-500 border-2 mb-7">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-blue-400">Recover using Seed Phrase</CardTitle>
                        <CardDescription className="text-gray-400">Enter Seed Phrase to Recover Private Key </CardDescription>
                        <Button className="mb-4 w-[200px] bg-blue-600 hover:bg-blue-700"><Link href="/SecretShare">Dont Remeber Your Phrase? </Link></Button>
                    </CardHeader>
                    <CardContent>
                        <Input value={seedPhrase} onChange={(e) => setSeedPhrase(e.target.value)} placeholder='Enter Seed Phrase' className='mb-4' />

                        {seedPhrase && <div>
                            <Label className="text-gray-300">Decrypted Private Key</Label>
                            <div className="flex mt-2">
                                <Input value={gotPrivateKey} readOnly className="mr-2 bg-gray-700 text-gray-300 border-gray-600" />
                            </div>
                            <Label className="text-gray-300">Decrypted Public Address</Label>
                            <div className="flex mt-2">
                                <Input value={gotAddress} readOnly className=" bg-gray-700 mr-2 text-gray-300 border-gray-600" />
                            </div>

                        </div>}

                    </CardContent>
                    <CardFooter className="flex flex-col items-start">
                        <Button onClick={recoverPrivateKey} className="mb-4 bg-blue-600 hover:bg-blue-700">
                            <MessageCircle className="mr-2 h-4 w-4" /> Recover 
                        </Button>

                        

                    </CardFooter>
                </Card>


    
                


            </div>
        </div>
    )
}