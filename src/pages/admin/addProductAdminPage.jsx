import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import uploadFile from "../../utils/mediaUpload";


export default function AddProductPage() {
    const [productId, setProductId] = useState("");
    const [name, setProductName] = useState("");
    const [altNames, setAlternativeName] = useState("");
    const [labellPrice, setLablePrice] = useState("");
    const [price, setPrice] = useState("");
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState("");
    const [miniDescription, setMiniDescription] = useState("");

    const navigate = useNavigate();

    async function handleSubmit() {
        const promisesArray = []

        for (let i = 0; i < images.length; i++) {
            const promise = uploadFile(images[i])
            promisesArray[i] = promise
        }

        const responses = await Promise.all(promisesArray)
        const altNamesInArray = altNames.split(",")

        const productData = {
            productId: productId,
            name: name,
            altNames: altNamesInArray,
            labellPrice: labellPrice,
            price: price,
            images: responses,
            description: description,
            miniDescription: miniDescription
        }

        const token = localStorage.getItem("token");

        if (token == null) {
            window.location.href = "/login";
            return;
        }

        axios.post(import.meta.env.VITE_BACKEND_URL + "/products", productData,
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        ).then(
            (res) => {
                toast.success("Product Added Successfully");
                navigate("/admin/product");
            }
        ).catch(
            (error) => {
                console.error("Error Adding Product:", error);
                if (error.response?.status === 403 || error.response?.status === 401) {
                    toast.error("Session expired or invalid. Please log in again.");
                    localStorage.removeItem("token");
                    navigate("/login");
                } else {
                    toast.error("Failed Adding Product: " + (error.response?.data?.message || error.message));
                }
            }
        )
    }

    return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-100 overflow-auto p-4">
            <div className="w-full max-w-[700px] border-[3px] rounded-[15px] p-[30px] bg-white flex flex-col gap-6">

                <h2 className="text-2xl font-bold text-center mb-4">Add New Product</h2>

                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">Product ID</label>
                        <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full border-[2px] h-[40px] rounded-md px-2" />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">Product Name</label>
                        <input type="text" value={name} onChange={(e) => setProductName(e.target.value)} className="w-full border-[2px] h-[40px] rounded-md px-2" />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Alternative Name</label>
                    <input type="text" value={altNames} onChange={(e) => setAlternativeName(e.target.value)} className="w-full border-[2px] h-[40px] rounded-md px-2" />
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">Label Price</label>
                        <input type="number" value={labellPrice} onChange={(e) => setLablePrice(e.target.value)} className="w-full border-[2px] h-[40px] rounded-md px-2" />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">Price</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border-[2px] h-[40px] rounded-md px-2" />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Images</label>
                    <input multiple type="file" onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setImages((prevImages) => [...prevImages, ...files])
                    }} className="w-full border-[2px] h-[40px] rounded-md px-2" />
                    {images.length > 0 && (
                        <div className="flex gap-2 mt-2 overflow-x-auto pb-2 flex-wrap">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative mt-2 mr-2">
                                    <img src={URL.createObjectURL(img)} alt={`New ${idx + 1}`} className="w-20 h-20 object-cover rounded-md border border-gray-300" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = [...images];
                                            newImages.splice(idx, 1);
                                            setImages(newImages);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Mini Description</label>
                    <textarea value={miniDescription} onChange={(e) => setMiniDescription(e.target.value)} className="w-full border-[2px] h-[60px] rounded-md px-2 py-1" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border-[2px] h-[100px] rounded-md px-2 py-1" />
                </div>

                <div className="flex justify-center gap-4 py-4">
                    <Link to="/admin/product" className="w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-white text-black hover:bg-gray-100 transition">Cancel</Link>
                    <button onClick={handleSubmit} className=" cursor-pointer w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-black text-white hover:bg-gray-800 transition">Add Product</button>
                </div>
            </div>
        </div>
    )
}
