'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Key, Phone, RefreshCw, Copy, Unlock } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { recoverKey } from '../home/utils/recoverKey'
import { recoverRemainingParts } from '../home/utils/recoverRemainingParts'

export default function ForgotPrivateKey() {
    const [inputParts, setInputParts] = useState<string[]>(['', '', ''])
    const [recoveredKey, setRecoveredKey] = useState('')
    const [error, setError] = useState('')


    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [backupKey, setBackupKey] = useState('')




    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }


    const recoverButtonClicked = () => {
        console.log(inputParts);
        try {
            const recoveredFromParts = recoverKey(inputParts);
            setRecoveredKey(recoveredFromParts);
            toast({
                title: `Private Key ${recoveredFromParts} has been recovered!`,
            });
        } catch (error: any) {
            toast({
                title: error.message, // Display the error message
                variant: 'destructive', // Optionally, you can set a variant for styling
            });
        }
    }

    const getBackupKey = () => {
        if (!phoneNumber) {
            toast({
                title: `Phone Number is required`,
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: `OTP has been sent to ${phoneNumber}`,
            description: 'This may take a few moments',
        });
        setPassword('');



        const { part1, part2 } = recoverRemainingParts(password, phoneNumber);
        console.log(`Part 1: ${part1}`);
        console.log(`Part 2: ${part2}`);
        setBackupKey(part1);
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 border-blue-500 border-2">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-blue-400">Recover Private Key</CardTitle>
                    <CardDescription className="text-gray-400">Enter any 3 parts to recover your private key</CardDescription>
                    <Button onClick={getBackupKey} className="w-full mb-4 bg-blue-600 hover:bg-blue-700">Get Backup Key</Button>


                    <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder='Enter Phone Number' className='mb-4' />

                    {backupKey && <div>
                        <Label className="text-gray-300">Decrypted Part-Key</Label>
                        <div className="flex items-center mt-2">
                            <Input value={backupKey} readOnly className="mr-2 bg-gray-700 text-gray-300 border-gray-600" />
                            <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                <Copy onClick={() => copyToClipboard(backupKey)} className="h-4 w-4" />
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
                                    <Copy onClick={() => copyToClipboard(recoveredKey)} className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}