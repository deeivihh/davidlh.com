import Return from "@/components/return";

export default function Article1() {
    return (
        <main className="max-md:mt-[8svh] mt-[10svh] pb-10 max-w-[75ch] flex flex-col gap-6 justify-start items-start mx-auto">
            <Return />
            <article className="flex flex-col gap-14 w-full">
                <div className="flex flex-col gap-4">
                    <h1 className="text-5xl">The AI that could kill us might also free us</h1>
                    <p className="text-xl px-0.5">AI could become the most humanizing tech ever created, if we stop using it only to demand more productivity from people.</p>
                    <img className="px-0.5" src="/articles/1/main.jpg" alt="Hands typing on a laptop with a blank white screen in a dimly lit room." />
                </div>
            </article>
        </main>
    );
}