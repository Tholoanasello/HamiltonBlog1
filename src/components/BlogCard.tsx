import { FileText, Download, Calendar, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  subcategory?: string;
  industry?: string;
  author: string;
  publishedDate: string;
  pdfUrl?: string;
}

const BlogCard = ({
  title,
  excerpt,
  category,
  subcategory,
  industry,
  author,
  publishedDate,
  pdfUrl,
}: BlogCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      valuation_reports: "Valuation Report",
      corporate_finance: "Corporate Finance",
      investment_insights: "Investment Insights",
    };
    return labels[cat] || cat;
  };

  return (
    <Card className="group transition-smooth hover:shadow-card-hover hover:-translate-y-1 border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="secondary">{getCategoryLabel(category)}</Badge>
          {subcategory && <Badge variant="outline">{subcategory}</Badge>}
          {industry && <Badge variant="outline">{industry}</Badge>}
        </div>
        <CardTitle className="text-xl group-hover:text-secondary transition-smooth">
          {title}
        </CardTitle>
        <CardDescription>{excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(publishedDate)}</span>
            </div>
          </div>
          {pdfUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-1" />
                PDF
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
