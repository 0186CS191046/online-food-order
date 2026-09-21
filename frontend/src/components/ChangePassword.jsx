import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ChangePasswordDialog = ({ open, onOpenChange }) => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.oldPassword.trim()) {
            toast.error("Current password is required");
            return;
        }
        if (!formData.newPassword.trim()) {
            toast.error("New password is required");
            return;
        }
        if (formData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }
        if (!formData.confirmPassword.trim()) {
            toast.error("Confirm password is required");
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            const response = await axios.patch(
                `${import.meta.env.VITE_URL}/api/v1/auth/change-password`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/");
                setFormData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                onOpenChange(false);
            }
        } catch (error) {
            console.log("Change password error:", error);
            toast.error(error.response?.data?.message || "Unable to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-106.5]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Enter your current password and choose a new password.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="oldPassword"> Current Password </Label>
                        <div className="relative">
                            <Input id="oldPassword" name="oldPassword"
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                value={formData.oldPassword}
                                onChange={handleInput}
                                placeholder="Enter current password"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        !showCurrentPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2" >
                                {showCurrentPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword"> New Password </Label>
                        <div className="relative">
                            <Input id="newPassword" name="newPassword"
                                type={
                                    showNewPassword ? "text" : "password"
                                }
                                value={formData.newPassword}
                                onChange={handleInput}
                                placeholder="Enter new password"
                                className="pr-10" />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2">
                                {showNewPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword"> Confirm New Password </Label>
                        <div className="relative">
                            <Input id="confirmPassword" name="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={formData.confirmPassword}
                                onChange={handleInput}
                                placeholder="Confirm new password"
                                className="pr-10" />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2" >
                                {showConfirmPassword ? (<EyeOff size={18} />) : (
                                    <Eye size={18} />)}
                            </button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}>
                            Cancel
                        </Button>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Changing..." : "Change Password"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordDialog;