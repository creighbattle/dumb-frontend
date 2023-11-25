"use client";
import axios from "axios";
// pages/ask.js
import { useState } from "react";
import Typewriter from "typewriter-effect";
import Lottie from "lottie-react";
import beansLoading from "@/public/beans-loading.json";
import tear from "@/public/tear.json";
import { motion } from "framer-motion";
import Image from "next/image";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const imageIds = [
  "IMG_3314.png",
  "IMG_3315.png",
  "IMG_3316.png",
  "IMG_3317.jpeg",
  "IMG_3318.jpeg",
  "IMG_3320.png",
  "IMG_3321.png",
  "IMG_3322.png",
  "IMG_3323.png",
  "IMG_3324.png",
  "IMG_3325.png",
  "IMG_3326.png",
  "IMG_3327.png",
  "IMG_3328.png",
  "IMG_3329.png",
  "IMG_3330.png",
  "IMG_3331.png",
  "IMG_3332.png",
  "IMG_3333.png",
  "IMG_3334.png",
  "IMG_3335.png",
  "IMG_3336.png",
  "IMG_3337.png",
  "IMG_3338.png",
  "IMG_3339.png",
  "IMG_3340.png",
  "IMG_3341.png",
  "IMG_3342.png",
  "IMG_3343.png",
];

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const getRandomImages = () => {
    let shuffled = imageIds.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4).map((url) => ({
      src: `https://dumb.nyc3.cdn.digitaloceanspaces.com/${url}`,
      isVisible: false,
    }));
  };

  const toggleImageVisibility = (index) => {
    setImages(
      images.map((img, i) => {
        if (i === index) img.isVisible = !img.isVisible;
        return img;
      })
    );
  };

  const suggestedQuestions = [
    "Why did Creigh do that?",
    "Is Creigh sorry for what happened?",
    "How is Creigh planning to make things right?",
    // ... add more suggestions if needed
  ];

  const handleSuggestionClick = (suggestion) => {
    setQuestion(suggestion);
  };

  const handleFlow = async () => {
    setAskedQuestion(question);
    setQuestion("");
    setResponse(null);
    setLoading(true);
    await askQuestion();
    const runId = await runAssistant();
    let attempts = 0;
    const maxAttempts = 10;

    const intervalId = setInterval(async () => {
      const status = await checkRun(runId);

      if (status === "completed") {
        clearInterval(intervalId); // Stop checking
        await getMessage();
        setImages(getRandomImages());
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(intervalId); // Stop checking after maximum attempts
          console.log("Maximum attempts reached without completion.");
        }
      }
    }, 1000); // Check every 1000 milliseconds (1 second)
  };

  const askQuestion = async () => {
    try {
      const response = await axios.post(`${apiUrl}ask`, {
        question,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
      alert("error");
    }
  };

  const runAssistant = async () => {
    try {
      const response = await axios.get(`${apiUrl}run-assistant`);
      return response.data.runId;
    } catch (error) {
      console.log(error);
      alert("error");
    }
  };

  const checkRun = async (runId) => {
    try {
      const response = await axios.post(`${apiUrl}check-run`, {
        runId,
      });

      console.log(response.data.status);

      return response.data.status;
    } catch (error) {
      console.log(error);
      alert("error");
    }
  };

  const getMessage = async () => {
    try {
      const response = await axios.get(`${apiUrl}get-message`);
      //return response.data.runId;
      console.log(response);
      setResponse(response.data.lastMessage);
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    images.map((image) => {
      image.isVisible = false;
    });
    // Handle the submission
    // For example, setResponse("Some response from the server");
    //await askQuestion();
    //await runAssistant();
    // await checkRun();
    await handleFlow();
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-900 text-white p-6 pb-28">
      {" "}
      {/* Further increased bottom padding */}
      {/* Response Display Section */}
      {response && (
        <div className="mb-4 flex-1 overflow-auto p-4 bg-gray-800 rounded-md max-h-[62vh]">
          <h2 className="mb-4 text-lg font-semibold">
            Question: {askedQuestion}
          </h2>
          <h2 className="mb-4 text-lg font-semibold">Response:</h2>
          {/* <p>{response || "Your response will appear here."}</p> */}
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .changeDelay(10)
                .typeString(response)
                .callFunction(() => {
                  setImages(
                    images.map((img) => {
                      img.isVisible = true;
                      return img;
                    })
                  );
                  console.log("String typed out!");
                })
                .start();
            }}
          />
          <div className="flex flex-wrap justify-center mt-4">
            {images.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={img.isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5 }}
                className="w-1/2 p-2"
                onClick={() => toggleImageVisibility(index)}
              >
                <Image
                  width={500}
                  height={500}
                  src={img.src}
                  alt={`image-${index}`}
                  className="w-full h-52 cursor-pointer rounded-lg object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {/* {!response && (
        <div className="mb-4 flex-1 p-4 rounded-md items-center justify-center bg-red-300">
          {loading && (
            <div className="flex justify-center items-center h-full w-full">
              <Lottie animationData={beansLoading} loop={true} />
            </div>
          )}
        </div>
      )} */}
      {!response && (
        <div className="mb-4 flex-1 p-4 rounded-md flex items-center justify-center ">
          {loading && (
            <div className="flex justify-center items-center h-full w-full">
              <div
                className="flex justify-center items-center"
                style={{ height: "100%", width: "100%" }}
              >
                <Lottie
                  animationData={beansLoading}
                  loop={true}
                  style={{ width: "300px", height: "300px" }} // Adjust size as needed
                />
              </div>
            </div>
          )}
          {!loading && (
            <div className="flex justify-center items-center h-full w-full">
              <div
                className="flex justify-center items-center"
                style={{ height: "100%", width: "100%" }}
              >
                <Lottie
                  animationData={tear}
                  loop={true}
                  style={{ width: "300px", height: "300px" }} // Adjust size as needed
                />
              </div>
            </div>
          )}
        </div>
      )}
      {/* Space Between */}
      <div className="mb-4"></div>
      {/* Suggestion Section */}
      <div className="flex overflow-x-auto space-x-4 mb-4">
        {suggestedQuestions.map((q, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(q)}
            className="min-w-max px-5 py-3 bg-gray-800 hover:bg-futuristic-green rounded-md whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>
      {/* Input Section */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask your question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="flex items-center justify-center  bg-futuristic-green  hover:bg-green-600 py-2 rounded-lg px-3"
        >
          {loading ? (
            <div className="spinner"></div> // Loading spinner
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg> // Regular button content
          )}
        </button>
      </form>
    </div>
  );
}
