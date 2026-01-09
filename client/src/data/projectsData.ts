export interface ProjectData {
  id: string;
  title: string;
  description: string;
  services: string[];
  launchUrl: string;
  backgroundColor: string;
  textColor: string;
  media: Array<{
    type: "image" | "video";
    url: string;
    aspectRatio: number;
  }>;
  nextProject: {
    id: string;
    title: string;
    backgroundColor: string;
    textColor: string;
  };
}

export const projectsData: Record<string, ProjectData> = {
  devin_ai: {
    id: "devin_ai",
    title: "Devin AI",
    description:
      "We worked with Cognition AI to create a website for their AI-powered platform Devin AI. The website needed to be sleek and modern, with a focus on showcasing the platform's features and benefits.",
    services: ["Concept", "Web Design", "Web Development", "3D Design", "WebGL"],
    launchUrl: "https://devin.ai/",
    backgroundColor: "#121414",
    textColor: "#ffffff",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1000", aspectRatio: 1 },
      { type: "image", url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1400", aspectRatio: 16 / 9 },
    ],
    nextProject: {
      id: "porsche_dream_machine",
      title: "Porsche:\nDream Machine",
      backgroundColor: "#EFD5D3",
      textColor: "#000000",
    },
  },

  porsche_dream_machine: {
    id: "porsche_dream_machine",
    title: "Porsche: Dream Machine",
    description:
      "An immersive 3D experience showcasing Porsche's design philosophy and engineering excellence through cutting-edge web technologies.",
    services: ["Concept", "3D Illustration", "Motion Graphics", "Video Production"],
    launchUrl: "#",
    backgroundColor: "#EFD5D3",
    textColor: "#000000",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1400", aspectRatio: 16 / 9 },
    ],
    nextProject: {
      id: "synthetic_human",
      title: "Synthetic\nHuman",
      backgroundColor: "#121414",
      textColor: "#ffffff",
    },
  },

  synthetic_human: {
    id: "synthetic_human",
    title: "Synthetic Human",
    description:
      "A groundbreaking exploration of AI-generated human avatars and their applications in modern digital experiences.",
    services: ["Web Design", "Web Development", "3D Design", "AI Integration"],
    launchUrl: "#",
    backgroundColor: "#121414",
    textColor: "#ffffff",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=1400", aspectRatio: 16 / 9 },
    ],
    nextProject: {
      id: "ddd_2024",
      title: "DDD\n2024",
      backgroundColor: "#1a1a2e",
      textColor: "#ffffff",
    },
  },

  ddd_2024: {
    id: "ddd_2024",
    title: "DDD 2024",
    description:
      "A digital design conference experience that brings together creativity and technology in an immersive online environment.",
    services: ["Web Design", "Web Development", "3D Design", "Event Platform"],
    launchUrl: "#",
    backgroundColor: "#1a1a2e",
    textColor: "#ffffff",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000", aspectRatio: 1 },
    ],
    nextProject: {
      id: "spaace",
      title: "Spaace\nNFT Marketplace",
      backgroundColor: "#0a0e27",
      textColor: "#ffffff",
    },
  },

  spaace: {
    id: "spaace",
    title: "Spaace - NFT Marketplace",
    description:
      "A next-generation NFT marketplace built with Web3 technologies, offering seamless minting, trading, and discovery of digital assets.",
    services: ["Web Design", "Web Development", "3D Design", "Web3", "Smart Contracts"],
    launchUrl: "#",
    backgroundColor: "#0a0e27",
    textColor: "#ffffff",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1400", aspectRatio: 16 / 9 },
    ],
    nextProject: {
      id: "choo_choo_world",
      title: "Choo Choo\nWorld",
      backgroundColor: "#ffe5d9",
      textColor: "#000000",
    },
  },

  choo_choo_world: {
    id: "choo_choo_world",
    title: "Choo Choo World",
    description:
      "An interactive game experience that combines playful design with engaging gameplay mechanics in a vibrant 3D world.",
    services: ["Concept", "Web Design", "Game Design", "3D Design"],
    launchUrl: "#",
    backgroundColor: "#ffe5d9",
    textColor: "#000000",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1400", aspectRatio: 16 / 9 },
    ],
    nextProject: {
      id: "zero_tech",
      title: "Zero\nTech",
      backgroundColor: "#0d1117",
      textColor: "#ffffff",
    },
  },

  zero_tech: {
    id: "zero_tech",
    title: "Zero Tech",
    description:
      "A cutting-edge technology platform focused on zero-carbon solutions and sustainable innovation for the future.",
    services: ["Web Design", "Web Development", "3D Design", "Motion Graphics"],
    launchUrl: "#",
    backgroundColor: "#0d1117",
    textColor: "#ffffff",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1000", aspectRatio: 1 },
    ],
    nextProject: {
      id: "spatial_fusion",
      title: "Meta:\nSpatial Fusion",
      backgroundColor: "#1c1c1e",
      textColor: "#ffffff",
    },
  },

  spatial_fusion: {
    id: "spatial_fusion",
    title: "Meta: Spatial Fusion",
    description:
      "An innovative spatial computing experience that merges physical and digital realities through advanced AR/VR technologies.",
    services: ["Web Design", "Web Development", "3D Design", "AR/VR"],
    launchUrl: "#",
    backgroundColor: "#1c1c1e",
    textColor: "#ffffff",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1400", aspectRatio: 16 / 9 },
    ],
    nextProject: {
      id: "worldcoin",
      title: "Worldcoin\nGlobe",
      backgroundColor: "#000000",
      textColor: "#ffffff",
    },
  },

  worldcoin: {
    id: "worldcoin",
    title: "Worldcoin Globe",
    description:
      "An interactive 3D globe visualization showcasing the global reach and adoption of Worldcoin's blockchain technology.",
    services: ["API Design", "WebGL", "3D Design", "Data Visualization"],
    launchUrl: "#",
    backgroundColor: "#000000",
    textColor: "#ffffff",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000", aspectRatio: 1 },
    ],
    nextProject: {
      id: "lusion_labs",
      title: "Lusion\nLabs",
      backgroundColor: "#0f0f0f",
      textColor: "#ffffff",
    },
  },

  lusion_labs: {
    id: "lusion_labs",
    title: "Lusion Labs",
    description:
      "Our experimental laboratory for pushing the boundaries of web technology and creating innovative digital experiences.",
    services: ["Web Design", "Web Development", "3D Design", "R&D"],
    launchUrl: "#",
    backgroundColor: "#0f0f0f",
    textColor: "#ffffff",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400", aspectRatio: 16 / 9 },
    ],
    nextProject: {
      id: "my_little_story_book",
      title: "My Little\nStorybook",
      backgroundColor: "#fff5e6",
      textColor: "#000000",
    },
  },

  my_little_story_book: {
    id: "my_little_story_book",
    title: "My Little Storybook",
    description:
      "An enchanting digital storytelling platform that brings children's stories to life through interactive 3D illustrations.",
    services: ["Concept", "Design", "Development", "3D Design", "Animation"],
    launchUrl: "#",
    backgroundColor: "#fff5e6",
    textColor: "#000000",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000", aspectRatio: 1 },
    ],
    nextProject: {
      id: "soda_experience",
      title: "Soda\nExperience",
      backgroundColor: "#ff6b6b",
      textColor: "#ffffff",
    },
  },

  soda_experience: {
    id: "soda_experience",
    title: "Soda Experience",
    description:
      "An augmented reality experience that transforms everyday moments into extraordinary interactive adventures.",
    services: ["AR Development", "3D Design", "Mobile App", "UX Design"],
    launchUrl: "#",
    backgroundColor: "#ff6b6b",
    textColor: "#ffffff",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1622495805609-f6c49cf4bfbc?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1400", aspectRatio: 16 / 9 },
    ],
    nextProject: {
      id: "infinite_passerella",
      title: "Infinite\nPasserella",
      backgroundColor: "#2d2d2d",
      textColor: "#ffffff",
    },
  },

  infinite_passerella: {
    id: "infinite_passerella",
    title: "Infinite Passerella",
    description:
      "A virtual fashion runway experience that reimagines how haute couture is presented in the digital age.",
    services: ["Concept", "Design", "Development", "3D Design", "Fashion Tech"],
    launchUrl: "#",
    backgroundColor: "#2d2d2d",
    textColor: "#ffffff",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1445510491599-30f90ac4e064?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000", aspectRatio: 1 },
    ],
    nextProject: {
      id: "the_turn_of_the_screw",
      title: "The Turn of\nThe Screw",
      backgroundColor: "#1a1818",
      textColor: "#ffffff",
    },
  },

  the_turn_of_the_screw: {
    id: "the_turn_of_the_screw",
    title: "The Turn Of The Screw",
    description:
      "An immersive digital adaptation of the classic gothic horror tale, brought to life through innovative web technologies.",
    services: ["Design", "Development", "3D Design", "Interactive Storytelling"],
    launchUrl: "#",
    backgroundColor: "#1a1818",
    textColor: "#ffffff",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1400", aspectRatio: 16 / 9 },
    ],
    nextProject: {
      id: "maxmara_bearings_gifts",
      title: "Max Mara:\nBearing Gifts",
      backgroundColor: "#e8d5c4",
      textColor: "#000000",
    },
  },

  maxmara_bearings_gifts: {
    id: "maxmara_bearings_gifts",
    title: "Max Mara: Bearing Gifts",
    description:
      "A luxurious digital experience showcasing Max Mara's latest collection through stunning 3D visuals and elegant interactions.",
    services: ["Development", "3D Design", "Luxury Branding", "WebGL"],
    launchUrl: "#",
    backgroundColor: "#e8d5c4",
    textColor: "#000000",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400", aspectRatio: 16 / 9 },
      { type: "image", url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000", aspectRatio: 1 },
    ],
    nextProject: {
      id: "devin_ai",
      title: "Devin\nAI",
      backgroundColor: "#121414",
      textColor: "#ffffff",
    },
  },
};