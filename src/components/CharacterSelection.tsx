"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
}

const characters: Character[] = [
  {
    id: "dominant-alex",
    name: "Alex",
    role: "도미넌트",
    description: "자신감 있고 주도적인 성격으로 상대방을 이끌어가는 스타일",
    avatar: "👑"
  },
  {
    id: "submissive-riley",
    name: "Riley",
    role: "서브미시브", 
    description: "순종적이고 감수성이 풍부하며 상대방을 따르는 성향",
    avatar: "🌸"
  },
  {
    id: "switch-jordan",
    name: "Jordan",
    role: "스위치",
    description: "상황에 따라 도미넌트와 서브미시브를 유연하게 오가는 성향",
    avatar: "⚖️"
  }
];

interface CharacterSelectionProps {
  onCharacterSelect: (characterId: string) => void;
}

export default function CharacterSelection({ onCharacterSelect }: CharacterSelectionProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const handleSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
    onCharacterSelect(characterId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            롤플레잉 챗봇 서비스
          </h1>
          <p className="text-gray-300 text-lg">
            원하는 캐릭터를 선택하여 안전하고 즐거운 대화를 시작하세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`bg-black/40 backdrop-blur-sm border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedCharacter === character.id
                  ? "border-purple-500 bg-purple-500/20"
                  : "border-gray-700 hover:border-purple-400"
              }`}
              onClick={() => handleSelect(character.id)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{character.avatar}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {character.name}
                </h3>
                <div className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm mb-3">
                  {character.role}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {character.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-sm">
              ⚠️ 이 서비스는 18세 이상 성인을 대상으로 합니다
            </p>
            <p className="text-gray-400 text-sm mt-2">
              모든 대화는 가상의 상황극이며, 언제든지 대화를 중단할 수 있습니다
            </p>
          </div>
          
          {selectedCharacter && (
            <Button
              onClick={() => handleSelect(selectedCharacter)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-lg text-lg"
            >
              대화 시작하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
