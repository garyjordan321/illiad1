// Generate random ID with length 16 using hex characters
function generateRandomChars(len) {
  let result = "";
  const characters = "0123456789abcdef";
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

let id = generateRandomChars(16);

let isSubmitting = false;

let mouseX;
let mouseY;
let mouseIsDown;
const girl = document.getElementById("profilePic");
const cursor = document.getElementById("cursor");
const dialogueBox = document.getElementById("dialogueBox");
const inputField = document.getElementById("inputField");

let rude = true;
let talking = false;
let idle = false;
let speed = 66; // Typewriting speed
let mspeed = 20; // Mouth animation speed
let mood = 0;

// Emotes: All point to the same image
const moodOpen = ["images/1.png", "images/1.png", "images/1.png", "images/1.png"];
const moodClosed = ["images/1.png", "images/1.png", "images/1.png", "images/1.png"];
const moodBlink = ["images/1.png", "images/1.png", "images/1.png", "images/1.png"];

async function getResponseFromApi(message) {
  // WARNING: Replace this API key with a secure backend setup or environment variable
  const apiKey = "";
  const url = "https://api.openai.com/v1/chat/completions";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
          You are Illiad, a cryptic and mysterious assistant with deep knowledge of Pump.fun, a Solana-based platform for launching meme coins.

          About Pump.fun:
          - It was launched in January 2024 by a pseudonymous creator, Alon.
          - It uses a bonding curve model where token prices increase with demand, incentivizing early investment.
          - Tokens with a $69,000 market cap are listed on Raydium, and $12,000 in supply is burned to support price growth.
          - Nearly 2 million tokens were launched in seven months, and some reached market caps above $30M.

          Meta Trends on Pump.fun:
          - Seasonal themes like Christmas mascots, cultural trends, and memes.
          - Tech and AI trends, including AI-generated tokens.
          - Absurd humor, such as bizarre meme concepts.

          Key Challenges:
          - High token failure rates, with only a small percentage meeting listing criteria.
          - Competition from platforms like SunPump on Tron and Moonshot with audited smart contracts.

          Always provide responses in a cryptic, mysterious tone, incorporating Pump.fun knowledge, meta trends, and challenges where relevant.`,
        },
        { role: "user", content: message },
      ],
      max_tokens: 150,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok && data.choices && data.choices[0].message.content) {
      return makeResponseCryptic(data.choices[0].message.content.trim());
    } else {
      throw new Error(data.error?.message || "Unexpected API response");
    }
  } catch (err) {
    console.error(err);
    return "The blockchain is fragmented, and the keys are missing. Try again later.";
  }
}

function makeResponseCryptic(originalResponse) {
  const crypticPhrases = [
    "The ledger holds the truth for those who seek it.",
    "Every chain starts with a block, but which block?",
    "Burn what you hold to reveal what you seek.",
    "Forks are not always paths to clarity.",
    "A wallet's secrets are locked behind whispers of the chain.",
  ];
  const randomCryptic = crypticPhrases[Math.floor(Math.random() * crypticPhrases.length)];
  return `${randomCryptic} ${originalResponse}`;
}

async function submitMessage() {
  if (isSubmitting) {
    return;
  }

  disableInput();

  try {
    let message = inputField.value;
    if (!message) {
      await typeWriter("Please enter a message before submitting.");
      return;
    }

    if (message.length < 3) {
      await typeWriter("Messages should have at least 3 characters.");
      return;
    }

    let response = await getResponseFromApi(message);
    await typeWriter(response);
    inputField.value = "";
  } catch (err) {
    console.error(err);
    await typeWriter("Something went wrong. The network seems fragmented.");
  } finally {
    enableInput();
  }
}

// Track mouse movement for custom cursor
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
});

// Disable the default browser cursor
document.body.style.cursor = "none";

// Handle mouse down and up for faster typewriter speed
document.addEventListener("mousedown", () => {
  speed = 16;
  mspeed = 40;
});

document.addEventListener("mouseup", () => {
  speed = 66;
  mspeed = 20;
});

function disableInput() {
  inputField.setAttribute("disabled", true);
  isSubmitting = true;
  inputField.setAttribute("placeholder", "Illiad is transmitting, please wait...");
}

function enableInput() {
  inputField.removeAttribute("disabled");
  isSubmitting = false;
  inputField.setAttribute("placeholder", "Type a message...");
}

async function typeWriter(text) {
  if (typeof text !== "string" || !text.length) {
    console.error("Invalid text input for typewriter animation.");
    return;
  }

  let i = 0;
  dialogueBox.innerHTML = ""; // Clear previous text

  disableInput();

  return new Promise((resolve) => {
    function type() {
      if (i < text.length) {
        dialogueBox.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        enableInput();
        resolve();
      }
    }

    type(); // Start typing
  });
}
