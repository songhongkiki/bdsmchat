"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CharacterSelection from "@/components/CharacterSelection";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
  };

  const handleBack = () => {
    setSelectedCharacter(null);
  };

  if (!selectedCharacter) {
    return <CharacterSelection onCharacterSelect={handleCharacterSelect} />;
  }

  return <ChatInterface character={selectedCharacter} onBack={handleBack} />;
}
