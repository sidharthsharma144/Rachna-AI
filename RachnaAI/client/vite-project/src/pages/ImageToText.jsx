"use client"

import { useState } from "react";
import React from "react";

function ImageToText() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setExtractedText("");

    if (!file.type.includes("image/")) {
      setError("Please upload an image file");
      return;
    }

    setImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please select an image first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("http://localhost:5000/fileupload/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setExtractedText(data.text);
    } catch (err) {
      setError(`Failed to extract text: ${err.message || "Unknown error"}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "white",
  };

  const uploadAreaStyle = {
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "background-color 0.3s",
  };

  const buttonStyle = {
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  };

  const textAreaStyle = {
    width: "100%",
    minHeight: "200px",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    padding: "10px",
    marginTop: "10px",
  };

  const imagePreviewStyle = {
    maxWidth: "100%",
    maxHeight: "300px",
    marginTop: "10px",
    borderRadius: "4px",
    border: "1px solid #e0e0e0",
  };

  const errorStyle = {
    color: "red",
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Image to Text Converter</h1>

      <div style={cardStyle}>
        <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Upload Image</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="image-upload" style={uploadAreaStyle}>
            <div>
              <p>Click to upload or drag and drop</p>
              <p style={{ fontSize: "14px", color: "#666" }}>SVG, PNG, JPG or GIF</p>
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </label>

          {imagePreview && (
            <div>
              <p style={{ fontSize: "16px", marginBottom: "5px" }}>Image Preview:</p>
              <img src={imagePreview} alt="Preview" style={imagePreviewStyle} />
            </div>
          )}

          {error && <p style={errorStyle}>{error}</p>}

          <button
            type="submit"
            style={!image || isLoading ? disabledButtonStyle : buttonStyle}
            disabled={!image || isLoading}
          >
            {isLoading ? "Processing..." : "Extract Text"}
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Extracted Text</h2>
        <div style={textAreaStyle}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
          ) : extractedText ? (
            <p style={{ whiteSpace: "pre-wrap" }}>{extractedText}</p>
          ) : (
            <p style={{ color: "#666", textAlign: "center" }}>Extracted text will appear here</p>
          )}
        </div>
        {extractedText && (
          <button
            style={{ ...buttonStyle, marginTop: "10px" }}
            onClick={() => navigator.clipboard.writeText(extractedText)}
          >
            Copy to Clipboard
          </button>
        )}
      </div>
    </div>
  );
}

export default ImageToText;
