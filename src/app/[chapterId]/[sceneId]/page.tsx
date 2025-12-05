"use client";

import React, { use } from 'react';
import { getScene } from '@/lib/game/content';
import { SceneDisplay } from '@/components/game/SceneDisplay';
import { notFound } from 'next/navigation';

import { useSearchParams } from 'next/navigation';

interface PageProps {
    params: Promise<{
        chapterId: string;
        sceneId: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function ScenePage({ params }: PageProps) {
    // Unwrap params using React.use()
    const { chapterId, sceneId } = use(params);
    const searchParams = useSearchParams();

    const playerName = searchParams.get('name') || 'DSI';

    const scene = getScene(chapterId, sceneId);

    if (!scene) {
        return notFound();
    }

    return <SceneDisplay scene={scene} chapterId={chapterId} playerName={playerName} />;
}
