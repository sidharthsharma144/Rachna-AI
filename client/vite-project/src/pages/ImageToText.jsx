import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const ImageToText = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    extractTextFromImage(file);
  };

  const extractTextFromImage = (file) => {
    setLoading(true);
    Tesseract.recognize(file, 'eng', {
      logger: m => console.log(m)
    })
      .then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setText('❌ Failed to recognize text.');
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🖼️ Text Extracter from Image
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 mb-6"
        />

        {image && (
          <div className="mb-6">
            <img
              src={image}
              alt="Uploaded"
              className="w-full max-h-64 object-contain mx-auto rounded-md shadow-md"
            />
          </div>
        )}

        {loading ? (
          <p className="text-blue-500 font-semibold">⏳ Processing image, please wait...</p>
        ) : (
          text && (
            <div className="text-left mt-4 bg-gray-100 rounded-md p-4 border border-gray-200 max-h-80 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Extracted Text:</h2>
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{text}</pre>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ImageToText;
