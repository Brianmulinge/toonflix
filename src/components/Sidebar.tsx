import Image from "next/image";
import { useEffect, useState } from "react";
import pic from "../assets/pic.png";
import requests from "src/pages/api/request";
import axios from "../pages/api/axios";

type MovieType = {
  id: number;
  title: string;
  backdrop_path: string;
};

export default function Sidebar() {
  const [movies, setMovies] = useState<MovieType[]>([]);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchAnimation);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, []);

  return (
    <section className="flex h-full w-full space-x-2 overflow-auto p-2 scrollbar-hide">
      <div className="flex space-x-2">
        {movies.map((movie) => (
          <Image
            className="h-52 w-80 rounded-lg"
            key={movie.id}
            alt="movie"
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            width={20}
            height={30}
          />
        ))}
      </div>
    </section>
  );
}
