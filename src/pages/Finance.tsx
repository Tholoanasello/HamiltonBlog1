import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import BlogCard from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Finance = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const subcategories = [
    "Investment Decisions",
    "Finance Decisions",
    "Dividend Decisions",
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("category", "corporate_finance")
        .order("published_date", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error("Failed to load corporate finance articles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterBySubcategory = (subcategory: string) => {
    return posts.filter((post) => !subcategory || post.subcategory === subcategory);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="gradient-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Corporate Finance</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Strategic insights on investment, financing, and dividend decisions
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8 flex-wrap h-auto">
                <TabsTrigger value="all">All Topics</TabsTrigger>
                {subcategories.map((sub) => (
                  <TabsTrigger key={sub} value={sub}>
                    {sub}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="all" className="space-y-6">
                {posts.length > 0 ? (
                  posts.map((post) => (
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
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-12">
                    No corporate finance articles available yet.
                  </p>
                )}
              </TabsContent>
              {subcategories.map((sub) => (
                <TabsContent key={sub} value={sub} className="space-y-6">
                  {filterBySubcategory(sub).length > 0 ? (
                    filterBySubcategory(sub).map((post) => (
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
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-12">
                      No articles available for {sub}.
                    </p>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>
    </div>
  );
};

export default Finance;
