
import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Email is required");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/auth/forgot-password`,
                {
                    email: email.trim(),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                toast.success(
                    response.data.message ||
                    "Password reset link sent to your email"
                );

                setEmail("");
            }

        } catch (error) {
            console.log(
                "Error in forgot password:",
                error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Something went wrong!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-green-100">

            <Card className="w-full max-w-sm">

                <CardHeader className="text-center">
                    <CardTitle>
                        Forgot Password
                    </CardTitle>

                    <p className="text-sm text-gray-500 mt-2">
                        Enter your registered email address and
                        we will send you a password reset link.
                    </p>
                </CardHeader>

                <form onSubmit={handleSubmit}>

                    <CardContent>
                        <div className="grid gap-2">

                            <Label htmlFor="email">
                                Email{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>
                    </CardContent>

                    <CardFooter className="flex-col gap-3">

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full cursor-pointer bg-[#6D8196] hover:bg-[#4A4A4A]"
                        >
                            {loading
                                ? "Sending..."
                                : "Send Reset Link"}
                        </Button>

                        <p className="text-gray-700 text-sm">
                            Remember your password?{" "}

                            <Link
                                to="/login"
                                className="hover:underline cursor-pointer text-green-800"
                            >
                                Login
                            </Link>
                        </p>

                    </CardFooter>

                </form>

            </Card>

        </div>
    );
};

export default ForgotPassword;

