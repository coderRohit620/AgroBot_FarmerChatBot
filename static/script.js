
document.addEventListener('DOMContentLoaded', () => {
  console.log('AgroBot script loaded ✅');

  const messages  = document.getElementById('messages');
  const input     = document.getElementById('msg');
  const sendBtn   = document.getElementById('sendBtn');
  const imageInput= document.getElementById('imageInput');
  const voiceBtn  = document.getElementById('voiceBtn');

  // ── Voice Recognition ───────────────────────────────────────
  let recognition = null;
  let isListening = false;

  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      input.value = event.results[0][0].transcript;
      updateVoiceButton(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      updateVoiceButton(false);
      addMessage('system', `🎤 Voice error: ${event.error}`);
    };

    recognition.onend = () => updateVoiceButton(false);
  } else {
    if (voiceBtn) voiceBtn.style.display = 'none';
  }

  function updateVoiceButton(listening) {
    isListening = listening;
    if (!voiceBtn) return;
    if (listening) {
      voiceBtn.textContent = '⏹';
      voiceBtn.classList.add('listening');
      voiceBtn.title = 'Stop listening';
    } else {
      voiceBtn.textContent = '🎤';
      voiceBtn.classList.remove('listening');
      voiceBtn.title = 'Voice input';
    }
  }

  function toggleVoiceInput() {
    if (!recognition) {
      addMessage('system', '🎤 Voice input is not supported in your browser. Try Chrome.');
      return;
    }
    if (isListening) {
      recognition.stop();
      updateVoiceButton(false);
    } else {
      try {
        recognition.start();
        updateVoiceButton(true);
      } catch (e) {
        console.error('Voice start error:', e);
      }
    }
  }

  // ── Helpers ─────────────────────────────────────────────────
  function now() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  // ── Add Message ──────────────────────────────────────────────
  function addMessage(who, text, imageData = null) {
    const el     = document.createElement('div');
    el.className = `message ${who}`;

    // Bot avatar
    if (who === 'bot') {
      const av = document.createElement('div');
      av.className = 'msg-avatar';
      av.setAttribute('aria-hidden', 'true');
      av.textContent = '🌾';
      el.appendChild(av);
    }

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    // Image preview
    if (imageData) {
      const img = document.createElement('img');
      img.src = imageData;
      img.alt = 'Uploaded crop image';
      img.className = 'chat-image';
      bubble.appendChild(img);
    }

    // Text
    if (text) {
      const txt = document.createElement('div');
      txt.className = 'message-text';
      txt.innerHTML = formatText(text);
      bubble.appendChild(txt);
    }

    // Timestamp (user & bot only)
    if (who === 'user' || who === 'bot') {
      const ts = document.createElement('div');
      ts.className = 'bubble-time';
      ts.textContent = now();
      bubble.appendChild(ts);
    }

    el.appendChild(bubble);
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  // ── Typing Indicator ─────────────────────────────────────────
  let typingEl = null;

  function showTyping() {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'message bot';

    const av = document.createElement('div');
    av.className = 'msg-avatar';
    av.setAttribute('aria-hidden', 'true');
    av.textContent = '🌾';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';

    bubble.appendChild(dots);
    typingEl.appendChild(av);
    typingEl.appendChild(bubble);
    messages.appendChild(typingEl);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    if (typingEl) {
      typingEl.remove();
      typingEl = null;
    }
  }

  // ── Image Upload ─────────────────────────────────────────────
  function handleImageUpload(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file'));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('Image must be under 5MB'));
        return;
      }
      const reader = new FileReader();
      reader.onload  = (e) => resolve(e.target.result);
      reader.onerror = ()  => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
  }

  async function analyzeImage(imageFile, textMessage = '') {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (textMessage) formData.append('message', textMessage);

    const res = await fetch('/api/analyze-image', { method: 'POST', body: formData });
    const responseText = await res.text();

    // Detect redirect to login page
    if (responseText.trim().startsWith('<!DOCTYPE') || responseText.includes('<html')) {
      throw new Error('🔒 Authentication required. Please log in to use image analysis.');
    }

    if (!res.ok) {
      const err = JSON.parse(responseText);
      throw new Error(err.error || `Server error ${res.status}`);
    }

    return JSON.parse(responseText);
  }

  // ── Send Message ─────────────────────────────────────────────
  async function sendMessage() {
    const msg       = input.value.trim();
    const imageFile = imageInput?.files[0];

    if (!msg && !imageFile) return;

    sendBtn.disabled = true;

    try {
      if (imageFile) {
        // Show loading indicator
        addMessage('system', '🔍 Analysing your image…');

        // Read image for display
        const imageData = await handleImageUpload(imageFile);
        addMessage('user', msg || 'Please analyse this crop image.', imageData);

        showTyping();
        try {
          const result = await analyzeImage(imageFile, msg);
          hideTyping();
          if (result.success) {
            addMessage('bot', result.response);
          } else {
            addMessage('bot', `Analysis issue: ${result.error}`);
          }
        } catch (analysisErr) {
          hideTyping();
          addMessage('bot', analysisErr.message);
        }

        imageInput.value = '';

      } else if (msg) {
        addMessage('user', msg);
        showTyping();

        const res = await fetch('/api/chat', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ message: msg })
        });

        if (!res.ok) throw new Error('Network error — please try again.');
        const data = await res.json();
        hideTyping();
        addMessage('bot', data.response || 'No response from server.');
      }

    } catch (err) {
      hideTyping();
      console.error('Send error:', err);
      addMessage('bot', `⚠️ ${err.message}`);
    } finally {
      sendBtn.disabled = false;
      input.value = '';
      input.focus();
    }
  }

  // ── Event Listeners ──────────────────────────────────────────
  sendBtn  && sendBtn.addEventListener('click', sendMessage);
  voiceBtn && voiceBtn.addEventListener('click', toggleVoiceInput);

  input && input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  imageInput && imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addMessage('system', '⚠️ Please select a valid image (JPEG, PNG, GIF, WebP)');
      imageInput.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addMessage('system', '⚠️ Image must be under 5MB');
      imageInput.value = '';
      return;
    }

    // Auto-send when image is chosen
    sendMessage();
  });

  // ── Welcome message ──────────────────────────────────────────
  setTimeout(() => {
    addMessage('bot',
      '👋 Hello! I\'m **AgroBot**, your AI farming assistant.\n\n'
      + '🌱 I can help you with:\n'
      + '• Crop diseases & pest control\n'
      + '• Soil health & fertilizers\n'
      + '• Irrigation & water management\n'
      + '• Seasonal farming advice\n\n'
      + 'Type a question below or tap a **Quick Tip** on the sidebar. You can also 📷 upload a plant photo for instant AI analysis!'
    );
  }, 500);

  // ── Input character counter ───────────────────────────────────
  if (input) {
    input.addEventListener('input', () => {
      const maxLen = parseInt(input.getAttribute('maxlength') || 1000);
      const remaining = maxLen - input.value.length;
      if (remaining < 100) {
        input.style.color = remaining < 20 ? '#f87171' : 'var(--text-muted)';
      } else {
        input.style.color = '';
      }
    });
  }

});