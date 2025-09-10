import { PrismaClient, TestCategoryType, Difficulty, QuestionType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Sample admin user
const ADMIN_USER = {
  email: 'admin@example.com',
  name: 'Test Administrator',
  role: 'ADMIN' as const,
  password: 'admin123',
};

// Test categories data
const testCategories = [
  {
    name: 'English Language',
    description: 'English language proficiency tests following CEFR standards',
    type: TestCategoryType.LANGUAGE,
  },
  {
    name: 'Spanish Language',
    description: 'Spanish language proficiency tests following CEFR standards',
    type: TestCategoryType.LANGUAGE,
  },
  {
    name: 'French Language',
    description: 'French language proficiency tests following CEFR standards',
    type: TestCategoryType.LANGUAGE,
  },
  {
    name: 'German Language',
    description: 'German language proficiency tests following CEFR standards',
    type: TestCategoryType.LANGUAGE,
  },
  {
    name: 'Chinese Language',
    description: 'Chinese (Mandarin) language proficiency tests',
    type: TestCategoryType.LANGUAGE,
  },
  {
    name: 'Adobe Creative Suite',
    description: 'Professional certification tests for Adobe products',
    type: TestCategoryType.PROFESSIONAL,
  },
  {
    name: 'Digital Marketing',
    description: 'Professional certification for digital marketing skills',
    type: TestCategoryType.PROFESSIONAL,
  },
  {
    name: 'Business Management',
    description: 'Professional skills in sales, customer service, and management',
    type: TestCategoryType.PROFESSIONAL,
  },
  {
    name: 'Computer Skills',
    description: 'Basic to advanced computer and IT skills certification',
    type: TestCategoryType.TECHNICAL,
  },
  {
    name: 'Programming',
    description: 'Programming fundamentals and software development skills',
    type: TestCategoryType.TECHNICAL,
  },
  {
    name: 'Mathematics',
    description: 'Academic mathematics assessments',
    type: TestCategoryType.ACADEMIC,
  },
  {
    name: 'Science',
    description: 'General science and specific science subject assessments',
    type: TestCategoryType.ACADEMIC,
  },
];

// English language test questions by CEFR level
const englishA1Questions = [
  {
    question: "What is the correct form of 'to be' for 'I'?",
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'am',
    explanation: "'I am' is the correct form of the verb 'to be' with the pronoun 'I'.",
    points: 1,
  },
  {
    question: "Which word means the opposite of 'big'?",
    options: ['large', 'huge', 'small', 'tall'],
    correctAnswer: 'small',
    explanation: "'Small' is the antonym of 'big'.",
    points: 1,
  },
  {
    question: "How do you say 'hello' in a formal way?",
    options: ['Hi', 'Hey', 'Good morning', 'Yo'],
    correctAnswer: 'Good morning',
    explanation: "'Good morning' is a formal greeting.",
    points: 1,
  },
  {
    question: "What do you use to write?",
    options: ['spoon', 'pen', 'cup', 'plate'],
    correctAnswer: 'pen',
    explanation: "A pen is used for writing.",
    points: 1,
  },
  {
    question: "Complete: 'My name ___ John.'",
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'is',
    explanation: "'My name is John' uses the third person singular form of 'to be'.",
    points: 1,
  },
  {
    question: "Which is a color?",
    options: ['dog', 'red', 'book', 'table'],
    correctAnswer: 'red',
    explanation: "Red is a color.",
    points: 1,
  },
  {
    question: "How many days are in a week?",
    options: ['five', 'six', 'seven', 'eight'],
    correctAnswer: 'seven',
    explanation: "There are seven days in a week.",
    points: 1,
  },
  {
    question: "What is the plural of 'cat'?",
    options: ['cat', 'cats', 'cates', 'catss'],
    correctAnswer: 'cats',
    explanation: "The plural of 'cat' is 'cats'.",
    points: 1,
  },
  {
    question: "Which meal do you eat in the morning?",
    options: ['lunch', 'dinner', 'breakfast', 'snack'],
    correctAnswer: 'breakfast',
    explanation: "Breakfast is the meal eaten in the morning.",
    points: 1,
  },
  {
    question: "Complete: 'I ___ a student.'",
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'am',
    explanation: "'I am a student' is correct.",
    points: 1,
  },
  {
    question: "What do you wear on your feet?",
    options: ['hat', 'gloves', 'shoes', 'shirt'],
    correctAnswer: 'shoes',
    explanation: "Shoes are worn on feet.",
    points: 1,
  },
  {
    question: "Which number comes after five?",
    options: ['four', 'six', 'three', 'seven'],
    correctAnswer: 'six',
    explanation: "Six comes after five.",
    points: 1,
  },
  {
    question: "What is the past tense of 'go'?",
    options: ['go', 'goes', 'went', 'gone'],
    correctAnswer: 'went',
    explanation: "'Went' is the past tense of 'go'.",
    points: 1,
  },
  {
    question: "Which article goes before 'apple'?",
    options: ['a', 'an', 'the', 'none'],
    correctAnswer: 'an',
    explanation: "'An' is used before vowel sounds.",
    points: 1,
  },
  {
    question: "What do you drink when you're thirsty?",
    options: ['food', 'water', 'book', 'music'],
    correctAnswer: 'water',
    explanation: "Water is drunk when thirsty.",
    points: 1,
  },
  {
    question: "Complete: 'She ___ happy.'",
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'is',
    explanation: "'She is happy' uses the third person singular form.",
    points: 1,
  },
  {
    question: "Which is a body part?",
    options: ['car', 'hand', 'tree', 'house'],
    correctAnswer: 'hand',
    explanation: "Hand is a body part.",
    points: 1,
  },
  {
    question: "How do you ask for someone's name?",
    options: ['How are you?', 'What is your name?', 'Where are you?', 'How old are you?'],
    correctAnswer: 'What is your name?',
    explanation: "'What is your name?' is used to ask for someone's name.",
    points: 1,
  },
  {
    question: "Which is a family member?",
    options: ['teacher', 'mother', 'doctor', 'student'],
    correctAnswer: 'mother',
    explanation: "Mother is a family member.",
    points: 1,
  },
  {
    question: "What comes after Monday?",
    options: ['Sunday', 'Tuesday', 'Wednesday', 'Friday'],
    correctAnswer: 'Tuesday',
    explanation: "Tuesday comes after Monday.",
    points: 1,
  },
  {
    question: "Complete: 'We ___ friends.'",
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'are',
    explanation: "'We are friends' uses the plural form of 'to be'.",
    points: 1,
  },
  {
    question: "Which is an animal?",
    options: ['car', 'dog', 'book', 'chair'],
    correctAnswer: 'dog',
    explanation: "Dog is an animal.",
    points: 1,
  },
  {
    question: "What do you use to see?",
    options: ['ears', 'nose', 'eyes', 'mouth'],
    correctAnswer: 'eyes',
    explanation: "Eyes are used for seeing.",
    points: 1,
  },
  {
    question: "Which is a place to live?",
    options: ['car', 'house', 'book', 'phone'],
    correctAnswer: 'house',
    explanation: "A house is a place to live.",
    points: 1,
  },
  {
    question: "Complete: 'They ___ students.'",
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'are',
    explanation: "'They are students' uses the plural form of 'to be'.",
    points: 1,
  },
];

const englishB2Questions = [
  {
    question: "Which sentence correctly uses the present perfect tense?",
    options: [
      'I go to London last year',
      'I have been to London',
      'I am going to London',
      'I will go to London'
    ],
    correctAnswer: 'I have been to London',
    explanation: "The present perfect tense uses 'have/has + past participle' to show completed actions with relevance to the present.",
    points: 1,
  },
  {
    question: "Choose the correct conditional sentence:",
    options: [
      'If I would have money, I buy a car',
      'If I have money, I would buy a car',
      'If I had money, I would buy a car',
      'If I have money, I will bought a car'
    ],
    correctAnswer: 'If I had money, I would buy a car',
    explanation: "This is a second conditional (hypothetical situation) using 'if + past simple, would + infinitive'.",
    points: 1,
  },
  {
    question: "What does 'pull someone's leg' mean?",
    options: [
      'to help someone walk',
      'to joke with someone',
      'to trip someone',
      'to massage someone'
    ],
    correctAnswer: 'to joke with someone',
    explanation: "'Pull someone's leg' is an idiom meaning to tease or joke with someone.",
    points: 1,
  },
  {
    question: "Which modal verb expresses obligation?",
    options: ['might', 'could', 'must', 'would'],
    correctAnswer: 'must',
    explanation: "'Must' expresses strong obligation or necessity.",
    points: 1,
  },
  {
    question: "Choose the correct passive voice:",
    options: [
      'The letter was written by John',
      'The letter was writing by John',
      'The letter is wrote by John',
      'The letter has wrote by John'
    ],
    correctAnswer: 'The letter was written by John',
    explanation: "Passive voice uses 'be + past participle'. Here it's 'was written'.",
    points: 1,
  },
  {
    question: "What is the meaning of 'procrastinate'?",
    options: [
      'to finish quickly',
      'to delay doing something',
      'to work efficiently',
      'to plan carefully'
    ],
    correctAnswer: 'to delay doing something',
    explanation: "Procrastinate means to delay or postpone doing something.",
    points: 1,
  },
  {
    question: "Which sentence uses reported speech correctly?",
    options: [
      'He said that he will come tomorrow',
      'He said that he would come tomorrow',
      'He said that he comes tomorrow',
      'He said that he is coming tomorrow'
    ],
    correctAnswer: 'He said that he would come tomorrow',
    explanation: "In reported speech, 'will' changes to 'would' when the reporting verb is in the past.",
    points: 1,
  },
  {
    question: "Choose the correct relative pronoun:",
    options: [
      'The book what I read was interesting',
      'The book which I read was interesting',
      'The book where I read was interesting',
      'The book when I read was interesting'
    ],
    correctAnswer: 'The book which I read was interesting',
    explanation: "'Which' is the correct relative pronoun to refer to things.",
    points: 1,
  },
  {
    question: "What does 'beat around the bush' mean?",
    options: [
      'to hit plants',
      'to avoid talking directly about something',
      'to work in a garden',
      'to make noise'
    ],
    correctAnswer: 'to avoid talking directly about something',
    explanation: "'Beat around the bush' means to avoid speaking directly about a topic.",
    points: 1,
  },
  {
    question: "Which word best completes: 'Despite the rain, they ___ with their picnic.'",
    options: ['went on', 'went up', 'went off', 'went down'],
    correctAnswer: 'went on',
    explanation: "'Went on' means continued, which fits the context of continuing despite difficulties.",
    points: 1,
  },
  {
    question: "Choose the correct form: 'I wish I ___ more time to study.'",
    options: ['have', 'had', 'will have', 'would have'],
    correctAnswer: 'had',
    explanation: "'I wish I had' expresses a desire for something different in the present.",
    points: 1,
  },
  {
    question: "What is the correct preposition: 'She's good ___ mathematics.'",
    options: ['in', 'at', 'on', 'with'],
    correctAnswer: 'at',
    explanation: "'Good at' is the correct collocation for skills or subjects.",
    points: 1,
  },
  {
    question: "Which sentence shows cause and effect correctly?",
    options: [
      'Because of the traffic, so we were late',
      'Because the traffic, we were late',
      'Because of the traffic, we were late',
      'Because the traffic, so we were late'
    ],
    correctAnswer: 'Because of the traffic, we were late',
    explanation: "'Because of' is followed by a noun phrase and doesn't need 'so' in the main clause.",
    points: 1,
  },
  {
    question: "What does 'elaborate' mean as a verb?",
    options: [
      'to make simple',
      'to explain in more detail',
      'to confuse',
      'to summarize'
    ],
    correctAnswer: 'to explain in more detail',
    explanation: "To elaborate means to add more detail or information to something.",
    points: 1,
  },
  {
    question: "Choose the correct quantifier: 'There are ___ people who agree with this idea.'",
    options: ['little', 'few', 'a little', 'a few'],
    correctAnswer: 'few',
    explanation: "'Few' is used with plural countable nouns to mean 'not many'.",
    points: 1,
  },
  {
    question: "Which sentence uses the subjunctive mood correctly?",
    options: [
      'I suggest that he comes early',
      'I suggest that he come early',
      'I suggest that he will come early',
      'I suggest that he is coming early'
    ],
    correctAnswer: 'I suggest that he come early',
    explanation: "After verbs like 'suggest', the subjunctive uses the base form of the verb.",
    points: 1,
  },
  {
    question: "What is the meaning of 'ubiquitous'?",
    options: [
      'rare',
      'present everywhere',
      'expensive',
      'temporary'
    ],
    correctAnswer: 'present everywhere',
    explanation: "Ubiquitous means present, appearing, or found everywhere.",
    points: 1,
  },
  {
    question: "Choose the correct phrasal verb: 'The meeting was ___ until next week.'",
    options: ['put off', 'put on', 'put up', 'put down'],
    correctAnswer: 'put off',
    explanation: "'Put off' means to postpone or delay something.",
    points: 1,
  },
  {
    question: "Which sentence correctly uses inversion?",
    options: [
      'Never I have seen such a beautiful sunset',
      'Never have I seen such a beautiful sunset',
      'Never I had seen such a beautiful sunset',
      'Never did I have seen such a beautiful sunset'
    ],
    correctAnswer: 'Never have I seen such a beautiful sunset',
    explanation: "After negative adverbs like 'never', we use inversion with auxiliary verbs.",
    points: 1,
  },
  {
    question: "What does 'meticulous' mean?",
    options: [
      'careless',
      'very careful and precise',
      'quick',
      'lazy'
    ],
    correctAnswer: 'very careful and precise',
    explanation: "Meticulous means showing great attention to detail; very careful and precise.",
    points: 1,
  },
  {
    question: "Choose the correct form: 'By the time you arrive, I ___ dinner.'",
    options: [
      'will cook',
      'will have cooked',
      'will be cooking',
      'cooked'
    ],
    correctAnswer: 'will have cooked',
    explanation: "Future perfect tense shows an action completed before a future time.",
    points: 1,
  },
  {
    question: "Which collocation is correct?",
    options: [
      'make a decision',
      'do a decision',
      'have a decision',
      'take a decision'
    ],
    correctAnswer: 'make a decision',
    explanation: "The correct collocation is 'make a decision'.",
    points: 1,
  },
  {
    question: "What does 'pervasive' mean?",
    options: [
      'limited',
      'spreading widely throughout',
      'temporary',
      'invisible'
    ],
    correctAnswer: 'spreading widely throughout',
    explanation: "Pervasive means spreading widely throughout an area or group of people.",
    points: 1,
  },
  {
    question: "Choose the correct emphasis structure: '___ was the weather that we cancelled the trip.'",
    options: ['So bad', 'Such bad', 'So badly', 'Such badly'],
    correctAnswer: 'So bad',
    explanation: "'So + adjective + that' is used for emphasis with adjectives.",
    points: 1,
  },
  {
    question: "What is the correct form: 'I'd rather you ___ smoking in the house.'",
    options: ["don't", "didn't", "not", "wouldn't"],
    correctAnswer: "didn't",
    explanation: "'I'd rather + past tense' is used to express preferences about other people's actions.",
    points: 1,
  },
];

// Professional skills questions
const photoshopQuestions = [
  {
    question: "What is the keyboard shortcut to duplicate a layer in Photoshop?",
    options: ['Ctrl+D', 'Ctrl+J', 'Ctrl+C', 'Ctrl+V'],
    correctAnswer: 'Ctrl+J',
    explanation: "Ctrl+J (Cmd+J on Mac) duplicates the selected layer.",
    points: 1,
  },
  {
    question: "Which tool is best for selecting objects with complex edges like hair?",
    options: ['Magic Wand', 'Lasso Tool', 'Refine Edge/Select and Mask', 'Rectangular Marquee'],
    correctAnswer: 'Refine Edge/Select and Mask',
    explanation: "Refine Edge (or Select and Mask in newer versions) is specifically designed for complex selections like hair and fur.",
    points: 1,
  },
  {
    question: "What does RGB stand for in color mode?",
    options: ['Red Green Blue', 'Red Gray Black', 'Really Great Colors', 'Red Gold Bronze'],
    correctAnswer: 'Red Green Blue',
    explanation: "RGB stands for Red, Green, and Blue - the primary colors of light used in digital displays.",
    points: 1,
  },
  {
    question: "Which blend mode is commonly used to lighten an image?",
    options: ['Multiply', 'Screen', 'Overlay', 'Normal'],
    correctAnswer: 'Screen',
    explanation: "Screen blend mode lightens the image by inverting the colors, multiplying them, and inverting again.",
    points: 1,
  },
  {
    question: "What is the recommended resolution for web graphics?",
    options: ['300 DPI', '150 DPI', '72 DPI', '600 DPI'],
    correctAnswer: '72 DPI',
    explanation: "72 DPI (dots per inch) is the standard resolution for web graphics as it provides good quality while keeping file sizes manageable.",
    points: 1,
  },
  // Add more Photoshop questions...
  {
    question: "Which file format preserves layers and transparency?",
    options: ['JPEG', 'PNG', 'PSD', 'GIF'],
    correctAnswer: 'PSD',
    explanation: "PSD (Photoshop Document) is the native format that preserves all layers, effects, and editing information.",
    points: 1,
  },
  {
    question: "What does the Dodge tool do?",
    options: ['Darkens areas', 'Lightens areas', 'Blurs areas', 'Sharpens areas'],
    correctAnswer: 'Lightens areas',
    explanation: "The Dodge tool lightens areas of an image, simulating the photographic technique of dodging.",
    points: 1,
  },
  {
    question: "Which color mode is best for print?",
    options: ['RGB', 'CMYK', 'LAB', 'HSB'],
    correctAnswer: 'CMYK',
    explanation: "CMYK (Cyan, Magenta, Yellow, Black) is the standard color mode for print production.",
    points: 1,
  },
  {
    question: "What is a clipping mask used for?",
    options: ['To cut out shapes', 'To mask one layer with the shape of another', 'To blend colors', 'To resize images'],
    correctAnswer: 'To mask one layer with the shape of another',
    explanation: "A clipping mask uses the content and transparency of one layer to mask the layers above it.",
    points: 1,
  },
  {
    question: "Which adjustment layer is best for correcting color casts?",
    options: ['Brightness/Contrast', 'Levels', 'Color Balance', 'Hue/Saturation'],
    correctAnswer: 'Color Balance',
    explanation: "Color Balance is specifically designed to correct color casts by adjusting the balance between complementary colors.",
    points: 1,
  },
  {
    question: "What does 'feathering' do to a selection?",
    options: ['Makes it more precise', 'Softens the edges', 'Inverts it', 'Duplicates it'],
    correctAnswer: 'Softens the edges',
    explanation: "Feathering creates a soft, gradual transition at the edges of a selection.",
    points: 1,
  },
  {
    question: "Which tool allows you to remove objects seamlessly?",
    options: ['Eraser', 'Content-Aware Fill', 'Magic Wand', 'Crop Tool'],
    correctAnswer: 'Content-Aware Fill',
    explanation: "Content-Aware Fill analyzes surrounding pixels to seamlessly fill in removed objects.",
    points: 1,
  },
  {
    question: "What is the purpose of adjustment layers?",
    options: ['To add text', 'To make non-destructive edits', 'To add shapes', 'To resize images'],
    correctAnswer: 'To make non-destructive edits',
    explanation: "Adjustment layers allow you to make color and tonal adjustments without permanently altering the original image data.",
    points: 1,
  },
  {
    question: "Which format is best for images with transparency on the web?",
    options: ['JPEG', 'PNG', 'BMP', 'TIFF'],
    correctAnswer: 'PNG',
    explanation: "PNG supports transparency and is widely supported by web browsers.",
    points: 1,
  },
  {
    question: "What does 'Smart Objects' preserve?",
    options: ['Only the pixels', 'Original image data and transformations', 'Just the colors', 'Only the size'],
    correctAnswer: 'Original image data and transformations',
    explanation: "Smart Objects preserve the original image data, allowing for non-destructive transformations and editing.",
    points: 1,
  },
  {
    question: "Which tool is used for precise path creation?",
    options: ['Brush', 'Pen Tool', 'Lasso', 'Magic Wand'],
    correctAnswer: 'Pen Tool',
    explanation: "The Pen Tool creates precise vector paths using anchor points and handles.",
    points: 1,
  },
  {
    question: "What is the difference between 8-bit and 16-bit images?",
    options: [
      '8-bit has more colors',
      '16-bit has more color information per channel',
      'No difference',
      '8-bit is larger in file size'
    ],
    correctAnswer: '16-bit has more color information per channel',
    explanation: "16-bit images contain more color information per channel (65,536 levels vs 256 in 8-bit), allowing for better color gradations.",
    points: 1,
  },
  {
    question: "Which histogram shows the distribution of tones in an image?",
    options: ['Color histogram', 'Luminosity histogram', 'RGB histogram', 'All of the above'],
    correctAnswer: 'All of the above',
    explanation: "Histograms can show various aspects of tone distribution - luminosity shows overall brightness, RGB shows individual channels, and color shows overall color distribution.",
    points: 1,
  },
  {
    question: "What does the 'Liquify' filter do?",
    options: [
      'Adds water effects',
      'Allows you to push, pull, and distort pixels',
      'Increases saturation',
      'Converts to liquid colors'
    ],
    correctAnswer: 'Allows you to push, pull, and distort pixels',
    explanation: "The Liquify filter provides tools to warp, push, pull, and distort any area of an image.",
    points: 1,
  },
  {
    question: "What is the purpose of layer masks?",
    options: [
      'To hide or reveal parts of a layer non-destructively',
      'To change layer opacity permanently',
      'To duplicate layers',
      'To change blend modes'
    ],
    correctAnswer: 'To hide or reveal parts of a layer non-destructively',
    explanation: "Layer masks allow you to hide or reveal portions of a layer without permanently deleting pixel information.",
    points: 1,
  },
  {
    question: "Which color profile is standard for web graphics?",
    options: ['Adobe RGB', 'sRGB', 'ProPhoto RGB', 'CMYK'],
    correctAnswer: 'sRGB',
    explanation: "sRGB is the standard color space for web graphics and most monitors.",
    points: 1,
  },
  {
    question: "What does 'rasterizing' a vector layer do?",
    options: [
      'Makes it editable as text',
      'Converts it to pixels',
      'Makes it transparent',
      'Changes its color mode'
    ],
    correctAnswer: 'Converts it to pixels',
    explanation: "Rasterizing converts vector-based content (shapes, text) into pixel-based content, making it no longer scalable without quality loss.",
    points: 1,
  },
  {
    question: "Which tool is best for removing dust and scratches?",
    options: ['Clone Stamp', 'Healing Brush', 'Patch Tool', 'All of the above'],
    correctAnswer: 'All of the above',
    explanation: "All these tools can effectively remove dust and scratches, with each having specific advantages depending on the situation.",
    points: 1,
  },
  {
    question: "What is the purpose of channels in Photoshop?",
    options: [
      'To organize layers',
      'To store color and alpha information',
      'To create animations',
      'To manage fonts'
    ],
    correctAnswer: 'To store color and alpha information',
    explanation: "Channels store the color information (RGB, CMYK) and alpha (transparency) data for images.",
    points: 1,
  },
  {
    question: "Which blend mode darkens an image?",
    options: ['Screen', 'Multiply', 'Overlay', 'Color Dodge'],
    correctAnswer: 'Multiply',
    explanation: "Multiply blend mode darkens the image by multiplying the base color with the blend color.",
    points: 1,
  },
];

// Technical skills questions
const programmingQuestions = [
  {
    question: "What is a variable in programming?",
    options: [
      'A fixed value',
      'A storage location with a name',
      'A type of loop',
      'A programming language'
    ],
    correctAnswer: 'A storage location with a name',
    explanation: "A variable is a named storage location in memory that can hold data values.",
    points: 1,
  },
  {
    question: "Which of these is NOT a programming language?",
    options: ['Python', 'Java', 'HTML', 'C++'],
    correctAnswer: 'HTML',
    explanation: "HTML is a markup language used for creating web pages, not a programming language.",
    points: 1,
  },
  {
    question: "What does 'debugging' mean?",
    options: [
      'Adding more code',
      'Finding and fixing errors in code',
      'Running the program',
      'Deleting code'
    ],
    correctAnswer: 'Finding and fixing errors in code',
    explanation: "Debugging is the process of finding and fixing bugs (errors) in computer programs.",
    points: 1,
  },
  {
    question: "What is an algorithm?",
    options: [
      'A programming language',
      'A step-by-step procedure to solve a problem',
      'A type of computer',
      'An error in code'
    ],
    correctAnswer: 'A step-by-step procedure to solve a problem',
    explanation: "An algorithm is a finite sequence of well-defined instructions to solve a problem.",
    points: 1,
  },
  {
    question: "What does 'loop' mean in programming?",
    options: [
      'A programming error',
      'A repeated execution of code',
      'A variable type',
      'A function name'
    ],
    correctAnswer: 'A repeated execution of code',
    explanation: "A loop is a programming construct that repeats a block of code multiple times.",
    points: 1,
  },
  // Add more programming questions...
  {
    question: "What is the purpose of comments in code?",
    options: [
      'To make the program run faster',
      'To explain what the code does',
      'To create variables',
      'To fix errors'
    ],
    correctAnswer: 'To explain what the code does',
    explanation: "Comments are used to document code, making it easier to understand for developers.",
    points: 1,
  },
  {
    question: "What is a function in programming?",
    options: [
      'A type of variable',
      'A reusable block of code',
      'A programming error',
      'A data type'
    ],
    correctAnswer: 'A reusable block of code',
    explanation: "A function is a reusable block of code that performs a specific task.",
    points: 1,
  },
  {
    question: "Which data type would you use to store a person's age?",
    options: ['String', 'Boolean', 'Integer', 'Character'],
    correctAnswer: 'Integer',
    explanation: "Age is typically stored as an integer (whole number).",
    points: 1,
  },
  {
    question: "What does 'syntax' mean in programming?",
    options: [
      'The meaning of the code',
      'The rules for writing code',
      'The speed of execution',
      'The memory usage'
    ],
    correctAnswer: 'The rules for writing code',
    explanation: "Syntax refers to the set of rules that defines valid constructs in a programming language.",
    points: 1,
  },
  {
    question: "What is the result of 5 + 3 * 2 in most programming languages?",
    options: ['16', '11', '13', '10'],
    correctAnswer: '11',
    explanation: "Following order of operations, multiplication is performed first: 5 + (3 * 2) = 5 + 6 = 11.",
    points: 1,
  },
  {
    question: "What is an array?",
    options: [
      'A single variable',
      'A collection of related data items',
      'A programming language',
      'A type of loop'
    ],
    correctAnswer: 'A collection of related data items',
    explanation: "An array is a data structure that stores multiple values in a single variable.",
    points: 1,
  },
  {
    question: "What does 'compile' mean?",
    options: [
      'Run the program',
      'Convert source code to machine code',
      'Fix errors',
      'Delete code'
    ],
    correctAnswer: 'Convert source code to machine code',
    explanation: "Compiling translates high-level source code into machine code that can be executed.",
    points: 1,
  },
  {
    question: "What is a conditional statement?",
    options: [
      'A statement that always executes',
      'A statement that executes based on a condition',
      'A statement that repeats',
      'A statement that defines variables'
    ],
    correctAnswer: 'A statement that executes based on a condition',
    explanation: "Conditional statements (like if-else) execute different code blocks based on whether conditions are true or false.",
    points: 1,
  },
  {
    question: "What is the difference between '=' and '==' in most programming languages?",
    options: [
      'No difference',
      '= assigns value, == compares values',
      '= compares values, == assigns value',
      'Both assign values'
    ],
    correctAnswer: '= assigns value, == compares values',
    explanation: "= is the assignment operator, while == is the equality comparison operator.",
    points: 1,
  },
  {
    question: "What is a constant?",
    options: [
      'A variable that changes frequently',
      'A value that cannot be changed during program execution',
      'A type of loop',
      'A programming error'
    ],
    correctAnswer: 'A value that cannot be changed during program execution',
    explanation: "A constant is a value that remains unchanged throughout the program's execution.",
    points: 1,
  },
  {
    question: "What does 'object-oriented programming' emphasize?",
    options: [
      'Linear execution',
      'Objects and classes',
      'Mathematical calculations',
      'File operations'
    ],
    correctAnswer: 'Objects and classes',
    explanation: "Object-oriented programming organizes code around objects and classes rather than functions and logic.",
    points: 1,
  },
  {
    question: "What is recursion?",
    options: [
      'A function calling itself',
      'A type of loop',
      'An error handling technique',
      'A data type'
    ],
    correctAnswer: 'A function calling itself',
    explanation: "Recursion occurs when a function calls itself to solve a smaller version of the same problem.",
    points: 1,
  },
  {
    question: "What is the purpose of indentation in Python?",
    options: [
      'Just for readability',
      'To define code blocks and structure',
      'To make comments',
      'To create variables'
    ],
    correctAnswer: 'To define code blocks and structure',
    explanation: "In Python, indentation is syntactically significant and defines code blocks and program structure.",
    points: 1,
  },
  {
    question: "What is a compiler error?",
    options: [
      'An error that occurs while running the program',
      'An error detected before the program runs',
      'A warning message',
      'A performance issue'
    ],
    correctAnswer: 'An error detected before the program runs',
    explanation: "Compiler errors are detected during compilation, before the program can run.",
    points: 1,
  },
  {
    question: "What is the purpose of version control (like Git)?",
    options: [
      'To run programs faster',
      'To track changes in code over time',
      'To fix syntax errors',
      'To compile code'
    ],
    correctAnswer: 'To track changes in code over time',
    explanation: "Version control systems track changes to files over time, allowing developers to collaborate and manage code history.",
    points: 1,
  },
  {
    question: "What is pseudocode?",
    options: [
      'A programming language',
      'An informal description of program logic',
      'Commented code',
      'Error messages'
    ],
    correctAnswer: 'An informal description of program logic',
    explanation: "Pseudocode is a high-level description of program logic using natural language mixed with programming concepts.",
    points: 1,
  },
  {
    question: "What does 'iterate' mean in programming?",
    options: [
      'To fix errors',
      'To repeat a process',
      'To declare variables',
      'To end a program'
    ],
    correctAnswer: 'To repeat a process',
    explanation: "Iteration means repeating a process, typically through loops or recursive calls.",
    points: 1,
  },
  {
    question: "What is the difference between a parameter and an argument?",
    options: [
      'No difference',
      'Parameter is in function definition, argument is the actual value passed',
      'Parameter is the value, argument is the definition',
      'Both are the same thing'
    ],
    correctAnswer: 'Parameter is in function definition, argument is the actual value passed',
    explanation: "A parameter is a variable in a function definition, while an argument is the actual value passed to the function when called.",
    points: 1,
  },
  {
    question: "What is the purpose of testing in software development?",
    options: [
      'To make code run faster',
      'To verify that code works correctly',
      'To add more features',
      'To reduce code size'
    ],
    correctAnswer: 'To verify that code works correctly',
    explanation: "Testing ensures that software behaves correctly and meets requirements.",
    points: 1,
  },
  {
    question: "What is a boolean data type?",
    options: [
      'A number',
      'A text string',
      'A true or false value',
      'A character'
    ],
    correctAnswer: 'A true or false value',
    explanation: "Boolean is a data type that can only have two values: true or false.",
    points: 1,
  },
];

// Academic subject questions (Mathematics)
const mathQuestions = [
  {
    question: "What is 15% of 200?",
    options: ['25', '30', '35', '40'],
    correctAnswer: '30',
    explanation: "15% of 200 = 0.15 × 200 = 30",
    points: 1,
  },
  {
    question: "What is the area of a rectangle with length 8 and width 5?",
    options: ['13', '26', '40', '45'],
    correctAnswer: '40',
    explanation: "Area of rectangle = length × width = 8 × 5 = 40",
    points: 1,
  },
  {
    question: "Solve for x: 2x + 7 = 15",
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    explanation: "2x + 7 = 15, so 2x = 8, therefore x = 4",
    points: 1,
  },
  {
    question: "What is the square root of 144?",
    options: ['11', '12', '13', '14'],
    correctAnswer: '12',
    explanation: "√144 = 12 because 12² = 144",
    points: 1,
  },
  {
    question: "What is the sum of interior angles in a triangle?",
    options: ['90°', '180°', '270°', '360°'],
    correctAnswer: '180°',
    explanation: "The sum of interior angles in any triangle is always 180°",
    points: 1,
  },
  // Add more math questions...
  {
    question: "What is 7³ (7 cubed)?",
    options: ['21', '49', '343', '729'],
    correctAnswer: '343',
    explanation: "7³ = 7 × 7 × 7 = 343",
    points: 1,
  },
  {
    question: "What is the slope of a line passing through points (2, 3) and (4, 7)?",
    options: ['1', '2', '3', '4'],
    correctAnswer: '2',
    explanation: "Slope = (y₂ - y₁)/(x₂ - x₁) = (7 - 3)/(4 - 2) = 4/2 = 2",
    points: 1,
  },
  {
    question: "What is the circumference of a circle with radius 5? (Use π ≈ 3.14)",
    options: ['15.7', '31.4', '78.5', '157'],
    correctAnswer: '31.4',
    explanation: "Circumference = 2πr = 2 × 3.14 × 5 = 31.4",
    points: 1,
  },
  {
    question: "If a = 3 and b = 4, what is a² + b²?",
    options: ['12', '25', '49', '144'],
    correctAnswer: '25',
    explanation: "a² + b² = 3² + 4² = 9 + 16 = 25",
    points: 1,
  },
  {
    question: "What is 2/3 + 1/4?",
    options: ['3/7', '11/12', '5/6', '1'],
    correctAnswer: '11/12',
    explanation: "2/3 + 1/4 = 8/12 + 3/12 = 11/12",
    points: 1,
  },
  {
    question: "What is the median of the numbers: 3, 7, 2, 9, 5?",
    options: ['3', '5', '7', '9'],
    correctAnswer: '5',
    explanation: "Arranged in order: 2, 3, 5, 7, 9. The median is the middle value: 5",
    points: 1,
  },
  {
    question: "What is 25% of 80?",
    options: ['15', '20', '25', '30'],
    correctAnswer: '20',
    explanation: "25% of 80 = 0.25 × 80 = 20",
    points: 1,
  },
  {
    question: "What is the volume of a cube with side length 4?",
    options: ['12', '16', '48', '64'],
    correctAnswer: '64',
    explanation: "Volume of cube = side³ = 4³ = 64",
    points: 1,
  },
  {
    question: "Solve for x: 3x - 5 = 16",
    options: ['5', '6', '7', '8'],
    correctAnswer: '7',
    explanation: "3x - 5 = 16, so 3x = 21, therefore x = 7",
    points: 1,
  },
  {
    question: "What is the greatest common factor (GCF) of 12 and 18?",
    options: ['2', '3', '6', '9'],
    correctAnswer: '6',
    explanation: "Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. GCF = 6",
    points: 1,
  },
  {
    question: "What is the area of a triangle with base 10 and height 6?",
    options: ['16', '30', '60', '120'],
    correctAnswer: '30',
    explanation: "Area of triangle = (1/2) × base × height = (1/2) × 10 × 6 = 30",
    points: 1,
  },
  {
    question: "What is 4! (4 factorial)?",
    options: ['16', '20', '24', '256'],
    correctAnswer: '24',
    explanation: "4! = 4 × 3 × 2 × 1 = 24",
    points: 1,
  },
  {
    question: "What is the next term in the sequence: 2, 6, 18, 54, ...?",
    options: ['108', '162', '216', '324'],
    correctAnswer: '162',
    explanation: "Each term is multiplied by 3: 54 × 3 = 162",
    points: 1,
  },
  {
    question: "What is sin(30°)?",
    options: ['1/2', '√2/2', '√3/2', '1'],
    correctAnswer: '1/2',
    explanation: "sin(30°) = 1/2",
    points: 1,
  },
  {
    question: "What is the distance between points (1, 2) and (4, 6)?",
    options: ['3', '4', '5', '7'],
    correctAnswer: '5',
    explanation: "Distance = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5",
    points: 1,
  },
  {
    question: "What is the derivative of x²?",
    options: ['x', '2x', 'x²', '2x²'],
    correctAnswer: '2x',
    explanation: "The derivative of x² is 2x using the power rule",
    points: 1,
  },
  {
    question: "What is log₁₀(1000)?",
    options: ['2', '3', '10', '100'],
    correctAnswer: '3',
    explanation: "log₁₀(1000) = 3 because 10³ = 1000",
    points: 1,
  },
  {
    question: "What is the standard form of the quadratic formula?",
    options: [
      'x = (-b ± √(b² - 4ac)) / 2a',
      'x = (b ± √(b² - 4ac)) / 2a',
      'x = (-b ± √(b² + 4ac)) / 2a',
      'x = (-b ± √(b² - 4ac)) / a'
    ],
    correctAnswer: 'x = (-b ± √(b² - 4ac)) / 2a',
    explanation: "The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a",
    points: 1,
  },
  {
    question: "What is the sum of the first 10 positive integers?",
    options: ['45', '50', '55', '100'],
    correctAnswer: '55',
    explanation: "Sum = n(n+1)/2 = 10(11)/2 = 55, or 1+2+3+...+10 = 55",
    points: 1,
  },
  {
    question: "What is the value of π to 2 decimal places?",
    options: ['3.12', '3.14', '3.16', '3.18'],
    correctAnswer: '3.14',
    explanation: "π ≈ 3.14159..., which rounds to 3.14 to 2 decimal places",
    points: 1,
  },
];

async function createAdminUser() {
  const hashedPassword = await hash(ADMIN_USER.password, 10);
  
  return prisma.user.upsert({
    where: { email: ADMIN_USER.email },
    update: {},
    create: {
      email: ADMIN_USER.email,
      name: ADMIN_USER.name,
      role: ADMIN_USER.role,
      // Note: This is just for seeding. In real app, password should be handled by auth provider
    },
  });
}

async function createTestCategories() {
  const categories = [];
  for (const category of testCategories) {
    const created = await prisma.testCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
    categories.push(created);
  }
  return categories;
}

async function createTest(
  title: string,
  description: string,
  categoryId: string,
  difficulty: Difficulty,
  level: string | null,
  duration: number,
  passingScore: number,
  questions: any[],
  createdBy: string
) {
  const test = await prisma.test.create({
    data: {
      title,
      description,
      categoryId,
      difficulty,
      level,
      duration,
      passingScore,
      totalQuestions: questions.length,
      isPublished: true,
      createdBy,
    },
  });

  // Create questions
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    await prisma.question.create({
      data: {
        testId: test.id,
        question: question.question,
        type: QuestionType.MULTIPLE_CHOICE,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        points: question.points,
        order: i + 1,
      },
    });
  }

  return test;
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminUser = await createAdminUser();

  // Create test categories
  console.log('📚 Creating test categories...');
  const categories = await createTestCategories();
  
  // Find categories by name
  const englishCategory = categories.find(c => c.name === 'English Language');
  const adobeCategory = categories.find(c => c.name === 'Adobe Creative Suite');
  const programmingCategory = categories.find(c => c.name === 'Programming');
  const mathCategory = categories.find(c => c.name === 'Mathematics');

  if (!englishCategory || !adobeCategory || !programmingCategory || !mathCategory) {
    throw new Error('Required categories not found');
  }

  console.log('📝 Creating English language tests...');
  
  // Create English A1 test
  await createTest(
    'English A1 - Basic User',
    'Basic level English test following CEFR A1 standards. Tests fundamental vocabulary, simple grammar, and basic communication skills.',
    englishCategory.id,
    Difficulty.BEGINNER,
    'A1',
    45,
    60,
    englishA1Questions,
    adminUser.id
  );

  // Create English B2 test
  await createTest(
    'English B2 - Independent User',
    'Upper-intermediate English test following CEFR B2 standards. Tests complex grammar, advanced vocabulary, and sophisticated communication skills.',
    englishCategory.id,
    Difficulty.INTERMEDIATE,
    'B2',
    90,
    70,
    englishB2Questions,
    adminUser.id
  );

  console.log('🎨 Creating Adobe Photoshop test...');
  
  // Create Photoshop test
  await createTest(
    'Adobe Photoshop Certified User',
    'Professional certification test covering essential Photoshop skills including tools, layers, color correction, and workflow optimization.',
    adobeCategory.id,
    Difficulty.INTERMEDIATE,
    null,
    75,
    75,
    photoshopQuestions,
    adminUser.id
  );

  console.log('💻 Creating Programming fundamentals test...');
  
  // Create Programming test
  await createTest(
    'Programming Fundamentals',
    'Comprehensive test covering basic programming concepts, data types, control structures, and problem-solving approaches.',
    programmingCategory.id,
    Difficulty.BEGINNER,
    null,
    60,
    65,
    programmingQuestions,
    adminUser.id
  );

  console.log('🔢 Creating Mathematics test...');
  
  // Create Mathematics test
  await createTest(
    'General Mathematics Assessment',
    'Comprehensive mathematics test covering algebra, geometry, statistics, and calculus concepts.',
    mathCategory.id,
    Difficulty.INTERMEDIATE,
    null,
    90,
    70,
    mathQuestions,
    adminUser.id
  );

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${categories.length} test categories`);
  console.log(`📝 Created 5 comprehensive tests with sample questions`);
  console.log(`👤 Admin user: ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });