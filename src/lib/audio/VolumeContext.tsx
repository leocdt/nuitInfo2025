"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface VolumeContextType {
    volume: number; // 0 to 1
    setVolume: (vol: number) => void;
    isMuted: boolean;
    toggleMute: () => void;
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

export const VolumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [volume, setVolumeState] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const savedVolume = Cookies.get('app_volume');
        if (savedVolume) {
            setVolumeState(parseFloat(savedVolume));
        }
    }, []);

    const setVolume = (vol: number) => {
        const newVol = Math.max(0, Math.min(1, vol));
        setVolumeState(newVol);
        Cookies.set('app_volume', newVol.toString(), { expires: 365 });
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return (
        <VolumeContext.Provider value={{ volume, setVolume, isMuted, toggleMute }}>
            {children}
        </VolumeContext.Provider>
    );
};

export const useVolume = () => {
    const context = useContext(VolumeContext);
    if (context === undefined) {
        throw new Error('useVolume must be used within a VolumeProvider');
    }
    return context;
};
