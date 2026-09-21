import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Spinner from "../components/Spinner";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formdata, setFormdata] = useState({ firstName: "", lastName: "", email: "", password: "", role: "" })
    const navigate = useNavigate()

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormdata((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/auth/register`, formdata, {
                headers: { "Content-Type": "application/json" }
            })

            if (response.data.success) {
                navigate("/");
                toast.success(response.data.message)
            }
        } catch (error) {
            console.log("Error in Signup :", error.message);
            toast.error(error.message);
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-green-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>Enter given details below to create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstname">
                                    FirstName
                                </Label>
                                <Input id="firstName" type="text" placeholder="Enter Your firstName" name="firstName"
                                    value={formdata.firstName} onChange={handleInput} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastname">
                                    LastName
                                </Label>
                                <Input id="lastName" type="text" placeholder="Enter Your lastName" name="lastName"
                                    value={formdata.lastName}
                                    onChange={handleInput} required />
                            </div>
                        </div>
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
                                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter Your password" name="password"
                                    value={formdata.password} onChange={handleInput} required />
                                {showPassword ? <EyeOff className="w-5 h-5 text-gray-700 absolute right-5 bottom-2" onClick={() => setShowPassword(false)} /> :
                                    <Eye className="w-5 h-5 text-gray-700 absolute right-5 bottom-2" onClick={() => setShowPassword(true)} />}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">
                                    Role
                                </Label>

                                <select
                                    id="role"
                                    name="role"
                                    value={formdata.role}
                                    onChange={handleInput}
                                    required
                                    className="border rounded-md px-3 py-2"
                                >
                                    <option value="">Select Role</option>
                                    <option value="User">User</option>
                                    <option value="Restaurant">Restaurant User</option>
                                </select>
                            </div>                    </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full cursor-pointer h-10 bg-green-600 hover:bg-green-500" onClick={handleSubmit}>
                        SignUp </Button>
                    <p className="text-gray-700 text-sm">Already have an account ? <Link to="/" className="hover:underline  cursor-pointer text-green-800">Login</Link></p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Signup;