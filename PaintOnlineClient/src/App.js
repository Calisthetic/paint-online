import './App.css';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from './components/sidebar';

function App() {
  const mainCanvasRef = useRef(null); 
  const shadowCanvasRef = useRef(null);
  const mainCtxRef = useRef(null); 
  const shadowCtxRef = useRef(null); 
  const [isDrawing, setIsDrawing] = useState(false); 
  const [lineWidth, setLineWidth] = useState(5); 
  const lineColor = useRef("black") 
  const [lineOpacity, setLineOpacity] = useState(1);
  const [currentObject, setCurrentObject] = useState("line")

  const pointsRef = useRef([{x: 0, y: 0}])

  const setLineColor = (color) => {
    lineColor.current = color
  }

  // Initialization when the component 
  // mounts for the first time 
  useEffect(() => {
    const canvas = mainCanvasRef.current; 
    const ctx = canvas.getContext("2d"); 
    ctx.lineCap = "round"; 
    ctx.lineJoin = "round"; 
    ctx.globalAlpha = lineOpacity; 
    ctx.strokeStyle = lineColor.current; 
    ctx.lineWidth = lineWidth; 
    mainCtxRef.current = ctx; 
    const canvas1 = shadowCanvasRef.current; 
    const ctx1 = canvas1.getContext("2d"); 
    ctx1.lineCap = "round"; 
    ctx1.lineJoin = "round"; 
    ctx1.globalAlpha = lineOpacity; 
    ctx1.strokeStyle = lineColor.current; 
    ctx1.lineWidth = lineWidth; 
    shadowCtxRef.current = ctx1;
  }, [lineColor, lineOpacity, lineWidth]);

  // useEffect(() => {
  //   //window.addEventListener("resize", onResizeWindowHandler)

  //   return () => {
  //     window.removeEventListener("resize", onResizeWindowHandler)
  //   }
  // })
  // const onResizeWindowHandler = useCallback(() => {
  //   let temp = mainCtxRef.current.getImageData(0,0,mainCanvasRef.current.width,mainCanvasRef.current.height)
  //   mainCanvasRef.current.width = window.innerWidth
  //   mainCanvasRef.current.height = window.innerHeight
  //   mainCtxRef.current.putImageData(temp,0,0)
  // }, [])

  const startDrawing = (e) => {
    if (currentObject === "line") {
      mainCtxRef.current.strokeStyle = lineColor.current; 
      mainCtxRef.current.beginPath(); 
      mainCtxRef.current.moveTo( 
        e.pageX, 
        e.pageY 
      );
    } else if (currentObject === "rectangle") {
    } else if (currentObject === "ellipse") {
    }
    pointsRef.current[0].x = e.pageX
    pointsRef.current[0].y = e.pageY
    setIsDrawing(true); 
  }; 

  const endDrawing = () => { 
    if (currentObject === "line") {
      mainCtxRef.current.closePath();
      SendDrawing({
        type: currentObject,
        color: lineColor.current,
        opacity: lineOpacity,
        width: lineWidth,
        points: pointsRef.current
      })
    } else if (currentObject === "rectangle") {
      shadowCtxRef.current.clearRect(0, 0, shadowCanvasRef.current.width, shadowCanvasRef.current.height);
      drawRect(pointsRef.current[0].x, pointsRef.current[0].y, 
        pointsRef.current[pointsRef.current.length - 1].x - pointsRef.current[0].x, 
        pointsRef.current[pointsRef.current.length - 1].y - pointsRef.current[0].y, mainCtxRef.current);
      SendDrawing({
        type: currentObject,
        color: lineColor.current,
        opacity: lineOpacity,
        width: lineWidth,
        points: [pointsRef.current[0], pointsRef.current[pointsRef.current.length - 1]]
      })
    } else if (currentObject === "ellipse") {
      shadowCtxRef.current.clearRect(0, 0, shadowCanvasRef.current.width, shadowCanvasRef.current.height);
      const { x, y } = pointsRef.current[pointsRef.current.length - 1];
      const radiusX = Math.abs(x - pointsRef.current[0].x) / 2;
      const radiusY = Math.abs(y - pointsRef.current[0].y) / 2;
      drawEllipse(pointsRef.current[0].x + (x - pointsRef.current[0].x > 0 ? radiusX : -radiusX), 
        pointsRef.current[0].y + (y - pointsRef.current[0].y > 0 ? radiusY : -radiusY), 
        radiusX, radiusY, mainCtxRef.current);
      SendDrawing({
        type: currentObject,
        color: lineColor.current,
        opacity: lineOpacity,
        width: lineWidth,
        points: [pointsRef.current[0], pointsRef.current[pointsRef.current.length - 1]]
      })
    }
    pointsRef.current = [{x:0,y:0}]
    setIsDrawing(false); 
  }; 
  
  const draw = (e) => { 
    if (!isDrawing) { 
      return; 
    }
    pointsRef.current.push({x: e.pageX, y: e.pageY})
    if (currentObject === "line") {
      mainCtxRef.current.lineTo( 
        e.pageX, 
        e.pageY 
      );
      mainCtxRef.current.stroke(); 
    } else if (currentObject === "rectangle") {
      shadowCtxRef.current.clearRect(0, 0, shadowCanvasRef.current.width, shadowCanvasRef.current.height);
      drawRect(pointsRef.current[0].x, pointsRef.current[0].y,
        pointsRef.current[pointsRef.current.length - 1].x - pointsRef.current[0].x, 
        pointsRef.current[pointsRef.current.length - 1].y - pointsRef.current[0].y, shadowCtxRef.current);
    } else if (currentObject === "ellipse") {
      shadowCtxRef.current.clearRect(0, 0, shadowCanvasRef.current.width, shadowCanvasRef.current.height);
      const { offsetX, offsetY } = e.nativeEvent;
      const radiusX = Math.abs(offsetX - pointsRef.current[0].x) / 2;
      const radiusY = Math.abs(offsetY - pointsRef.current[0].y) / 2;
      drawEllipse(pointsRef.current[0].x + (offsetX - pointsRef.current[0].x > 0 ? radiusX : -radiusX), 
        pointsRef.current[0].y + (offsetY - pointsRef.current[0].y > 0 ? radiusY : -radiusY), 
        radiusX, radiusY, shadowCtxRef.current);
    }
  };

  const drawRect = useCallback((x, y, width, height, canvasContext, color) => {
    canvasContext.beginPath();
    canvasContext.rect(x, y, width, height);
    canvasContext.fillStyle = color ?? lineColor.current;
    canvasContext.fill();
    canvasContext.closePath();
  }, [lineColor]);

  const drawEllipse = useCallback((x, y, radiusX, radiusY, canvasContext, color) => {
    canvasContext.beginPath();
    canvasContext.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
    canvasContext.fillStyle = color ?? lineColor.current;
    canvasContext.fill();
  }, [lineColor])



  function MouseDownHandler(e) {
    startDrawing(e)
  }
  function MouseUpHandler(e) {
    endDrawing(e)
  }
  function MouseMoveHandler(e) {
    draw(e)
  }




  // SignalR
  var connection = new HubConnectionBuilder().withUrl("https://localhost:7272/paint").configureLogging(LogLevel.Information).build();

  const ReceiveDrawing = useCallback((drawingData) => {
    console.log(drawingData)
    if (drawingData.type === "line") {
      mainCtxRef.current.strokeStyle = drawingData.color
      mainCtxRef.current.beginPath(); 
      mainCtxRef.current.moveTo( 
        drawingData.points[0].x, 
        drawingData.points[0].y 
      );
      for (let i = 1; i < drawingData.points.length; i++) {
        mainCtxRef.current.lineTo( 
          drawingData.points[i].x, 
          drawingData.points[i].y
        ); 
        mainCtxRef.current.stroke(); 
      }
      mainCtxRef.current.strokeStyle = lineColor.current
      mainCtxRef.current.closePath()
    } else if (drawingData.type === "rectangle") {
      drawRect(drawingData.points[0].x, drawingData.points[0].y,
        drawingData.points[drawingData.points.length-1].x - drawingData.points[0].x, 
        drawingData.points[drawingData.points.length-1].y - drawingData.points[0].y, 
        mainCtxRef.current, drawingData.color)
    } else if (drawingData.type === "ellipse") {
      const { x, y } = drawingData.points[drawingData.points.length - 1];
      const radiusX = Math.abs(x - drawingData.points[0].x) / 2;
      const radiusY = Math.abs(y - drawingData.points[0].y) / 2;
      drawEllipse(drawingData.points[0].x + (x - drawingData.points[0].x > 0 ? radiusX : -radiusX), 
        drawingData.points[0].y + (y - drawingData.points[0].y > 0 ? radiusY : -radiusY), 
        radiusX, radiusY, mainCtxRef.current, drawingData.color);
      mainCtxRef.current.fillStyle = lineColor.current
    }
  }, [lineColor, drawRect, drawEllipse])

  useEffect(() => {
    connection.on("ReceiveDrawing", ReceiveDrawing);
    return () => {
      connection.off("ReceiveDrawing", ReceiveDrawing)
    }
  }, [ReceiveDrawing, connection])

  connection.start().then(function () {
      console.log("connection started")
  }).catch(function (err) {
      return console.error(err.toString());
  });

  function SendDrawing(data) {
    connection.invoke("SendDrawing", data).catch(function (err) {
      return console.error(err.toString());
    });
  }
  
  return ( 
    <div className="App">
      <canvas id='mainCanvas'
        ref={mainCanvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
      /> 
      <canvas id='shadowCanvas'
        onMouseDown={MouseDownHandler} 
        onMouseUp={MouseUpHandler} 
        onMouseMove={MouseMoveHandler} 
        ref={shadowCanvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
      />
      <Sidebar setColor={setLineColor} setType={setCurrentObject}
      setLineWidth={setLineWidth} setOpacity={setLineOpacity}></Sidebar>
    </div> 
  );
}

export default App;
