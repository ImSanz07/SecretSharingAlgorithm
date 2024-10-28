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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"




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
            setError('Phone Number is required')
            return
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            setError('Invalid phone number. Please enter a 10-digit phone number.')
            return
        }

        if(!remainingParts[0]||!remainingParts[1]){
            setError('Generate Public Private Key first')
            return
        }

        //Verify the OTP & if Verified
        storeRemainingParts(remainingParts, phoneNumber, password);
        
        toast({
            title: `OTP sent to ${phoneNumber}`,
        })
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
                    <h1 className="text-4xl font-bold text-blue-400">ECC Key Management</h1>
                    <p className="text-gray-400">Secure generating and storing keys</p>
                </div>
                <Card className="mb-8 bg-gray-800 border-blue-500 border-2">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-blue-400">Generate Keys</CardTitle>
                        <CardDescription className="text-gray-400">Create and split your ECC keys securely</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} className='mb-4'>
                        </Input>
                        <Button onClick={callGenerateKey} className="w-full mb-4 bg-blue-600 hover:bg-blue-700">
                            <Key className="mr-2 h-4 w-4" /> Generate New Key Pair
                        </Button>
                        {publicKey && (
                            <div className="mb-4">
                                <Label htmlFor="publicKey" className="text-gray-300">Public Key</Label>
                                <div className="flex items-center">
                                    <Input id="publicKey" value={publicKey} readOnly className="mr-2 bg-gray-700 text-gray-300 border-gray-600" />
                                    <Button onClick={()=>copyButtonClicked("Public Key")} variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        <Copy className="h-4 w-4"  />
                                    </Button>
                                </div>
                            </div>
                        )}
                        {privateKey && (
                            <div className="mb-4">
                                <Label htmlFor="privateKey" className="text-gray-300">Private Key</Label>
                                <div className="flex items-center">
                                    <Input id="privateKey" value={privateKey} readOnly className="mr-2 bg-gray-700 text-gray-300 border-gray-600" />
                                    <Button onClick={() => copyButtonClicked("Private Key")} variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className='mt-4'>
                                    <Button onClick={splitPrivateKey} className="w-full mb-4 bg-green-600 hover:bg-blue-700">
                                        <SplitSquareHorizontal className="mr-2 h-4 w-4" /> Split Private Key
                                    </Button>

                                </div>
                                
                                
                            </div>
                            
                        )}
                        {keyParts.length > 0 && (
                            <div>
                                <Label className="text-gray-300">Key Parts (Save these securely)</Label>
                                {keyParts.map((part, index) => (
                                    <div key={index} className="flex items-center mt-2">
                                        <Input value={part} readOnly className="mr-2 bg-gray-700 text-gray-300 border-gray-600" />
                                        <Button onClick={() => copyKeyParts(part)} variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-blue-500 border-2 mb-7">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-blue-400">Mobile Verification</CardTitle>
                        <CardDescription className="text-gray-400">Enter Phone Number & OTP to Recover Private Key</CardDescription>
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
                

                <Card className="bg-gray-800 border-blue-500 border-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-blue-400">Recover Private Key</CardTitle>
                        <CardDescription className="text-gray-400">Enter any 3 parts to recover your private key</CardDescription>
                        <Button onClick={getBackupKey} className="w-full mb-4 bg-blue-600 hover:bg-blue-700">Get Backup Key</Button>
                        {backupKey && <div>
                            <Label className="text-gray-300">Decrypted Part-Key</Label>
                                <div  className="flex items-center mt-2">
                                    <Input value={backupKey} readOnly className="mr-2 bg-gray-700 text-gray-300 border-gray-600" />
                                    <Button onClick={() => copyKeyParts(backupKey)} variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                        </div>}
                    </CardHeader>
                    <CardContent>
                        {inputParts.map((part, index) => (
                            <div key={index} className="mb-4">
                                <Label htmlFor={`part${index + 1}`} className="text-gray-300">Part {index + 1}</Label>
                                <Input
                                    id={`part${index + 1}`}
                                    value={part}
                                    onChange={(e) => {
                                        const newParts = [...inputParts]
                                        newParts[index] = e.target.value
                                        setInputParts(newParts)
                                    }}
                                    placeholder={`Enter part ${index + 1}`}
                                    className="bg-gray-700 text-gray-300 border-gray-600"
                                />
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="flex flex-col items-start">
                        <Button onClick={recoverButtonClicked} className="mb-4 bg-blue-600 hover:bg-blue-700">
                            <Unlock className="mr-2 h-4 w-4" /> Recover Private Key
                        </Button>
                        {error && (
                            <div className="text-red-400 flex items-center">
                                <AlertCircle className="mr-2 h-4 w-4" /> {error}
                            </div>
                        )}
                        {recoveredKey && (
                            <div className="mt-4 w-full">
                                <Label htmlFor="recoveredKey" className="text-gray-300">Recovered Private Key</Label>
                                <div className="flex items-center">
                                    <Input id="recoveredKey" value={recoveredKey} readOnly className="mr-2 bg-gray-700 text-gray-300 border-gray-600" />
                                    <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardFooter>
                </Card>


            </div>
        </div>
    )
}