import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import BlogCard from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Valuation = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("category", "valuation_reports")
        .order("published_date", { ascending: false });

      if (error) throw error;

      setPosts(data || []);
      
      // Extract unique industries
      const uniqueIndustries = [...new Set(data?.map((post: any) => post.industry).filter(Boolean))];
      setIndustries(uniqueIndustries as string[]);
    } catch (error: any) {
      toast.error("Failed to load valuation reports");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterByIndustry = (industry: string) => {
    return posts.filter((post) => !industry || post.industry === industry);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="gradient-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Valuation Reports</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Comprehensive financial asset valuations with detailed financial analysis.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading reports...</p>
            </div>
          ) : industries.length > 0 ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8 flex-wrap h-auto">
                <TabsTrigger value="all">All Industries</TabsTrigger>
                {industries.map((industry) => (
                  <TabsTrigger key={industry} value={industry}>
                    {industry}
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
                    No valuation reports available yet.
                  </p>
                )}
              </TabsContent>
              {industries.map((industry) => (
                <TabsContent key={industry} value={industry} className="space-y-6">
                  {filterByIndustry(industry).map((post) => (
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
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No valuation reports available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Valuation;
