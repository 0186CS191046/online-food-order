import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, deleteAddress, setCart, setSelectedAddress } from "../redux/restaurantSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddressForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        zipcode: "",
        state: "",
        country: ""
    });
    const dispatch = useDispatch();

    const { cart, addresses, selectedAddress } = useSelector((store) => store.restaurant);
    const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        dispatch(addAddress(formData));
        setShowForm(false)
    };

    const subtotal = cart.totalPrice;
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = parseFloat(subtotal * 0.05).toFixed(2);
    const total = subtotal + Number(tax) + shipping;

    const navigate = useNavigate()

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem("token")
            const { data } = await axios.post(`${import.meta.env.VITE_URL}/api/v1/order`, {
                products: cart?.items?.map((item) => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                })),
                restaurantId: cart?.restaurantId,
                tax, shipping, currency: "INR", amount: total
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (!data.success) {
                return toast.error(data.message)
            }
            navigate("/");
        } catch (error) {
            console.log("Error in handlePayment :", error.message);
            toast.error("Something went wrong while processing payment!")
        }
    }

    return (
        <div className="max-w-7xl mx-auto grid place-items-center p-10">
            <div className="grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto">
                <div className="space-y-4 p-6 bg-white">
                    {showForm ?
                        (<> <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input placeholder="John Doe" value={formData.fullName}
                                onChange={handleChange} required id="fullName" name="fullName" />
                        </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input placeholder="4578945678" value={formData.phone}
                                    onChange={handleChange} required id="phone" name="phone" />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input placeholder="john@example.com" value={formData.email}
                                    onChange={handleChange} required id="email" name="email" />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input placeholder="Enter your address" value={formData.address}
                                    onChange={handleChange} required id="address" name="address" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input placeholder="Enter your city" value={formData.city}
                                        onChange={handleChange} required id="city" name="city" />
                                </div>
                                <div>
                                    <Label htmlFor="zipcode">Zipcode</Label>
                                    <Input placeholder="Enter your city" value={formData.zipcode}
                                        onChange={handleChange} required id="zipcode" name="zipcode" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="state">State</Label>
                                    <Input placeholder="John Doe" value={formData.state}
                                        onChange={handleChange} required id="state" name="state" />
                                </div>
                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input placeholder="John Doe" value={formData.country}
                                        onChange={handleChange} required id="country" name="country" />
                                </div>
                            </div>
                            <Button className="w-full cursor-pointer" onClick={handleSave}>Save</Button>
                        </>) :
                        (<div className="space-y-4">
                            <h2 className="text-lg font-semibold">Saved Addresses</h2>
                            {
                                addresses.map((addr, index) => {
                                    return <div onClick={(e) => dispatch(setSelectedAddress(index))} key={index} className={`border p-4 rounded-md cursor-pointer
                                    relative ${selectedAddress == index ? "border-green-600 bg-green-50" : "border-gray-300"}`}>
                                        <p className="font-medium">{addr.fullName}</p>
                                        <p>{addr.phone}</p>
                                        <p>{addr.email}</p>
                                        <p>{addr.address} , {addr.city}, {addr.state}, {addr.zipcode}, {addr.country}</p>
                                        <button onClick={(e) => dispatch(deleteAddress(index))} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm">Delete</button>
                                    </div>
                                })
                            }
                            <Button variant="outline" className="w-full cursor-pointer" onClick={() => setShowForm(true)}>+ Add new Address</Button>
                            <Button disabled={selectedAddress === null} className="cursor-pointer w-full bg-green-600" onClick={handlePayment}>Proceed to Checkout</Button>
                        </div>
                        )}
                </div>
                {/* Right side order summary */}
                <div>
                    <Card className="w-100">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal ({cart.items.length || 0}) items</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{shipping}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹{tax}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span> <span>₹{total}</span>
                            </div>
                            <div className="text-sm text-muted-foreground pt-4">
                                <p>* Free Shipping on orders above 299</p>
                                <p>* 30 day return policy</p>
                                <p>* Secure checkout with SSL encryption</p>
                            </div>

                        </CardContent>
                    </Card>

                </div>
            </div>

        </div>
    )
};

export default AddressForm;