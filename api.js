const requestBody = {
  "messages": [
    {
      "parts": [
        {
          "type": "text",
          "text": "hello"
        }
      ],
      "id": "elDmViSf83yeplFg",
      "role": "user"
    },
    {
      "id": "JmDGjxDJ4dMT8yTS",
      "metadata": {
        "usage": {
          "inputTokens": 1155,
          "outputTokens": 111,
          "totalTokens": 1266
        },
        "model": "claude-haiku-4.5",
        "duration": 2002
      },
      "role": "assistant",
      "parts": [
        {
          "type": "step-start"
        },
        {
          "type": "text",
          "text": "Hello! 👋 I'm here to help you with documentation and information about libraries and packages.",
          "state": "done"
        }
      ]
    }
  ]
};

fetch("https://smithery.ai/api/chat", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-posthog-distinct-id": "dcdf92cf-6676-46c1-b288-29090c4610ad",
    "x-posthog-session-id": "019a1b0e-85ae-7be4-8052-8836b7f46e62",
    "x-posthog-window-id": "019a1b0e-85ae-7be4-8052-8837c5db8a5f",
    "Referer": "https://smithery.ai/server/@upstash/context7-mcp",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": JSON.stringify(requestBody),
  "method": "POST"
}).then(response => {
  return response.json();
}).then(data => {
  console.log(data);
}).catch(error => {
  console.error('Error:', error);
});