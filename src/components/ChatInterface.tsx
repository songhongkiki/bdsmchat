"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "character";
  content: string;
  timestamp: Date;
}

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const characterData: Record<string, Character> = {
  "dominant-alex": {
    id: "dominant-alex",
    name: "Alex",
    role: "도미넌트",
    avatar: "👑"
  },
  "submissive-riley": {
    id: "submissive-riley",
    name: "Riley",
    role: "서브미시브",
    avatar: "🌸"
  },
  "switch-jordan": {
    id: "switch-jordan",
    name: "Jordan",
    role: "스위치",
    avatar: "⚖️"
  }
};

interface ChatInterfaceProps {
  character: string;
  onBack: () => void;
}

export default function ChatInterface({ character, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentCharacter = characterData[character];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting
    const greeting = {
      id: "greeting",
      sender: "character" as const,
      content: `안녕하세요! 저는 ${currentCharacter.name}입니다. 함께 편안하고 안전한 대화를 나눠봐요. 궁금한 것이 있거나 불편하면 언제든 말해주세요.`,
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, [currentCharacter.name]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      // Prepare conversation history for Claude API
      const conversationHistory = messages
        .filter(msg => msg.id !== "greeting") // Exclude initial greeting
        .map(msg => ({
          role: msg.sender === "user" ? "user" as const : "assistant" as const,
          content: msg.content
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId: character,
          message: currentInput,
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      const characterResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "character",
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, characterResponse]);
    } catch (error) {
      console.error('Error getting character response:', error);
      toast("응답을 가져오는 중 오류가 발생했습니다.", {
        description: "잠시 후 다시 시도해주세요.",
      });
      
      // Fallback response
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "character",
        content: "죄송해요, 잠시 생각이 필요해요. 다시 말해주실 수 있나요?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              ← 뒤로가기
            </Button>
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{currentCharacter.avatar}</div>
              <div>
                <h2 className="text-white font-semibold">{currentCharacter.name}</h2>
                <p className="text-gray-400 text-sm">{currentCharacter.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-black/40 backdrop-blur-sm border border-gray-700 text-gray-100"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-black/40 backdrop-blur-sm border border-gray-700 text-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-black/40 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
            >
              전송
            </Button>
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              이 대화는 가상의 상황극입니다. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
