import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import BlogCard from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Insights = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("category", "investment_insights")
        .order("published_date", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error("Failed to load investment insights");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="gradient-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Investment Insights</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Everything, Anything, Anywhere- all in one place.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading insights...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  subcategory={post.subcategory}
                  industry={post.industry}
                  author={post.author}
                  publishedDate={post.published_date}
                  pdfUrl={post.pdf_url}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No investment insights available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Insights;
