import { people, questions } from "@/consts";
import Image from "next/image";
import React from "react";
import Marquee from "@/components/magicui/marquee";
import { Input } from "./ui/input";
import { ArrowRight } from "lucide-react";

function Discover() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-end">
        <p className="font-extrabold text-5xl">find and</p>
        <p className="font-extrabold text-5xl">create.</p>
      </div>
      <Marquee className="w-[80%] [--duration:35s]">
        {people.map((person) => (
          <PersonCard
            key={person.name}
            name={person.name}
            image={person.image}
            bio={person.bio}
          />
        ))}
      </Marquee>
      <Marquee className="w-[80%] [--duration:50s]" reverse>
        {questions.slice(0, questions.length / 2).map((question) => (
          <p
            key={question}
            className="p-1 border border-gray-700 text-xs text-gray-400 cursor-pointer hover:text-white"
          >
            {question}
          </p>
        ))}
      </Marquee>
      <Marquee className="w-[80%] [--duration:50s]">
        {questions.slice(questions.length / 2).map((question) => (
          <p
            key={question}
            className="p-1 border border-gray-700 text-xs text-gray-400 cursor-pointer hover:text-white"
          >
            {question}
          </p>
        ))}
      </Marquee>
    </div>
  );
}

const PersonCard = ({
  image,
  name,
  bio,
}: {
  image: string;
  name: string;
  bio: string;
}) => {
  return (
    <div className="p-3 border border-gray-700 w-[150px] grayscale hover:grayscale-0 cursor-pointer transition-all">
      <Image
        src={image}
        alt={name}
        className="w-[120px] h-[120px] object-cover"
        width={200}
        height={200}
      />
      <p className="text-lg font-bold">{name}</p>
      <p className="text-xs text-gray-400 mt-6">
        {bio.slice(0, 60) + (bio.length > 60 ? "..." : "")}
      </p>
    </div>
  );
};

export default Discover;
