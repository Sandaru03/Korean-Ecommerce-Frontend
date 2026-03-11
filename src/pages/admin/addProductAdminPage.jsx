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
    const [stock, setStock] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);

    // Dynamic categories (Tree Structure)
    const [allCategoriesTree, setAllCategoriesTree] = useState([]);
    
    // Derived lists based on selection
    const [categoriesList, setCategoriesList] = useState([]);
    const [subCategoriesList, setSubCategoriesList] = useState([]);

    // Selected values
    const [superCategory, setSuperCategory] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");

            // Fetch nested category tree
            const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/categories?tree=true", {
                headers: { Authorization: "Bearer " + token }
            });
            const fetchedTree = res.data.categories || [];
            setAllCategoriesTree(fetchedTree);

            // Default auto-select first available tree nodes if applicable
            if (fetchedTree.length > 0) {
                const headSuper = fetchedTree[0];
                setSuperCategory(headSuper.name);
                setCategoriesList(headSuper.children || []);
                
                if (headSuper.children?.length > 0) {
                    const headCat = headSuper.children[0];
                    setCategory(headCat.name);
                    setSubCategoriesList(headCat.children || []);
                    
                    if (headCat.children?.length > 0) {
                        setSubCategory(headCat.children[0].name);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories.");
        }
    };

    // Auto-update Categories when Super Category changes
    useEffect(() => {
        if (!superCategory || allCategoriesTree.length === 0) return;
        const selectedSuper = allCategoriesTree.find(c => c.name === superCategory);
        if (selectedSuper && selectedSuper.children?.length > 0) {
            setCategoriesList(selectedSuper.children);
            setCategory(selectedSuper.children[0].name);
        } else {
            setCategoriesList([]);
            setCategory("");
        }
    }, [superCategory, allCategoriesTree]);

    // Auto-update Sub Categories when Category changes
    useEffect(() => {
        if (!category || categoriesList.length === 0) return;
        const selectedCat = categoriesList.find(c => c.name === category);
        if (selectedCat && selectedCat.children?.length > 0) {
            setSubCategoriesList(selectedCat.children);
            setSubCategory(selectedCat.children[0].name);
        } else {
            setSubCategoriesList([]);
            setSubCategory("");
        }
    }, [category, categoriesList]);

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
            superCategory: superCategory,
            category: category,
            subCategory: subCategory
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
                console.log("Product Added Successfully");
                console.log(res.data);
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

        console.log(productData);

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
                        <label className="text-sm font-semibold">Super Category</label>
                        <select value={superCategory} onChange={(e) => setSuperCategory(e.target.value)} className="w-full border-[2px] h-[40px] rounded-md px-2">
                            <option value="">None</option>
                            {allCategoriesTree.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border-[2px] h-[40px] rounded-md px-2" disabled={categoriesList.length === 0}>
                            <option value="">None</option>
                            {categoriesList.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">Subcategory</label>
                        <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full border-[2px] h-[40px] rounded-md px-2" disabled={subCategoriesList.length === 0}>
                            <option value="">None</option>
                            {subCategoriesList.map(sub => (
                                <option key={sub.id} value={sub.name}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-center gap-4 py-4">
                    <Link to="/admin/product" className="w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-white text-black hover:bg-gray-100 transition">Cancel</Link>
                    <button onClick={handleSubmit} className=" cursor-pointer w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-black text-white hover:bg-gray-800 transition">Add Product</button>
                </div>
            </div>
        </div>
    )
}
