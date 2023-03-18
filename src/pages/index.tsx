import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Image from "next/image";
import { useEffect, useState } from "react";
import requests from "../pages/api/request";
import axios from "../pages/api/axios";

type HomeProps = {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  name: string;
  original_name: string;
};

type ApiResponse = {
  results: HomeProps[];
};

const Home: NextPage = () => {
  const [movies, setMovies] = useState<HomeProps[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<HomeProps | null>(null);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get<ApiResponse>(requests.fetchAnimation);
      const fetchedMovies = request.data.results;
      setMovies(fetchedMovies);

      // Set a random movie as the default movie
      const randomMovie =
        fetchedMovies[Math.floor(Math.random() * fetchedMovies.length)];
      setSelectedMovie(randomMovie ?? null);

      return request;
    }
    void fetchData();
  }, []);

  const handleMovieselect = (movie: HomeProps) => {
    setSelectedMovie(movie);
  };

  function truncate(str: string | null | undefined, n: number): string {
    if (!str || str.length <= n) {
      return str || "";
    }
    return str.substr(0, n - 1) + "...";
  }

  return (
    <div
      style={{
        backgroundImage: selectedMovie
          ? `url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <Head>
        <title>Toonflix</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-full">
        <section className="h-screen w-screen p-4">
          <Image
            priority={true}
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
            width={20}
            height={20}
            alt="tmdb_logo"
            className="h-12 w-12"
          />
          <div className="absolute top-28 mr-4 space-y-4 p-2 backdrop-blur-sm md:top-44">
            {selectedMovie && (
              <>
                <h1 className="text-4xl font-semibold">
                  {selectedMovie.title ||
                    selectedMovie.name ||
                    selectedMovie.original_name}
                </h1>
                <h2 className="text-sm font-semibold">
                  {truncate(selectedMovie.overview, 80)}
                </h2>
                <div className="flex space-x-2">
                  <button className="rounded-lg border py-2 px-4">
                    Play Now
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
        <div className="absolute bottom-0">
          <Sidebar movies={movies} onMovieselect={handleMovieselect} />
        </div>
      </main>
    </div>
  );
};

export default Home;
