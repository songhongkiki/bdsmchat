"use client";

import { Button } from "@/components/ui/button";

interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  traits: string[];
  avatar: string;
}

const characters: Character[] = [
  {
    id: "dominant-alex",
    name: "Alex",
    role: "도미넌트",
    description: "경험이 풍부한 도미넌트. 당신의 한계를 안전하게 탐색하도록 이끌어줍니다.",
    traits: ["경험 풍부", "배려심 깊음", "명확한 소통", "안전 중시"],
    avatar: "👑"
  },
  {
    id: "submissive-riley",
    name: "Riley",
    role: "서브미시브",
    description: "순종적이고 감수성이 풍부한 서브미시브. 함께 새로운 경험을 나눕니다.",
    traits: ["순종적", "감수성 풍부", "솔직함", "호기심 많음"],
    avatar: "🌸"
  },
  {
    id: "switch-jordan",
    name: "Jordan",
    role: "스위치",
    description: "상황에 따라 도미넌트와 서브미시브를 오가는 스위치. 다양한 관점을 제공합니다.",
    traits: ["유연함", "이해심 깊음", "적응력 좋음", "균형감각"],
    avatar: "⚖️"
  }
];

interface CharacterSelectionProps {
  onSelect: (characterId: string) => void;
}

export default function CharacterSelection({ onSelect }: CharacterSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">캐릭터 선택</h1>
          <p className="text-gray-300 text-lg">
            함께 성향을 탐색할 파트너를 선택해주세요
          </p>
          <p className="text-gray-400 text-sm mt-2">
            모든 캐릭터는 안전하고 합의된 상황극을 진행합니다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-purple-500 transition-all duration-300 hover:scale-105"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{character.avatar}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{character.name}</h3>
                <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {character.role}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                {character.description}
              </p>

              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">특징</h4>
                <div className="flex flex-wrap gap-2">
                  {character.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-gray-800 text-gray-300 px-2 py-1 rounded-lg text-xs"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => onSelect(character.id)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
              >
                {character.name}와 대화하기 💬
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-white font-semibold mb-3">🛡️ 안전 가이드</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• 언제든 "세이프워드"를 입력하면 대화가 즉시 중단됩니다</p>
              <p>• 불편하거나 원하지 않는 상황에서는 주저하지 말고 중단하세요</p>
              <p>• 이 서비스는 성향 탐색을 위한 교육적 도구입니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
