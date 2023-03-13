import Image from "next/image";
import pic from "../assets/pic.png";

export default function Sidebar() {
  return (
    <section className="scrollbar-hide flex h-full w-full space-x-2 overflow-auto p-2">
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <Image
            className="h-52 w-80 rounded-lg"
            priority={true}
            alt="sidebar_image"
            key={i}
            src={pic}
          />
        ))}
    </section>
  );
}
