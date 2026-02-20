import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FiRefreshCcw, FiSearch } from "react-icons/fi";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function ReviewsAdminPage() {
    const [status, setStatus] = useState("loading"); // loading | success | error
    const [reviews, setReviews] = useState([]);
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("newest"); // newest | rating-desc | rating-asc
    const [popupVisible, setPopupVisible] = useState(false);
    const [clickedReview, setClickedReview] = useState(null);

    const navigate = useNavigate();

    const fetchAll = useCallback(async () => {
        try {
            setStatus("loading");
            const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/reviews/all");
            setReviews(Array.isArray(res.data) ? res.data : []);
            setStatus("success");
        } catch (err) {
            console.error(err);
            const code = err?.response?.status;
            if (code === 401 || code === 403) {
                toast.error("Not authorized");
                navigate("/login");
            } else {
                toast.error("Failed to load reviews");
            }
            setStatus("error");
        }
    }, [navigate]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    async function handleDelete(id) {
        if (!window.confirm("Delete this review?")) return;

        try {
            await axios.delete(import.meta.env.VITE_BACKEND_URL + `/reviews/${id}`);
            toast.success("Review deleted");
            setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
            setPopupVisible(false); // close popup if opened
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to delete review");
        }
    }

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = [...reviews];
        if (q) {
            list = list.filter((r) => {
                const pid = (r.productId || "").toLowerCase();
                const user = (r.userName || r.user || "").toLowerCase();
                const c = (r.comment || "").toLowerCase();
                return pid.includes(q) || user.includes(q) || c.includes(q);
            });
        }
        list.sort((a, b) => {
            if (sort === "newest") {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            }
            if (sort === "rating-desc") return (b.rating || 0) - (a.rating || 0);
            if (sort === "rating-asc") return (a.rating || 0) - (b.rating || 0);
            return 0;
        });
        return list;
    }, [reviews, query, sort]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Reviews</h1>
                    <p className="text-sm text-slate-500">View, search and manage customer reviews.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-xl border px-2 py-1.5 bg-white">
                        <FiSearch className="opacity-70" />
                        <input
                            className="outline-none text-sm bg-transparent"
                            placeholder="Search productId / user / text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="rounded-xl border px-3 py-1.5 text-sm bg-white cursor-pointer"
                    >
                        <option value="newest">Sort: Newest</option>
                        <option value="rating-desc">Rating: High → Low</option>
                        <option value="rating-asc">Rating: Low → High</option>
                    </select>

                    <button
                        onClick={fetchAll}
                        className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm bg-white hover:bg-slate-50 cursor-pointer"
                        title="Refresh"
                    >
                        <FiRefreshCcw />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Body */}
            {status === "loading" ? (
                <div className="rounded-2xl border p-6 text-slate-500">Loading…</div>
            ) : status === "error" ? (
                <div className="rounded-2xl border p-6 text-red-600">Failed to load reviews.</div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl border p-6 text-slate-500">No reviews found.</div>
            ) : (
                <>
                    {/* Table (desktop) */}
                    <div className="hidden md:block rounded-2xl border overflow-hidden bg-white">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="text-left px-4 py-3">Date</th>
                                    <th className="text-left px-4 py-3">Product</th>
                                    <th className="text-left px-4 py-3">User</th>
                                    <th className="text-left px-4 py-3">Rating</th>
                                    <th className="text-left px-4 py-3">Comment</th>
                                    <th className="text-right px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r) => {
                                    const id = r._id || r.id;
                                    return (
                                        <tr
                                            key={id}
                                            className="border-t hover:bg-slate-100 cursor-pointer"
                                            onClick={() => {
                                                setClickedReview(r);
                                                setPopupVisible(true);
                                            }}
                                        >
                                            <td className="px-4 py-3">{fmtDate(r.createdAt)}</td>
                                            <td className="px-4 py-3 break-all">{r.productId}</td>
                                            <td className="px-4 py-3">{r.userName || r.user || "Customer"}</td>
                                            <td className="px-4 py-3">
                                                <Stars value={Number(r.rating) || 0} />
                                            </td>
                                            <td className="px-4 py-3 max-w-[520px]">
                                                <span className="line-clamp-2 text-slate-700">{r.comment}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(id);
                                                    }}
                                                    className="cursor-pointer inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-600 text-white hover:bg-red-500"
                                                    title="Delete"
                                                >
                                                    <RiDeleteBin5Fill />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {filtered.map((r) => {
                            const id = r._id || r.id;
                            return (
                                <div
                                    key={id}
                                    className="rounded-2xl border p-4 cursor-pointer hover:bg-slate-100"
                                    onClick={() => {
                                        setClickedReview(r);
                                        setPopupVisible(true);
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="text-xs text-slate-500">{fmtDate(r.createdAt)}</div>
                                        <Stars value={Number(r.rating) || 0} />
                                    </div>
                                    <div className="mt-1 font-semibold">{r.userName || r.user || "Customer"}</div>
                                    <div className="mt-1 break-all text-blue-600">{r.productId}</div>
                                    <div className="mt-2 text-slate-700 whitespace-pre-wrap line-clamp-2">
                                        {r.comment}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Popup */}
            {popupVisible && clickedReview && (
                <div className="fixed top-0 left-0 w-full h-full bg-[#00000070] flex justify-center items-center z-50">
                    <div className="w-[600px] h-[80vh] bg-white rounded-2xl shadow-xl relative p-6 flex flex-col">
                        {/* Close button */}
                        <button
                            className="absolute w-[35px] h-[35px] bg-red-500 border-2 border-red-600 text-white top-[-20px] right-[-20px] rounded-full cursor-pointer hover:bg-transparent hover:text-red-500 font-bold flex items-center justify-center"
                            onClick={() => setPopupVisible(false)}
                        >
                            ✕
                        </button>

                        <div className="overflow-y-auto pr-2 flex-1">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Review Details</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Posted on: {fmtDate(clickedReview.createdAt)}
                            </p>

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Product</h3>
                                <a
                                    href={`/overview/${clickedReview.productId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 break-all hover:underline"
                                >
                                    {clickedReview.productId}
                                </a>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">User</h3>
                                <p>{clickedReview.userName || clickedReview.user || "Customer"}</p>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Rating</h3>
                                <Stars value={Number(clickedReview.rating) || 0} />
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Comment</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{clickedReview.comment}</p>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => handleDelete(clickedReview._id || clickedReview.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 cursor-pointer"
                            >
                                Delete Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Stars({ value = 0 }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <FaStar key={n} className={n <= value ? "text-yellow-500" : "text-slate-300"} />
            ))}
        </div>
    );
}

function fmtDate(d) {
    if (!d) return "-";
    const dt = new Date(d);
    if (String(dt) === "Invalid Date") return "-";
    return dt.toLocaleString();
}
