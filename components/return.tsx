import Link from "vinext/shims/link";

export default function Return() {
    return (
        <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-medium text-[#666666] hover:text-[#111111] transition-colors duration-200 select-none w-fit"
        >
            <span>🡐</span>
            <span className="group-hover:underline underline-offset-4">Return</span>
        </Link>
    )
}