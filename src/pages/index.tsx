import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Image from "next/image";
import { useEffect, useState } from "react";
import requests from "../pages/api/request";
import axios from "../pages/api/axios";
import { env } from "src/env.mjs";
import YouTube from "react-youtube";

const API_KEY = env.NEXT_PUBLIC_CLIENTVAR;

type HomeProps = {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  name: string;
  original_name: string;
  movieId: number;
};

type ApiResponse = {
  results: HomeProps[];
};

type TrailerResponseType = {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
};

type TrailerResponse = {
  results: TrailerResponseType[];
};

const Home: NextPage = () => {
  const [trailerUrl, setTrailerUrl] = useState("");
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

  const handleClick = async (movieId: number | undefined) => {
    if (!movieId) return;

    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      const trailerurl = await axios.get<TrailerResponse>(
        `/movie/${movieId}/videos?api_key=${API_KEY}`
      );
      setTrailerUrl(trailerurl.data.results[0]?.key || "");
    }
  };

  return (
    <div
      style={{
        backgroundImage: selectedMovie
          ? `url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
      className="h-screen w-screen text-gray-100"
    >
      <Head>
        <title>Toonflix</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="h-screen w-full">
        <section className="flex h-screen w-screen flex-col justify-between">
          <div className="flex items-center justify-between p-4 backdrop-blur-sm">
            <h1 className="text-xl font-semibold md:text-2xl lg:text-4xl">
              Toonflix
            </h1>
            <Image
              priority={true}
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
              width={20}
              height={20}
              alt="tmdb_logo"
              className="h-12 w-12"
            />
          </div>
          <div className="space-y-4 p-6">
            {selectedMovie && (
              <div className=" rounded-lg backdrop-blur-sm">
                <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
                  {selectedMovie.title ||
                    selectedMovie.name ||
                    selectedMovie.original_name}
                </h1>
                <h2 className="text-sm font-semibold md:w-3/4 md:text-base lg:text-lg">
                  {truncate(selectedMovie.overview, 150)}
                </h2>
                <div className="flex space-x-2">
                  <button
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={() => handleClick(selectedMovie?.id)}
                    className="rounded-lg border py-2 px-4"
                  >
                    Play Now
                  </button>
                </div>
              </div>
            )}
          </div>
          {trailerUrl && (
            <div className="flex h-full w-full items-center justify-center rounded-lg px-2">
              <YouTube
                className="h-full w-full rounded-lg"
                videoId={trailerUrl}
                opts={{
                  height: "100%",
                  width: "100%",
                  playerVars: {
                    ytControls: 2,
                    autoplay: 1,
                    controls: 1,
                    rel: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    fs: 0,
                    cc_load_policy: 1,
                    color: "white",
                    disablekb: 0,
                    hl: "en",
                    iv_load_policy: 3,
                    loop: 1,
                    playsinline: 0,
                    theme: "dark",
                  },
                }}
              />
            </div>
          )}
          <div className="">
            <Sidebar movies={movies} onMovieselect={handleMovieselect} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
