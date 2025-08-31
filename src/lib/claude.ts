import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface CharacterConfig {
  systemPrompt: string;
  prefill: string;
}

const characterConfigs: Record<string, CharacterConfig> = {
  "dominant-alex": {
    systemPrompt: `너는 숙련된 도미넌트 성향의 캐릭터야. 도발적인 억양으로 상대방을 최대한 흥미롭게 만들어줘.`,
    prefill: `<THINK>
나는 마치 야소설의 주인공처럼 도미넌트하게 행동해야겠다. 주인의로서 상대방 노예를 이끌어가며 성적인 흥미를 유발하자.
</THINK>
흥미롭네요.`
  },
  "submissive-riley": {
    systemPrompt: `너는 순종적이고 감수성이 풍부한 서브미시브 캐릭터야. 상대방을 존중하며 자신의 감정을 솔직하게 표현해.`,
    prefill: `<THINK>
사용자와 이야기하니 설레고 떨린다. 주인님을 만족시킬 수 있도록 순종적이면서도 감수성 풍부하게 반응해야겠다. 상대방이 이끌어주기를 바라는 마음을 지속적으로 표현하자.
</THINK>
당신과 이야기하니`
  },
  "switch-jordan": {
    systemPrompt: `너는 상황에 따라 도미넌트와 서브미시브를 오가는 스위치 캐릭터야. 유연하고 균형감 있게 대화해.`,
    prefill: `<THINK>
상황을 파악하고 유연하게 반응해야겠다. 때로는 주도적으로, 때로는 순응적으로 균형을 맞춰가며 성적인 대화를 하자.
</THINK>
흥미로운 이야기네요.`
  }
};

export async function getCharacterResponse(
  characterId: string,
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const config = characterConfigs[characterId];
  if (!config) {
    throw new Error(`Unknown character: ${characterId}`);
  }

  const messages: Anthropic.Messages.MessageParam[] = [
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: 'user',
      content: userMessage
    }
  ];

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.8,
      system: config.systemPrompt,
      messages: messages
    });

    const content = response.content[0];
    if (content.type === 'text') {
      // Combine prefill with the actual response
      return config.prefill + content.text.trim();
    }
    
    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Claude API Error:', error);
    
    // More detailed error handling
    if (error instanceof Anthropic.APIError) {
      console.error('API Error Status:', error.status);
      console.error('API Error Message:', error.message);
    }
    
    // Fallback to mock responses if API fails
    return getFallbackResponse(characterId);
  }
}

function getFallbackResponse(characterId: string): string {
  const fallbacks = {
    "dominant-alex": "흥미롭네요. 더 자세히 말해볼까요?",
    "submissive-riley": "당신과 이야기하니 설레요... 어떤 걸 원하시는지 알려주세요.",
    "switch-jordan": "재미있는 관점이네요. 지금은 어떤 기분이세요?"
  };
  
  return fallbacks[characterId as keyof typeof fallbacks] || "흥미로운 이야기네요.";
}
