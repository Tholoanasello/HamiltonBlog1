import { ArrowRight, TrendingUp, PieChart, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-finance.jpg";

const Home = () => {
  const services = [
    {
      icon: <PieChart className="h-8 w-8 text-secondary" />,
      title: "Valuation Reports",
      description: "Comprehensive business valuations across multiple industries with detailed analysis and insights.",
      link: "/valuation",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-secondary" />,
      title: "Corporate Finance",
      description: "Expert guidance on investment decisions, financing strategies, and dividend policies.",
      link: "/finance",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-secondary" />,
      title: "Investment Insights",
      description: "Market analysis, trends, and strategic investment recommendations for informed decision-making.",
      link: "/insights",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(26, 46, 74, 0.85), rgba(58, 124, 165, 0.85)), url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Smart Capital Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Professional valuation services and investment insights for informed business decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/valuation">
                  Explore Reports <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                asChild
              >
                <a href="#contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Expertise</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Delivering comprehensive financial analysis and strategic insights to drive your business forward
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="transition-smooth hover:shadow-card-hover hover:-translate-y-2 border-l-4 border-l-secondary"
              >
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="group" asChild>
                    <Link to={service.link}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/90">
            Let's discuss how our financial expertise can help your business thrive
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
            Schedule a Consultation
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Hamilton Investment. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
