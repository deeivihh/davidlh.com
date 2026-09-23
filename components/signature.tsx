import Link from "vinext/shims/link";

export default function Signature() {
    return (
        <footer className="mt-14 flex flex-col gap-2 w-full">
            <h2 className="text-3xl">by <Link href="/" className="italic text-4xl font-semibold">David Lahoz</Link>.</h2>
        </footer>
    );
}