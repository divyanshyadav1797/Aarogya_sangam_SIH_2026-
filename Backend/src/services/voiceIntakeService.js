class VoiceIntakeService {
    async transcribeAudio({
        buffer,
        mimeType,
        originalName,
        languageHint
    }) {
        if (!buffer || !buffer.length) {
            throw new Error(
                'Backend received an empty audio buffer.'
            );
        }

        const aiServiceUrl =
            process.env.AI_SERVICE_URL ||
            'http://127.0.0.1:4100';

        const formData = new FormData();

        const audioBuffer = Buffer.from(buffer);

        const audioBlob = new Blob(
            [audioBuffer],
            {
                type: mimeType || 'audio/webm'
            }
        );

        formData.append(
            'audio',
            audioBlob,
            originalName || 'answer.webm'
        );

        if (languageHint) {
            formData.append(
                'language',
                languageHint
            );
        }

        console.log("FORWARDING AUDIO TO AI SERVICE:");
        console.log({
            size: audioBuffer.length,
            mimeType: mimeType,
            originalName: originalName,
            language: languageHint
        });

        const controller =
            new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 30000);

        try {
            const response = await fetch(
                `${aiServiceUrl}/api/v1/voice/transcribe`,
                {
                    method: 'POST',

                    headers: {
                        Authorization:
                            `Bearer ${process.env.AI_SERVICE_KEY}`
                    },

                    body: formData,

                    signal: controller.signal
                }
            );

            const responseText =
                await response.text();

            console.log(
                "AI SERVICE RESPONSE:",
                response.status,
                responseText
            );

            if (!response.ok) {
                throw new Error(
                    `Voice AI service failed: ${responseText}`
                );
            }

            return JSON.parse(responseText);

        } finally {
            clearTimeout(timeout);
        }
    }
}

module.exports = new VoiceIntakeService();