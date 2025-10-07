"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import LogoLoop from "@/components/react-bits/LogoLoop";

export default function HomePage() {
  const features = [
    {
      ribbon: "1V1 COMPETITION",
      text: "Beat your opponent or let them cook!",
      img: "/assets/MO1.webp",
      reverse: false,
    },
    {
      ribbon: "GATHER!",
      text: "Raid goblin huts, harvest crops, steal other player's ingredients — it's up to you!",
      img: "/assets/MO2.gif",
      reverse: true,
    },
    {
      ribbon: "COOK FAST!",
      text: "Toss it in the pan, don't let it burn — timing is everything!",
      img: "/assets/MO3.webp",
      reverse: false,
    },
    {
      ribbon: "COSMETICS!",
      text: "From classical hats to modern ones, choose your favorite cosmetic!",
      img: "/assets/MO4.gif",
      reverse: true,
    },
  ];

  const techLogos = [
  { node: <>DON'T LET THE FOOD BURN</>},
  { node: <>SABOTAGE OR GET SABOTAGED!</>},
  { node: <>ONLY THE FASTEST WINS</>},
];

  return (
    <main className="min-h-screen font-[PixterDisplay] select-none">
      <header className="relative h-[80vh] sm:h-screen">
        <div className="absolute inset-0">
          <Image
            src="/assets/OfficialRenderCompressed.png"
            alt="Game Scene"
            fill
            className="object-cover hero-bg"
            priority
          />
        </div>
        <Navigation />
      </header>

      <section className="overflow-hidden border-y-2 border-yellow-400">
        <div className="relative flex w-full whitespace-nowrap text-yellow-400 py-4 sm:py-6">
          <div
            style={{
              height: "fit-content",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <LogoLoop
              logos={techLogos}
              speed={120}
              direction="left"
              logoHeight={24}
              gap={80}
              fadeOut
              fadeOutColor="#0e0901"
              ariaLabel="Technology partners"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col lg:flex-row items-center gap-8 sm:gap-10">
        <div className="flex-shrink-0">
          <Image
            src="/assets/Cauldron.gif"
            alt="cauldron"
            width={280}
            height={280}
            className="rounded mx-auto sm:w-[320px] sm:h-[320px]"
          />
        </div>

        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-xl sm:text-2xl text-yellow-400 mb-3 sm:mb-4 leading-tight">
            CHOP, COOK, BEAT ONE ANOTHER
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
            Step into a fast-paced 1v1 cooking showdown where speed, strategy,
            and skill decide who’s the ultimate chef! Compete to gather rare
            ingredients, cook the most dishes, and earn the highest score before
            time runs out. Every second counts — outcook your rival and claim
            the title of master chef!
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm">
            PLAY NOW
          </button>
        </div>
      </section>

      <div className="w-full">
        <Image
          src="/assets/ingredients.png"
          alt="ingredients divider"
          width={1920}
          height={193}
          className="w-full object-cover"
        />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-14 sm:space-y-20">
        {features.map((f, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              f.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center gap-6 sm:gap-8`}
          >
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-block bg-yellow-500 text-black px-3 py-1 rounded-md text-xs mb-3 sm:mb-4">
                {f.ribbon}
              </div>
              <p className="text-sm sm:text-base leading-relaxed">{f.text}</p>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center">
              <Image
                src={f.img}
                alt={f.ribbon}
                width={460}
                height={300}
                className="rounded-lg shadow-lg w-full max-w-sm sm:max-w-md"
              />
            </div>
          </div>
        ))}
      </section>

      <div className="w-full">
        <Image
          src="/assets/Bread.png"
          alt="bread divider"
          width={1920}
          height={230}
          className="w-full object-cover"
        />
      </div>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <h2 className="text-xl sm:text-2xl text-yellow-400 mb-3 sm:mb-4">
          SUPPORT
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
          Need Help? We're here to make your cooking adventure smooth and fun!
          If you’ve got questions, we’ve got answers. From game mechanics to
          troubleshooting, everything you need is just a click away.
        </p>
        <button
          onClick={() => (window.location.href = "/support")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm"
        >
          Help? Click Me!
        </button>
      </section>

      <section className="relative bg-gray-900 py-10 sm:py-12">
        <Image
          src="/assets/Footer2.png"
          alt="footer border"
          width={1920}
          height={160}
          className="absolute inset-x-0 top-0 w-full -z-10"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <Image
              src="/assets/Mascot.png"
              alt="mascot"
              width={100}
              height={100}
            />
            <div>
              <h3 className="text-yellow-400 text-lg sm:text-xl">
                JOIN THE COMMUNITY!
              </h3>
              <div className="flex justify-center sm:justify-start items-center gap-3 sm:gap-4 mt-3 text-yellow-400">
                <Link
                  href="https://discord.com"
                  target="_blank"
                  aria-label="Discord"
                  className="hover:opacity-80"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="26"
                    height="26"
                  >
                    <path d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009z" />
                  </svg>
                </Link>

                <Link
                  href="https://youtube.com"
                  target="_blank"
                  aria-label="YouTube"
                  className="hover:opacity-80"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="26"
                    height="26"
                  >
                    <path d="M18 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-12a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-9 6v6a1 1 0 0 0 1.514 .857l5 -3a1 1 0 0 0 0 -1.714l-5 -3a1 1 0 0 0 -1.514 .857z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <li>
                <a href="#top" className="hover:text-yellow-400">
                  Home
                </a>
              </li>
              <li>
                <a href="#media" className="hover:text-yellow-400">
                  Media
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-yellow-400">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-yellow-400">
                  About Us
                </a>
              </li>
            </ul>
            <Image
              src="/assets/fillogo.png"
              alt="footer logo"
              width={90}
              height={50}
            />
          </div>
        </div>

        <div className="text-center text-[10px] sm:text-xs text-gray-400 mt-6 sm:mt-8 pb-4 sm:pb-6">
          © 2025 Copyright Filbyte. All rights reserved.
        </div>
      </section>
    </main>
  );
}
