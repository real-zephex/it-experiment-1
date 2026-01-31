import AllPostsUser from "@/components/custom/elements/blog/allUserPosts";
import NewBlogForm from "@/components/custom/elements/blog/newBlogForm";
import AllPostsFeed from "@/components/custom/elements/blog/allPostsFeed/AllPostsFeed";

export default async function Home() {
  return (
    <main className="container mx-auto space-y-12 pb-20 px-4">
      <h1 className="text-3xl font-bold mt-8 border-l-stone-700 border-l-4 pl-4">
        Welcome to IT Experiment - 1
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <NewBlogForm />
        <div className="border rounded-xl p-6 h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-6 border-l-4 border-l-teal-400 pl-4">
            Your Posts
          </h2>
          <div className="flex-1">
            <AllPostsUser />
          </div>
        </div>
      </div>

      <div className="border-t pt-12">
        <h2 className="text-2xl font-bold mb-8 border-l-4 border-l-blue-500 pl-4">
          Explore All Posts
        </h2>
        <div className="rounded-xl border bg-card">
          <AllPostsFeed />
        </div>
      </div>
    </main>
  );
}
