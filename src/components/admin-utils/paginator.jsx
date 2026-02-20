export default function Paginator({ currentPage, totalPages, setCurrentPage, limit, setlimit }) {
    return (
        <div className="w-full flex flex-row justify-center items-center gap-[20px] p-4 text-red-500">
            <select
                className="border border-gray-300 rounded-lg p-[10px]"
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value))}
            >
                {Array.from({ length: totalPages }, (_, index) => (
                    <option key={index} value={index + 1}>
                        Page {index + 1}
                    </option>
                ))}
            </select>

            <select
                className="border border-gray-300 rounded-lg p-[10px]"
                value={limit}
                onChange={(e) => setlimit(parseInt(e.target.value))}
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>

            <span className="text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
        </div>
    );
}
