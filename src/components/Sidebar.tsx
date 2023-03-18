import Image from "next/image";

type MovieType = {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  name: string;
  original_name: string;
};

type SidebarProps = {
  movies: MovieType[];
  onMovieselect: (movie: MovieType) => void; // this is the function that will be passed in from index.tsx
};

export default function Sidebar({ movies, onMovieselect }: SidebarProps) {
  return (
    <section className="flex h-full w-full space-x-4 overflow-auto p-2">
      {movies.map((movie) => (
        <Image
          onClick={() => onMovieselect(movie)}
          className="h-52 w-80 rounded-lg"
          key={movie.id}
          alt={movie.title || movie.name || movie.original_name}
          priority={true}
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          width={200}
          height={300}
        />
      ))}
    </section>
  );
}
