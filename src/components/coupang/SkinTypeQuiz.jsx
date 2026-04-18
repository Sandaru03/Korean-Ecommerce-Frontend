import { useState } from "react"

const questions = [
    {
        id: 1,
        question: "How does your skin feel an hour after washing your face?",
        options: [
            { key: "A", text: "Shiny and greasy all over." },
            { key: "B", text: "Oily in the T-zone (forehead and nose) but dry or normal on the cheeks." },
            { key: "C", text: "Tight, itchy, or slightly flaky." },
            { key: "D", text: "Comfortable and balanced; not too oily or too dry." },
        ],
    },
    {
        id: 2,
        question: "How would you describe your pores?",
        options: [
            { key: "A", text: "Large and visible all over my face." },
            { key: "B", text: "Visible and enlarged only on the nose and forehead." },
            { key: "C", text: "Very small, tight, and almost invisible." },
            { key: "D", text: "Normal size and not very noticeable." },
        ],
    },
    {
        id: 3,
        question: "How does your skin react to a moisturizer?",
        options: [
            { key: "A", text: 'It feels heavy, greasy, or like it\'s "sitting" on top of the skin.' },
            { key: "B", text: "It feels great on my cheeks but makes my T-zone feel too oily." },
            { key: "C", text: "My skin drinks it up quickly and often needs more." },
            { key: "D", text: "It feels hydrated, smooth, and comfortable." },
        ],
    },
    {
        id: 4,
        question: "How does your skin look by mid-day?",
        options: [
            { key: "A", text: "Very shiny; I need to use oil-blotting papers or powder." },
            { key: "B", text: "Shiny on my forehead and nose, but my cheeks look matte or dry." },
            { key: "C", text: "Dull, tight, or I might see some dry patches." },
            { key: "D", text: "Mostly fresh and healthy-looking." },
        ],
    },
    {
        id: 5,
        question: "How does your skin respond to new products or weather changes?",
        options: [
            { key: "A", text: "I break out easily or get extra oily in the heat." },
            { key: "B", text: "My skin gets drier in winter and oilier in summer." },
            { key: "C", text: "It gets irritated, red, or very dry quite easily." },
            { key: "D", text: "It stays relatively stable and rarely has issues." },
        ],
    },
]

const skinTypeInfo = {
    A: {
        type: "Oily Skin",
        description:
            "Your skin produces excess sebum, keeping it naturally moisturised but prone to shine and breakouts. Focus on lightweight, non-comedogenic products and gentle cleansing.",
    },
    B: {
        type: "Combination Skin",
        description:
            "You have the best (and most complex!) of both worlds — an oily T-zone with drier cheeks. Balance is key: use zone-specific products to address different areas.",
    },
    C: {
        type: "Dry Skin",
        description:
            "Your skin lacks sufficient moisture and natural oils, which can lead to tightness and flakiness. Rich, hydrating formulas will be your best friend.",
    },
    D: {
        type: "Normal Skin",
        description:
            "You've won the skin lottery! Your skin is well-balanced — not too oily, not too dry — and rarely reacts to products or weather. Focus on maintenance.",
    },
}

function getMajority(answers) {
    const counts = { A: 0, B: 0, C: 0, D: 0 }
    Object.values(answers).forEach((v) => { if (v) counts[v]++ })
    let max = 0, winner = null
    for (const [key, count] of Object.entries(counts)) {
        if (count > max) { max = count; winner = key }
    }
    return winner
}

export function SkinTypeQuiz() {
    const [step, setStep] = useState(0) // 0 = intro, 1-5 = questions, 6 = result
    const [answers, setAnswers] = useState({})
    const [selected, setSelected] = useState(null)
    const [animating, setAnimating] = useState(false)

    const isSensitive = answers[5] === "C"
    const currentQ = questions[step - 1]

    const handleStart = () => {
        setStep(1)
        setSelected(null)
    }

    const handleSelect = (key) => {
        if (animating) return
        setSelected(key)
    }

    const handleNext = () => {
        if (!selected || animating) return
        setAnimating(true)
        const newAnswers = { ...answers, [step]: selected }
        setAnswers(newAnswers)
        setTimeout(() => {
            setAnimating(false)
            setSelected(null)
            if (step < 5) {
                setStep(step + 1)
            } else {
                setStep(6)
            }
        }, 200)
    }

    const handleRetake = () => {
        setStep(0)
        setAnswers({})
        setSelected(null)
    }

    const resultKey = step === 6 ? getMajority(answers) : null
    const result = resultKey ? skinTypeInfo[resultKey] : null

    return (
        <div className="mb-16 mt-8">
            <div className="flex items-center gap-4 mb-3">
                <div>
                    <span className="text-[11px] font-bold text-primary bg-accent/50 px-2 py-0.5 rounded-full uppercase tracking-wider">Skin Tool</span>
                    {step === 0 && <h2 className="text-[24px] font-black text-[#111] mt-1">Discover Your Perfect Routine</h2>}
                    {step >= 1 && step <= 5 && <h2 className="text-[24px] font-black text-[#111] mt-1">Question {step} of 5</h2>}
                    {step === 6 && <h2 className="text-[24px] font-black text-[#111] mt-1">Assessment Complete</h2>}
                </div>
            </div>

            {/* ── Intro Screen ── */}
            {step === 0 && (
                <div className="bg-[#f8f8f8] rounded-2xl p-8 md:p-12 border border-[#eee]">
                    <p className="text-[16px] text-[#444] leading-relaxed max-w-[720px] mb-8">
                        Answer 5 quick, easy questions to discover your underlying skin type. We analyze your responses to determine if you have an Oily, Combination, Dry, or Normal foundation, helping you pick perfectly matched Korean skincare.
                    </p>
                    <button 
                        onClick={handleStart}
                        className="bg-primary hover:bg-red-800 text-white px-8 py-3 rounded-xl text-[14px] font-bold transition-colors"
                    >
                        Start Assessment
                    </button>
                </div>
            )}

            {/* ── Question Screen ── */}
            {step >= 1 && step <= 5 && (
                <div className="bg-[#f8f8f8] rounded-2xl p-8 md:p-12 border border-[#eee]" style={{ opacity: animating ? 0 : 1, transition: "opacity 0.2s ease" }}>
                    <div className="max-w-[720px]">
                        <div className="w-full h-1.5 bg-[#e5e5e5] rounded-full mb-8 overflow-hidden">
                            <div className="h-full bg-[#111] transition-all duration-300" style={{ width: `${((step - 1) / 5) * 100}%` }}></div>
                        </div>
                        
                        <h3 className="text-[20px] font-bold text-[#111] mb-6">{currentQ.question}</h3>
                        
                        <div className="space-y-3 mb-8">
                            {currentQ.options.map((opt) => (
                                <button
                                    key={opt.key}
                                    onClick={() => handleSelect(opt.key)}
                                    className={`w-full flex items-center p-4 rounded-xl border text-left transition-all ${
                                        selected === opt.key 
                                            ? "border-[#111] bg-white shadow-sm ring-1 ring-[#111]" 
                                            : "border-[#ddd] bg-white hover:border-[#bbb]"
                                    }`}
                                >
                                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-[12px] font-black mr-4 shrink-0 transition-colors ${
                                        selected === opt.key ? "bg-[#111] text-white" : "bg-[#f0f0f0] text-[#666]"
                                    }`}>
                                        {opt.key}
                                    </span>
                                    <span className={`text-[15px] ${selected === opt.key ? "text-[#111] font-semibold" : "text-[#555]"}`}>
                                        {opt.text}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            {step > 1 && (
                                <button
                                    onClick={() => {
                                        setStep(step - 1)
                                        setSelected(answers[step - 1] || null)
                                    }}
                                    className="px-6 py-3 rounded-xl border border-[#ddd] bg-white text-[#444] text-[14px] font-bold hover:bg-[#f0f0f0] transition-colors"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={!selected}
                                className="bg-[#111] hover:bg-black text-white px-8 py-3 rounded-xl text-[14px] font-bold transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                                {step < 5 ? "Next Question" : "See Result"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Result Screen ── */}
            {step === 6 && result && (
                <div className="bg-[#111] rounded-2xl p-8 md:p-12 text-white" style={{ opacity: animating ? 0 : 1, transition: "opacity 0.2s ease" }}>
                    <h3 className="text-[36px] font-black mb-4 tracking-tight">{result.type}</h3>
                    
                    {isSensitive && (
                        <div className="mb-6">
                            <span className="inline-block text-[12px] font-bold text-[#ffd700] bg-white/10 border border-white/20 px-4 py-1.5 rounded-full">
                                Your skin also shows signs of being Sensitive.
                            </span>
                        </div>
                    )}

                    <p className="text-[16px] text-white/80 leading-relaxed max-w-[720px] mb-10">
                        {result.description}
                    </p>

                    <button 
                        onClick={handleRetake}
                        className="bg-white hover:bg-gray-100 text-[#111] px-8 py-3 rounded-xl text-[14px] font-bold transition-colors"
                    >
                        Retake Assessment
                    </button>
                </div>
            )}
        </div>
    )
}
