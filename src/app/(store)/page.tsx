import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="relative isolate flex min-h-[70vh] w-full items-center overflow-hidden">
      <Image
        src="/placeholder_img.png"
        alt="Close up image of pants"
        fill
        priority
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute" />
      <div className="relative mx-auto flex w-full max-w-6xl justify-end px-6 py-24 text-white sm:px-12">
        <div className="max-w-xl flex flex-col items-center text-center gap-6 lg:items-end lg:text-right">
          <p className="text-xs font-light tracking-[0.3em]">
            Clothes should fit you, not the other way around
          </p>
          <h1 className="text-4xl font-bold uppercase leading-tight sm:text-5xl">
            New Arrivals
          </h1>

          <div className="flex flex-wrap justify-center gap-4 lg:justify-end">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center uppercase rounded-lg bg-orange-400 px-10 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-500"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
