import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

export default async function DashboardBlogPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("author_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog articles and stories</p>
        </div>
        <Link href="/dashboard/blog/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Category: {post.category}</span>
                    <span>
                      {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Not published"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {post.published && (
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Link href={`/dashboard/blog/${post.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!posts ||
          (posts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">You haven't created any blog posts yet.</p>
                <Link href="/dashboard/blog/new">
                  <Button>Create Your First Post</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
