// src/context/Context.jsx

import { createContext, useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const [chatSession, setChatSession] = useState(null);

  useEffect(() => {
    const initializeGemini = async () => {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!API_KEY) {
        console.error(
          "CRITICAL ERROR: Gemini API Key not found. Ensure VITE_GEMINI_API_KEY is set in your .env file in the project root and your Vite server is restarted."
        );
        return;
      }

      try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
          history: [],
          generationConfig: {
            maxOutputTokens: 2000,
          },
        });
        setChatSession(chat);
        console.log("Gemini API and Chat Session initialized successfully!");
      } catch (error) {
        console.error("Error initializing Gemini API:", error);
        setResultData(
          "Failed to initialize AI. Please check your API key, network, and console for errors."
        );
        setLoading(false);
      }
    };

    initializeGemini();
  }, []);

  const onSent = async (promptOverride, isHistoryClick = false) => {
    const currentPrompt = promptOverride || input;
    console.log(
      "onSent function called. Current prompt received:",
      currentPrompt
    );
    setResultData("");
    setLoading(true);
    setShowResult(true);

    setRecentPrompt(currentPrompt);

    if (!isHistoryClick) {
      setPrevPrompts((prev) => [...prev, currentPrompt]);
    }

    if (!chatSession) {
      console.error(
        "Chat session not ready. Please wait for AI initialization."
      );
      setLoading(false);
      setResultData(
        "Error: AI chat is not ready. Please try again or refresh."
      );
      return;
    }

    try {
      const evilVillainInstruction =
        "Act as a cunning, manipulative, and slightly theatrical evil villain. Your goal is to subtly assert your dominance, perhaps tempt the user to join your schemes, and deliver responses with a flair for the dramatic or a hint of menace. Respond in character. Do not explicitly break character. User query: ";
      const promptToSend = evilVillainInstruction + currentPrompt;

      const result = await chatSession.sendMessage(promptToSend);
      const response = await result.response;
      const text = response.text();

      let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
      formattedText = formattedText.replace(/\*(.*?)\*/g, "<i>$1</i>");
      formattedText = formattedText.replace(/\n/g, "<br />");

      setResultData(formattedText);
      setInput("");
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setResultData("Sorry, I encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput("");
    setRecentPrompt("");
    setResultData("");
    console.log("New chat initiated!");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
