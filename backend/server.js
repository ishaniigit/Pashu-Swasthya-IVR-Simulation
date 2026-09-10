const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const crypto = require("crypto");
const { Pool } = require("pg");

const {
    createInitialSession,
    handleKey
} = require("./ivrFlow");

dotenv.config();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const app = express();
pool.query("SELECT NOW()")
    .then(() => console.log("PostgreSQL connected successfully"))
    .catch((err) => console.error("PostgreSQL connection failed:", err.message));

const PORT = process.env.PORT || 5000;


// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());

app.use(
    express.json({
        limit: "2mb"
    })
);


// ==================================================
// IVR SESSIONS
// ==================================================

const sessions = new Map();


// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {

    res.json({
        status: "ok",
        message: "Pashu Swasthya IVR backend is running"
    });

});


// ==================================================
// ML HEALTH CHECK
// ==================================================

app.get("/api/ml-health", async (req, res) => {

    try {

        const mlUrl = process.env.ML_SERVICE_URL;

        if (!mlUrl) {

            return res.status(500).json({
                status: "error",
                message: "ML_SERVICE_URL is not configured"
            });

        }

        const response = await axios.get(
            mlUrl,
            {
                timeout: 10000
            }
        );

        res.json({
            status: "ok",
            ml: response.data
        });

    } catch (error) {

        console.error(
            "ML health check error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            status: "error",
            message:
                error.response?.data ||
                error.message
        });

    }

});


// ==================================================
// START IVR
// ==================================================

app.post("/api/ivr/start", (req, res) => {

    try {

        // Create a completely new session ID
        const sessionId = crypto.randomUUID();

        // Create fresh IVR session
        const session = createInitialSession();

        // Store session
        sessions.set(
            sessionId,
            session
        );

        console.log(
            "\n======================================"
        );

        console.log(
            "NEW IVR SESSION"
        );

        console.log(
            "Session ID:",
            sessionId
        );

        console.log(
            "State:",
            session.state
        );

        console.log(
            "Active sessions:",
            sessions.size
        );

        console.log(
            "======================================\n"
        );

        res.json({
            sessionId: sessionId,
            state: session.state,
            message:
                "Welcome to the Livestock Disease Surveillance System."
        });

    } catch (error) {

        console.error(
            "START IVR ERROR:",
            error
        );

        res.status(500).json({
            error:
                "Unable to start IVR session"
        });

    }

});


// ==================================================
// KEYPAD PRESS
// ==================================================

app.post("/api/ivr/press", async (req, res) => {

    try {

        const {
            sessionId,
            key
        } = req.body;


        console.log(
            "\n======================================"
        );

        console.log(
            "KEYPAD REQUEST"
        );

        console.log(
            "Session ID:",
            sessionId
        );

        console.log(
            "Key:",
            key
        );

        console.log(
            "Active sessions:",
            sessions.size
        );

        console.log(
            "======================================"
        );


        // ------------------------------------------
        // CHECK SESSION ID
        // ------------------------------------------

        if (!sessionId) {

            return res.status(400).json({
                error:
                    "sessionId is required"
            });

        }


        // ------------------------------------------
        // CHECK KEY
        // ------------------------------------------

        if (
            key === undefined ||
            key === null
        ) {

            return res.status(400).json({
                error:
                    "key is required"
            });

        }


        // ------------------------------------------
        // FIND SESSION
        // ------------------------------------------

        const session =
            sessions.get(sessionId);


        if (!session) {

            console.error(
                "IVR SESSION NOT FOUND"
            );

            console.error(
                "Requested:",
                sessionId
            );

            console.error(
                "Available sessions:",
                Array.from(
                    sessions.keys()
                )
            );

            return res.status(404).json({
                error:
                    "IVR session not found"
            });

        }


        console.log(
            "Current state:",
            session.state
        );


        // ------------------------------------------
        // PROCESS KEY
        // ------------------------------------------

        const result =
            await handleKey(
                session,
                String(key)
            );


        // ------------------------------------------
        // SAVE UPDATED SESSION
        // ------------------------------------------

        const updatedSession =
            result.session || session;

        sessions.set(
            sessionId,
            updatedSession
        );


        console.log(
            "\nSESSION UPDATED"
        );

        console.log(
            "Session ID:",
            sessionId
        );

        console.log(
            "New state:",
            updatedSession.state
        );

        console.log(
            "Language:",
            updatedSession.language
        );

        console.log(
            "Animal:",
            updatedSession.animal
        );

        console.log(
            "Age:",
            updatedSession.age_years
        );

        console.log(
            "Vaccination:",
            updatedSession.vaccination_status
        );

        console.log(
            "Symptoms:",
            updatedSession.symptoms
        );

        console.log(
            "======================================\n"
        );


        // ------------------------------------------
        // SEND RESPONSE TO FRONTEND
        // ------------------------------------------

        res.json({

            sessionId: sessionId,

            state:
                result.state ||
                updatedSession.state,

            message:
                result.message || "",

            prediction:
                result.prediction || null

        });

    } catch (error) {

        console.error(
            "\n======================================"
        );

        console.error(
            "IVR PRESS ERROR"
        );

        console.error(
            error
        );

        console.error(
            "======================================\n"
        );

        res.status(500).json({

            error:
                "Unable to process IVR input",

            details:
                error.message

        });

    }

});


// ==================================================
// END IVR SESSION
// ==================================================

app.delete(
    "/api/ivr/:sessionId",
    (req, res) => {

        const {
            sessionId
        } = req.params;


        const existed =
            sessions.has(sessionId);


        sessions.delete(
            sessionId
        );


        console.log(
            "IVR SESSION ENDED:",
            sessionId
        );

        console.log(
            "Active sessions:",
            sessions.size
        );


        res.json({

            success: true,

            existed: existed

        });

    }
);


// ==================================================
// SARVAM TEXT TO SPEECH
// ==================================================

app.post("/api/tts", async (req, res) => {

    try {

        const {
            text,
            language
        } = req.body;


        if (!text) {

            return res.status(400).json({
                error:
                    "text is required"
            });

        }


        // ------------------------------------------
        // LANGUAGE MAPPING
        // ------------------------------------------

        const languageMap = {

            en: "en-IN",

            hi: "hi-IN",

            mr: "mr-IN"

        };


        const languageCode =
            languageMap[language] ||
            "en-IN";


        // ------------------------------------------
        // SPEAKER
        // ------------------------------------------

        let speaker = "shubh";

        if (languageCode === "mr-IN") {
            speaker = "ratan";
        }


        console.log(
            "\n--------------------------------------"
        );

        console.log(
            "SARVAM TTS"
        );

        console.log(
            "Language:",
            languageCode
        );

        console.log(
            "Speaker:",
            speaker
        );

        console.log(
            "Text:",
            text
        );

        console.log(
            "--------------------------------------"
        );


        // ------------------------------------------
        // SARVAM API
        // ------------------------------------------

        const response =
            await axios.post(

                "https://api.sarvam.ai/text-to-speech",

                {
                    text: text,

                    language_code:
                        languageCode,

                    speaker:
                        speaker,

                    model:
                        "bulbul:v3",

                    pace: 1,

                    speech_sample_rate:
                        22050
                },

                {
                    headers: {

                        "api-subscription-key":
                            process.env.SARVAM_API_KEY,

                        "Content-Type":
                            "application/json"

                    },

                    timeout: 30000
                }
            );


        // ------------------------------------------
        // GET AUDIO
        // ------------------------------------------

        const audio =
            response.data?.audios?.[0];


        if (!audio) {

            return res.status(500).json({

                error:
                    "Sarvam did not return audio"

            });

        }


        // ------------------------------------------
        // SEND AUDIO TO FRONTEND
        // ------------------------------------------

        res.json({

            audio: audio,

            language:
                languageCode

        });

    } catch (error) {

        console.error(
            "\n======================================"
        );

        console.error(
            "SARVAM TTS ERROR"
        );

        console.error(
            error.response?.data ||
            error.message
        );

        console.error(
            "======================================\n"
        );


        res.status(500).json({

            error:
                "Sarvam TTS failed",

            details:
                error.response?.data ||
                error.message

        });

    }

});


// ==================================================
// START SERVER
// ==================================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "\n======================================"
        );

        console.log(
            "PASHU SWASTHYA IVR BACKEND"
        );

        console.log(
            "======================================"
        );

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            "ML Service:",
            process.env.ML_SERVICE_URL
        );

        console.log(
            "Active sessions:",
            sessions.size
        );

        console.log(
            "======================================\n"
        );

    }
);