import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Link from "next/link";

const postDirectory = path.join(process.cwd(), "data/news");

const PAGE_SIZE = 5;

const range = (start: number, end: number, length = end - start + 1) =>
  Array.from({ length }, (_, i) => start + i);

type PostData = {
  slug: string;
  title: string;
  date: string;
  isPublished?: boolean;
};

export async function getNewsData(page = 1) {
  const fileNames = fs.readdirSync(postDirectory);
  const allPostData: PostData[] = fileNames
    .map((fileNames) => {
      const slug = fileNames.replace(/\.md$/, "");
      const fullPath = path.join(postDirectory, fileNames);
      const fileContents = fs.readFileSync(fullPath, "utf-8");
      const matterResult = matter(fileContents);
      return {
        slug,
        ...(matterResult.data as Omit<PostData, "slug">),
      };
    })
    .filter((post) => post.isPublished !== false);

  const sortedPosts = allPostData.sort((postA, postB) =>
    new Date(postA.date) > new Date(postB.date) ? -1 : 1
  );

  const pages = range(1, Math.ceil(allPostData.length / PAGE_SIZE));
  const posts = sortedPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    posts,
    pages,
  };
}

type NewsProps = {
  params: {
    page?: string;
  };
};

const News = async ({ params }: NewsProps) => {
  const currentPage = params.page ? Number.parseInt(params.page) : 1;
  const { posts, pages } = await getNewsData(currentPage);

  return (
    <div>
      <h1>News</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/news/${post.slug}`}>
              <h2>{post.title}</h2>
              <p>{post.date}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <p>Pages:</p>
        <ul>
          {pages.map((page) => (
            <li key={page}>
              <Link href={`/news/page/${page}`}>{page}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default News;
