import Link from "vinext/shims/link";

type ReturnProps = {
    absolute?: boolean;
};

export default function Return({ absolute = false }: ReturnProps) {
    return (
        <Link
            href="/"
            title="Return to the homepage"
            aria-label={absolute ? "Return" : undefined}
            className={`group flex items-center text-sm font-medium text-[#666666] hover:text-[#111111] select-none ${absolute ? "fixed bottom-4 left-1/2 z-50 w-fit -translate-x-1/2 gap-2 rounded-full border border-[#666666] bg-white px-4 py-1 shadow-xl backdrop-blur-sm transition-colors duration-200 md:absolute md:right-full md:top-1/2 md:bottom-auto md:left-auto md:z-auto md:mr-6 md:h-12 md:w-12 md:min-w-12 md:max-w-12 md:shrink-0 md:translate-x-0 md:-translate-y-1/2 md:justify-center md:gap-0 md:rounded-full md:bg-transparent md:px-0 md:py-0 md:shadow-none md:backdrop-blur-none md:text-3xl md:hover:bg-black" : "w-fit gap-2 transition-colors duration-200"}`}
        >
            <span className={`block ${absolute ? "md:font-bold md:text-2xl md:group-hover:text-white" : ""}`}>
                <svg
                    aria-hidden="true"
                    className="h-[1em] w-[1em]"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M19 12H5m0 0 6 6m-6-6 6-6"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                    />
                </svg>
            </span>
            <span className="group-hover:underline underline-offset-4 md:hidden">Return</span>
        </Link>
    )
}