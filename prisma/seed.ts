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

// Language-focused test categories
const testCategories = [
  {
    name: 'English Language',
    description: 'English language proficiency tests following CEFR standards (A1-C2)',
    type: TestCategoryType.LANGUAGE,
  },
  {
    name: 'Spanish Language',
    description: 'Spanish language proficiency tests following CEFR standards (A1-C2)',
    type: TestCategoryType.LANGUAGE,
  },
  {
    name: 'French Language',
    description: 'French language proficiency tests following CEFR standards (A1-C2)',
    type: TestCategoryType.LANGUAGE,
  },
  {
    name: 'German Language',
    description: 'German language proficiency tests following CEFR standards (A1-C2)',
    type: TestCategoryType.LANGUAGE,
  },
  {
    name: 'Italian Language',
    description: 'Italian language proficiency tests following CEFR standards (A1-C2)',
    type: TestCategoryType.LANGUAGE,
  },
  {
    name: 'Portuguese Language',
    description: 'Portuguese language proficiency tests following CEFR standards (A1-C2)',
    type: TestCategoryType.LANGUAGE,
  },
  {
    name: 'Chinese Language',
    description: 'Chinese (Mandarin) language proficiency tests based on HSK levels',
    type: TestCategoryType.LANGUAGE,
  },
  {
    name: 'Japanese Language',
    description: 'Japanese language proficiency tests based on JLPT levels',
    type: TestCategoryType.LANGUAGE,
  },
];

// English A1 (Beginner) Questions
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
    question: "What is the opposite of 'hot'?",
    options: ['warm', 'cold', 'cool', 'nice'],
    correctAnswer: 'cold',
    explanation: "'Cold' is the opposite of 'hot'.",
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
    question: "What do you use to see?",
    options: ['ears', 'nose', 'eyes', 'mouth'],
    correctAnswer: 'eyes',
    explanation: "Eyes are used for seeing.",
    points: 1,
  },
  {
    question: "Which is a family member?",
    options: ['teacher', 'doctor', 'mother', 'student'],
    correctAnswer: 'mother',
    explanation: "Mother is a family member.",
    points: 1,
  },
  {
    question: "What is the first month of the year?",
    options: ['December', 'January', 'February', 'March'],
    correctAnswer: 'January',
    explanation: "January is the first month of the year.",
    points: 1,
  },
  {
    question: "Complete: 'This ___ my book.'",
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'is',
    explanation: "'This is my book' uses the singular form of 'to be'.",
    points: 1,
  },
  {
    question: "What do you sit on?",
    options: ['table', 'chair', 'book', 'pen'],
    correctAnswer: 'chair',
    explanation: "A chair is used for sitting.",
    points: 1,
  },
  {
    question: "Which is correct for asking someone's name?",
    options: ['How are you?', 'What is your name?', 'Where are you from?', 'How old are you?'],
    correctAnswer: 'What is your name?',
    explanation: "'What is your name?' is used to ask someone's name.",
    points: 1,
  },
];

// English B2 (Upper-Intermediate) Questions
const englishB2Questions = [
  {
    question: "If I hadn't studied so hard, I _____ passed the exam.",
    options: ["wouldn't have", "won't have", "didn't have", "don't have"],
    correctAnswer: "wouldn't have",
    explanation: "This is a third conditional sentence expressing a hypothetical past situation.",
    points: 2,
  },
  {
    question: "Choose the correct phrasal verb: 'The meeting was _____ until next week.'",
    options: ["put off", "put on", "put up", "put down"],
    correctAnswer: "put off",
    explanation: "'Put off' means to postpone or delay something.",
    points: 2,
  },
  {
    question: "Which sentence uses the subjunctive mood correctly?",
    options: [
      "I wish I was taller.",
      "I wish I were taller.",
      "I wish I am taller.",
      "I wish I will be taller."
    ],
    correctAnswer: "I wish I were taller.",
    explanation: "The subjunctive 'were' is used after 'wish' for hypothetical situations.",
    points: 2,
  },
  {
    question: "The new policy will come _____ effect next month.",
    options: ["in", "into", "on", "to"],
    correctAnswer: "into",
    explanation: "'Come into effect' is the correct prepositional phrase.",
    points: 2,
  },
  {
    question: "Choose the sentence with correct reported speech:",
    options: [
      "He said me that he was coming.",
      "He told me that he was coming.",
      "He said to me that he is coming.",
      "He told to me that he was coming."
    ],
    correctAnswer: "He told me that he was coming.",
    explanation: "'Tell' takes a direct object without a preposition, and tense shifts in reported speech.",
    points: 2,
  },
  {
    question: "The project was completed _____ time and _____ budget.",
    options: ["in, on", "on, under", "at, below", "by, within"],
    correctAnswer: "on, under",
    explanation: "'On time' and 'under budget' are correct idiomatic expressions.",
    points: 2,
  },
  {
    question: "Which word best completes: 'Her argument was _____ and well-reasoned.'",
    options: ["compelling", "repelling", "expelling", "compelling"],
    correctAnswer: "compelling",
    explanation: "'Compelling' means convincing and persuasive.",
    points: 2,
  },
  {
    question: "Choose the correct form: 'I'd rather you _____ smoking in here.'",
    options: ["don't", "didn't", "not", "won't"],
    correctAnswer: "didn't",
    explanation: "'I'd rather you didn't' uses the past tense for polite requests in the present.",
    points: 2,
  },
  {
    question: "The company has been _____ from strength to strength this year.",
    options: ["going", "moving", "walking", "running"],
    correctAnswer: "going",
    explanation: "'Going from strength to strength' is a fixed idiom meaning becoming more successful.",
    points: 2,
  },
  {
    question: "Which sentence is grammatically correct?",
    options: [
      "Neither John nor Mary are coming.",
      "Neither John nor Mary is coming.",
      "Neither John or Mary is coming.",
      "Neither John and Mary are coming."
    ],
    correctAnswer: "Neither John nor Mary is coming.",
    explanation: "'Neither...nor' takes singular verb agreement with the subject closer to the verb.",
    points: 2,
  },
  {
    question: "The manager insisted _____ the report by Friday.",
    options: ["to finish", "on finishing", "that we finish", "we finished"],
    correctAnswer: "that we finish",
    explanation: "'Insist that' is followed by a subjunctive clause (base form of verb).",
    points: 2,
  },
  {
    question: "Choose the best synonym for 'ubiquitous':",
    options: ["rare", "omnipresent", "temporary", "specific"],
    correctAnswer: "omnipresent",
    explanation: "'Ubiquitous' means present everywhere, so 'omnipresent' is the best synonym.",
    points: 2,
  },
  {
    question: "The weather was _____ awful that we decided to stay indoors.",
    options: ["so", "such", "too", "very"],
    correctAnswer: "so",
    explanation: "'So' is used before adjectives (so awful), while 'such' is used before nouns.",
    points: 2,
  },
  {
    question: "By the time you arrive, I _____ cooking dinner.",
    options: ["will finish", "will have finished", "will be finishing", "finish"],
    correctAnswer: "will have finished",
    explanation: "Future perfect tense shows an action completed before another future action.",
    points: 2,
  },
  {
    question: "Choose the correct preposition: 'She has a real flair _____ languages.'",
    options: ["for", "in", "at", "with"],
    correctAnswer: "for",
    explanation: "'A flair for' is the correct prepositional phrase meaning natural talent.",
    points: 2,
  },
  {
    question: "The committee reached a _____ decision after hours of debate.",
    options: ["unanimous", "anonymous", "unanimous", "autonomous"],
    correctAnswer: "unanimous",
    explanation: "'Unanimous' means everyone agreed on the decision.",
    points: 2,
  },
  {
    question: "Which sentence uses the passive voice correctly?",
    options: [
      "The book was written by Shakespeare.",
      "The book wrote by Shakespeare.",
      "The book was wrote by Shakespeare.",
      "The book has written by Shakespeare."
    ],
    correctAnswer: "The book was written by Shakespeare.",
    explanation: "Passive voice uses 'be + past participle' construction.",
    points: 2,
  },
  {
    question: "Had I known about the traffic, I _____ earlier.",
    options: ["would leave", "would have left", "will leave", "left"],
    correctAnswer: "would have left",
    explanation: "Third conditional with inverted 'had' requires 'would have + past participle'.",
    points: 2,
  },
  {
    question: "The new software is supposed to _____ productivity significantly.",
    options: ["enhance", "inhance", "enhanse", "inhanse"],
    correctAnswer: "enhance",
    explanation: "'Enhance' means to improve or increase the quality of something.",
    points: 2,
  },
  {
    question: "Choose the sentence with correct conditional usage:",
    options: [
      "If I was you, I would accept the offer.",
      "If I were you, I would accept the offer.",
      "If I am you, I would accept the offer.",
      "If I will be you, I would accept the offer."
    ],
    correctAnswer: "If I were you, I would accept the offer.",
    explanation: "Second conditional uses 'were' for all persons in hypothetical situations.",
    points: 2,
  },
];

// Spanish A1 (Beginner) Questions
const spanishA1Questions = [
  {
    question: "¿Cómo se dice 'hello' en español?",
    options: ['Adiós', 'Hola', 'Gracias', 'Por favor'],
    correctAnswer: 'Hola',
    explanation: "'Hola' means 'hello' in Spanish.",
    points: 1,
  },
  {
    question: "¿Cuál es el artículo definido para palabras femeninas singulares?",
    options: ['el', 'la', 'los', 'las'],
    correctAnswer: 'la',
    explanation: "'La' is the definite article for feminine singular nouns.",
    points: 1,
  },
  {
    question: "¿Cómo se dice 'I am' en español?",
    options: ['Yo soy', 'Tú eres', 'Él es', 'Nosotros somos'],
    correctAnswer: 'Yo soy',
    explanation: "'Yo soy' means 'I am' in Spanish.",
    points: 1,
  },
  {
    question: "¿Cuál es el número 'cinco' en inglés?",
    options: ['four', 'five', 'six', 'seven'],
    correctAnswer: 'five',
    explanation: "'Cinco' means 'five' in English.",
    points: 1,
  },
  {
    question: "¿Qué significa 'casa'?",
    options: ['car', 'house', 'book', 'water'],
    correctAnswer: 'house',
    explanation: "'Casa' means 'house' in English.",
    points: 1,
  },
  {
    question: "¿Cómo se pregunta 'What is your name?' en español?",
    options: ['¿Cómo estás?', '¿Cuántos años tienes?', '¿Cómo te llamas?', '¿De dónde eres?'],
    correctAnswer: '¿Cómo te llamas?',
    explanation: "'¿Cómo te llamas?' means 'What is your name?' in Spanish.",
    points: 1,
  },
  {
    question: "¿Cuál es la forma correcta del verbo 'tener' para 'yo'?",
    options: ['tengo', 'tienes', 'tiene', 'tenemos'],
    correctAnswer: 'tengo',
    explanation: "'Yo tengo' is the correct form of 'tener' (to have) for first person singular.",
    points: 1,
  },
  {
    question: "¿Qué significa 'agua'?",
    options: ['fire', 'air', 'water', 'earth'],
    correctAnswer: 'water',
    explanation: "'Agua' means 'water' in English.",
    points: 1,
  },
  {
    question: "¿Cuál es el color 'azul' en inglés?",
    options: ['red', 'blue', 'green', 'yellow'],
    correctAnswer: 'blue',
    explanation: "'Azul' means 'blue' in English.",
    points: 1,
  },
  {
    question: "¿Cómo se dice 'thank you' en español?",
    options: ['Por favor', 'De nada', 'Gracias', 'Lo siento'],
    correctAnswer: 'Gracias',
    explanation: "'Gracias' means 'thank you' in Spanish.",
    points: 1,
  },
];

// French A1 (Beginner) Questions  
const frenchA1Questions = [
  {
    question: "Comment dit-on 'hello' en français?",
    options: ['Au revoir', 'Bonjour', 'Merci', 'S\'il vous plaît'],
    correctAnswer: 'Bonjour',
    explanation: "'Bonjour' means 'hello' in French.",
    points: 1,
  },
  {
    question: "Quel est l'article défini pour les mots masculins singuliers?",
    options: ['le', 'la', 'les', 'un'],
    correctAnswer: 'le',
    explanation: "'Le' is the definite article for masculine singular nouns.",
    points: 1,
  },
  {
    question: "Comment dit-on 'I am' en français?",
    options: ['Je suis', 'Tu es', 'Il est', 'Nous sommes'],
    correctAnswer: 'Je suis',
    explanation: "'Je suis' means 'I am' in French.",
    points: 1,
  },
  {
    question: "Que veut dire 'chat'?",
    options: ['dog', 'cat', 'bird', 'fish'],
    correctAnswer: 'cat',
    explanation: "'Chat' means 'cat' in English.",
    points: 1,
  },
  {
    question: "Quel est le nombre 'trois' en anglais?",
    options: ['two', 'three', 'four', 'five'],
    correctAnswer: 'three',
    explanation: "'Trois' means 'three' in English.",
    points: 1,
  },
  {
    question: "Comment dit-on 'thank you' en français?",
    options: ['S\'il vous plaît', 'De rien', 'Merci', 'Excusez-moi'],
    correctAnswer: 'Merci',
    explanation: "'Merci' means 'thank you' in French.",
    points: 1,
  },
  {
    question: "Que veut dire 'eau'?",
    options: ['fire', 'air', 'water', 'earth'],
    correctAnswer: 'water',
    explanation: "'Eau' means 'water' in English.",
    points: 1,
  },
  {
    question: "Quel est la forme correcte du verbe 'avoir' pour 'je'?",
    options: ['ai', 'as', 'a', 'avons'],
    correctAnswer: 'ai',
    explanation: "'J'ai' is the correct form of 'avoir' (to have) for first person singular.",
    points: 1,
  },
  {
    question: "Comment demande-t-on 'What is your name?' en français?",
    options: ['Comment allez-vous?', 'Quel âge avez-vous?', 'Comment vous appelez-vous?', 'D\'où venez-vous?'],
    correctAnswer: 'Comment vous appelez-vous?',
    explanation: "'Comment vous appelez-vous?' means 'What is your name?' in French.",
    points: 1,
  },
  {
    question: "Quel est le couleur 'rouge' en anglais?",
    options: ['red', 'blue', 'green', 'yellow'],
    correctAnswer: 'red',
    explanation: "'Rouge' means 'red' in English.",
    points: 1,
  },
];

// German A1 (Beginner) Questions
const germanA1Questions = [
  {
    question: "Wie sagt man 'hello' auf Deutsch?",
    options: ['Auf Wiedersehen', 'Hallo', 'Danke', 'Bitte'],
    correctAnswer: 'Hallo',
    explanation: "'Hallo' means 'hello' in German.",
    points: 1,
  },
  {
    question: "Was ist der bestimmte Artikel für männliche Substantive?",
    options: ['der', 'die', 'das', 'den'],
    correctAnswer: 'der',
    explanation: "'Der' is the definite article for masculine nouns in nominative case.",
    points: 1,
  },
  {
    question: "Wie sagt man 'I am' auf Deutsch?",
    options: ['Ich bin', 'Du bist', 'Er ist', 'Wir sind'],
    correctAnswer: 'Ich bin',
    explanation: "'Ich bin' means 'I am' in German.",
    points: 1,
  },
  {
    question: "Was bedeutet 'Hund'?",
    options: ['cat', 'dog', 'bird', 'fish'],
    correctAnswer: 'dog',
    explanation: "'Hund' means 'dog' in English.",
    points: 1,
  },
  {
    question: "Wie heißt die Zahl 'vier' auf Englisch?",
    options: ['three', 'four', 'five', 'six'],
    correctAnswer: 'four',
    explanation: "'Vier' means 'four' in English.",
    points: 1,
  },
  {
    question: "Wie sagt man 'thank you' auf Deutsch?",
    options: ['Bitte', 'Gern geschehen', 'Danke', 'Entschuldigung'],
    correctAnswer: 'Danke',
    explanation: "'Danke' means 'thank you' in German.",
    points: 1,
  },
  {
    question: "Was bedeutet 'Wasser'?",
    options: ['fire', 'air', 'water', 'earth'],
    correctAnswer: 'water',
    explanation: "'Wasser' means 'water' in English.",
    points: 1,
  },
  {
    question: "Wie lautet die richtige Form von 'haben' für 'ich'?",
    options: ['habe', 'hast', 'hat', 'haben'],
    correctAnswer: 'habe',
    explanation: "'Ich habe' is the correct form of 'haben' (to have) for first person singular.",
    points: 1,
  },
  {
    question: "Wie fragt man 'What is your name?' auf Deutsch?",
    options: ['Wie geht es Ihnen?', 'Wie alt sind Sie?', 'Wie heißen Sie?', 'Woher kommen Sie?'],
    correctAnswer: 'Wie heißen Sie?',
    explanation: "'Wie heißen Sie?' means 'What is your name?' in German.",
    points: 1,
  },
  {
    question: "Wie heißt die Farbe 'grün' auf Englisch?",
    options: ['red', 'blue', 'green', 'yellow'],
    correctAnswer: 'green',
    explanation: "'Grün' means 'green' in English.",
    points: 1,
  },
];

// Italian A1 (Beginner) Questions
const italianA1Questions = [
  {
    question: "Come si dice 'hello' in italiano?",
    options: ['Arrivederci', 'Ciao', 'Grazie', 'Prego'],
    correctAnswer: 'Ciao',
    explanation: "'Ciao' means 'hello' (informal) in Italian.",
    points: 1,
  },
  {
    question: "Qual è l'articolo determinativo per i sostantivi maschili singolari?",
    options: ['il', 'la', 'i', 'le'],
    correctAnswer: 'il',
    explanation: "'Il' is the definite article for masculine singular nouns.",
    points: 1,
  },
  {
    question: "Come si dice 'I am' in italiano?",
    options: ['Io sono', 'Tu sei', 'Lui è', 'Noi siamo'],
    correctAnswer: 'Io sono',
    explanation: "'Io sono' means 'I am' in Italian.",
    points: 1,
  },
  {
    question: "Cosa significa 'gatto'?",
    options: ['dog', 'cat', 'bird', 'fish'],
    correctAnswer: 'cat',
    explanation: "'Gatto' means 'cat' in English.",
    points: 1,
  },
  {
    question: "Come si dice il numero 'due' in inglese?",
    options: ['one', 'two', 'three', 'four'],
    correctAnswer: 'two',
    explanation: "'Due' means 'two' in English.",
    points: 1,
  },
  {
    question: "Come si dice 'thank you' in italiano?",
    options: ['Prego', 'Di niente', 'Grazie', 'Scusi'],
    correctAnswer: 'Grazie',
    explanation: "'Grazie' means 'thank you' in Italian.",
    points: 1,
  },
  {
    question: "Cosa significa 'acqua'?",
    options: ['fire', 'air', 'water', 'earth'],
    correctAnswer: 'water',
    explanation: "'Acqua' means 'water' in English.",
    points: 1,
  },
  {
    question: "Qual è la forma corretta del verbo 'avere' per 'io'?",
    options: ['ho', 'hai', 'ha', 'abbiamo'],
    correctAnswer: 'ho',
    explanation: "'Io ho' is the correct form of 'avere' (to have) for first person singular.",
    points: 1,
  },
  {
    question: "Come si chiede 'What is your name?' in italiano?",
    options: ['Come stai?', 'Quanti anni hai?', 'Come ti chiami?', 'Di dove sei?'],
    correctAnswer: 'Come ti chiami?',
    explanation: "'Come ti chiami?' means 'What is your name?' in Italian.",
    points: 1,
  },
  {
    question: "Come si dice il colore 'giallo' in inglese?",
    options: ['red', 'blue', 'green', 'yellow'],
    correctAnswer: 'yellow',
    explanation: "'Giallo' means 'yellow' in English.",
    points: 1,
  },
];

// Chinese HSK1 (Beginner) Questions
const chineseHSK1Questions = [
  {
    question: "你好 (nǐ hǎo) means:",
    options: ['goodbye', 'hello', 'thank you', 'excuse me'],
    correctAnswer: 'hello',
    explanation: "你好 (nǐ hǎo) is the most common way to say 'hello' in Chinese.",
    points: 1,
  },
  {
    question: "What does 我 (wǒ) mean?",
    options: ['you', 'he', 'she', 'I'],
    correctAnswer: 'I',
    explanation: "我 (wǒ) means 'I' or 'me' in Chinese.",
    points: 1,
  },
  {
    question: "How do you say 'thank you' in Chinese?",
    options: ['你好', '谢谢', '再见', '对不起'],
    correctAnswer: '谢谢',
    explanation: "谢谢 (xiè xiè) means 'thank you' in Chinese.",
    points: 1,
  },
  {
    question: "What does 水 (shuǐ) mean?",
    options: ['fire', 'water', 'earth', 'air'],
    correctAnswer: 'water',
    explanation: "水 (shuǐ) means 'water' in Chinese.",
    points: 1,
  },
  {
    question: "How do you say the number 'three' in Chinese?",
    options: ['一', '二', '三', '四'],
    correctAnswer: '三',
    explanation: "三 (sān) means 'three' in Chinese.",
    points: 1,
  },
  {
    question: "What does 猫 (māo) mean?",
    options: ['dog', 'cat', 'bird', 'fish'],
    correctAnswer: 'cat',
    explanation: "猫 (māo) means 'cat' in Chinese.",
    points: 1,
  },
  {
    question: "How do you say 'goodbye' in Chinese?",
    options: ['你好', '谢谢', '再见', '对不起'],
    correctAnswer: '再见',
    explanation: "再见 (zài jiàn) means 'goodbye' in Chinese.",
    points: 1,
  },
  {
    question: "What does 书 (shū) mean?",
    options: ['pen', 'book', 'paper', 'desk'],
    correctAnswer: 'book',
    explanation: "书 (shū) means 'book' in Chinese.",
    points: 1,
  },
  {
    question: "How do you ask 'What is your name?' in Chinese?",
    options: ['你好吗？', '你几岁？', '你叫什么名字？', '你是哪国人？'],
    correctAnswer: '你叫什么名字？',
    explanation: "你叫什么名字？(nǐ jiào shén me míng zi?) means 'What is your name?' in Chinese.",
    points: 1,
  },
  {
    question: "What does 红色 (hóng sè) mean?",
    options: ['blue', 'green', 'red', 'yellow'],
    correctAnswer: 'red',
    explanation: "红色 (hóng sè) means 'red' in Chinese.",
    points: 1,
  },
];

// Test creation data
const testsData = [
  {
    title: 'English A1 - Beginner Level',
    description: 'Test your basic English language skills according to CEFR A1 level standards. Perfect for beginners starting their English learning journey.',
    categoryName: 'English Language',
    difficulty: Difficulty.BEGINNER,
    duration: 60,
    passingScore: 60,
    price: 0,
    isPublished: true,
    questions: englishA1Questions,
  },
  {
    title: 'English B2 - Upper Intermediate Level',
    description: 'Advanced English proficiency test following CEFR B2 standards. Covers complex grammar, vocabulary, and language usage.',
    categoryName: 'English Language',
    difficulty: Difficulty.ADVANCED,
    duration: 90,
    passingScore: 70,
    price: 0,
    isPublished: true,
    questions: englishB2Questions,
  },
  {
    title: 'Spanish A1 - Nivel Principiante',
    description: 'Evalúa tus habilidades básicas en español según los estándares CEFR A1. Perfecto para principiantes.',
    categoryName: 'Spanish Language',
    difficulty: Difficulty.BEGINNER,
    duration: 60,
    passingScore: 60,
    price: 0,
    isPublished: true,
    questions: spanishA1Questions,
  },
  {
    title: 'French A1 - Niveau Débutant',
    description: 'Testez vos compétences de base en français selon les normes CECRL A1. Parfait pour les débutants.',
    categoryName: 'French Language',
    difficulty: Difficulty.BEGINNER,
    duration: 60,
    passingScore: 60,
    price: 0,
    isPublished: true,
    questions: frenchA1Questions,
  },
  {
    title: 'German A1 - Anfängerstufe',
    description: 'Testen Sie Ihre grundlegenden Deutschkenntnisse nach GER A1-Standards. Perfekt für Anfänger.',
    categoryName: 'German Language',
    difficulty: Difficulty.BEGINNER,
    duration: 60,
    passingScore: 60,
    price: 0,
    isPublished: true,
    questions: germanA1Questions,
  },
  {
    title: 'Italian A1 - Livello Principiante',
    description: 'Testa le tue competenze di base in italiano secondo gli standard QCER A1. Perfetto per principianti.',
    categoryName: 'Italian Language',
    difficulty: Difficulty.BEGINNER,
    duration: 60,
    passingScore: 60,
    price: 0,
    isPublished: true,
    questions: italianA1Questions,
  },
  {
    title: 'Chinese HSK1 - Beginner Level',
    description: 'Test your basic Chinese language skills with HSK Level 1 standards. Perfect for beginners learning Mandarin Chinese.',
    categoryName: 'Chinese Language',
    difficulty: Difficulty.BEGINNER,
    duration: 60,
    passingScore: 60,
    price: 0,
    isPublished: true,
    questions: chineseHSK1Questions,
  },
];

async function main() {
  console.log('🌱 Seeding language-focused database...');

  try {
    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await hash(ADMIN_USER.password, 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: ADMIN_USER.email },
      update: {},
      create: {
        email: ADMIN_USER.email,
        name: ADMIN_USER.name,
        password: hashedPassword,
        role: ADMIN_USER.role,
        emailVerified: new Date(),
      },
    });

    console.log(`✅ Admin user created: ${adminUser.email}`);

    // Create test categories
    console.log('Creating test categories...');
    const categories = [];
    
    for (const categoryData of testCategories) {
      const category = await prisma.testCategory.upsert({
        where: { name: categoryData.name },
        update: categoryData,
        create: categoryData,
      });
      categories.push(category);
    }

    console.log(`✅ Created ${categories.length} test categories`);

    // Create tests with questions
    console.log('Creating tests and questions...');
    
    for (const testData of testsData) {
      const category = categories.find(c => c.name === testData.categoryName);
      if (!category) {
        console.warn(`⚠️  Category not found: ${testData.categoryName}`);
        continue;
      }

      // Check if test already exists
      const existingTest = await prisma.test.findFirst({
        where: {
          title: testData.title,
          categoryId: category.id
        }
      });

      const test = existingTest 
        ? await prisma.test.update({
            where: { id: existingTest.id },
            data: {
              description: testData.description,
              difficulty: testData.difficulty,
              duration: testData.duration,
              passingScore: testData.passingScore,
              isPublished: testData.isPublished,
            }
          })
        : await prisma.test.create({
            data: {
              title: testData.title,
              description: testData.description,
              categoryId: category.id,
              difficulty: testData.difficulty,
              duration: testData.duration,
              passingScore: testData.passingScore,
              isPublished: testData.isPublished,
              createdBy: adminUser.id,
            },
          });

      // Create questions for this test
      for (let i = 0; i < testData.questions.length; i++) {
        const questionData = testData.questions[i];
        
        // Check if question already exists
        const existingQuestion = await prisma.question.findFirst({
          where: {
            testId: test.id,
            order: i + 1
          }
        });

        if (existingQuestion) {
          await prisma.question.update({
            where: { id: existingQuestion.id },
            data: {
              question: questionData.question,
              options: questionData.options,
              correctAnswer: questionData.correctAnswer,
              explanation: questionData.explanation,
              points: questionData.points,
              type: QuestionType.MULTIPLE_CHOICE,
            }
          });
        } else {
          await prisma.question.create({
            data: {
              testId: test.id,
              question: questionData.question,
              options: questionData.options,
              correctAnswer: questionData.correctAnswer,
              explanation: questionData.explanation,
              points: questionData.points,
              type: QuestionType.MULTIPLE_CHOICE,
              order: i + 1,
            },
          });
        }
      }

      console.log(`✅ Created test: ${test.title} with ${testData.questions.length} questions`);
    }

    console.log('🎉 Language-focused database seeded successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   • ${categories.length} language test categories`);
    console.log(`   • ${testsData.length} language proficiency tests`);
    console.log(`   • ${testsData.reduce((sum, test) => sum + test.questions.length, 0)} total questions`);
    console.log('');
    console.log('🌍 Languages available:');
    console.log('   • English (A1, B2 levels)');
    console.log('   • Spanish (A1 level)');
    console.log('   • French (A1 level)');
    console.log('   • German (A1 level)');
    console.log('   • Italian (A1 level)');
    console.log('   • Chinese (HSK1 level)');
    console.log('');
    console.log('🔑 Admin credentials:');
    console.log(`   Email: ${ADMIN_USER.email}`);
    console.log(`   Password: ${ADMIN_USER.password}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });