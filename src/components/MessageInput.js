import { Camera, File, Image, Mic, Plus, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../../src/core/public/store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const [isTextEntered, setIsTextEntered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [documentPreview, setDocumentPreview] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const documentInputRef = useRef(null);
  const audioStreamRef = useRef(null);


  // Opens the camera and closes the menu
  const openCamera = async () => {
    setShowMenu(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Failed to access the camera:", error);
      toast.error("Unable to access the camera. Please check your permissions.");
    }
  };

  // Handle Document Upload
  const handleDocumentChange = (e) => {
    setShowMenu(false);
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
      setDocumentPreview(file.name); // Display the file name
    } else {
      toast.error("Please select a valid document.");
    }
  };

  const startRecording = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorderRef.current = new MediaRecorder(stream);
          audioChunksRef.current = [];
    
          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
    
          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            const audioURL = URL.createObjectURL(audioBlob);
            setAudioBlob(audioBlob);
            setAudioURL(audioURL);
          };
    
          mediaRecorderRef.current.start();
          setIsRecording(true);
        } catch (error) {
          console.error("Failed to access microphone:", error);
          toast.error("Microphone access denied.");
        }
      };
    
      // Stop Audio Recording
      const stopRecording = () => {
        if (mediaRecorderRef.current) {
          setIsRecording(false); // Reset the recording state to false
          mediaRecorderRef.current.stop();
      
          // Ensure the stream is valid and stop the tracks
          const stream = mediaRecorderRef.current.stream || mediaRecorderRef.current.srcObject;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());  
          }
        }
      };
      
    
      // Remove Audio
      const removeAudio = () => {
        setAudioBlob(null);
        setAudioURL(null);
      };
    

  // Handles image selection from the gallery and closes the menu
  const handleImageChange = (e) => {
    setShowMenu(false);
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop(); // Stop each track in the stream
      });
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null; // Clear the video source
    }
  
    setCameraStream(null);
    setIsCameraOpen(false);
  };
  
  // Captures an image from the video stream and sets it as `imagePreview`
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = canvasRef.current.toDataURL("image/png");
      setImagePreview(imageData);
      closeCamera();
    }
  };

  // Removes the selected or captured image
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handles sending the message
  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    // Stop recording if still recording before sending the message
    if (isRecording) {
      stopRecording();
    }
  
    // If there's no content (text, image, audio, or document), return early
    if (!text.trim() && !imagePreview && !audioBlob && !documentFile) return;
  
    try {
      const messageData = { text: text.trim() };
  
      // Handle document file (ensure this is sent after FileReader is done)
      if (documentFile) {
        const reader = new FileReader();
        reader.readAsDataURL(documentFile);
        reader.onloadend = async () => {
          // When the file is loaded, add it to messageData
          messageData.document = reader.result;
          messageData.documentName = documentFile.name;
  
          // Now send the message with the document
          await sendMessage(messageData); // Wait until upload is complete
  
          // Clear document states
          setDocumentFile(null);
          setDocumentPreview(null);
        };
      } else {
        // If no document, send the message directly
        if (imagePreview) messageData.image = imagePreview;
        if (audioBlob) {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            messageData.audio = reader.result;
            await sendMessage(messageData);
            setAudioBlob(null);
            setAudioURL(null);
          };
        } else {
          await sendMessage(messageData);
        }
      }
  
      setText("");
      setImagePreview(null);
  
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error("Failed to send message. Please try again.");
    }
  };
  
  
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    setIsTextEntered(text.trim() !== "");
  }, [text]);

  return (
    <div className="p-4 w-full relative">

{documentPreview && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm ">{documentPreview}</span>
          <button onClick={() => setDocumentPreview(null)} className="text-red-500">
            <X size={16} />
          </button>
        </div>
      )}

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border "
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full  flex items-center justify-center"
              type="button"
              aria-label="Remove image"
            >
              <X className="size-3 text-red-500" />
            </button>
          </div>
        </div>
      )}

      {isCameraOpen && (
        <div className="fixed inset-0 bg-base-100 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" p-4 rounded-lg shadow-lg relative">
            <video ref={videoRef} autoPlay className="w-full max-h-[400px] rounded-lg" />
            <canvas ref={canvasRef} className="hidden" width={640} height={480}></canvas>
            <div className="flex justify-between mt-4">
              <button
                onClick={captureImage}
                className="bg-green-500  px-4 py-2 rounded-lg"
              >
                Capture
              </button>
              <button
                onClick={closeCamera}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

{audioURL && ( 
      <div className="mb-3 flex items-center gap-2">
          <audio controls src={audioURL} className="w-40" />
          <button onClick={removeAudio} className="w-5 h-5 rounded-full  flex items-center justify-center" type="button" aria-label="Remove audio">
            <X className="size-3 text-red-500" />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            className="w-10 h-10  rounded-full flex items-center justify-center p-2 "
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Attach file"
          >
            <Plus size={24} className="text-gray-600" />
          </button>
          {showMenu && (
            <div className="absolute bottom-16 left-0 mt-2 w-36 bg-base-100 shadow-md rounded-md border  p-2 flex flex-col gap-2">
              <button className="flex items-center gap-2 p-2  rounded-md" onClick={openCamera}>
                <Camera size={20} className="text-green-500" />
                <h1>Camera</h1>
              </button>
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md" onClick={() =>  {setShowMenu(false) ;documentInputRef.current?.click()}}>
              <File size={20} className="text-purple-500" /> Document
            </button>
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md" onClick={() => {
                setShowMenu(false);
                fileInputRef.current?.click();
              }}>
                <Image size={20} className="text-blue-800" /> Gallery
              </button> 
            </div>
          )}
        </div>

      <button type="button" className={`w-10 h-10 rounded-full flex items-center justify-center ${isRecording ? "bg-red-500 text-white" : "text-gray-600"}`} onClick={isRecording ? stopRecording : startRecording} aria-label="Record Audio">
        <Mic size={22} />
      </button>

      <div className="flex-1 flex gap-2">
           <input
            type="text"
            className="py-2 px-3 rounded-lg border outline-none bg-base-100 shadow-sm flex-1  sm:text-md text-sm"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" className="hidden" ref={documentInputRef} onChange={handleDocumentChange} />
        </div>

        <button
        type="submit"
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isTextEntered || imagePreview || audioBlob || documentFile
            ? ""
            : ""
        }`}
        disabled={!text.trim() && !imagePreview && !audioBlob && !documentFile}
        aria-label="Send message"
      >
        <Send size={22} className="text-gray-600" />
      </button>


      </form>
    </div>
  );
};

export default MessageInput;
