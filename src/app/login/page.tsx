'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Eye, EyeOff, Key, Lock } from 'lucide-react'
import Link from 'next/link'

export default function BlockchainLogin() {
    const [privateKey, setPrivateKey] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        const originalPrivateKey = '3caeb1fe9939783e2a8f3649df883ff935b2e4bfa66cd08bc258e169f686d692'
        const originalPassword = 'sanat'

        if (privateKey !== originalPrivateKey && password !== originalPassword) {
            setError('Invalid private key or password')
        }else{
            window.location.href = '/success'
        }
        
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 border-blue-500 border-2">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-blue-400">Blockchain Wallet Login</CardTitle>
                    <CardDescription className="text-gray-400">Enter your credentials to access your wallet</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="privateKey" className="text-gray-300">Private Key</Label>
                            <div className="relative">
                                <Input
                                    id="privateKey"
                                    type="text"
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                    className="bg-gray-700 text-gray-300 border-gray-600 pr-10"
                                    placeholder="Enter your private key"
                                />
                                <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>
                        </div>                      
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            <Lock className="mr-2 h-4 w-4" /> Login
                        </Button>
                        <Link href="/forgot" className="text-blue-400 text-sm mt-4">Forgot password?</Link>
                        {error && (
                            <div className="mt-4 text-red-400 flex items-center">
                                <AlertCircle className="mr-2 h-4 w-4" /> {error}
                            </div>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}