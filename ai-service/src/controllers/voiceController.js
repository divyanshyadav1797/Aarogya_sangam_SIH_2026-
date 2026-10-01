import {
    transcribeVoice
} from "../ai/voiceTranscriptionAgent.js";

export async function transcribeVoiceController(req, res) {
    try {
        console.log("VOICE FILE RECEIVED BY AI SERVICE:");

        console.log({
            originalname: req.file?.originalname,
            mimetype: req.file?.mimetype,
            size: req.file?.size,
            bufferLength: req.file?.buffer?.length
        });

        if (!req.file) {
            return res.status(400).json({
                error: "Audio file is required."
            });
        }

        const result = await transcribeVoice({
            buffer: req.file.buffer,
            mimeType: req.file.mimetype,
            languageHint: req.body.language
        });

        return res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("VOICE TRANSCRIPTION ERROR:");
        console.error(error);

        return res.status(500).json({
            error: "Unable to process voice input.",
            details: error?.message || "Unknown error"
        });
    }
}