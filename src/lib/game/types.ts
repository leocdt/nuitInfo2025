export interface Choice {
    text: string;
    targetScene: string; // Format: "chapterId/sceneId" or just "sceneId" if same chapter
}

export interface Dialogue {
    speaker: string;
    text: string;
    emotion?: string; // For future sprite variations
    choices?: Choice[];
    input?: {
        correctValue: string;
        successScene: string;
        failureScene: string;
        placeholder?: string;
    };
}

export interface Scene {
    id: string;
    background: string; // URL to image
    dialogues: Dialogue[];
    nextScene?: string; // Default next scene if no choices
    showChatCompanion?: boolean;
    showDialogueBox?: boolean;
    dialogueBoxStyle?: 'default' | 'retro'; // For future variations
}

export interface Chapter {
    id: string;
    title: string;
    scenes: Record<string, Scene>; // Map sceneId to Scene
}

export interface GameConfig {
    chapters: Record<string, Chapter>;
}
