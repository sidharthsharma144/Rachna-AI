import React, { useEffect, useRef, useState } from 'react'
import * as fabric from 'fabric'

const LogoMaker = () => {
  const canvasRef = useRef(null)
  const [canvas, setCanvas] = useState(null)
  const [textInput, setTextInput] = useState('')
  const [color, setColor] = useState('#000000')
  const [fontSize, setFontSize] = useState(40)

  useEffect(() => {
    const initCanvas = new fabric.Canvas('canvas', {
      height: 400,
      width: 600,
      backgroundColor: '#fefefe',
      selectionColor: 'rgba(0,123,255,0.3)',
      selectionBorderColor: '#007bff',
      selectionLineWidth: 2,
    })
    setCanvas(initCanvas)

    // Cleanup on unmount
    return () => {
      initCanvas.dispose()
      setCanvas(null)
    }
  }, [])

  const addText = () => {
    if (!textInput) return
    const text = new fabric.Textbox(textInput, {
      left: 50,
      top: 50,
      fill: color,
      fontSize: fontSize,
      editable: true,
      fontWeight: '600',
      fontFamily: "'Poppins', sans-serif",
      shadow: '1px 1px 2px rgba(0,0,0,0.15)',
    })
    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
    setTextInput('')
  }

  const addRect = () => {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: '#3498db',
      width: 100,
      height: 60,
      selectable: true,
      rx: 12, // rounded corners
      ry: 12,
      shadow: '2px 2px 8px rgba(52, 152, 219, 0.3)',
    })
    canvas.add(rect)
    canvas.setActiveObject(rect)
    canvas.renderAll()
  }

  const addCircle = () => {
    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      fill: '#e74c3c',
      radius: 50,
      selectable: true,
      shadow: '2px 2px 8px rgba(231, 76, 60, 0.3)',
    })
    canvas.add(circle)
    canvas.setActiveObject(circle)
    canvas.renderAll()
  }

  const changeColor = (e) => {
    setColor(e.target.value)
    const activeObj = canvas.getActiveObject()
    if (activeObj && activeObj.set) {
      activeObj.set('fill', e.target.value)
      canvas.renderAll()
    }
  }

  const changeFontSize = (e) => {
    const size = parseInt(e.target.value, 10)
    if (!isNaN(size)) {
      setFontSize(size)
      const activeObj = canvas.getActiveObject()
      if (activeObj && activeObj.set && activeObj.type === 'textbox') {
        activeObj.set('fontSize', size)
        canvas.renderAll()
      }
    }
  }

  const removeSelected = () => {
    const activeObj = canvas.getActiveObject()
    if (activeObj) {
      canvas.remove(activeObj)
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  const clearCanvas = () => {
    canvas.clear()
    canvas.setBackgroundColor('#fefefe', canvas.renderAll.bind(canvas))
  }

  const downloadImage = () => {
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    })
    const link = document.createElement('a')
    link.href = dataURL
    link.download = 'logo.png'
    link.click()
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gradient-to-r from-indigo-50 to-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-700 tracking-wide drop-shadow-md">
        Logo Maker
      </h1>

      <div className="mb-6 flex flex-wrap gap-4 justify-center items-center">
        <input
          type="text"
          placeholder="Enter text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="border border-indigo-300 focus:ring-indigo-400 focus:border-indigo-500 rounded-lg px-4 py-2 text-lg w-60 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
        />
        <button
          onClick={addText}
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl"
        >
          Add Text
        </button>

        <button
          onClick={addRect}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl"
        >
          Add Rectangle
        </button>

        <button
          onClick={addCircle}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl"
        >
          Add Circle
        </button>

        <input
          type="color"
          value={color}
          onChange={changeColor}
          title="Change Color"
          className="w-12 h-12 p-0 border border-indigo-300 rounded-full cursor-pointer shadow-inner transition duration-300 ease-in-out hover:shadow-lg"
        />

        <input
          type="number"
          min="10"
          max="100"
          value={fontSize}
          onChange={changeFontSize}
          title="Font Size"
          className="border border-indigo-300 rounded-lg px-3 py-2 w-24 text-center font-semibold text-indigo-700 shadow-sm focus:ring-indigo-400 focus:border-indigo-500 transition duration-300 ease-in-out hover:shadow-md"
        />

        <button
          onClick={removeSelected}
          className="bg-yellow-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl"
        >
          Delete Selected
        </button>

        <button
          onClick={clearCanvas}
          className="bg-gray-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl"
        >
          Clear Canvas
        </button>

        <button
          onClick={downloadImage}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl"
        >
          Download Logo
        </button>
      </div>

      <div className="border-4 border-indigo-200 rounded-xl shadow-xl mx-auto max-w-[620px]">
        <canvas
          id="canvas"
          ref={canvasRef}
          className="block rounded-lg shadow-lg"
        />
      </div>
    </div>
  )
}

export default LogoMaker
