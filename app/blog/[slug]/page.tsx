import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createServerClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select(`
      *,
      profiles:author_id (
        full_name,
        avatar_url,
        bio
      )
    `)
    .eq("slug", params.slug)
    .eq("published", true)
    .single()

  if (!post) {
    notFound()
  }

  const { data: comments } = await supabase
    .from("blog_comments")
    .select(`
      *,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .eq("post_id", post.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/blog">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 max-w-4xl">
        <header className="mb-8">
          <div className="flex gap-2 mb-4">
            <Badge variant="secondary">{post.category}</Badge>
            {post.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{post.title}</h1>

          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.profiles?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{post.profiles?.full_name?.[0] || "A"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{post.profiles?.full_name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {post.featured_image && (
            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
              <Image src={post.featured_image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-16">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Author Bio */}
        <Card className="mb-16">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={post.profiles?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{post.profiles?.full_name?.[0] || "A"}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg mb-1">About {post.profiles?.full_name}</h3>
                <p className="text-muted-foreground">
                  {post.profiles?.bio || "Creator and contributor to Spectrum for Us"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Comments ({comments?.length || 0})</h2>

          <div className="space-y-6">
            {comments?.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={comment.profiles?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{comment.profiles?.full_name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{comment.profiles?.full_name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </article>
    </div>
  )
}
