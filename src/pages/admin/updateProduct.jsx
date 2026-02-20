import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import uploadFile from "../../utils/mediaUpload";


export default function UpdateProductPage() {
    const location = useLocation()
    const [productId, setProductId] = useState(location.state.productId);
    const [name, setProductName] = useState(location.state.name);
    const [altNames, setAlternativeName] = useState(location.state.altNames.join(","));
    const [labellPrice, setLablePrice] = useState(location.state.labellPrice);
    const [price, setPrice] = useState(location.state.price);
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState(location.state.description);
    const [stock, setStock] = useState(location.state.stock);
    const [isAvailable, setIsAvailable] = useState(location.state.isAvailable);
    const [category, setCategory] = useState(location.state.category);
    const navigate = useNavigate();


    async function handleSubmit() {

        const promisesArray = []

        for (let i = 0; i < images.length; i++) {
            const promise = uploadFile(images[i])
            promisesArray[i] = promise
        }

        const responses = await Promise.all(promisesArray)
        console.log(responses);

        const altNamesInArray = altNames.split(",")

        const productData = {
            productId: productId,
            name: name,
            altNames: altNamesInArray,
            labellPrice: labellPrice,
            price: price,
            images: responses,
            description: description,
            stock: stock,
            isAvailable: isAvailable,
            category: category
        }

        if (responses.length == 0) {
            productData.images = location.state.images
        }

        const token = localStorage.getItem("token");

        if (token == null) {
            window.location.href = "/login";
            return;
        }

        axios.put(import.meta.env.VITE_BACKEND_URL + "/products/" + productId, productData,
            {
                headers: {
                    Authorization: "Bearer " + token
                }

            }

        ).then(
            (res) => {
                console.log("Product Added Successfully");
                console.log(res.data);
                toast.success("Product Updated Successfully");
                navigate("/admin/product");
            }
        ).catch(
            (error) => {
                console.error("Error Updating Product:", error);
                toast.error("Failed Updating Product");
            }
        )

        console.log(productData);

    }

    return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-100 overflow-auto p-4">
            <div className="w-full max-w-[700px] border-[3px] rounded-[15px] p-[30px] bg-white flex flex-col gap-6">

                <h2 className="text-2xl font-bold text-center mb-4">Update Product</h2>

                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">Product ID</label>
                        <input disabled type="text" value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full border-[2px] h-[40px] rounded-md px-2" />
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
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border-[2px] h-[100px] rounded-md px-2 py-1" />
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">Stock</label>
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full border-[2px] h-[40px] rounded-md px-2" />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">Is Available</label>
                        <select value={isAvailable} onChange={(e) => setIsAvailable(e.target.value === "true")} className="w-full border-[2px] h-[40px] rounded-md px-2">
                            <option value={true}>Available</option>
                            <option value={false}>Not Available</option>
                        </select>
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border-[2px] h-[40px] rounded-md px-2">
                            <option value="cctv1">CCTV Camera</option>
                            <option value="cctv2">Accessories</option>
                            <option value="cctv3">Package</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-center gap-4 py-4">
                    <Link to="/admin/product" className="w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-white text-black hover:bg-gray-100 transition">Cancel</Link>
                    <button onClick={handleSubmit} className=" cursor-pointer w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-black text-white hover:bg-gray-800 transition">Update Product</button>
                </div>
            </div>
        </div>
    )
}
