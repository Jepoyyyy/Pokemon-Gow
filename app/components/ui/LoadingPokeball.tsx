

export default function LoadingPokeball() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="pokeball-spinner" />
      <p className="text-gray-600 dark:text-gray-400 text-lg">
        Loading...
      </p>
    </div>
  );
}
