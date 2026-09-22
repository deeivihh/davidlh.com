import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[85svh] flex flex-col items-center justify-center">
            <div className="flex flex-col gap-8 z-50 items-center justify-center mx-auto text-center">
                <h1 className="max-lg:text-5xl text-2xl lg:text-3xl font-medium text-center max-w-4xl mx-auto">
                    Page not found
                </h1>
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-sm font-medium text-[#666666] hover:text-[#111111] transition-colors duration-200 select-none w-fit"
                >
                    <span className="group-hover:underline underline-offset-4 max-lg:text-xl">Return</span>
                </Link>
            </div>
        </div>
    );
}