import { motion } from "framer-motion";
import { Instagram, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface InstagramPost {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

const fetchInstagramFeed = async (): Promise<InstagramPost[]> => {
  const { data, error } = await supabase.functions.invoke("instagram-feed");
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  const posts = data?.data || [];
  if (posts.length === 0) throw new Error("No posts");
  return posts;
};

const InstagramFeed = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["instagram-feed"],
    queryFn: fetchInstagramFeed,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  if (error || (isLoading && !posts)) return null;

  return (
    <section className="px-6 py-10 bg-background">
      <div className="max-w-lg mx-auto md:max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <Instagram className="w-8 h-8 mx-auto mb-2 text-ocean-medium" />
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Siga-nos no Instagram
          </h2>
          <a
            href="https://www.instagram.com/pontalsereias/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ocean-medium hover:underline text-sm mt-1 inline-block"
          >
            @pontalsereias
          </a>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))
            : posts?.slice(0, 8).map((post, index) => (
                <motion.a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative aspect-square rounded-lg overflow-hidden block"
                >
                  <img
                    src={post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url}
                    alt={post.caption?.slice(0, 100) || "Post do Instagram"}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.a>
              ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-6"
        >
          <a
            href="https://www.instagram.com/pontalsereias/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full ocean-gradient text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Instagram className="w-5 h-5" />
            Ver mais no Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;
