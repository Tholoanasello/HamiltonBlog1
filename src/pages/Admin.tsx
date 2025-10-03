import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "valuation_reports" as "valuation_reports" | "corporate_finance" | "investment_insights",
    subcategory: "",
    industry: "",
    customCategory: "",
    author: "Hamilton Investment",
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchPosts();
      fetchCustomCategories();
    }
  }, []);

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("password_hash")
        .eq("username", "admin")
        .single();

      if (error) throw error;

      const isValid = await bcrypt.compare(password, data.password_hash);
      if (isValid) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminAuth", "true");
        fetchPosts();
        fetchCustomCategories();
        toast.success("Logged in successfully");
      } else {
        toast.error("Invalid password");
      }
    } catch (error: any) {
      toast.error("Authentication failed");
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_date", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error("Failed to load posts");
    }
  };

  const fetchCustomCategories = async () => {
    try {
      const { data, error } = await supabase.from("custom_categories").select("name");
      if (error) throw error;
      setCustomCategories(data?.map((cat) => cat.name) || []);
    } catch (error: any) {
      console.error("Failed to load custom categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let pdfUrl = null;

      // Upload PDF if provided
      if (pdfFile) {
        const fileExt = pdfFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from("blog-pdfs")
          .upload(fileName, pdfFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("blog-pdfs").getPublicUrl(fileName);
        pdfUrl = urlData.publicUrl;
      }

      // Determine final subcategory
      const finalSubcategory = formData.customCategory || formData.subcategory;

      // Insert blog post
      const { error } = await supabase.from("blog_posts").insert({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        subcategory: finalSubcategory,
        industry: formData.industry,
        author: formData.author,
        pdf_url: pdfUrl,
      });

      if (error) throw error;

      // Add custom category if new
      if (formData.customCategory) {
        await supabase.from("custom_categories").insert({ name: formData.customCategory });
        setCustomCategories([...customCategories, formData.customCategory]);
      }

      toast.success("Blog post created successfully");
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        category: "valuation_reports",
        subcategory: "",
        industry: "",
        customCategory: "",
        author: "Hamilton Investment",
      });
      setPdfFile(null);
      fetchPosts();
    } catch (error: any) {
      toast.error("Failed to create post: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      toast.success("Post deleted");
      fetchPosts();
    } catch (error: any) {
      toast.error("Failed to delete post");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Admin Login
            </CardTitle>
            <CardDescription>Enter the admin password to access blog management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter admin password"
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Default password: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Site
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Post Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Main Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valuation_reports">Valuation Reports</SelectItem>
                      <SelectItem value="corporate_finance">Corporate Finance</SelectItem>
                      <SelectItem value="investment_insights">Investment Insights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.category === "valuation_reports" && (
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>
                )}

                {formData.category === "corporate_finance" && (
                  <div>
                    <Label htmlFor="subcategory">Finance Decision Type</Label>
                    <Select
                      value={formData.subcategory}
                      onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Investment Decisions">Investment Decisions</SelectItem>
                        <SelectItem value="Finance Decisions">Finance Decisions</SelectItem>
                        <SelectItem value="Dividend Decisions">Dividend Decisions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="customCategory">Custom Category (Optional)</Label>
                  <Input
                    id="customCategory"
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    placeholder="Add a new category"
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="pdf">Upload PDF Report</Label>
                  <Input
                    id="pdf"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Post"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Posts List */}
          <Card>
            <CardHeader>
              <CardTitle>Published Posts</CardTitle>
              <CardDescription>{posts.length} total posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded">
                          {post.category}
                        </span>
                        {post.subcategory && (
                          <span className="text-xs bg-muted px-2 py-1 rounded">{post.subcategory}</span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
