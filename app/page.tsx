import AllPostsUser from "@/components/custom/elements/blog/allUserPosts";
import NewBlogForm from "@/components/custom/elements/blog/newBlogForm";
import AllPostsFeed from "@/components/custom/elements/blog/allPostsFeed/AllPostsFeed";

export default async function Home() {
  return (
    <main className="container mx-auto space-y-16 pb-24 px-4 pt-10">
      <header className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          IT Experiment 1
        </p>
        <h1 className="text-4xl md:text-5xl font-display tracking-tight">
          Welcome to the editorial workspace
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          A calm, focused space to craft posts, share ideas, and explore the
          latest stories from the community.
        </p>
      </header>

      <section className="rounded-[28px] border bg-card/70 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Create
            </p>
            <h2 className="text-2xl md:text-3xl font-display tracking-tight">
              Content studio
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Draft, review, and publish with clarity. Your latest posts stay
            close at hand.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 items-start">
          <NewBlogForm />
          <div className="rounded-2xl border bg-background/60 p-6 shadow-sm">
            <h3 className="text-lg font-semibold font-display mb-4">
              Your posts
            </h3>
            <div className="flex-1">
              <AllPostsUser />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border bg-muted/20 p-6 md:p-8 bg-editorial-grid">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Explore
            </p>
            <h2 className="text-2xl md:text-3xl font-display tracking-tight">
              Latest from the community
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Discover new perspectives and share the best of your reading list.
          </p>
        </div>
        <div className="rounded-2xl border bg-card/80 shadow-sm">
          <AllPostsFeed />
        </div>
      </section>
    </main>
  );
}
