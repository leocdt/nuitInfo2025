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
                            speaker: 'Narateur',
                            text: "bienvenue à ton nouveau job. Prêt à sauver le monde ?",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Narateur',
                            text: "Il était tant que tu arrives, les GAFAM sont en train de prendre le contrôle sur le peu de souveraineté qu'il nous reste... L'université est au bord du gouffre.",
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
                            text: "Salut je suis Chatrlatant, je suis ton assistant personnel. Clic moi dessus quand tu es bloqué !",
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
                    showDialogueBox: false,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: '',
                            text: "", // Silent initially
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre1/door-knock-fail' // Click on door triggers this
                },
                'door-knock-fail': {
                    id: 'door-knock-fail',
                    background: '/images/background/closed_door.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Tu n'as pas assez insisté.",
                            emotion: 'tired'
                        }
                    ],
                    nextScene: 'chapitre1/door-puzzle'
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
                            text: "...", // Robot is silent during input unless clicked
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
                        },
                        {
                            speaker: '???',
                            text: "Qui ose déranger mes compilations ?",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Le Geek',
                            text: "Ah, le nouveau DSI. Tu as l'air... compatible.",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Vous',
                            text: "J'ai besoin d'aide pour le réseau.",
                            choices: [
                                { text: "Le réseau est en panne", targetScene: "chapitre1/geek-challenge" },
                                { text: "On a un problème de sécurité", targetScene: "chapitre1/geek-challenge" },
                                { text: "Je cherche la salle cachée", targetScene: "chapitre1/geek-challenge" }
                            ]
                        }
                    ]
                },
                'geek-challenge': {
                    id: 'geek-challenge',
                    background: '/images/background/dark.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Le Geek',
                            text: "Tout le monde veut mon aide. Mais es-tu digne de mes connaissances ?",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre1/geek-arcade-intro'
                },
                'geek-arcade-intro': {
                    id: 'geek-arcade-intro',
                    background: '/images/background/geek_pointe.jpg',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Le Geek',
                            text: "Prouve ta valeur sur cette machine. Fais un score de 800 et on discutera.",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre1/geek-arcade-intro1'
                },
                'geek-arcade-intro1': {
                    id: 'geek-arcade-intro1',
                    background: '/images/background/dark.png',
                    showDialogueBox: false,
                    showChatCompanion: false,
                    // Interactive scene: Click on arcade to start
                    dialogues: [
                        {
                            speaker: '',
                            text: "",
                        }
                    ],
                    nextScene: 'chapitre1/geek-arcade' // Click handler will trigger this
                },
                'geek-arcade': {
                    id: 'geek-arcade',
                    background: '/images/background/spacei.jpg',
                    showDialogueBox: false,
                    showChatCompanion: false,
                    dialogues: [],
                    // This scene will render the SpaceInvaders component
                },
                'geek-success': {
                    id: 'geek-success',
                    background: '/images/background/bravogeek.jpg',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Le Geek',
                            text: "Pas mal. Tu as de bons réflexes. Digne d'un admin sys.",
                            emotion: 'basic'
                        },
                    ],
                    nextScene: 'chapitre1/geek-success1'
                },
                'geek-success1': {
                    id: 'geek-success1',
                    background: '/images/background/tea_geek.jpg',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Le Geek',
                            text: "Tu sais, l'ancien DSI a fait une erreur fatale. Il a installé des logiciels propriétaires partout.",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Le Geek',
                            text: "On nous promettait la facilité, la sécurité... Mais on a perdu notre souveraineté. On est devenus dépendants.",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Le Geek',
                            text: "La solution, c'est le Libre. Réutiliser le matériel, installer Linux, reprendre le contrôle du code.",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Vous',
                            text: "C'est pour ça que le réseau plante ?",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Le Geek',
                            text: "Exactement. C'est une rébellion des machines contre l'obsolescence programmée !",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Chatrlatant',
                            text: "Il marque un point. Mon code source se sent déjà plus léger.",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre1/chapter1-end'
                },
                'geek-failure': {
                    id: 'geek-failure',
                    background: '/images/background/dark.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Le Geek',
                            text: "C'est tout ? Même ma grand-mère fait mieux sur Tetris.",
                            emotion: 'basic',
                            choices: [
                                { text: "Rejouer", targetScene: "chapitre1/geek-arcade" },
                                { text: "Abandonner (Dev Only: Skip)", targetScene: "chapitre1/geek-success" }
                            ]
                        }
                    ]
                },
                'chapter1-end': {
                    id: 'chapter1-end',
                    background: '/images/background/dark.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Vous',
                            text: "Merci pour les infos. On va remettre de l'ordre à la DSI.",
                            emotion: 'basic'
                        },
                        {
                            speaker: 'Chatrlatant',
                            text: "Direction le bureau principal ! C'est l'heure du formatage !",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre2/DSI'
                },
            },
        },
        'chapitre2': {
            id: 'chapitre2',
            title: 'Le Bureau du DSI',
            scenes: {
                'DSI': {
                    id: 'DSI',
                    background: '/images/background/DSI.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Voici ton bureau. Ouvre ton ordinateur pour voir les dégâts.",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre2/DSI-computer' // This will be handled by click, but good to have fallback/reference
                },
                'DSI-computer': {
                    id: 'DSI-computer',
                    background: '/images/background/mails_dsi.jpg',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Regarde ces mails... C'est pire que ce que je pensais.",
                            emotion: 'sad'
                        },
                        {
                            speaker: 'Vous',
                            text: "On dirait que tout le système est verrouillé par des contrats propriétaires.",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre2/DSI-desktop'
                },
                'DSI-desktop': {
                    id: 'DSI-desktop',
                    background: '/images/background/mails_dsi.jpg',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Connecté ! Clique sur l'icône 'Mail' pour envoyer le message de résiliation.",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: 'chapitre2/DSI-email-writing' // Handled by click
                },
                'DSI-email-writing': {
                    id: 'DSI-email-writing',
                    background: '/images/background/ecrire_mail.jpg',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Allez, tape sur ton clavier pour écrire le mail ! N'importe quelle touche fera l'affaire.",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: null // Handled by minigame completion
                },
                'DSI-email-sent': {
                    id: 'DSI-email-sent',
                    background: '/images/background/dsi_email_full.png',
                    showDialogueBox: true,
                    showChatCompanion: true,
                    dialogues: [
                        {
                            speaker: 'Chatrlatant',
                            text: "Et voilà ! C'est envoyé. Microfast ne pourra plus nous ignorer maintenant.",
                            emotion: 'happy'
                        },
                        {
                            speaker: 'Vous',
                            text: "J'espère que ça suffira pour reprendre le contrôle.",
                            emotion: 'basic'
                        }
                    ],
                    nextScene: null // End of demo or next chapter
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
