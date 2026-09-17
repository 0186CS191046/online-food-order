import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { X } from "lucide-react";

const ImageUpload = ({productData,setProductData})=>{
     const handleFiles = (e)=>{
        const files = Array.from(e.target.files || [] );

        if(files.length){
            setProductData((prev)=> ({...prev,productImg:[...prev.productImg,...files]}))
        }
    };

     const removeImages = (index)=>{
        setProductData((prev)=>{
            const productImages = prev.productImg.filter((_,idx)=> idx!==index)
            return {...prev,productImg:productImages}
        })
    };
    
    return (
        <div className="grid gap-2 mt-2">
            <Label>Product Images</Label>
            <Input type="file" id="file-upload" className="hidden" multiple onChange={handleFiles}/>
            <Button variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">Upload Images</label>
            </Button>

    {
        productData.productImg.length>0 && (
            <div className="grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3">
                {
                    productData.productImg.map((img,idx)=>{
                        let preview;
                        if(img instanceof File){
                            preview = URL.createObjectURL(img)
                        }else if(typeof img === "string"){
                            preview = img
                        }else if(img?.url){
                            preview = img.url
                        }else{
                            return null
                        }
                        return (
                            <Card key={idx} className="relative group overflow-hidden">
                                <CardContent>
                                    <img src={preview} width={200} height={200} className="w-full h-32 object-cover rounded-md" />
                                    <button onClick={()=> removeImages(idx)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full 
                                    opacity-0 group-hover:opacity-100 transition"><X sixe={10}/></button>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>
        )
    }
        </div>
    )
}

export default ImageUpload;