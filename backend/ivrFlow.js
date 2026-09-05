const axios = require("axios");


// ==================================================
// LANGUAGES
// ==================================================

const LANGUAGES = {
    "1": "en",
    "2": "hi",
    "3": "mr"
};


// ==================================================
// ANIMALS
// ==================================================

const ANIMALS = {
    "1": {
        value: "cow",
        en: "Cow",
        hi: "गाय",
        mr: "गाय"
    },

    "2": {
        value: "cattle",
        en: "Bull",
        hi: "बैल",
        mr: "बैल"
    },

    "3": {
        value: "goat",
        en: "Goat",
        hi: "बकरी",
        mr: "शेळी"
    },

    "4": {
        value: "buffalo",
        en: "Buffalo",
        hi: "भैंस",
        mr: "म्हैस"
    },

    "5": {
        value: "sheep",
        en: "Sheep",
        hi: "भेड़",
        mr: "मेंढी"
    }
};


// ==================================================
// SYMPTOMS
// ==================================================

const SYMPTOMS = {
    "1": {
        field: "fever",
        en: "Fever",
        hi: "बुखार",
        mr: "ताप"
    },

    "2": {
        field: "mouth_blisters",
        en: "Mouth blisters",
        hi: "मुंह में छाले",
        mr: "तोंडात फोड"
    },

    "3": {
        field: "hoof_blisters",
        en: "Hoof blisters",
        hi: "खुर में छाले",
        mr: "खुरांवर फोड"
    },

    "4": {
        field: "lameness",
        en: "Lameness",
        hi: "लंगड़ापन",
        mr: "लंगडणे"
    },

    "5": {
        field: "skin_nodules",
        en: "Skin nodules",
        hi: "त्वचा पर गांठें",
        mr: "त्वचेवर गाठी"
    },

    "6": {
        field: "swelling",
        en: "Swelling",
        hi: "सूजन",
        mr: "सूज"
    },

    "7": {
        field: "breathing_issues",
        en: "Breathing difficulty",
        hi: "सांस लेने में दिक्कत",
        mr: "श्वास घेण्यास त्रास"
    },

    "8": {
        field: "reduced_feed",
        en: "Reduced feed intake",
        hi: "चारा कम खाना",
        mr: "चारा कमी खाणे"
    },

    "9": {
        field: "lethargy",
        en: "Lethargy",
        hi: "सुस्ती",
        mr: "सुस्ती"
    },

    "0": {
        field: "salivation",
        en: "Excessive salivation",
        hi: "ज्यादा लार आना",
        mr: "जास्त लाळ येणे"
    }
};


// ==================================================
// SYMPTOM MENU
// ==================================================

function getSymptomMenu(language) {

    return Object.entries(SYMPTOMS).map(
        ([key, symptom]) => {
            return `${key}. ${symptom[language]}`;
        }
    );
}


// ==================================================
// PROMPTS
// ==================================================

const PROMPTS = {

    en: {

        welcome:
            "Welcome to the Livestock Disease Surveillance System. Press 1 for English, हिंदी के लिए 2, मराठीसाठी 3 दाबा।",

        animal:
            "Please select the animal. Press 1 for Cow, 2 for Bull, 3 for Goat, 4 for Buffalo, or 5 for Sheep.",

        age:
            "Select the age of the animal. Press 1 for 1 year, 2 for 2 years, or 3 for 3 years or older.",

        vaccination:
            "Is the animal vaccinated? Press 1 for Yes or 0 for No.",

        symptoms:
            "Please select all symptoms. Press the corresponding number for each symptom. Press the number again to remove a symptom. Press hash when you are finished.",

        duration:
            "How many days have the symptoms been present? Press 1 for 1 day, 2 for 2 days, 3 for 3 days, or 4 for 4 or more days.",

        analysing:
            "Thank you. We are analysing the symptoms. Please wait.",

        invalid:
            "Invalid selection. Please try again.",

        noSymptoms:
            "No symptoms have been selected. Please select at least one symptom before pressing hash.",

        symptomSelected:
            "selected. You can select another symptom or press hash when finished.",

        symptomRemoved:
            "removed. You can select another symptom or press hash when finished.",

        result:
            "The analysis is complete."
    },


    hi: {

        welcome:
            "Welcome to the Livestock Disease Surveillance System. Press 1 for English, हिंदी के लिए 2, मराठीसाठी 3 दाबा।",

        animal:
            "पशु चुनें। गाय के लिए 1, बैल के लिए 2, बकरी के लिए 3, भैंस के लिए 4, या भेड़ के लिए 5 दबाएं।",

        age:
            "पशु की उम्र चुनें। 1 साल के लिए 1, 2 साल के लिए 2, या 3 साल या उससे अधिक के लिए 3 दबाएं।",

        vaccination:
            "क्या पशु का टीकाकरण हुआ है? हाँ के लिए 1 और नहीं के लिए 0 दबाएं।",

        symptoms:
            "सभी लक्षण चुनें। संबंधित नंबर दबाएं। किसी लक्षण को हटाने के लिए उसका नंबर दोबारा दबाएं। लक्षण चुनने के बाद हैश दबाएं।",

        duration:
            "पशु को ये लक्षण कितने दिनों से हैं? 1 दिन के लिए 1, 2 दिन के लिए 2, 3 दिन के लिए 3, या 4 या उससे अधिक दिनों के लिए 4 दबाएं।",

        analysing:
            "धन्यवाद। हम लक्षणों का विश्लेषण कर रहे हैं। कृपया प्रतीक्षा करें।",

        invalid:
            "गलत विकल्प। कृपया दोबारा प्रयास करें।",

        noSymptoms:
            "कृपया हैश दबाने से पहले कम से कम एक लक्षण चुनें।",

        symptomSelected:
            "चुना गया है। आप दूसरा लक्षण चुन सकते हैं या समाप्त करने के लिए हैश दबा सकते हैं।",

        symptomRemoved:
            "हटा दिया गया है। आप दूसरा लक्षण चुन सकते हैं या समाप्त करने के लिए हैश दबा सकते हैं।",

        result:
            "विश्लेषण पूरा हो गया है।"
    },


    mr: {

        welcome:
            "Welcome to the Livestock Disease Surveillance System. Press 1 for English, हिंदी के लिए 2, मराठीसाठी 3 दाबा।",

        animal:
            "प्राणी निवडा. गाईसाठी 1, बैलासाठी 2, शेळीसाठी 3, म्हशीसाठी 4, किंवा मेंढीसाठी 5 दाबा.",

        age:
            "प्राण्याचे वय निवडा. 1 वर्षासाठी 1, 2 वर्षांसाठी 2, किंवा 3 वर्षे किंवा त्यापेक्षा जास्त वयासाठी 3 दाबा.",

        vaccination:
            "प्राण्याचे लसीकरण झाले आहे का? होय साठी 1 आणि नाही साठी 0 दाबा.",

        symptoms:
            "सर्व लक्षणे निवडा. संबंधित क्रमांक दाबा. एखादे लक्षण काढण्यासाठी तो क्रमांक पुन्हा दाबा. लक्षणे निवडल्यानंतर हॅश दाबा.",

        duration:
            "प्राण्याला ही लक्षणे किती दिवसांपासून आहेत? 1 दिवसासाठी 1, 2 दिवसांसाठी 2, 3 दिवसांसाठी 3, किंवा 4 किंवा अधिक दिवसांसाठी 4 दाबा.",

        analysing:
            "धन्यवाद। आम्ही लक्षणांचे विश्लेषण करत आहोत. कृपया प्रतीक्षा करा.",

        invalid:
            "चुकीचा पर्याय. कृपया पुन्हा प्रयत्न करा.",

        noSymptoms:
            "कृपया हॅश दाबण्यापूर्वी किमान एक लक्षण निवडा.",

        symptomSelected:
            "निवडले आहे. तुम्ही दुसरे लक्षण निवडू शकता किंवा पूर्ण करण्यासाठी हॅश दाबू शकता.",

        symptomRemoved:
            "काढले आहे. तुम्ही दुसरे लक्षण निवडू शकता किंवा पूर्ण करण्यासाठी हॅश दाबू शकता.",

        result:
            "विश्लेषण पूर्ण झाले आहे."
    }
};


// ==================================================
// CREATE INITIAL SESSION
// ==================================================

function createInitialSession() {

    return {

        state: "LANGUAGE",

        language: null,

        animal: null,

        age_years: null,

        vaccination_status: null,

        symptoms: {},

        days_since_onset: null,

        prediction: null
    };
}


// ==================================================
// GET DURATION
// ==================================================

function getDuration(key) {

    const durations = {

        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4
    };

    return durations[key] || null;
}


// ==================================================
// GET AGE
// ==================================================

function getAge(key) {

    const ages = {

        "1": 1,
        "2": 2,
        "3": 3
    };

    return ages[key] || null;
}


// ==================================================
// GET VACCINATION
// ==================================================

function getVaccinationStatus(key) {

    if (key === "1") {
        return "Yes";
    }

    if (key === "0") {
        return "No";
    }

    return null;
}


// ==================================================
// ML CALL
// ==================================================
async function analyzeWithML(session) {

    const payload = {

        // ------------------------------------------
        // BASIC INFORMATION
        // ------------------------------------------

        species:
            session.animal,

        temperature:
            102.0,


        // ------------------------------------------
        // SYMPTOMS
        // ------------------------------------------

        fever:
            !!session.symptoms.fever,

        mouth_blisters:
            !!session.symptoms.mouth_blisters,

        hoof_blisters:
            !!session.symptoms.hoof_blisters,

        lameness:
            !!session.symptoms.lameness,

        skin_nodules:
            !!session.symptoms.skin_nodules,

        swelling:
            !!session.symptoms.swelling,

        breathing_issues:
            !!session.symptoms.breathing_issues,

        reduced_feed:
            !!session.symptoms.reduced_feed,

        lethargy:
            !!session.symptoms.lethargy,

        salivation:
            !!session.symptoms.salivation,

        nasal_discharge:
            false,

        eye_discharge:
            false,

        diarrhea:
            false,

        coughing:
            false,

        milk_drop:
            false,


        // ------------------------------------------
        // VISION
        // ------------------------------------------

        // Vision is not being used in the IVR yet.
        // ML service expects a string or null.
        vision_prediction:
            null,


        // ------------------------------------------
        // DURATION
        // ------------------------------------------

        days_since_onset:
            session.days_since_onset,


        // ------------------------------------------
        // AGE + VACCINATION
        // ------------------------------------------

        age_years:
            session.age_years,

        vaccination_status:
            session.vaccination_status,


        // ------------------------------------------
        // LOCATION
        // ------------------------------------------

        // ML service expects floats, so use 0.0
        // when GPS/location is not collected.
        lat:
            0.0,

        lng:
            0.0,

        village:
            null,

        taluka:
            null,

        district:
            null
    };


    console.log(
        "\n======================================"
    );

    console.log(
        "ML REQUEST"
    );

    console.log(
        payload
    );

    console.log(
        "======================================"
    );


    const mlUrl =
        `${process.env.ML_SERVICE_URL}/analyze-symptoms`;


    const response =
        await axios.post(
            mlUrl,
            payload,
            {
                timeout: 30000
            }
        );


    console.log(
        "\n======================================"
    );

    console.log(
        "ML RESPONSE"
    );

    console.log(
        response.data
    );

    console.log(
        "======================================"
    );


    return response.data;
}


// ==================================================
// HANDLE KEYPAD
// ==================================================

async function handleKey(
    session,
    key
) {

    const language =
        session.language || "en";


    // ==============================================
    // LANGUAGE
    // ==============================================

    if (
        session.state === "LANGUAGE"
    ) {

        if (!LANGUAGES[key]) {

            return {

                session,

                state: "LANGUAGE",

                message:
                    PROMPTS.en.invalid
            };
        }


        session.language =
            LANGUAGES[key];


        session.state =
            "ANIMAL";


        return {

            session,

            state: "ANIMAL",

            message:
                PROMPTS[
                    session.language
                ].animal
        };
    }


    // ==============================================
    // ANIMAL
    // ==============================================

    if (
        session.state === "ANIMAL"
    ) {

        if (!ANIMALS[key]) {

            return {

                session,

                state: "ANIMAL",

                message:
                    PROMPTS[
                        language
                    ].invalid
            };
        }


        session.animal =
            ANIMALS[key].value;


        session.state =
            "AGE";


        return {

            session,

            state: "AGE",

            message:
                PROMPTS[
                    language
                ].age
        };
    }


    // ==============================================
    // AGE
    // ==============================================

    if (
        session.state === "AGE"
    ) {

        const age =
            getAge(key);


        if (!age) {

            return {

                session,

                state: "AGE",

                message:
                    PROMPTS[
                        language
                    ].invalid
            };
        }


        session.age_years =
            age;


        session.state =
            "VACCINATION";


        return {

            session,

            state: "VACCINATION",

            message:
                PROMPTS[
                    language
                ].vaccination
        };
    }


    // ==============================================
    // VACCINATION
    // ==============================================

    if (
        session.state === "VACCINATION"
    ) {

        const vaccination =
            getVaccinationStatus(key);


        if (!vaccination) {

            return {

                session,

                state: "VACCINATION",

                message:
                    PROMPTS[
                        language
                    ].invalid
            };
        }


        session.vaccination_status =
            vaccination;


        session.state =
            "SYMPTOMS";


        // ------------------------------------------
        // IMPORTANT:
        // SEND COMPLETE SYMPTOM MENU
        // ------------------------------------------

        const menu =
            getSymptomMenu(
                language
            );


        const finishMessage =
            language === "hi"

                ? "लक्षण चुनने के बाद हैश दबाएं।"

                : language === "mr"

                    ? "लक्षणे निवडल्यानंतर हॅश दाबा."

                    : "Press hash when you are finished.";


        return {

            session,

            state: "SYMPTOMS",

            message:
                PROMPTS[
                    language
                ].symptoms +

                "\n\n" +

                menu.join("\n") +

                "\n\n" +

                finishMessage
        };
    }


    // ==============================================
    // SYMPTOMS
    // ==============================================

    if (
        session.state === "SYMPTOMS"
    ) {

        // ------------------------------------------
        // HASH = FINISH
        // ------------------------------------------

        if (key === "#") {

            const selectedSymptoms =
                Object.keys(
                    session.symptoms
                ).filter(
                    symptom =>
                        session.symptoms[
                            symptom
                        ]
                );


            if (
                selectedSymptoms.length === 0
            ) {

                return {

                    session,

                    state: "SYMPTOMS",

                    message:
                        PROMPTS[
                            language
                        ].noSymptoms
                };
            }


            session.state =
                "DURATION";


            return {

                session,

                state: "DURATION",

                message:
                    PROMPTS[
                        language
                    ].duration,

                selectedSymptoms
            };
        }


        // ------------------------------------------
        // FIND SYMPTOM
        // ------------------------------------------

        const symptom =
            SYMPTOMS[key];


        if (!symptom) {

            return {

                session,

                state: "SYMPTOMS",

                message:
                    PROMPTS[
                        language
                    ].invalid
            };
        }


        // ------------------------------------------
        // TOGGLE
        // ------------------------------------------

        const field =
            symptom.field;


        const wasSelected =
            !!session.symptoms[field];


        session.symptoms[field] =
            !wasSelected;


        // ------------------------------------------
        // CONFIRMATION MESSAGE
        // ------------------------------------------

        let message;


        if (
            !wasSelected
        ) {

            message =
                `${symptom[language]} ` +
                `${PROMPTS[language].symptomSelected}`;

        } else {

            message =
                `${symptom[language]} ` +
                `${PROMPTS[language].symptomRemoved}`;
        }


        const selectedSymptoms =
            Object.keys(
                session.symptoms
            ).filter(
                symptomName =>
                    session.symptoms[
                        symptomName
                    ]
            );


        return {

            session,

            state: "SYMPTOMS",

            message,

            selectedSymptoms
        };
    }


    // ==============================================
    // DURATION
    // ==============================================

    if (
        session.state === "DURATION"
    ) {

        const duration =
            getDuration(key);


        if (!duration) {

            return {

                session,

                state: "DURATION",

                message:
                    PROMPTS[
                        language
                    ].invalid
            };
        }


        session.days_since_onset =
            duration;


        session.state =
            "ANALYSING";


        try {

            const prediction =
                await analyzeWithML(
                    session
                );


            session.prediction =
                prediction;


            session.state =
                "RESULT";


            return {

                session,

                state: "RESULT",

                message:
                    PROMPTS[
                        language
                    ].result,

                prediction
            };


        } catch (error) {

            console.error(
                "ML ERROR:",
                error.response?.data ||
                error.message
            );


            session.state =
                "RESULT";


            return {

                session,

                state: "RESULT",

                message:

                    language === "hi"

                        ? "विश्लेषण के दौरान समस्या हुई। कृपया बाद में पुनः प्रयास करें।"

                        : language === "mr"

                            ? "विश्लेषण करताना समस्या आली. कृपया नंतर पुन्हा प्रयत्न करा."

                            : "There was an error while analysing the symptoms. Please try again later.",

                prediction: null
            };
        }
    }


    // ==============================================
    // ANALYSING
    // ==============================================

    if (
        session.state === "ANALYSING"
    ) {

        return {

            session,

            state: "ANALYSING",

            message:
                PROMPTS[
                    language
                ].analysing
        };
    }


    // ==============================================
    // RESULT
    // ==============================================

    if (
        session.state === "RESULT"
    ) {

        return {

            session,

            state: "RESULT",

            message:
                PROMPTS[
                    language
                ].result,

            prediction:
                session.prediction
        };
    }


    // ==============================================
    // FALLBACK
    // ==============================================

    return {

        session,

        state:
            session.state,

        message:
            PROMPTS[
                language
            ].invalid
    };
}


// ==================================================
// EXPORT
// ==================================================

module.exports = {

    createInitialSession,

    handleKey
};