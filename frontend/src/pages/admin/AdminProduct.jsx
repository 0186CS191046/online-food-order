import { Edit, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import axios from "axios";
import { toast } from "sonner";
import { setProducts } from "@/redux/productSlice";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Spinner from "@/components/Spinner";

const AdminProducts = () => {
    const { products } = useSelector((store) => store.restaurant );
    const [editProduct, setEditProduct] = useState(null);
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");

    let filteredProducts = products.filter((prod) => (
        prod.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchTerm.toLowerCase())
    ));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditProduct((prev) => ({
            ...prev,
            [name]: value
        }))
    };
    const token = localStorage.getItem("token")

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("productName", editProduct.productName);
        formData.append("productDesc", editProduct.productDesc);
        formData.append("price", editProduct.price);
        formData.append("category", editProduct.category);

        // Add existing images public_ids
        // const existingImages = editProduct.productImg.filter((img) => !(img instanceof File) &&
        //     img.public_id).map((img) => img.public_id) || []
        const existingImages = editProduct.productImg
            .filter((img) => !(img instanceof File))
            .map((img) => img.publicId) // ✅ ALWAYS publicId
            .filter(Boolean);

        formData.append("existingImages", JSON.stringify(existingImages))
        editProduct.productImg.filter((img) => img instanceof File).forEach((file) => {
            formData.append("files", file)
        });

        try {
            const res = await axios.put(`${import.meta.env.VITE_URL}/api/v1/product/${editProduct._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            if (res.data.success) {
                toast.success("Product updated successfully!")
                const updateproducts = products.map((p) =>
                    p._id === editProduct._id ? res.data.product : p)
                dispatch(setProducts(updateproducts))
                setOpen(false)
            }
        } catch (error) {
            console.log("Error in updating product :", error.message);
            toast.error(error.message);
        }finally{
            setLoading(false)
        }
    };

    const removeProduct = async (productId) => {
        setLoading(true);
        try {
            const remainingProducts = products.filter((prod) => prod._id !== productId)
            const res = await axios.delete(`${import.meta.env.VITE_URL}/api/v1/product/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setProducts(remainingProducts))
            }
        } catch (error) {
            console.log("Error in removeProduct :", error.message);
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    }

   
    return (
        <div className="pt-5 px-6 w-full flex flex-col gap-4 bg-gray-100 mt-20">
            
            {filteredProducts.map((product, index) => {
                return <Card key={index} className="w-full px-4 py-3 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <img src={product?.productImg[0]?.url} alt="" className="w-25 h-25" />
                            <h1 className="font-bold w-96 text-gray-700">
                                {product.productName}
                            </h1>
                        </div>
                        <h1 className="font-semibold text-gray-800">{product.price}</h1>
                        <div className="flex gap-3">
                            <Dialog open={open} setOpen={setOpen}>
                                <form>
                                    <DialogTrigger asChild>
                                        <Edit onClick={() => { setOpen(true), setEditProduct(product) }} className="text-green-500 cursor-pointer" />
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-156.25 max-h-150 overflow-y-scroll">
                                        <DialogHeader>
                                            <DialogTitle>Edit profile</DialogTitle>
                                            <DialogDescription>
                                                Make changes to your product here. Click save when you&apos;re
                                                done.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-2">
                                            <div className="grid gap-2">
                                                <Label>Product Name</Label>
                                                <Input type="text" value={editProduct?.productName} onChange={handleChange} placeholder="Product Name" name="productName" required />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Price</Label>
                                                <Input type="number" value={editProduct?.price} onChange={handleChange} placeholder="Price" name="price" required />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label>Catgeory</Label>
                                                    <Input type="text" value={editProduct?.category} onChange={handleChange} placeholder="Ex-Iphone" name="category" required />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label>Product Description</Label>
                                                </div>
                                                <Textarea name="productDesc" placeholder="Enter brief description about product"
                                                    value={editProduct?.productDesc} onChange={handleChange} />
                                            </div>
                                            <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                                        </div>

                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                            </DialogClose>
                                            <Button type="submit" onClick={handleSave} className="cursor-pointer bg-green-600">Save changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </form>
                            </Dialog>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Trash2 className="text-red-500 cursor-pointer" />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your
                                            account from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                        <AlertDialogAction variant="outline" className="bg-green-500 hover:bg-green-600 cursor-pointer"
                                            onClick={() => removeProduct(product._id)} >Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    </div>
                </Card>
            })}
        </div>
    )
};

export default AdminProducts;