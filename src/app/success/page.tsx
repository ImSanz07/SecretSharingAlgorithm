"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuccessPage() {
    const handleLogout = () => {
        // Implement your logout logic here, such as clearing tokens or redirecting to the login page
        window.location.href = '/home'; // Redirect to the login page or home
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 border-blue-500 border-2">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-blue-400">Login Successful!</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-gray-300">Welcome to your blockchain wallet!</p>
                    <p className="text-gray-400 mt-2">You have successfully logged in.</p>
                </CardContent>
                <div className="flex justify-center mb-4">
                    <Button onClick={handleLogout} className="bg-blue-600 hover:bg-blue-700">
                        Logout
                    </Button>
                </div>
            </Card>
        </div>
    );
}
