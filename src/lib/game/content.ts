import { GameConfig } from './types';

export const gameContent: GameConfig = {
    chapters: {
        'prologue': {
            id: 'prologue',
            title: 'Le Réveil',
            scenes: {
                'start': {
                    id: 'start',
                    background: '/images/backgrounds/corridor.jpg', // Placeholder
                    showDialogueBox: true,
                    dialogues: [
                        {
                            speaker: 'Vous',
                            text: "Où suis-je ? Tout est flou..."
                        },
                        {
                            speaker: '???',
                            text: "Initialisation des systèmes... 3... 2... 1..."
                        },
                        {
                            speaker: 'Chatrlatant',
                            text: "Ah ! Enfin réveillé, DSI. On a du pain sur la planche."
                        }
                    ],
                    nextScene: 'prologue/meet-robot'
                },
                'context-arrival': {
                    id: 'context-arrival',
                    background: '/images/background/front_scool.png',
                    showDialogueBox: true,
                    dialogues: [
                        {
                            speaker: 'Voix Off',
                            text: "J'espère que vous avez les nerfs solides. L'ancien DSI... a dû prendre un congé. Permanent."
                        },
                        {
                            speaker: 'Vous',
                            text: "Sympa l'ambiance..."
                        }
                    ],
                    nextScene: 'prologue/meet-robot'
                },
                'meet-robot': {
                    id: 'meet-robot',
                    background: '/images/background/front_scool.png',
                    showChatCompanion: true,
                    showDialogueBox: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Salut <name> ! Je suis Chatrlatant, ton assistant personnel. Prêt à sauver le monde ?",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Chatrlatant',
                            text: "Les GAFAM ont pris le contrôle... L'université est au bord du gouffre.",
                            emotion: 'sad'
                        }
                    ],
                    nextScene: 'prologue/meet-robot-questions'
                },
                'meet-robot-questions': {
                    id: 'meet-robot-questions',
                    background: '/images/background/front_scool.png',
                    showChatCompanion: true,
                    showDialogueBox: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Tu dois avoir des questions sur l'université ?",
                            emotion: 'basic',
                            choices: [
                                { text: "Pourquoi 'Souveraine' ?", targetScene: "prologue/q-souveraine" },
                                { text: "C'est quoi ce robot ?", targetScene: "prologue/q-robot" },
                                { text: "Où sont les profs ?", targetScene: "prologue/q-profs" },
                                { text: "Y'a quelqu'un pour m'aider ?", targetScene: "prologue/legend-hook" }
                            ]
                        }
                    ]
                },
                'q-souveraine': {
                    id: 'q-souveraine',
                    background: '/images/background/front_scool.png',
                    showChatCompanion: true,
                    showDialogueBox: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Parce qu'on n'aime pas que Google lise nos mails ! Enfin... s'il restait des mails à lire.",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'prologue/meet-robot-questions'
                },
                'q-robot': {
                    id: 'q-robot',
                    background: '/images/background/front_scool.png',
                    showChatCompanion: true,
                    showDialogueBox: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Je suis le dernier cri de la technologie... de 1998. Increvable !",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'prologue/meet-robot-questions'
                },
                'q-profs': {
                    id: 'q-profs',
                    background: '/images/background/front_scool.png',
                    showChatCompanion: true,
                    showDialogueBox: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Partis chez Amazon. Ils payaient en livraison Prime gratuite.",
                            emotion: 'sad'
                        }
                    ],
                    nextScene: 'prologue/meet-robot-questions'
                },
                'legend-hook': {
                    id: 'legend-hook',
                    background: '/images/background/front_scool.png',
                    showChatCompanion: true,
                    showDialogueBox: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Non, enfin... il y a peut-être quelqu'un mais ce n'est qu'une rumeur...",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Vous',
                            text: "Dis-m'en plus."
                        },
                        {
                            speaker: 'Chatrlatant',
                            text: "Une légende raconte que dans une salle cachée vit quelqu'un avec des connaissances oubliées... Dangereuses pour l'ordre établi.",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Chatrlatant',
                            text: "Je ne sais pas où c'est, mais on devrait commencer par vérifier le réseau. Suis moi !",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre1/start'
                },
            }
        },
        'chapitre1': {
            id: 'chapitre1',
            title: 'Le Jeu du Geek',
            scenes: {
                'start': {
                    id: 'start',
                    background: '/images/background/hall.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Nous y voilà. Le réseau est instable ici. Fais attention.",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Chatrlatant',
                            text: "On doit trouver cette fameuse salle. Suis-moi !",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre1/corridor-choice'
                },
                'corridor-choice': {
                    id: 'corridor-choice',
                    background: '/images/background/two_choice.png',
                    showDialogueBox: true,
                    showChatCompanion: false, // Focus on choice
                    dialogues: [
                        {
                            speaker: 'Vous',
                            text: "Deux chemins...",
                            choices: [
                                { text: "Aller à gauche", targetScene: "chapitre1/door-closed" },
                                { text: "Aller à droite", targetScene: "chapitre1/dead-end" }
                            ]
                        }
                    ]
                },
                'dead-end': {
                    id: 'dead-end',
                    background: '/images/background/dead_end.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Cul-de-sac ! Je t'avais dit que mon GPS buggait ?",
                            emotion: 'error'
                        }
                    ],
                    nextScene: 'chapitre1/corridor-choice'
                },
                'door-closed': {
                    id: 'door-closed',
                    background: '/images/background/closed_door.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Regarde cette porte... Le numéro est bizarre.",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Vous',
                            text: "Que faire ?",
                            choices: [
                                { text: "Toquer", targetScene: "chapitre1/door-knock-1" },
                                { text: "Essayer d'entrer", targetScene: "chapitre1/door-locked" }
                            ]
                        }
                    ]
                },
                'door-locked': {
                    id: 'door-locked',
                    background: '/images/background/closed_door.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Système',
                            text: "La porte semble fermée à clé.",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre1/door-interaction-2'
                },
                'door-knock-1': {
                    id: 'door-knock-1',
                    background: '/images/background/closed_door.png',
                    showDialogueBox: true,
                    showChatCompanion: false,
                    dialogues: [
                        {
                            speaker: '...',
                            text: "...",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre1/door-interaction-2'
                },
                'door-interaction-2': {
                    id: 'door-interaction-2',
                    background: '/images/background/closed_door.png',
                    showDialogueBox: true,
                    showChatCompanion: false,
                    dialogues: [
                        {
                            speaker: 'Vous',
                            text: "Je réessaie ?",
                            choices: [
                                { text: "Toquer", targetScene: "chapitre1/door-knock-1" },
                                { text: "Toquer FORT", targetScene: "chapitre1/door-puzzle" }
                            ]
                        }
                    ]
                },
                'door-puzzle': {
                    id: 'door-puzzle',
                    background: '/images/background/closed_door.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Voix Intérieure',
                            text: "MOT DE PASSE !",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Chatrlatant',
                            text: "Vite ! Traduis le binaire sur la porte !",
                            emotion: 'basic',
                            input: {
                                correctValue: "Linux",
                                successScene: "chapitre1/door-open",
                                failureScene: "chapitre1/door-fail",
                                placeholder: "Entrez le mot de passe..."
                            }
                        }
                    ]
                },
                'door-fail': {
                    id: 'door-fail',
                    background: '/images/background/closed_door.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Voix Intérieure',
                            text: "VA T'EN !",
                            emotion: 'error'
                        }
                    ],
                    nextScene: 'chapitre1/door-puzzle'
                },
                'door-open': {
                    id: 'door-open',
                    background: '/images/background/open_door.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Ça s'ouvre ! Bien joué DSI.",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre1/geek-room'
                },
                'geek-room': {
                    id: 'geek-room',
                    background: '/images/background/dark.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "C'est sombre ici...",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: null
                }
            }
        }
    }
};

export const getScene = (chapterId: string, sceneId: string) => {
    const chapter = gameContent.chapters[chapterId];
    if (!chapter) return null;
    return chapter.scenes[sceneId] || null;
};
