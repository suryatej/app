/**
 * Play sound file
 */
export const playSound = async (soundPath: string): Promise<void> => {
  try {
    const audio = new Audio(soundPath);
    
    // Check if the audio file can be loaded
    audio.addEventListener('error', (e) => {
      console.warn('Audio file not found or cannot be loaded:', soundPath);
    });
    
    // Set a timeout to prevent hanging
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Silently handle the error - audio file may not exist yet
        console.warn('Could not play sound:', soundPath);
      });
    }
  } catch (err) {
    console.warn('Failed to initialize sound:', err);
  }
};

/**
 * Send browser notification
 */
export const sendNotification = async (
  title: string,
  options?: NotificationOptions
): Promise<void> => {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return;
  }

  // Request permission if not granted
  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return;
    }
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, options);
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
  }
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'default') {
    return await Notification.requestPermission();
  }

  return Notification.permission;
};

/**
 * Trigger vibration (mobile devices)
 */
export const triggerVibration = (pattern: number | number[]): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};
