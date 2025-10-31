"use client";

import Image from "next/image";
import Navigation from "@/components/Navigation";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#d8742c] text-[#1B1B1B] font-[PixterDisplay] relative">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 px-6 md:px-24 lg:px-48 text-center">
        {/* Placeholder logo */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-[#f7f4f0] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-[#77dd76]">F</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#77dd76] mb-6 drop-shadow-lg">
          About Filbyte
        </h1>

        <p className="max-w-3xl mx-auto text-lg text-[#1B1B1B]/80 leading-relaxed">
          Filbyte is an indie studio of passionate creators dedicated to crafting
          engaging and imaginative experiences within the Minecraft universe.
          From voxel modeling and game builds to immersive adventures, our goal
          is to bring creativity and community together — one block at a time.
        </p>
      </section>

      {/* Team Section */}
      <section className="mt-20 px-6 md:px-24 lg:px-48 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#77dd76] mb-8 drop-shadow-lg">
          Meet the Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { name: "Sean Anthony Encabo" },
            { name: "Jiro Azil Santillan" },
            { name: "Harold Jay Luro" },
            { name: "Moncier Aldous Lim" },
          ].map((member, i) => (
            <div
              key={i}
              className="bg-[#f7f4f0] rounded-xl p-4 shadow-lg flex flex-col items-center"
            >
              <div className="w-28 h-28 rounded-full bg-[#ccc] flex items-center justify-center mb-4">
                <span className="text-[#1B1B1B] font-bold text-2xl">
                  {member.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              {/* <p className="text-sm text-[#1B1B1B]/70">{member.role}</p> */}
            </div>
          ))}
        </div>
      </section>

      {/* Game Section */}
      <section className="mt-24 px-6 md:px-24 lg:px-48 text-center pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-[#77dd76] mb-6 drop-shadow-lg">
          About the Game
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-[#1B1B1B]/80 leading-relaxed">
          Our flagship project is a cooking adventure game that blends
          creativity, fun, and skill. Players explore dynamic kitchens,
          experiment with ingredients, and face exciting challenges while
          learning the art of cooking. Built with passion and attention to
          detail, this game is designed to entertain, inspire, and serve as the
          foundation for future Filbyte creations.
        </p>
      </section>
    </main>
  );
}
