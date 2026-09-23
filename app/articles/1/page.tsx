import type { Metadata } from "next";
import Return from "@/components/return";
import Signature from "@/components/signature";
import Video from "@/components/video";

export const metadata: Metadata = {
    title: "The AI that could kill us might also free us",
    description: "AI could become the most humanizing tech ever created, if we stop using it only to demand more productivity from people.",
    alternates: {
        canonical: "https://davidlh.com/articles/1",
    },
    openGraph: {
        title: "The AI that could kill us might also free us",
        description: "AI could become the most humanizing tech ever created, if we stop using it only to demand more productivity from people.",
        url: "https://davidlh.com/articles/1",
        siteName: "David Lahoz",
        type: "article",
        images: [
            {
                url: "https://davidlh.com/articles/1/og-image.jpg",
                width: 1920,
                height: 1080,
                alt: "The AI that could kill us might also free us",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "The AI that could kill us might also free us",
        description: "AI could become the most humanizing tech ever created, if we stop using it only to demand more productivity from people.",
        images: ["https://davidlh.com/articles/1/og-image.jpg"],
    },
    keywords: [
        "AI",
        "Artificial Intelligence",
        "Productivity",
        "David Lahoz",
    ],
    authors: [{ name: "David Lahoz" }],
    creator: "David Lahoz",
    publisher: "David Lahoz",
};

export default function Article1() {
    return (
        <main className="max-md:mt-[8svh] mt-[10svh] pb-10 max-w-[75ch] flex flex-col gap-6 justify-start items-start mx-auto">
            <Return />
            <article className="flex flex-col gap-10 w-full">
                <div className="flex flex-col gap-4">
                    <h1 className="text-5xl">The AI that could kill us might also free us</h1>
                    <p className="text-xl px-0.5">AI could become the most humanizing tech ever created, if we stop using it only to demand more productivity from people.</p>
                    <div className="flex justify-center items-center w-full">
                        <Video src="/articles/1/main.mp4" />
                    </div>
                </div>
                <div className="flex flex-col gap-6 px-0.5 text-lg leading-relaxed">
                    <p>
                        These days, we hear a lot about how AI could kill us all in less than ten years. Just a few months ago, however, the big concern was whether artificial intelligence would replace us at work. Some insisted that a machine could never do what we do, while others argued that we would have to work harder to remain useful.
                    </p>
                    <p>
                        But what if it replaced us? Why do we necessarily see that as a bad thing? What if we let AI work for us?
                    </p>
                    <p>
                        We have created one of the most transformative tools in history. We can use it to demand that every worker produce twice as much, or we can use it to live in a more human way. And, although it may make some people uncomfortable, if we have created something this powerful, perhaps we should put it to work and start living more of our own lives.
                    </p>
                    <p>
                        According to <a className="underline" href="https://www.gettysburg.edu/news/stories?id=79db7b34-630c-4f49-ad32-4ab9ea48e72b" target="_blank" rel="noopener noreferrer">Andrew Naber</a>, we spend around 90,000 hours of our lives working. Imagine being able to get all that time back. We could travel more, take better care of our children, learn, create, rest, try new experiences, or simply enjoy life.
                    </p>
                    <p>
                        Artificial intelligence could unlock an enormous amount of productive capacity. Millions of automated systems could perform tasks that currently depend on people, faster and at a lower cost. But that possibility will only be positive if the benefits are shared. If wealth remains concentrated in the hands of a few companies or individuals, AI will not set us free; it will only make inequality worse.
                    </p>
                    <p>
                        It would also change education. Our children would no longer have to study to get a good job, but to better understand the world they live in, discover other cultures, create art, think critically, and build better relationships with others.
                    </p>
                    <div className="flex flex-col gap-3 pt-2">
                        <h3 className="text-2xl font-semibold">What do we need to reach that model?</h3>
                        <ul className="list-disc pl-5 flex flex-col gap-2 ml-4 my-2">
                            <li>
                                Governments willing to make it happen.
                            </li>
                            <li>
                                A <strong className="font-semibold italic">f*cking incredible</strong> artificial intelligence.
                            </li>
                            <li>
                                Share the wealth among everyone.
                            </li>
                        </ul>
                    </div>
                    <p>
                        It may seem unrealistic right now. But if politicians, business leaders, and workers are able to change the rules, humanity could be transformed forever. A person&apos;s status should not depend on where they work, how much they earn, or how many degrees they have, but on how they live, how well they understand the world, and what they contribute to others.
                    </p>
                </div>
            </article>

            <Signature />
        </main>
    );
}