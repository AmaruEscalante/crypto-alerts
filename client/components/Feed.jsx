import AlertCard from "./AlertCard";

const Feed = () => {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-4 xl:max-w-6xl mx-auto">
      {/* Card */}
      <section className="col-span-4">
        <AlertCard />
      </section>
      {/* Alert List */}
    </main>
  );
};

export default Feed;
