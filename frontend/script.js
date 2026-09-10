const BACKEND_URL = "http://localhost:5000";

let sessionId = null;
let currentState = "READY";
let selectedLanguage = "en";
let currentAudio = null;


// ==================================================
// PAGE ELEMENTS
// ==================================================

const stateElement =
    document.getElementById("state");

const messageElement =
    document.getElementById("message");

const resultElement =
    document.getElementById("result");


// ==================================================
// MULTILINGUAL IVR MESSAGES
// ==================================================

const translations = {

    LANGUAGE: {

        en:
            "Welcome to the Livestock Disease Surveillance System. Press 1 for English, हिंदी के लिए 2, मराठीसाठी 3 दाबा।",

        hi:
            "Welcome to the Livestock Disease Surveillance System. Press 1 for English, हिंदी के लिए 2, मराठीसाठी 3 दाबा।",

        mr:
            "Welcome to the Livestock Disease Surveillance System. Press 1 for English, हिंदी के लिए 2, मराठीसाठी 3 दाबा।"
    },


    ANIMAL: {

        en:
            "Please select the animal. Press 1 for cow, 2 for bull, 3 for goat, 4 for buffalo, or 5 for sheep.",

        hi:
            "कृपया पशु चुनें। गाय के लिए 1, बैल के लिए 2, बकरी के लिए 3, भैंस के लिए 4 और भेड़ के लिए 5 दबाएँ।",

        mr:
            "कृपया प्राणी निवडा। गाईसाठी 1, बैलासाठी 2, शेळीसाठी 3, म्हशीसाठी 4 आणि मेंढीसाठी 5 दाबा।"
    },


    AGE: {

        en:
            "Select the age of the animal. Press 1 for 1 year, 2 for 2 years, or 3 for 3 years or older.",

        hi:
            "पशु की उम्र चुनें। 1 साल के लिए 1, 2 साल के लिए 2, या 3 साल या उससे अधिक के लिए 3 दबाएँ।",

        mr:
            "प्राण्याचे वय निवडा. 1 वर्षासाठी 1, 2 वर्षांसाठी 2, किंवा 3 वर्षे किंवा त्यापेक्षा जास्त वयासाठी 3 दाबा।"
    },


    VACCINATION: {

        en:
            "Is the animal vaccinated? Press 1 for yes or 0 for no.",

        hi:
            "क्या पशु का टीकाकरण हुआ है? हाँ के लिए 1 और नहीं के लिए 0 दबाएँ।",

        mr:
            "प्राण्याचे लसीकरण झाले आहे का? होय साठी 1 आणि नाही साठी 0 दाबा।"
    },


    SYMPTOMS: {

        en:
            "Please select all symptoms. Press the corresponding number for each symptom. Press the number again to remove a symptom. Press hash when you are finished.",

        hi:
            "कृपया सभी लक्षण चुनें। प्रत्येक लक्षण के लिए संबंधित नंबर दबाएँ। किसी लक्षण को हटाने के लिए उसका नंबर दोबारा दबाएँ। चयन पूरा होने पर हैश दबाएँ।",

        mr:
            "कृपया सर्व लक्षणे निवडा. प्रत्येक लक्षणासाठी संबंधित क्रमांक दाबा. एखादे लक्षण काढण्यासाठी तो क्रमांक पुन्हा दाबा. निवड पूर्ण झाल्यावर हॅश दाबा."
    },


    DURATION: {

        en:
            "How many days have the symptoms been present? Press 1 for 1 day, 2 for 2 days, 3 for 3 days, or 4 for 4 or more days.",

        hi:
            "पशु को ये लक्षण कितने दिनों से हैं? 1 दिन के लिए 1, 2 दिनों के लिए 2, 3 दिनों के लिए 3, या 4 या उससे अधिक दिनों के लिए 4 दबाएँ।",

        mr:
            "प्राण्याला ही लक्षणे किती दिवसांपासून आहेत? 1 दिवसासाठी 1, 2 दिवसांसाठी 2, 3 दिवसांसाठी 3, किंवा 4 किंवा अधिक दिवसांसाठी 4 दाबा."
    },


    ANALYSING: {

        en:
            "Thank you. We are analysing the symptoms. Please wait.",

        hi:
            "धन्यवाद। हम लक्षणों का विश्लेषण कर रहे हैं। कृपया प्रतीक्षा करें।",

        mr:
            "धन्यवाद। आम्ही लक्षणांचे विश्लेषण करत आहोत. कृपया प्रतीक्षा करा."
    },


    INVALID: {

        en:
            "Invalid selection. Please try again.",

        hi:
            "गलत चयन। कृपया दोबारा प्रयास करें।",

        mr:
            "चुकीची निवड. कृपया पुन्हा प्रयत्न करा."
    },


    NO_SYMPTOMS: {

        en:
            "No symptoms have been selected. Please select at least one symptom before pressing hash.",

        hi:
            "कोई लक्षण नहीं चुना गया है। कृपया हैश दबाने से पहले कम से कम एक लक्षण चुनें।",

        mr:
            "कोणतीही लक्षणे निवडलेली नाहीत. कृपया हॅश दाबण्यापूर्वी किमान एक लक्षण निवडा."
    },


    RESULT: {

        en:
            "The analysis is complete. Please consult a veterinarian for professional diagnosis and treatment.",

        hi:
            "विश्लेषण पूरा हो गया है। सही निदान और उपचार के लिए कृपया पशु चिकित्सक से सलाह लें।",

        mr:
            "विश्लेषण पूर्ण झाले आहे. योग्य निदान आणि उपचारासाठी कृपया पशुवैद्यकांचा सल्ला घ्या."
    }
};


// ==================================================
// START IVR
// ==================================================

async function startIVR() {

    try {

        selectedLanguage = "en";
        currentState = "READY";
        sessionId = null;


        if (resultElement) {

            resultElement.classList.add(
                "hidden"
            );

            resultElement.innerHTML = "";
        }


        console.log(
            "Starting IVR..."
        );


        const response =
            await fetch(
                `${BACKEND_URL}/api/ivr/start`,
                {
                    method: "POST"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not start IVR"
            );
        }


        const data =
            await response.json();


        sessionId =
            data.sessionId;

        currentState =
            data.state;


        updateScreen(data);


        // Initial greeting
        await speak(
            translations.LANGUAGE.en,
            "en"
        );


        console.log(
            "IVR started:",
            sessionId
        );


    } catch (error) {

        console.error(
            "Start IVR error:",
            error
        );


        if (stateElement) {
            stateElement.innerText =
                "ERROR";
        }


        if (messageElement) {
            messageElement.innerText =
                "Unable to connect to the IVR server.";
        }
    }
}


// ==================================================
// KEYPAD PRESS
// ==================================================

async function pressKey(key) {

    // ==================================================
    // STOP CURRENT VOICE WHEN ANY KEY IS PRESSED
    // ==================================================

    if (currentAudio) {

        currentAudio.pause();
        currentAudio.currentTime = 0;

        currentAudio = null;
    }


    if (!sessionId) {

        if (messageElement) {

            messageElement.innerText =
                "Please press the call button first.";
        }

        return;
    }


    console.log(
        "Key pressed:",
        key
    );


    // ----------------------------------------------
    // LANGUAGE SELECTION
    // ----------------------------------------------

    if (
        currentState === "LANGUAGE"
    ) {

        if (key === "1") {

            selectedLanguage = "en";

        } else if (key === "2") {

            selectedLanguage = "hi";

        } else if (key === "3") {

            selectedLanguage = "mr";
        }


        console.log(
            "Selected language:",
            selectedLanguage
        );
    }


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/api/ivr/press`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            sessionId:
                                sessionId,

                            key:
                                key
                        })
                }
            );


        const data =
            await response.json();


        console.log(
            "IVR RESPONSE:",
            data
        );


        if (!response.ok) {

            console.error(
                "IVR ERROR:",
                data
            );

            return;
        }


        // ------------------------------------------
        // UPDATE STATE
        // ------------------------------------------

        currentState =
            data.state;


        updateScreen(data);


        // ==========================================
        // LANGUAGE → ANIMAL
        // ==========================================

        if (
            data.state === "ANIMAL"
        ) {

            const message =
                translations.ANIMAL[
                    selectedLanguage
                ];


            await speak(
                message,
                selectedLanguage
            );


            return;
        }


        // ==========================================
        // ANIMAL → AGE
        // ==========================================

        if (
            data.state === "AGE"
        ) {

            const message =
                translations.AGE[
                    selectedLanguage
                ];


            await speak(
                message,
                selectedLanguage
            );


            return;
        }


        // ==========================================
        // AGE → VACCINATION
        // ==========================================

        if (
            data.state === "VACCINATION"
        ) {

            const message =
                translations.VACCINATION[
                    selectedLanguage
                ];


            await speak(
                message,
                selectedLanguage
            );


            return;
        }


        // ==========================================
        // VACCINATION → SYMPTOMS
        // ==========================================

        if (
            data.state === "SYMPTOMS"
        ) {

            /*
             IMPORTANT:

             We speak data.message directly.

             The backend will send the complete
             symptom menu including:

             1. Fever
             2. Mouth blisters
             3. Hoof blisters
             ...

             in the selected language.
            */

            const message =
                data.message ||
                translations.SYMPTOMS[
                    selectedLanguage
                ];


            await speak(
                message,
                selectedLanguage
            );


            return;
        }


        // ==========================================
        // SYMPTOMS → DURATION
        // ==========================================

        if (
            data.state === "DURATION"
        ) {

            const message =
                data.message ||
                translations.DURATION[
                    selectedLanguage
                ];


            await speak(
                message,
                selectedLanguage
            );


            return;
        }


        // ==========================================
        // ANALYSING
        // ==========================================

        if (
            data.state === "ANALYSING"
        ) {

            const message =
                translations.ANALYSING[
                    selectedLanguage
                ];


            await speak(
                message,
                selectedLanguage
            );


            return;
        }


        // ==========================================
        // RESULT
        // ==========================================

        if (
            data.state === "RESULT"
        ) {

            if (data.prediction) {

                await speakMLResult(
                    data.prediction
                );

            } else {

                await speak(
                    translations.RESULT[
                        selectedLanguage
                    ],
                    selectedLanguage
                );
            }


            return;
        }


        // ==========================================
        // NORMAL MESSAGE
        // ==========================================

        if (data.message) {

            await speak(
                data.message,
                selectedLanguage
            );
        }


    } catch (error) {

        console.error(
            "Key press error:",
            error
        );


        if (messageElement) {

            messageElement.innerText =
                "There was a problem connecting to the IVR.";
        }
    }
}


// ==================================================
// UPDATE SCREEN
// ==================================================

function updateScreen(data) {

    if (stateElement) {

        stateElement.innerText =
            data.state || "";
    }


    if (messageElement) {

        messageElement.innerText =
            data.message || "";
    }


    // ----------------------------------------------
    // DISPLAY ML RESULT
    // ----------------------------------------------

    if (
        data.prediction &&
        resultElement
    ) {

        resultElement.classList.remove(
            "hidden"
        );


        let predictionData =
            data.prediction;


        /*
         ML RESPONSE STRUCTURE:

         {
             prediction: {
                 prediction: {
                     disease: "...",
                     confidence_score: ...
                 },

                 urgency_assessment: {...},

                 advisory: {...}
             }
         }

         Therefore we unwrap the outer
         prediction object first.
        */

        if (
            predictionData.prediction &&
            predictionData.prediction.prediction
        ) {

            predictionData =
                predictionData.prediction;
        }


        const prediction =
            predictionData.prediction ||
            {};


        const urgency =
            predictionData.urgency_assessment ||
            {};


        const disease =
            prediction.disease ||
            "Unknown";


        const confidence =
            prediction.confidence_score;


        const urgencyLevel =
            urgency.level ||
            "Unknown";


        const confidenceText =
            typeof confidence === "number"

                ? Math.round(
                    confidence * 100
                ) + "%"

                : "N/A";


        resultElement.innerHTML = `

            <strong>Disease:</strong>
            ${disease}

            <br><br>

            <strong>Confidence:</strong>
            ${confidenceText}

            <br><br>

            <strong>Urgency:</strong>
            ${urgencyLevel}

        `;
    }
}


// ==================================================
// SPEAK ML RESULT
// ==================================================

async function speakMLResult(
    predictionData
) {

    console.log(
        "RAW ML RESULT:",
        predictionData
    );


    /*
     IMPORTANT:

     Actual ML response:

     predictionData
        ↓
     {
       prediction: {
         prediction: {
           disease,
           confidence_score
         },

         urgency_assessment,
         advisory
       }
     }

     So unwrap the outer prediction.
    */


    if (
        predictionData.prediction &&
        predictionData.prediction.prediction
    ) {

        predictionData =
            predictionData.prediction;
    }


    const prediction =
        predictionData.prediction ||
        {};


    const urgency =
        predictionData.urgency_assessment ||
        {};


    const advisory =
        predictionData.advisory ||
        {};


    const disease =
        prediction.disease ||
        "Unknown";


    const confidence =
        prediction.confidence_score;


    const urgencyLevel =
        urgency.level ||
        "Unknown";


    const confidencePercent =
        typeof confidence === "number"

            ? Math.round(
                confidence * 100
            )

            : 0;


    let speech = "";


    // ==========================================
    // ENGLISH
    // ==========================================

    if (
        selectedLanguage === "en"
    ) {

        speech =
            `The analysis is complete. ` +

            `The predicted disease is ${disease}. ` +

            `The confidence level is ` +
            `${confidencePercent} percent. ` +

            `The urgency level is ` +
            `${urgencyLevel}. ` +

            `${advisory.en || ""} ` +

            `Please consult a veterinarian ` +
            `for professional diagnosis and treatment.`;
    }


    // ==========================================
    // HINDI
    // ==========================================

    else if (
        selectedLanguage === "hi"
    ) {

        speech =
            `विश्लेषण पूरा हो गया है। ` +

            `संभावित बीमारी ${disease} है। ` +

            `विश्वास स्तर ` +
            `${confidencePercent} प्रतिशत है। ` +

            `तात्कालिकता का स्तर ` +
            `${urgencyLevel} है। ` +

            `${advisory.hi || ""} ` +

            `कृपया सही निदान और उपचार के लिए ` +
            `पशु चिकित्सक से सलाह लें।`;
    }


    // ==========================================
    // MARATHI
    // ==========================================

    else {

        speech =
            `विश्लेषण पूर्ण झाले आहे। ` +

            `संभाव्य रोग ${disease} आहे। ` +

            `विश्वास पातळी ` +
            `${confidencePercent} टक्के आहे। ` +

            `तातडीची पातळी ` +
            `${urgencyLevel} आहे। ` +

            `${advisory.mr || ""} ` +

            `कृपया योग्य निदान आणि उपचारासाठी ` +
            `पशुवैद्यकांचा सल्ला घ्या।`;
    }


    console.log(
        "FINAL RESULT SPEECH:",
        speech
    );


    await speak(
        speech,
        selectedLanguage
    );
}


// ==================================================
// SARVAM TEXT TO SPEECH
// ==================================================

async function speak(
    text,
    language
) {

    if (!text) {

        console.warn(
            "TTS skipped because text is empty."
        );

        return;
    }


    try {

        console.log(
            "\n================================"
        );

        console.log(
            "SARVAM TTS REQUEST"
        );

        console.log(
            "Language:",
            language
        );

        console.log(
            "Text:",
            text
        );

        console.log(
            "================================"
        );


        const response =
            await fetch(
                `${BACKEND_URL}/api/tts`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            text:
                                text,

                            language:
                                language
                        })
                }
            );


        if (!response.ok) {

            const errorData =
                await response
                    .json()
                    .catch(
                        () => ({})
                    );


            console.error(
                "Sarvam TTS error:",
                errorData
            );

            return;
        }


        const data =
            await response.json();


        if (!data.audio) {

            console.error(
                "Sarvam returned no audio."
            );

            return;
        }


        // ------------------------------------------
        // BASE64 → BYTE ARRAY
        // ------------------------------------------

        const audioBytes =
            atob(data.audio);


        const byteArray =
            new Uint8Array(
                audioBytes.length
            );


        for (
            let i = 0;
            i < audioBytes.length;
            i++
        ) {

            byteArray[i] =
                audioBytes.charCodeAt(i);
        }


        // ------------------------------------------
        // CREATE WAV
        // ------------------------------------------

        const audioBlob =
            new Blob(
                [byteArray],
                {
                    type: "audio/wav"
                }
            );


        const audioURL =
            URL.createObjectURL(
                audioBlob
            );


        const audio =
            new Audio(audioURL);

        // Track the currently playing voice.
        currentAudio = audio;


        // ------------------------------------------
        // PLAY AND WAIT
        // ------------------------------------------

        await new Promise(
            (resolve) => {

                audio.onended =
                    () => {

                        if (currentAudio === audio) {
                            currentAudio = null;
                        }

                        URL.revokeObjectURL(
                            audioURL
                        );

                        resolve();
                    };


                audio.onpause =
                    () => {

                        // A keypad press sets currentAudio to null,
                        // so the interrupted voice finishes immediately.
                        if (currentAudio === null) {

                            URL.revokeObjectURL(
                                audioURL
                            );

                            resolve();
                        }
                    };


                audio.onerror =
                    (error) => {

                        console.error(
                            "Audio playback error:",
                            error
                        );

                        if (currentAudio === audio) {
                            currentAudio = null;
                        }

                        URL.revokeObjectURL(
                            audioURL
                        );

                        resolve();
                    };


                audio.play()
                    .catch(
                        (error) => {

                            console.error(
                                "Audio play failed:",
                                error
                            );

                            if (currentAudio === audio) {
                                currentAudio = null;
                            }

                            URL.revokeObjectURL(
                                audioURL
                            );

                            resolve();
                        }
                    );
            }
        );


    } catch (error) {

        console.error(
            "TTS ERROR:",
            error
        );
    }
}


// ==================================================
// END CALL
// ==================================================

async function endCall() {

    // Stop any currently playing voice.
    if (currentAudio) {

        currentAudio.pause();
        currentAudio.currentTime = 0;

        currentAudio = null;
    }


    if (sessionId) {

        try {

            await fetch(
                `${BACKEND_URL}/api/ivr/${sessionId}`,
                {
                    method: "DELETE"
                }
            );

        } catch (error) {

            console.error(
                "End call error:",
                error
            );
        }
    }


    sessionId = null;

    currentState = "READY";

    selectedLanguage = "en";


    if (stateElement) {

        stateElement.innerText =
            "Ready";
    }


    if (messageElement) {

        messageElement.innerText =
            "Press the call button to begin.";
    }


    if (resultElement) {

        resultElement.classList.add(
            "hidden"
        );

        resultElement.innerHTML = "";
    }
}