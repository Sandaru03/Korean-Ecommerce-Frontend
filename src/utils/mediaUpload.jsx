import { createClient } from "@supabase/supabase-js";

const anon_key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase_url = import.meta.env.VITE_SUPABASE_URL;

const supabase = createClient(supabase_url, anon_key)

export default function mediaUpload(file) {
    return new Promise((resolve, reject) => {
        if (file == null) {
            reject("No file selected")
        }

        const timestamp = new Date().getTime();
        const fileName = timestamp + file.name;

        supabase.storage
            .from("images")
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: false,
            })
            .then(() => {
                const publicUrl = supabase.storage.from("images").getPublicUrl(fileName)
                    .data.publicUrl;
                resolve(publicUrl);
            }).catch(() => {
                reject("Error uploading file")
            })
    });
}
