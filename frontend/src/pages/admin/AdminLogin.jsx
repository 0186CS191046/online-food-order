import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";


const AdminSignin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const [formdata, setFormdata] = useState({ email: "", password: "" })
    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormdata((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/admin-login`, formdata, {
                headers: { "Content-Type": "application/json" },
                withCredentials:true
            })
            if (response.data.success) {
                navigate("/");
                sessionStorage.setItem("token", response.data.accessToken)
                toast.success(response.data.message)
            }
        } catch (error) {
            console.log("Error in SignIn :",error.message);
            toast.error(error.message);
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-green-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login your account</CardTitle>
                    <CardDescription>Enter given details below to login your account and please enter real emailId</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                Email
                            </Label>
                            <Input id="email" type="email" placeholder="Enter Your email" name="email" value={formdata.email} onChange={handleInput} required />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center"></div>
                            <Label htmlFor="password">
                                Password
                            </Label>
                            <div className="relative">
                                <Input id="email" type={showPassword ? "text" : "password"} placeholder="Enter Your password" name="password"
                                    value={formdata.password} onChange={handleInput} required />
                                {showPassword ? <EyeOff className="w-5 h-5 text-gray-700 absolute right-5 bottom-2" onClick={() => setShowPassword(false)} /> :
                                    <Eye className="w-5 h-5 text-gray-700 absolute right-5 bottom-2" onClick={() => setShowPassword(true)} />}
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full cursor-pointer bg-green-600 hover:bg-green-500" onClick={handleSubmit}>
                        {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Please Wait</> : "Login"} </Button>
                    <p className="text-gray-700 text-sm">Don't have an account ? <Link to="/signup" className="hover:underline  cursor-pointer text-green-800">SignUp</Link></p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default AdminSignin;