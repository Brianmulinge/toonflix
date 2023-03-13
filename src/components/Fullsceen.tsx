import Image from "next/image";
import pic from "../assets/pic.jpeg";

export default function Fullscreen() {
  return (
    <section className="h-screen w-screen">
      <Image
        className="h-full w-full object-fill object-center"
        alt="background_image"
        src={pic}
      />
      <div className="absolute top-28 space-y-4 p-4 md:top-44">
        <h1 className="text-4xl font-semibold">Movie Title</h1>
        <h2 className="text-sm font-semibold">Movie Description</h2>
        <div className="flex space-x-2">
          <button className="rounded-lg border py-2 px-4">Play Now</button>
        </div>
      </div>
    </section>
  );
}
