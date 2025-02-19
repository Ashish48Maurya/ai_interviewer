"use client";

import { useState } from "react";

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("query", query);

        try {
            const res = await fetch("/api/file-upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setResponse(data.message || "No response received");
        } catch (error) {
            console.error("Upload error:", error);
            setResponse("Error uploading file");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="video/mp4" onChange={handleFileChange} />
            <input
                type="text"
                placeholder="Enter query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "Upload & Process"}
            </button>

            {response && <p>Response: {response}</p>}
        </div>
    );
}
