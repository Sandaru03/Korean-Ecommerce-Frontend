import React, { useState, useEffect, useRef, useMemo } from "react"
import { ChevronDown, Search, Check, X } from "lucide-react"
import deliveryData from "@/data/sriLankaDeliveryZones.json"

export default function DistrictCitySelector({
    selectedDistrict = "",
    selectedCity = "",
    onSelectDistrict,
    onSelectCity,
    className = ""
}) {
    const [districtOpen, setDistrictOpen] = useState(false)
    const [cityOpen, setCityOpen] = useState(false)

    const [districtSearch, setDistrictSearch] = useState("")
    const [citySearch, setCitySearch] = useState("")

    const districtRef = useRef(null)
    const cityRef = useRef(null)

    // All 25 Sri Lankan districts
    const districts = useMemo(() => {
        return (deliveryData.districts || []).slice().sort((a, b) => a.localeCompare(b))
    }, [])

    // Filtered districts by search
    const filteredDistricts = useMemo(() => {
        if (!districtSearch.trim()) return districts
        const q = districtSearch.toLowerCase()
        return districts.filter(d => d.toLowerCase().includes(q))
    }, [districts, districtSearch])

    // Cities for selected district (deduplicated & sorted)
    const availableCities = useMemo(() => {
        if (!selectedDistrict || !deliveryData.citiesByDistrict?.[selectedDistrict]) {
            return []
        }
        const rawCities = deliveryData.citiesByDistrict[selectedDistrict].map(c => c.name.trim())
        const seen = new Set()
        const unique = []
        for (const name of rawCities) {
            const key = name.toLowerCase().replace(/[\s\-_]+/g, '')
            if (!seen.has(key)) {
                seen.add(key)
                unique.push(name)
            }
        }
        return unique.sort((a, b) => a.localeCompare(b))
    }, [selectedDistrict])

    // Filtered cities by search
    const filteredCities = useMemo(() => {
        if (!citySearch.trim()) return availableCities
        const rawQ = citySearch.toLowerCase().trim()
        const terms = rawQ.split(/\s+/).filter(Boolean)
        return availableCities.filter(c => {
            const lower = c.toLowerCase()
            // 1. Direct substring match
            if (lower.includes(rawQ)) return true
            // 2. All search tokens match
            if (terms.length > 1 && terms.every(t => lower.includes(t))) return true
            // 3. Transliteration tolerance (watte <-> watta, th <-> t, v <-> w)
            const normLower = lower.replace(/watte/g, 'watta').replace(/th/g, 't').replace(/v/g, 'w')
            const normQ = rawQ.replace(/watte/g, 'watta').replace(/th/g, 't').replace(/v/g, 'w')
            if (normLower.includes(normQ)) return true
            return false
        })
    }, [availableCities, citySearch])

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (districtRef.current && !districtRef.current.contains(event.target)) {
                setDistrictOpen(false)
            }
            if (cityRef.current && !cityRef.current.contains(event.target)) {
                setCityOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleDistrictPick = (dist) => {
        onSelectDistrict(dist)
        if (dist !== selectedDistrict) {
            onSelectCity("") // Reset city when district changes
        }
        setDistrictOpen(false)
        setDistrictSearch("")
        // Automatically open city dropdown for smooth next step
        setTimeout(() => {
            setCityOpen(true)
        }, 120)
    }

    const handleCityPick = (city) => {
        onSelectCity(city)
        setCityOpen(false)
        setCitySearch("")
    }

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3.5 ${className}`}>
            {/* ─── 1. DISTRICT SELECTOR ─── */}
            <div className="relative" ref={districtRef}>
                <label className="block text-[14px] font-bold text-[#1f2937] mb-2 tracking-tight">
                    District <span className="text-red-500">*</span>
                </label>

                <button
                    id="checkout-district-btn"
                    type="button"
                    onClick={() => {
                        setDistrictOpen(prev => !prev)
                        setCityOpen(false)
                    }}
                    className={`w-full bg-white border rounded-2xl px-4 py-3.5 text-[15px] flex items-center justify-between transition-all text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${
                        districtOpen 
                            ? "border-[#346aff] ring-2 ring-[#346aff]/15" 
                            : "border-[#e2e8f0] hover:border-gray-300"
                    }`}
                >
                    <span className={selectedDistrict ? "font-semibold text-gray-900" : "font-normal text-[#1f2937]"}>
                        {selectedDistrict || "Select District"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 stroke-[1.75] ${districtOpen ? "rotate-180 text-gray-600" : ""}`} />
                </button>

                {/* District Dropdown Menu */}
                {districtOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-gray-200 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] p-2 animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* Search Input */}
                        <div className="relative mb-2">
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                id="checkout-district-search"
                                type="text"
                                autoFocus
                                value={districtSearch}
                                onChange={e => setDistrictSearch(e.target.value)}
                                placeholder="Search district..."
                                className="w-full pl-8 pr-3 py-2 text-[13.5px] border border-gray-200 rounded-xl outline-none focus:border-[#346aff] focus:ring-1 focus:ring-[#346aff] placeholder:text-gray-400"
                            />
                            {districtSearch && (
                                <button
                                    type="button"
                                    onClick={() => setDistrictSearch("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[380px] sm:max-h-[440px] overflow-y-auto divide-y divide-gray-50 scrollbar-thin scrollbar-thumb-gray-200">
                            {filteredDistricts.length === 0 ? (
                                <div className="py-4 text-center text-xs text-gray-400 font-medium">
                                    No district matching "{districtSearch}"
                                </div>
                            ) : (
                                filteredDistricts.map(dist => {
                                    const isSelected = selectedDistrict === dist
                                    return (
                                        <button
                                            key={dist}
                                            type="button"
                                            onClick={() => handleDistrictPick(dist)}
                                            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[14px] rounded-xl transition-colors text-left ${
                                                isSelected
                                                    ? "bg-blue-50 text-[#346aff] font-bold"
                                                    : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span>{dist}</span>
                                            {isSelected && <Check className="w-4 h-4 text-[#346aff]" />}
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ─── 2. TOWN / CITY SELECTOR ─── */}
            <div className="relative" ref={cityRef}>
                <label className="block text-[14px] font-bold text-[#1f2937] mb-2 tracking-tight">
                    Town/City <span className="text-red-500">*</span>
                </label>

                {!selectedDistrict ? (
                    /* Disabled State when district is not selected yet - exact visual match */
                    <div 
                        id="checkout-city-disabled-placeholder"
                        title="Please select a District first"
                        className="w-full bg-[#eaedf0] border border-transparent rounded-2xl px-4 py-3.5 text-[15px] flex items-center justify-between cursor-not-allowed select-none"
                    >
                        <span className="font-normal text-[#6b7280]">Select District first...</span>
                        <ChevronDown className="w-4 h-4 text-[#adb5bd] stroke-[1.75]" />
                    </div>
                ) : (
                    /* Active State when district is chosen */
                    <>
                        <button
                            id="checkout-city-btn"
                            type="button"
                            onClick={() => {
                                setCityOpen(prev => !prev)
                                setDistrictOpen(false)
                            }}
                            className={`w-full bg-white border rounded-2xl px-4 py-3.5 text-[15px] flex items-center justify-between transition-all text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${
                                cityOpen 
                                    ? "border-[#346aff] ring-2 ring-[#346aff]/15" 
                                    : "border-[#e2e8f0] hover:border-gray-300"
                            }`}
                        >
                            <span className={selectedCity ? "font-semibold text-gray-900" : "font-normal text-gray-500"}>
                                {selectedCity || "Select Town / City"}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 stroke-[1.75] ${cityOpen ? "rotate-180 text-gray-600" : ""}`} />
                        </button>

                        {/* Town / City Dropdown Menu */}
                        {cityOpen && (
                            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-gray-200 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] p-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                {/* Search Input */}
                                <div className="relative mb-2">
                                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        id="checkout-city-search"
                                        type="text"
                                        autoFocus
                                        value={citySearch}
                                        onChange={e => setCitySearch(e.target.value)}
                                        placeholder={`Search in ${selectedDistrict}...`}
                                        className="w-full pl-8 pr-3 py-2 text-[13.5px] border border-gray-200 rounded-xl outline-none focus:border-[#346aff] focus:ring-1 focus:ring-[#346aff] placeholder:text-gray-400"
                                    />
                                    {citySearch && (
                                        <button
                                            type="button"
                                            onClick={() => setCitySearch("")}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                <div className="px-2 pb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                                    <span>{selectedDistrict} Towns ({availableCities.length})</span>
                                    {citySearch && <span>Found: {filteredCities.length}</span>}
                                </div>

                                {/* Cities List */}
                                <div className="max-h-[380px] sm:max-h-[440px] overflow-y-auto divide-y divide-gray-50 scrollbar-thin scrollbar-thumb-gray-200">
                                    {filteredCities.length === 0 ? (
                                        <div className="py-5 text-center text-xs text-gray-400 font-medium">
                                            No town/city matching "{citySearch}" in {selectedDistrict}
                                        </div>
                                    ) : (
                                        filteredCities.map(city => {
                                            const isSelected = selectedCity === city
                                            return (
                                                <button
                                                    key={city}
                                                    type="button"
                                                    onClick={() => handleCityPick(city)}
                                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[14px] rounded-xl transition-colors text-left ${
                                                        isSelected
                                                            ? "bg-blue-50 text-[#346aff] font-bold"
                                                            : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <span>{city}</span>
                                                    {isSelected && <Check className="w-4 h-4 text-[#346aff]" />}
                                                </button>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

