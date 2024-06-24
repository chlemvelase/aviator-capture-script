// Function to capture data from .bubble-multiplier elements within div elements
function captureData(intervalInSeconds = 1, durationInMinutes = 1) {
    let data = [];
    let capturedElements = new Set();
    const interval = intervalInSeconds * 1000; // Convert interval to milliseconds
    const duration = durationInMinutes * 60 * 1000; // Convert duration to milliseconds

    // Capture function
    const capture = () => {
        const timestamp = new Date().toISOString();
        try {
            document.querySelectorAll('div .bubble-multiplier').forEach(el => {
                if (!capturedElements.has(el)) {
                    const content = el.textContent || el.innerText;
                    if (content) {
                        data.push(`${timestamp}: ${content}`);
                    } else {
                        data.push(`${timestamp}: Empty or undefined content`);
                    }
                    capturedElements.add(el);
                }
            });
        } catch (error) {
            console.error(`Error capturing data at ${timestamp}:`, error);
            data.push(`${timestamp}: Error capturing data - ${error.message}`);
        }
    };

    // MutationObserver to detect changes in the .bubble-multiplier elements within div elements
    const observer = new MutationObserver((mutationsList, observer) => {
        capture(); // Capture data whenever a mutation occurs
    });

    // Observe changes in the specific elements
    document.querySelectorAll('div .bubble-multiplier').forEach(el => {
        observer.observe(el, { childList: true, subtree: true });
    });

    // Start capturing data at regular intervals
    const intervalId = setInterval(capture, interval);

    // Stop capturing data after the duration and save to a file
    setTimeout(() => {
        clearInterval(intervalId);
        observer.disconnect(); // Stop observing changes
        try {
            const blob = new Blob([data.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'bubble-multiplier-data.txt';
            a.click();
            URL.revokeObjectURL(url);
            console.log('Data captured and saved to bubble-multiplier-data.txt');
        } catch (error) {
            console.error('Error saving data to file:', error);
        }
    }, duration);
}

// Run the captureData function with adjustable parameters
captureData(1, 1); // Default values: interval of 1 second, duration of 1 minute
