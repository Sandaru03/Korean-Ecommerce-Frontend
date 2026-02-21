import axios from "axios";

export default function mediaUpload(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject("No file selected");
        }

        const formData = new FormData();
        formData.append("images", file); // Key must match backend uploadCloudinary.array('images')

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload/cloudinary`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                const urls = response.data.urls;
                if (urls && urls.length > 0) {
                    resolve(urls[0]); // Return the single URL for compatibility
                } else {
                    reject("No URL returned from server");
                }
            })
            .catch((error) => {
                console.error("Upload error:", error);
                reject(error.response?.data?.message || "Error uploading file");
            });
    });
}
