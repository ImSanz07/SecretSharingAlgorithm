// components/SecretSharing.js
"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { MessageCircle, Link, Copy } from 'lucide-react';

import React, { useState } from 'react';

import { splitSeed,recoverSeed } from '../homealt/utils/splitSeed'
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast"



const SecretSharing = () => {
    const [seedPhrase, setSeedPhrase] =
    useState('baby onion guide song rally gloom oxygen detail surround awkward case follow');
    const [shares, setShares] = useState([]);
    const [recoveredPhrase, setRecoveredPhrase] = useState('');
    const [email, setEmail] = useState('');

    
    const [backupShare, setBackupShare] = useState<string[]>(['', '', ''])

    const [inputParts, setInputParts] = useState<string[]>(['', '', ''])
    const { toast } = useToast()

    

    // Function to get the user wallet from the cookie
    const getSeedPhrase = () => {
        //Check the mail
        if(!email){
            toast({
                title: `Email is required`,
                description:'Please Try Again!',
                variant: 'destructive',
            })
            return;
        }
        
        console.log(seedPhrase);
        const shares = splitSeed(seedPhrase);
        console.log(shares);
        setShares(shares);
        localStorage.setItem('shares', JSON.stringify(shares.slice(3, 6)));

             
    };

    const getBackSeedPhrase = () => {
        setBackupShare(['', '', ''])
        const sharesToRecover = shares.slice(3, 6);
        console.log(sharesToRecover);
        console.log(inputParts);
        
        
        // Recover the seed phrase from the shares
        const recoveredSeedPhrase = recoverSeed(inputParts);
        if(recoveredSeedPhrase){
            setRecoveredPhrase(recoveredSeedPhrase)
            console.log("Recovered Seed Phrase:", recoveredSeedPhrase);
        }else{
            console.log("Recovered Seed Phrase not found");
            toast({
                title: `Could Not Recover Seed Phrase`,
                description:'Please Try Again!',
                variant: 'destructive',
            })
        }
        


    };

    const getBackUpShares = () => {
        const backUpShares = localStorage.getItem('shares');
        if(backUpShares){
            const sharesArray = JSON.parse(backUpShares);
            setBackupShare(sharesArray);
            console.log("BackUp Shares Array (State): ",backupShare);
        }else{
            console.log("Backup Shares not found");
            toast({
                title: `Backup Shares not found`,
                description:'Please verify your Mail First',
                variant: 'destructive',
            })
        }
        
        
    }


    return (
        <>
            <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
                <div className="container mx-auto max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-blue-400">Recover Seed Phrase</h1>
                        <p className="text-gray-400">Secure recovering keys using Shamir Secret Sharing Scheme</p>
                    </div>


                    <Card className="bg-gray-800 border-blue-500 border-2 mb-7">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-blue-400">Mobile / Email Verification</CardTitle>
                            <CardDescription className="text-gray-400">Enter Phone Number or Email to Recover Private Key</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* // Add input field for phone number or email */}

                            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-700 text-gray-300 border-gray-600"></Input>  
                            {shares && (
                                <div className="mt-4 w-full">
                                    <Label htmlFor="shares" className="text-gray-300">Save These Shares</Label>
                                    <div>
                                        {/* Add input field to display the first three shares */}
                                        {shares.slice(0, 3).map((share, index) => (
                                            <div key={index} className="flex items-center mt-[5px]">
                                                <Input
                                                    value={share}
                                                    readOnly
                                                    className="bg-gray-700 text-gray-300 border-gray-600"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="border-gray-600 text-gray-300 hover:bg-gray-700 ml-2"
                                                    onClick={() => navigator.clipboard.writeText(share)} // Copy share to clipboard
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
         

                        </CardContent>
                        <CardFooter className="flex flex-col items-start">
                            <Button onClick={getSeedPhrase} className="mb-4 bg-blue-600 hover:bg-blue-700">
                                <MessageCircle className="mr-2 h-4 w-4" /> Verify Mail
                            </Button>

                        </CardFooter>
                    </Card>


                    <Card className="bg-gray-800 border-blue-500 border-2 mb-7">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-blue-400">Enter 3 Backup Shares</CardTitle>
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

                            

                            {recoveredPhrase && (
                                <div className="mt-4 w-full">
                                    <Label htmlFor="shares" className="text-gray-300">Recovered Seed Phrase</Label>
                                    <div>
                                        <Input
                                            value={recoveredPhrase}
                                            readOnly
                                            className="bg-gray-700 text-gray-300 border-gray-600"
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col items-start">
                            <Button onClick={getBackUpShares} className="mb-4 bg-blue-600 hover:bg-blue-700">
                                <MessageCircle className="mr-2 h-4 w-4" /> Get Backup Shares
                            </Button>

                            {/* Conditionally render the backup shares if there are any */}
                            {backupShare[0] != '' && backupShare.map((part, index) => (
                                <div key={index} className="flex items-center mt-[5px]">
                                    <Input
                                        value={part}
                                        readOnly
                                        className="bg-gray-700 text-gray-300 border-gray-600"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700 ml-2"
                                        onClick={() => navigator.clipboard.writeText(part)} // Copy share to clipboard
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            <Button onClick={getBackSeedPhrase} className="mb-4 bg-blue-600 hover:bg-blue-700">
                                <MessageCircle className="mr-2 h-4 w-4" /> Get Back Seed Phrase
                            </Button>
                        </CardFooter>

                    </Card>





                </div>
            </div>

        </>
    );
};

export default SecretSharing;
