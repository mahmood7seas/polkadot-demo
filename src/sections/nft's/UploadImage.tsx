/** @format */

// src/components/ImageUploader.tsx
import React, { useState } from "react";
import axios from "axios";

const ImageUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Handle file upload to Pinata
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError(null);

    const apiKey = "3b7c3583d0707a78bd46";
    const apiSecret =
      "17b99fa91a935f2646d7b1c626652989f61356eb7e2a8c740342e806b489d3cd";

    const formData = new FormData();
    formData.append("file", file);

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    try {
      const res = await axios.post(url, formData, {
        maxBodyLength: Infinity, // Pinata has a file size limit, this ensures larger files can be uploaded
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      });

      setIpfsUrl(`https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
    } catch (err) {
      setError("Failed to upload image to IPFS.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Image to IPFS</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {ipfsUrl && (
        <div>
          <p>Image uploaded successfully! View it here:</p>
          <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">
            {ipfsUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
