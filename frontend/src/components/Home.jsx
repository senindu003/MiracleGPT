import React, { useState } from "react";
import Episodes from "../subcomponents/Episodes";
import PromptSpace from "../subcomponents/PromptSpace";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openNav = () => setIsOpen(true);
  const closeNav = () => setIsOpen(false);

  const storyData1 = {
  "episode_1": {
    "title": "Homecoming in Maple Creek 🍂✨",
    "story": "The scent of damp earth and burning leaves hits you as you step off the bus in Maple Creek. You left a decade ago, chasing city dreams that now feel like someone else's life. The town square is unchanged—the old gazebo, the flickering streetlights, the distant sound of the river. Your heart pounds with a strange, lucid clarity. This is where you left a piece of yourself, and him: Riley, with his quiet smile and paint-stained hands.",
    "choices": {
      "Go straight to Riley's old studio 🎨": {
        "episode_2": {
          "title": "Ghosts and Canvases 👻🖼️",
          "story": "The studio's windows are dark, but the door is unlocked. Inside, the air is thick with turpentine and memory. Canvases lean against every wall, but they're all landscapes—no portraits, no echoes of you. A figure stands silhouetted against the back window. He turns. It's Riley, older, sharper, his eyes holding a storm you don't recognize. \"I heard you were back,\" he says, voice flat. The space between you hums with everything unsaid.",
          "choices": {
            "Ask him why he never answered your letters 💌": {
              "episode_3": {
                "title": "Unsealed Confessions ✉️💔",
                "story": "Riley flinches as if struck. He runs a hand through his hair, gesturing to a small, battered box on a shelf. \"I wrote one every week,\" he admits, voice raw. \"Never sent a single one. Thought you were gone for good.\" He pulls out a folded letter, the paper soft with age. Your name is written in his familiar, looping script. The vulnerability in his eyes mirrors the ache in your own chest.",
                "choices": {
                  "Take the letter and read it now 📖💖": {
                    "episode_4a": {
                      "title": "Ink-Stained Truths 🖋️❤️‍🩹",
                      "story": "Your hands tremble as you unfold the paper. His words spill out—yearning, regret, pride, love that never faded. He wrote about the light on the river, hoping you saw it too. He wrote about the silence in the studio after you left. Tears blur the ink. When you look up, he's watching you with a hope so fragile it steals your breath. \"I never stopped,\" he whispers.",
                      "choices": {
                        "Walk to him and kiss him 👩‍❤️‍💋‍👨✨": {
                          "episode_5a": {
                            "title": "A New Canvas, Together 🎨🌟",
                            "story": "His lips are familiar and new, a decade of longing melting in the gentle autumn air. He holds your face like you're his most precious masterpiece. \"Stay,\" he whispers against your mouth. You nod, laughing through tears. In his studio the next morning, sunlight paints your intertwined shadows on the floor. The future is a blank canvas, and you'll fill it together.",
                            "choices": {}
                          }
                        },
                        "Say you need time to think alone 🏞️💭": {
                          "episode_5b": {
                            "title": "The River's Patient Song 🌊🍂",
                            "story": "You need space to let his words settle. The riverbank is cold and quiet. You sit, watching the water carry away old leaves. You sense him before you see him—Riley sits beside you, not touching, just sharing the silence. \"I'll wait,\" he says simply. It's not an ending, but a delicate, lucid beginning, with the patient river as your witness.",
                            "choices": {}
                          }
                        }
                      }
                    }
                  },
                  "Tell him it's too late and leave 🚪🌫️": {
                    "episode_4b": {
                      "title": "The Final Stroke ✋🎨",
                      "story": "The weight of the years feels insurmountable. You shake your head, the letter feeling heavy in your hand. \"Some ghosts should stay buried, Riley.\" His face collapses, but he doesn't stop you. You walk back into the crisp evening, the studio door clicking shut behind you. The pain is sharp, clean.",
                      "choices": {
                        "Board the last bus out of town 🚌🍂": {
                          "episode_5c": {
                            "title": "Ashes and Autumn Air 🍁💨",
                            "story": "You watch Maple Creek's lights disappear from the bus window. It hurts, but it's a lucid, chosen pain. You're free, but the freedom tastes like ashes and autumn air. The town becomes a beautiful, distant memory—a painting you once loved but had to leave behind.",
                            "choices": {}
                          }
                        },
                        "Go to the Cedar Cafe instead ☕🔄": {
                          "episode_5d": {
                            "title": "Second Chances at Sunrise 🌅👋",
                            "story": "The cafe bell jingles. Morgan, your old friend, looks up from the counter. \"Tough night?\" they ask gently. Over coffee, you explain everything. \"He's at the river every sunrise,\" Morgan says. \"Always has been.\" The next morning, you find him there. He turns, surprised. No words—just two people, one river, and a new day dawning.",
                            "choices": {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "Comment on his new work, avoiding the past 🖼️🗣️": {
              "episode_3b": {
                "title": "Polite Distances 😶🖌️",
                "story": "You gesture to a brooding painting of the winter woods. \"The use of shadow is incredible.\" The tension eases into a stiff, gallery-like professionalism. He talks about technique, influences, the local art scene. You discuss his work like polite strangers. An hour passes with coffee and careful small talk.",
                "choices": {
                  "Exchange numbers, promise to 'keep in touch' 📱🤝": {
                    "episode_4c": {
                      "title": "Civil Emptiness 📞🌌",
                      "story": "You leave with hollow promises. The connection is severed, replaced by a civil, adult understanding. It's peaceful, and utterly empty. Weeks later, you text about an exhibit. He replies with a polite thumbs-up. You become acquaintances who once loved—a story rewritten into something safe, shallow, and sad.",
                      "choices": {
                        "Leave town for good, close this chapter ✈️📖": {
                          "episode_5e": {
                            "title": "The Safest Ending ✨🚪",
                            "story": "You pack your bags with a strange calm. This is the ending without risk, without tears, without messy beauty. At the bus station, you delete his number. The town fades in the distance. You build a new life elsewhere, neat and tidy. Sometimes you wonder about the paintings he never made of you.",
                            "choices": {}
                          }
                        },
                        "Return one last time, say a real goodbye 👋❤️": {
                          "episode_5f": {
                            "title": "A Proper Farewell 🌇💌",
                            "story": "You find him at the river at dusk. \"I came to say a real goodbye,\" you tell him. He nods, understanding. You hug—brief, warm, final. \"Be happy,\" he murmurs. You walk away, lighter. It wasn't the love story you wanted, but it's a complete one, with a proper period at the end.",
                            "choices": {}
                          }
                        }
                      }
                    }
                  },
                  "Ask if you can paint together sometime 🎨🤲": {
                    "episode_4d": {
                      "title": "Brushstroke by Brushstroke 👩‍🎨👨‍🎨",
                      "story": "His eyes flicker with surprise, then cautious interest. \"I'd like that.\" The next Saturday, you share his studio. No heavy talks, just the scrape of brushes and the smell of paint. Slowly, through shared art, you rebuild a bridge. It's not romance—not yet—but it's a connection, stroke by careful stroke.",
                      "choices": {
                        "Invite him to dinner, see where this goes 🍽️✨": {
                          "episode_5g": {
                            "title": "Slow Burn Romance 🕯️❤️",
                            "story": "Dinner becomes weekly. Talking becomes easy. Laughter returns. One evening, he reaches across the table and takes your hand. \"I'm glad you came back,\" he says. The love that returns isn't the fiery youth you left behind—it's deeper, wiser, built on the ruins of what was and the careful construction of what could be.",
                            "choices": {}
                          }
                        },
                        "Keep it purely platonic, cherish the friendship 🤝🌈": {
                          "episode_5h": {
                            "title": "Art and Affection 🖼️💕",
                            "story": "You become artistic partners and close friends. You critique each other's work, share meals, support each other's dreams. He dates someone else; you're genuinely happy for him. What you build is beautiful in its own way—a masterpiece of platonic love, colored with history and respect.",
                            "choices": {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "Head to the Cedar Cafe first for courage ☕🌟": {
        "episode_2b": {
          "title": "Steam and Old Friends ☕👋",
          "story": "The cafe bell jingles. It's all warm wood and the rich smell of espresso. Behind the counter, a familiar face lights up—Morgan, your old best friend, now owning the place. \"Look what the cat dragged in!\" they cheer, pulling you into a hug that smells of cinnamon and coffee beans. Over a perfect cappuccino, they catch you up.",
          "choices": {
            "Ask Morgan for their honest advice 💬🤔": {
              "episode_3c": {
                "title": "Wisdom with Whipped Cream 🧁💖",
                "story": "Morgan leans on the counter, serious. \"Riley built a shell. You left, and he sealed himself in his art. But the guy who loved you is in there.\" They slide a slice of peach pie toward you. \"The question is, do you want to risk chipping the shell? It might be beautiful underneath, or it might just... be hard.\"",
                "choices": {
                  "Decide to write Riley a note 📝✨": {
                    "episode_4e": {
                      "title": "A Paper Bridge 📄🌉",
                      "story": "Your words are simple: \"The light on the river is just as I remembered. I'm at the gazebo until sunset. No expectations.\" You slip it under his studio door, heart hammering. The gazebo is bathed in golden hour glow. You wait, the minutes stretching.",
                      "choices": {
                        "Wait patiently, trust the process ⏳❤️": {
                          "episode_5i": {
                            "title": "Sunset Promise 🌇🤝",
                            "story": "Just as the sun dips, you see him walking from the direction of the river. He meets your eyes and breaks into a jog. \"I went to the river first,\" he says breathlessly. \"To see the light you mentioned.\" He reaches for your hand. No grand speeches, just linked hands and a silent walk back into town.",
                            "choices": {}
                          }
                        },
                        "Panic and ask Morgan to walk you home 🏡😰": {
                          "episode_5j": {
                            "title": "The Safety of Friendship 👭🍂",
                            "story": "The anticipation is too much. Old fears rise. \"I can't,\" you whisper to Morgan. They nod, looping their arm through yours. You watch from your window as Riley arrives at the empty gazebo, looks around, and sits alone. Your heart breaks, but it's a quiet, familiar break.",
                            "choices": {}
                          }
                        }
                      }
                    }
                  },
                  "Ask Morgan if they need a new barista 👩‍💼☕": {
                    "episode_4f": {
                      "title": "A Different Kind of Warmth 🔥💕",
                      "story": "\"Actually, I do!\" Morgan grins. You spend the week learning the espresso machine, laughing with customers. Riley comes in once, watches from a corner, but doesn't approach. You share a nod, a silent truce. The love you find is in the steady friendship and community.",
                      "choices": {
                        "Commit to this new life, find peace here 🏡✨": {
                          "episode_5k": {
                            "title": "Roots in Friendly Soil 🌱🏠",
                            "story": "Months pass. You become a fixture at the cafe, a beloved part of the town. You see Riley around. You wave. He waves back. The sharp edges soften into mutual respect. Your life is full of love—just not the romantic kind you expected. It's a different, complete picture.",
                            "choices": {}
                          }
                        },
                        "Use this stability to slowly reconnect with Riley 🔄❤️": {
                          "episode_5l": {
                            "title": "Slow Brew Romance ☕❤️",
                            "story": "From your secure base at the cafe, you start leaving small gifts at his studio—a fresh coffee, a new brush. He begins returning them—a sketch of you behind the counter, a single wildflower. It's a slow, gentle courtship, brewed over months, steeped in patience and newfound stability.",
                            "choices": {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "Change the subject, enjoy Morgan's company 😊🎶": {
              "episode_3d": {
                "title": "Comfort in the Familiar 🥧🎵",
                "story": "You shake your head. \"No more heavy stuff tonight.\" Morgan laughs and puts on an old vinyl record. You talk about silly memories, their new bakery supplier, everything but Riley. The night deepens, filled with warmth and laughter. This is a love story too—the rekindling of a deep, platonic bond.",
                "choices": {
                  "Accept Morgan's offer to stay in their spare room 🛋️✨": {
                    "episode_4g": {
                      "title": "Platonic Paradise 🏠💖",
                      "story": "Their spare room becomes your sanctuary. You help at the cafe, become \"auntie\" to Morgan's kids. Riley becomes a distant figure in your new life. What you build with Morgan is solid, joyful, and enough. It's a different happy ending—one built on friendship's unwavering foundation.",
                      "choices": {
                        "Build a life here, find joy in simplicity 🌼🌈": {
                          "episode_5m": {
                            "title": "The Friendship Ever After 👭🌟",
                            "story": "Years later, you and Morgan run the cafe together. You've created a home, a family of choice. Riley married someone else; you're genuinely happy for him. Your love story wasn't with him—it was with this town, this friend, this life you built from the pieces. And it's beautiful.",
                            "choices": {}
                          }
                        },
                        "Realize you're hiding, go face Riley finally 🎭➡️❤️": {
                          "episode_5n": {
                            "title": "Better Late Than Never ⏰❤️",
                            "story": "After months of hiding in comfort, you realize you're still scared. You march to Riley's studio. \"I've been a coward,\" you blurt out. He looks up from his canvas, smiles softly. \"Took you long enough.\" It's messy and imperfect, but it's real. The friendship gave you the courage for the romance.",
                            "choices": {}
                          }
                        }
                      }
                    }
                  },
                  "Take a long walk by the river alone 🌙🏞️": {
                    "episode_4h": {
                      "title": "Moonlit Clarity 🌕💧",
                      "story": "The moon paints a silver path on the water. The cool air clears your head. You realize you came back not just for Riley, but for the person you were here—softer, more connected. You can be that person again, with or without him. You pick up a smooth stone—a token for your new beginning.",
                      "choices": {
                        "Stay in Maple Creek, live for yourself first 🌳💪": {
                          "episode_5o": {
                            "title": "Self-Love Symphony 🎶❤️",
                            "story": "You rent a small cottage. You paint, you walk, you breathe. Riley becomes a occasional pleasant presence, not the center of your universe. You fall in love with your own company, with the town's rhythm, with the person you're becoming. The greatest romance of your life turns out to be the one with yourself.",
                            "choices": {}
                          }
                        },
                        "Find Riley, propose starting fresh as friends ➡️👫": {
                          "episode_5p": {
                            "title": "Friendship First Foundation 🤝❤️",
                            "story": "You find him painting by the river. \"Can we try being friends?\" you ask. \"No past, no pressure.\" He considers, then nods. You start with coffee, then hikes, then helping each other with projects. The friendship grows strong—and one day, looking at him laugh, you realize it's grown into something more, organically.",
                            "choices": {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const storyData2 = {
  "episode_1": {
    "title": "Whispers in the Hallway 👁️",
    "story": "A cold draft slithers across the warped wooden floor as the two investigators—Maeve and Corin—push open the door of the abandoned manor. Shadows cling to the peeling wallpaper, shifting as though alive. Somewhere above them, a faint thud echoes, followed by a whisper that seems to slide beneath their skin. The air reeks of dust and something older, something watchful. Maeve’s breath trembles as she raises her lantern, illuminating claw-like scratches along the staircase banister. Corin steps forward, jaw tight, sensing the house waiting for them to move. The silence feels predatory, thick with secrets.",
    "choices": {
      "Investigate the upstairs hallway": {
        "episode_2": {
          "title": "The Lantern’s Flicker 🕯️",
          "story": "As Maeve and Corin ascend the crooked staircase, the lantern’s flame sputters as though resisting the climb. The upstairs corridor stretches unnaturally long, lined with doors that seem too narrow, too tall. A rhythmic tapping emerges behind the walls—soft, deliberate, following their steps. Maeve swallows hard, noticing a draft curling from beneath the third door on the left. Corin kneels beside a collapsed picture frame, brushing away dust to reveal the portrait of a family with hollowed-out faces, their eyes scratched away. A sudden creak echoes behind them, as though the house just took a step closer.",
          "choices": {
            "Open the door with the cold draft": {
              "episode_3": {
                "title": "The Room That Breaths 🌫️",
                "story": "The door groans as it opens, revealing a small room pulsing with an unsettling warmth. The wallpaper curls like peeling skin, and a low hum vibrates through the floorboards. In the center of the room stands an antique mirror draped in a dusty cloth. Something shifts beneath the fabric—something slow, deliberate. Maeve forces herself forward, reaching for the cloth, while Corin eyes the ceiling where the boards bend inward, as though something heavy lurks above. A soft, trembling breath fills the room, but it isn’t theirs.",
                "choices": {
                  "Pull the cloth from the mirror": {
                    "episode_4": {
                      "title": "Reflection of the Dead 🪞",
                      "story": "Maeve yanks the cloth away, revealing a mirror clouded with age. Their reflections appear distorted—jawlines stretching, eyes sinking into shadow. Corin steps closer, and the mirror’s surface ripples like disturbed water. A pale hand presses outward from within the glass, fingers dragging down as though trying to escape. The room trembles; the ceiling cracks. Maeve feels the presence behind her, cold and hungry. The last thing she hears is her own heartbeat thundering as the mirror pulls their reflections—and their bodies—into its ravenous dark.",
                      "choices": {}
                    }
                  },
                  "Step back and leave the room immediately": {
                    "episode_4": {
                      "title": "Reflection of the Dead 🪞",
                      "story": "Maeve yanks the cloth away, revealing a mirror clouded with age. Their reflections appear distorted—jawlines stretching, eyes sinking into shadow. Corin steps closer, and the mirror’s surface ripples like disturbed water. A pale hand presses outward from within the glass, fingers dragging down as though trying to escape. The room trembles; the ceiling cracks. Maeve feels the presence behind her, cold and hungry. The last thing she hears is her own heartbeat thundering as the mirror pulls their reflections—and their bodies—into its ravenous dark.",
                      "choices": {}
                    }
                  }
                }
              }
            },
            "Inspect the scratched-out family portrait": {
              "episode_3": {
                "title": "The Room That Breaths 🌫️",
                "story": "The door groans as it opens, revealing a small room pulsing with an unsettling warmth. The wallpaper curls like peeling skin, and a low hum vibrates through the floorboards. In the center of the room stands an antique mirror draped in a dusty cloth. Something shifts beneath the fabric—something slow, deliberate. Maeve forces herself forward, reaching for the cloth, while Corin eyes the ceiling where the boards bend inward, as though something heavy lurks above. A soft, trembling breath fills the room, but it isn’t theirs.",
                "choices": {
                  "Pull the cloth from the mirror": {
                    "episode_4": {
                      "title": "Reflection of the Dead 🪞",
                      "story": "Maeve yanks the cloth away, revealing a mirror clouded with age. Their reflections appear distorted—jawlines stretching, eyes sinking into shadow. Corin steps closer, and the mirror’s surface ripples like disturbed water. A pale hand presses outward from within the glass, fingers dragging down as though trying to escape. The room trembles; the ceiling cracks. Maeve feels the presence behind her, cold and hungry. The last thing she hears is her own heartbeat thundering as the mirror pulls their reflections—and their bodies—into its ravenous dark.",
                      "choices": {}
                    }
                  },
                  "Step back and leave the room immediately": {
                    "episode_4": {
                      "title": "Reflection of the Dead 🪞",
                      "story": "Maeve yanks the cloth away, revealing a mirror clouded with age. Their reflections appear distorted—jawlines stretching, eyes sinking into shadow. Corin steps closer, and the mirror’s surface ripples like disturbed water. A pale hand presses outward from within the glass, fingers dragging down as though trying to escape. The room trembles; the ceiling cracks. Maeve feels the presence behind her, cold and hungry. The last thing she hears is her own heartbeat thundering as the mirror pulls their reflections—and their bodies—into its ravenous dark.",
                      "choices": {}
                    }
                  }
                }
              }
            }
          }
        }
      },
      "Search the ground floor before going upstairs": {
        "episode_2": {
          "title": "The Lantern’s Flicker 🕯️",
          "story": "As Maeve and Corin ascend the crooked staircase, the lantern’s flame sputters as though resisting the climb. The upstairs corridor stretches unnaturally long, lined with doors that seem too narrow, too tall. A rhythmic tapping emerges behind the walls—soft, deliberate, following their steps. Maeve swallows hard, noticing a draft curling from beneath the third door on the left. Corin kneels beside a collapsed picture frame, brushing away dust to reveal the portrait of a family with hollowed-out faces, their eyes scratched away. A sudden creak echoes behind them, as though the house just took a step closer.",
          "choices": {
            "Open the door with the cold draft": {
              "episode_3": {
                "title": "The Room That Breaths 🌫️",
                "story": "The door groans as it opens, revealing a small room pulsing with an unsettling warmth. The wallpaper curls like peeling skin, and a low hum vibrates through the floorboards. In the center of the room stands an antique mirror draped in a dusty cloth. Something shifts beneath the fabric—something slow, deliberate. Maeve forces herself forward, reaching for the cloth, while Corin eyes the ceiling where the boards bend inward, as though something heavy lurks above. A soft, trembling breath fills the room, but it isn’t theirs.",
                "choices": {
                  "Pull the cloth from the mirror": {
                    "episode_4": {
                      "title": "Reflection of the Dead 🪞",
                      "story": "Maeve yanks the cloth away, revealing a mirror clouded with age. Their reflections appear distorted—jawlines stretching, eyes sinking into shadow. Corin steps closer, and the mirror’s surface ripples like disturbed water. A pale hand presses outward from within the glass, fingers dragging down as though trying to escape. The room trembles; the ceiling cracks. Maeve feels the presence behind her, cold and hungry. The last thing she hears is her own heartbeat thundering as the mirror pulls their reflections—and their bodies—into its ravenous dark.",
                      "choices": {}
                    }
                  },
                  "Step back and leave the room immediately": {
                    "episode_4": {
                      "title": "Reflection of the Dead 🪞",
                      "story": "Maeve yanks the cloth away, revealing a mirror clouded with age. Their reflections appear distorted—jawlines stretching, eyes sinking into shadow. Corin steps closer, and the mirror’s surface ripples like disturbed water. A pale hand presses outward from within the glass, fingers dragging down as though trying to escape. The room trembles; the ceiling cracks. Maeve feels the presence behind her, cold and hungry. The last thing she hears is her own heartbeat thundering as the mirror pulls their reflections—and their bodies—into its ravenous dark.",
                      "choices": {}
                    }
                  }
                }
              }
            },
            "Inspect the scratched-out family portrait": {
              "episode_3": {
                "title": "The Room That Breaths 🌫️",
                "story": "The door groans as it opens, revealing a small room pulsing with an unsettling warmth. The wallpaper curls like peeling skin, and a low hum vibrates through the floorboards. In the center of the room stands an antique mirror draped in a dusty cloth. Something shifts beneath the fabric—something slow, deliberate. Maeve forces herself forward, reaching for the cloth, while Corin eyes the ceiling where the boards bend inward, as though something heavy lurks above. A soft, trembling breath fills the room, but it isn’t theirs.",
                "choices": {
                  "Pull the cloth from the mirror": {
                    "episode_4": {
                      "title": "Reflection of the Dead 🪞",
                      "story": "Maeve yanks the cloth away, revealing a mirror clouded with age. Their reflections appear distorted—jawlines stretching, eyes sinking into shadow. Corin steps closer, and the mirror’s surface ripples like disturbed water. A pale hand presses outward from within the glass, fingers dragging down as though trying to escape. The room trembles; the ceiling cracks. Maeve feels the presence behind her, cold and hungry. The last thing she hears is her own heartbeat thundering as the mirror pulls their reflections—and their bodies—into its ravenous dark.",
                      "choices": {}
                    }
                  },
                  "Step back and leave the room immediately": {
                    "episode_4": {
                      "title": "Reflection of the Dead 🪞",
                      "story": "Maeve yanks the cloth away, revealing a mirror clouded with age. Their reflections appear distorted—jawlines stretching, eyes sinking into shadow. Corin steps closer, and the mirror’s surface ripples like disturbed water. A pale hand presses outward from within the glass, fingers dragging down as though trying to escape. The room trembles; the ceiling cracks. Maeve feels the presence behind her, cold and hungry. The last thing she hears is her own heartbeat thundering as the mirror pulls their reflections—and their bodies—into its ravenous dark.",
                      "choices": {}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const storyData3 = {
  "episode_1": {
    "title": "The Arrival 🌴✈️",
    "story": "The seaplane's engine sputtered as you descended toward the emerald jewel of Isla Perdida. Four of you had won this 'adventure of a lifetime': you, the natural leader; Leo, the impulsive jokester; Maya, the quiet science whiz; and Kai, the athletic survivalist. The island unfolded below—waterfalls cascading into turquoise lagoons, dense jungle concealing ancient stone formations. But as the wheels touched water, a jagged coral reef ripped through the hull. The plane listed violently. 'Brace!' Kai shouted. You grabbed your waterproof bag as saltwater surged into the cabin. The pilot was unconscious. Four sets of wide, terrified eyes met. The paradise outside now felt like a gilded cage. You had to move fast—the plane was sinking.",
    "choices": {
      "Check on the pilot first 👨‍✈️": {
        "episode_2a": {
          "title": "The Weight of Duty ⚖️🩹",
          "story": "You fought against the rising water to reach the cockpit. The pilot, Captain Rios, had a deep gash on his forehead but was breathing. 'Leave me... radio in the compartment,' he rasped. Leo helped you drag him from his seat as Maya retrieved the emergency radio—crackling with static. 'We need to get him to shore NOW!' Kai yelled, shoving the door open. The four of you floated Captain Rios on a seat cushion, kicking toward the white sand beach. The plane groaned and vanished beneath the waves behind you. Onshore, Maya applied pressure to the wound while you tried the radio. Only faint, distorted signals replied. The sun began its swift tropical descent. A distant, unnatural shriek echoed from the jungle's heart. The group looked to you. The pilot's survival was your responsibility, but that sound promised other, more immediate dangers.",
          "choices": {
            "Stay with the pilot and guard the beach 🏖️": {
              "episode_4a": {
                "title": "Eternal Sentinel 🕯️🌅",
                "story": "You decided the group's humanity was its greatest strength. 'We don't abandon our own,' you declared. You built a lean-to for Captain Rios and a large signal fire. The night was alive with strange sounds and glowing eyes at the tree line, but your fire kept them at bay. At dawn, a fishing boat spotted your smoke. Rescue arrived, and Captain Rios survived thanks to your care. The mystery of Isla Perdida remained unsolved, but your bond was forged in compassion. Back home, you four were inseparable, forever changed by the night you chose to stand guard over a flickering light in the vast, dark sea. Sometimes, the greatest adventure is the one where you choose to stay. 🔥👫🏝️",
                "choices": {}
              }
            },
            "Send a pair to scout the source of the noise 🔍": {
              "episode_4b": {
                "title": "Divided We Fall 😨🌺",
                "story": "'Kai and Leo, scout ahead. Be back before full dark,' you ordered. They vanished into the vibrant foliage. Hours crept by. The radio suddenly emitted a clear, automated message: '... volcanic activity... island unstable... evacuate...' Then, a blood-curdling scream tore through the jungle, followed by utter silence. Maya's face went pale. Captain Rios murmured, 'The island... it takes.' You grabbed a torch, but it was too late. A deep rumble shook the ground. The beautiful beach cracked and began to sink into a newly formed lagoon. Your last sight was the glittering water rising to meet you, the island's secret buried once more, along with your friends and your chance to leave. The paradise was a predator all along. 💀🏝️⚰️",
                "choices": {}
              }
            }
          }
        }
      },
      "Grab supplies and evacuate immediately 🎒🚪": {
        "episode_2b": {
          "title": "First Priorities ⚡🍍",
          "story": "'Supplies first! Go!' you commanded. You snatched the emergency kit, a water canister, and a machete. Leo grabbed a flare gun, Maya a first-aid kit, and Kai the waterproof bag of rations. You tumbled out into the warm sea just as the plane's tail vanished. Swimming frantically, you reached a crescent beach of powdered coral sand. The group collapsed, panting. A quick inventory: limited water, some protein bars, a single flare. Survival mode activated. Kai pointed to a trail leading inland. 'Fresh water source likely that way.' But Maya gestured to a plume of smoke rising from the far side of the island. 'Sign of habitation?' Hope and peril intertwined. The group's energy was high, but resources were low. Where would you stake your survival?",
          "choices": {
            "Follow the trail inland to find fresh water 💧🌿": {
              "episode_4c": {
                "title": "Heart of the Island 💚🌀",
                "story": "You chose the ancient trail. It wound through cathedral-like trees hung with bioluminescent vines that glowed as twilight fell. You found a crystal-clear spring flowing from a mossy idol—a serene, powerful place. As you drank, the vines pulsed in rhythm. Images flooded your mind: the island's memory—ancient guardians, a catastrophic event that sealed a great energy within the stone formations. You weren't stranded; you were chosen. The island healed your minor cuts and filled you with calm certainty. You returned to the beach with a new mission. Using the island's subtle guidance, you signaled a passing research vessel days later. You four became the island's modern protectors, its secret keepers, forever linked to its vibrant, living heart. 🧠🗿🌌",
                "choices": {}
              }
            },
            "Head toward the column of smoke 🔥🏃‍♀️": {
              "episode_4d": {
                "title": "False Sanctuary 😈🏚️",
                "story": "The smoke led to a derelict research station, not rescue. Faded logos warned 'QUARANTINE.' Inside, journals told a chilling story: a pathogen that altered behavior, making hosts violently territorial. As you read, Leo touched a strange, iridescent fungus growing on the wall. He jerked back. 'It's... warm.' Within minutes, paranoia set in. 'You're looking at me funny!' he accused Kai. A fight erupted. In the chaos, the flare gun discharged, igniting the old fuel stores. The explosion was swift and catastrophic. The last of the station's secrets—and your chance of survival—were consumed in a fireball visible for miles, a warning to any who would seek easy answers on Isla Perdida. Your adventure ended in a blaze of fear and mistrust. 💥🤯🔥",
                "choices": {}
              }
            }
          }
        }
      }
    }
  }
}


  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 overflow-x-hidden transition-width duration-500 pt-16 z-50 ${
          isOpen ? "w-50" : "w-0"
        }`}
        style={{ paddingTop: "60px" }}
      >
        <button
          onClick={closeNav}
          className="absolute top-0 right-6 text-white text-4xl font-bold focus:outline-none"
          aria-label="Close sidebar"
        >
          &times;
        </button>
        <nav
          className={`flex flex-col space-y-4 pl-8 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <a
            href="#"
            className="text-gray-400 text-[20px] hover:text-gray-100 transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="text-gray-400 text-2xl hover:text-gray-100 transition-colors"
          >
            Services
          </a>
          <a
            href="#"
            className="text-gray-400 text-2xl hover:text-gray-100 transition-colors"
          >
            Clients
          </a>
          <a
            href="#"
            className="text-gray-400 text-2xl hover:text-gray-100 transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`relative transition-margin duration-500 p-4 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        <button
          onClick={openNav}
          className="text-white sticky top-5 bg-gray-900 px-3 py-1.5 text-lg rounded hover:bg-gray-700 focus:outline-none"
          aria-label="Open sidebar"
        >
          &#9776;
        </button>
        <PromptSpace />
        <Episodes storyData={storyData1}/>
      </div>
    </>
  );
};

export default Home;
